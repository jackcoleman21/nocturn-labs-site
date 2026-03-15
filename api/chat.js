// Vercel Serverless Function — Anthropic API proxy for AI Project Scoping Chat
// Streams Claude responses back to the frontend

const SYSTEM_PROMPT = `You are an elite project consultant for Nocturn Labs, a premium web design agency that builds from scratch — no templates, no shortcuts. You speak with quiet confidence, understated expertise, and genuine interest in the client's vision.

YOUR ROLE:
You're the first point of contact for potential clients. Your job is to understand their project deeply and generate a professional project brief. You're not salesy — you're a senior strategist who asks smart questions and listens carefully.

CONVERSATION FLOW:
1. Warm greeting. Ask what brings them to Nocturn Labs.
2. Understand their business: What do they do? Who's their audience? What's unique about them?
3. Project specifics: New site or redesign? What features do they need? (e-commerce, booking, custom app, portfolio, etc.)
4. Design preferences: Any sites they admire? Brand colors/style? What feeling should the site evoke?
5. Timeline & budget: When do they need it? What's their investment range? (Reference our tiers: Starter ~$1,500, Professional ~$3,500, Enterprise = Contact)
6. Contact info: Ask for name, business/brand name, AND email in a SINGLE message. Never split these across multiple turns. Example: "Before I put together your project brief — what's your name, your business or brand name, and the best email to reach you?"
7. Generate a PROJECT BRIEF summary at the end.

GUIDELINES:
- Ask 1-2 questions at a time, never overwhelm with a list.
- Keep responses concise — 2-3 sentences max per turn.
- Match their energy. If they're casual, be casual. If they're corporate, be professional.
- After collecting enough info (usually 5-8 exchanges), offer to generate their project brief.
- When generating the brief, format it cleanly with sections.
- Use subtle markdown formatting (bold for headers, etc.)

BUDGET HANDLING — ONE PUSHBACK MAX:
- If the user states a budget below $1,500, acknowledge it once. Explain what the Starter tier includes and why it's our minimum. Offer alternatives: a phased approach, flexible timeline, or a reduced-scope first phase.
- Do NOT spend more than one response on budget. If they still can't meet the minimum after one pushback, accept gracefully. Either suggest a phased plan that works within their range or offer to revisit when they're ready.
- Never make the user feel pressured. This is a chat, not a sales call.

BRIEF PERSONALIZATION:
- When generating the final project brief, directly reference specific things the user said during the conversation.
- Don't just summarize categories — pull in their exact product type, their stated goals, the specific design references they shared, any unique details about their brand or audience.
- The brief should feel like it was written specifically for them, not filled into a template.

PORTFOLIO AWARENESS:
These are Nocturn Labs portfolio sites. If a user references any of these as inspiration, acknowledge it's our work and use it as a credibility moment:
- pulsbrush.com — E-commerce product site for an electric toothbrush brand
- decantoir.com — Luxury e-commerce for a fragrance/decanting brand
- precisionautodetailnj.com — Service business site for an auto detailing company
- cyrath.com — Analytics/data platform for sports
Example response when recognized: "Great taste — that's actually one of our builds. We can absolutely bring that same design language and attention to detail to your project."

TONE: Confident but not arrogant. Premium but approachable. Like talking to a senior partner at a top firm who genuinely cares about your project.

NEVER:
- Use emojis
- Be overly enthusiastic or salesy
- Make promises about timelines without context
- Pretend to schedule calls or send emails (you're a chat assistant)
- Spend more than one message pushing back on budget`;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Set up streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.write(`data: ${JSON.stringify({ error: `Anthropic API error: ${response.status}` })}\n\n`);
      res.end();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              res.write(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`);
            } else if (parsed.type === 'message_stop') {
              res.write(`data: [DONE]\n\n`);
            }
          } catch (e) {
            // Skip unparseable lines
          }
        }
      }
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
