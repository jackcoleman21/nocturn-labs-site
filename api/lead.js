// Vercel Serverless Function — Lead capture pipeline
// Saves conversation to Supabase, emails brief via Resend, pings Discord

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages, brief, contactInfo } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    // Format the transcript
    const transcript = messages
      .map(m => `${m.role === 'user' ? '👤 Visitor' : '🤖 Nocturn AI'}: ${m.content}`)
      .join('\n\n');

    const timestamp = new Date().toISOString();
    const name = contactInfo?.name || 'Unknown';
    const email = contactInfo?.email || 'Not provided';
    const projectType = contactInfo?.projectType || 'Not specified';
    const budget = contactInfo?.budget || 'Not specified';

    const results = { supabase: null, email: null, discord: null };

    // ═══ 1. SUPABASE — Store in database ═══
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      try {
        const supabaseRes = await fetch(`${supabaseUrl}/rest/v1/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            name,
            email,
            project_type: projectType,
            budget,
            brief: brief || '',
            transcript,
            message_count: messages.length,
            created_at: timestamp,
            status: 'new',
          }),
        });
        results.supabase = supabaseRes.ok ? 'saved' : `error: ${supabaseRes.status}`;
      } catch (e) {
        results.supabase = `error: ${e.message}`;
        console.error('Supabase error:', e);
      }
    }

    // ═══ 2. RESEND — Email the brief ═══
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.NOTIFY_EMAIL || 'hello@nocturnlabs.com';
    
    if (resendKey) {
      try {
        const emailHtml = `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a18; color: #e8e4df; padding: 40px; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 24px; font-weight: 400; color: #fff; margin: 0;">New Project Lead</h1>
              <p style="color: #e8622c; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-top: 8px;">NOCTURN LABS AI CONSULTANT</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 24px; border-radius: 4px; margin-bottom: 24px; border-left: 3px solid #e8622c;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; padding: 8px 0;">Name</td><td style="color: #fff; font-size: 15px; padding: 8px 0;">${name}</td></tr>
                <tr><td style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; padding: 8px 0;">Email</td><td style="color: #e8622c; font-size: 15px; padding: 8px 0;"><a href="mailto:${email}" style="color: #e8622c;">${email}</a></td></tr>
                <tr><td style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; padding: 8px 0;">Project</td><td style="color: #fff; font-size: 15px; padding: 8px 0;">${projectType}</td></tr>
                <tr><td style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; padding: 8px 0;">Budget</td><td style="color: #fff; font-size: 15px; padding: 8px 0;">${budget}</td></tr>
                <tr><td style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; padding: 8px 0;">Messages</td><td style="color: #fff; font-size: 15px; padding: 8px 0;">${messages.length}</td></tr>
              </table>
            </div>

            ${brief ? `
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 14px; color: #e8622c; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 16px;">AI-Generated Brief</h2>
              <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.08);">
                <p style="color: #ccc; font-size: 14px; line-height: 1.8; white-space: pre-wrap; margin: 0;">${brief}</p>
              </div>
            </div>
            ` : ''}

            <div>
              <h2 style="font-size: 14px; color: #e8622c; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 16px;">Full Transcript</h2>
              <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.08);">
                ${messages.map(m => `
                  <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <span style="font-size: 10px; color: ${m.role === 'user' ? '#e8622c' : '#888'}; text-transform: uppercase; letter-spacing: 2px;">${m.role === 'user' ? 'Visitor' : 'Nocturn AI'}</span>
                    <p style="color: #ccc; font-size: 13px; line-height: 1.7; margin: 6px 0 0;">${m.content}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <div style="text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08);">
              <p style="color: #666; font-size: 11px;">Captured ${new Date(timestamp).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
            </div>
          </div>
        `;

        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'Nocturn AI <onboarding@resend.dev>',
            to: [notifyEmail],
            subject: `🔥 New Lead: ${name} — ${projectType}`,
            html: emailHtml,
          }),
        });
        results.email = emailRes.ok ? 'sent' : `error: ${emailRes.status}`;
      } catch (e) {
        results.email = `error: ${e.message}`;
        console.error('Resend error:', e);
      }
    }

    // ═══ 3. DISCORD — Webhook notification ═══
    const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
    
    if (discordWebhook) {
      try {
        // Truncate transcript for Discord (2000 char limit per field)
        const shortTranscript = transcript.length > 1000 
          ? transcript.slice(0, 997) + '...' 
          : transcript;

        const discordRes = await fetch(discordWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'Nocturn AI',
            avatar_url: 'https://nocturnlabs.com/nocturn-logo.webp',
            embeds: [{
              title: '🔥 New Project Lead',
              color: 0xe8622c,
              fields: [
                { name: 'Name', value: name, inline: true },
                { name: 'Email', value: email, inline: true },
                { name: 'Project', value: projectType, inline: true },
                { name: 'Budget', value: budget, inline: true },
                { name: 'Messages', value: `${messages.length}`, inline: true },
                { name: 'Status', value: '🟢 New Lead', inline: true },
                ...(brief ? [{ name: '📋 AI Brief', value: brief.slice(0, 1024) }] : []),
                { name: '💬 Transcript Preview', value: shortTranscript },
              ],
              timestamp: timestamp,
              footer: { text: 'Nocturn Labs AI Consultant' },
            }],
          }),
        });
        results.discord = discordRes.ok ? 'sent' : `error: ${discordRes.status}`;
      } catch (e) {
        results.discord = `error: ${e.message}`;
        console.error('Discord error:', e);
      }
    }

    return res.status(200).json({ success: true, results });
  } catch (error) {
    console.error('Lead capture error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
