import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════
const PROJECTS = [
  { id: 1, title: "PRECISION", fullTitle: "Precision Auto Detailing", category: "Web Design", year: "2025", desc: "Premium auto detailing site for Precision Detailing NJ — dark-mode, conversion-driven, built from scratch.", color: "#2d8c4e", image: "/precision-hero.png", logo: "/precision-logo.png", url: "https://precisionautodetailnj.com" },
  { id: 2, title: "CYRATH", fullTitle: "Cyrath", category: "Web Application", year: "2025", desc: "Full-stack fantasy football analytics platform with real-time crowdsourced player valuations and trade tools.", color: "#7c6cff", image: "/cyrath-hero.png", logo: "/cyrath-logo.png", url: "https://cyrath.com" },
  { id: 3, title: "PULSBRUSH", fullTitle: "PulsBrush", category: "E-Commerce", year: "2025", desc: "Premium DTC Shopify store for the world's first fully automatic sonic toothbrush — 40K vibrations, 30-second clean.", color: "#00e5cc", image: "/pulsbrush-hero.png", logo: "/pulsbrush-logo.png", url: "https://pulsbrush.com" },
  { id: 4, title: "DECANTOIR", fullTitle: "Decantoir", category: "E-Commerce", year: "2026", desc: "Luxury fragrance decant boutique — authentic niche & designer scents, perfectly portioned for discovery.", color: "#c5a55a", image: "/decantoir-hero.png", logo: "/decantoir-logo.png", url: "https://decantoir.com" },
];
const SERVICES = [
  { num: "01", title: "Custom Website Design", desc: "Bespoke, conversion-optimized sites built from scratch. No templates. No compromises. Every pixel intentional." },
  { num: "02", title: "Brand Identity Systems", desc: "Logo, typography, color, voice — a complete identity architecture that makes your brand unmistakable." },
  { num: "03", title: "E-Commerce Builds", desc: "Shopify, headless, or custom — storefronts engineered to sell. Premium aesthetics meet ruthless performance." },
  { num: "04", title: "Web Applications", desc: "Full-stack applications with institutional-grade UX. Dashboards, SaaS platforms, and complex tools made beautiful." },
  { num: "05", title: "Creative Direction", desc: "Strategic visual leadership for launches, campaigns, and digital experiences that demand attention." },
];
const PRICING = [
  { tier: "STARTER", price: "1,500", desc: "Single-page site with premium design", features: ["Custom Design (1 page)", "Mobile Responsive", "Basic Animations", "SEO Foundation", "2 Revision Rounds", "1-Week Delivery"] },
  { tier: "PROFESSIONAL", price: "3,500", desc: "Multi-page site with full identity", features: ["Up to 5 Custom Pages", "Brand Identity Package", "Advanced Animations", "CMS Integration", "E-Commerce Ready", "3-Week Delivery"], featured: true },
  { tier: "ENTERPRISE", price: "Contact", desc: "Complete digital ecosystem", features: ["Unlimited Pages", "Full Brand System", "Custom Web App / SaaS", "API Integrations", "Ongoing Support", "Timeline TBD"] },
];
const TESTIMONIALS = [
  { quote: "They didn't just build us a website — they built us a weapon. Conversions up 340% in the first quarter.", name: "Nick Sabatino", role: "CEO, Precision Auto Detailing" },
  { quote: "The level of craft is obscene. Every interaction, every transition, every detail — it's like they're designing for a different decade.", name: "John Perrone", role: "Co-Owner, Cyrath" },
  { quote: "We've worked with agencies that charge 5x more and deliver half the quality. This team operates on another level entirely.", name: "Ryan Coleman", role: "Owner, PulsBrush" },
];
const CASE_STUDIES = [
  { id: 1, title: "Precision Auto Detailing", category: "Web Design", tag: "Automotive", desc: "Premium detailing business site engineered to dominate local search", color: "#2d8c4e", image: "/precision-services.png", logo: "/precision-logo.png", challenge: "No online presence — losing high-value clients to competitors with polished websites and SEO.", solution: "Ground-up dark-mode site with conversion-optimized layout, service pages, Google review integration, and local SEO.", results: [{ value: 180, label: "Organic Traffic", prefix: "+", suffix: "%" }, { value: 4.9, label: "Google Rating", suffix: "★" }] },
  { id: 2, title: "Cyrath", category: "Web Application", tag: "Sports Tech", desc: "Fantasy football analytics platform with 24.8M+ data points", color: "#7c6cff", image: "/cyrath-features.png", logo: "/cyrath-logo.png", challenge: "Fantasy football managers lacked a unified, real-time source for community-driven player valuations across Dynasty, Redraft, and DFS formats.", solution: "Full-stack Next.js platform with live crowdsourced rankings, trade calculator, DFS optimizer, and gamified community engagement.", results: [{ value: 132, label: "Community Leagues", suffix: "K+" }, { value: 24, label: "Data Points", suffix: ".8M+" }] },
  { id: 3, title: "PulsBrush", category: "E-Commerce", tag: "Consumer Product", desc: "DTC Shopify store for automatic sonic toothbrush with 2,400+ reviews", color: "#00e5cc", image: "/pulsbrush-features.png", logo: "/pulsbrush-logo.png", challenge: "Launching a novel oral care product in a crowded market dominated by established brands like Sonicare and Oral-B.", solution: "High-converting Shopify store with dark premium aesthetic, social proof integration, and 3-step how-it-works funnel.", results: [{ value: 100, label: "Happy Customers", suffix: "K+" }, { value: 4.8, label: "Average Rating", suffix: "★" }] },
  { id: 4, title: "Decantoir", category: "E-Commerce", tag: "Luxury Retail", desc: "Boutique fragrance decant store with 100+ authentic scents", color: "#c5a55a", image: "/decantoir-features.png", logo: "/decantoir-logo.png", challenge: "Breaking into the luxury fragrance market where customers hesitate to buy full bottles of expensive niche scents sight-unseen.", solution: "Elegant Shopify boutique with gold-accented minimal design, curated discovery flow, and trust-building authenticity guarantees.", results: [{ value: 100, label: "Fragrances", suffix: "+" }, { value: 4.8, label: "Avg Rating", suffix: "★" }] },
];

const IS_TOUCH = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

// ═══════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════
function useScrollReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsVisible(true); obs.unobserve(el); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, isVisible];
}

function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      const p = Math.max(0, Math.min(1, (viewH - rect.top) / (viewH + rect.height)));
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return progress;
}

function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (IS_TOUCH) return;
    const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return pos;
}

// ═══════════════════════════════════════════
// CORE COMPONENTS
// ═══════════════════════════════════════════
function AnimatedText({ children, delay = 0, className = "" }) {
  const [ref, vis] = useScrollReveal();
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(60px)", transition: `all 1s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` }}>
      {children}
    </div>
  );
}

function SplitText({ children, delay = 0, stagger = 0.04, trigger = true, type = "words" }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (trigger === true) {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
        { threshold: 0.2 }
      );
      if (containerRef.current) obs.observe(containerRef.current);
      return () => obs.disconnect();
    } else {
      setIsVisible(trigger);
    }
  }, [trigger]);
  const text = typeof children === "string" ? children : "";
  const pieces = type === "chars" ? text.split("") : text.split(" ");
  return (
    <span ref={containerRef} style={{ display: "inline" }}>
      {pieces.map((piece, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden" }}>
          <span style={{
            display: "inline-block",
            transform: isVisible ? "translateY(0)" : "translateY(110%)",
            opacity: isVisible ? 1 : 0,
            transition: `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * stagger}s, opacity 0.5s ease ${delay + i * stagger}s`,
          }}>
            {piece}{type === "words" ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </span>
  );
}

function MagneticButton({ children, style = {}, onClick, className, as = "button", href, ...props }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (IS_TOUCH) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.2;
    const deltaY = (e.clientY - centerY) * 0.2;
    setOffset({ x: Math.max(-10, Math.min(10, deltaX)), y: Math.max(-10, Math.min(10, deltaY)) });
  };

  const handleMouseLeave = () => { setOffset({ x: 0, y: 0 }); setIsHovering(false); };
  const handleMouseEnter = () => setIsHovering(true);

  const Tag = as === "a" ? "a" : "button";
  return (
    <Tag ref={ref} data-hover onClick={onClick} href={href} className={className}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}
      style={{
        ...style,
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: isHovering ? "transform 0.15s ease-out" : "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        textDecoration: "none",
      }} {...props}>
      {children}
    </Tag>
  );
}

function GrainOverlay() {
  return <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9999, opacity: 0.015, background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />;
}

function ScrollProgressBar() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    let raf;
    const update = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(docH > 0 ? (window.scrollY / docH) * 100 : 0);
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "2px", background: "rgba(255,255,255,0.06)", zIndex: 10001 }} />
      <div style={{ position: "fixed", top: 0, left: 0, width: `${width}%`, height: "2px", background: "#e8622c", zIndex: 10001, transition: "width 0.05s linear" }} />
    </>
  );
}

function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hoverType, setHoverType] = useState("none"); // none, default, project, cta
  useEffect(() => {
    if (IS_TOUCH) return;
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e) => {
      const proj = e.target.closest("[data-hover-project]");
      const cta = e.target.closest("[data-hover-cta]");
      const generic = e.target.closest("[data-hover]");
      if (proj) setHoverType("project");
      else if (cta) setHoverType("cta");
      else if (generic) setHoverType("default");
    };
    const out = (e) => {
      if (e.target.closest("[data-hover]") || e.target.closest("[data-hover-project]") || e.target.closest("[data-hover-cta]")) setHoverType("none");
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); window.removeEventListener("mouseout", out); };
  }, []);

  if (IS_TOUCH) return null;

  const isHovering = hoverType !== "none";
  const size = isHovering ? 50 : 10;

  return (
    <>
      {/* Main cursor */}
      <div style={{
        position: "fixed", left: pos.x, top: pos.y, width: size, height: size, borderRadius: "50%",
        background: isHovering ? "transparent" : "#e8622c",
        border: isHovering ? "1px solid #e8622c" : "none",
        transform: "translate(-50%, -50%)",
        transition: "width 0.3s, height 0.3s, background 0.3s, border 0.3s",
        pointerEvents: "none", zIndex: 10000, mixBlendMode: "difference",
      }} />
      {/* Trailing dot */}
      <div style={{
        position: "fixed", left: pos.x, top: pos.y, width: 5, height: 5, borderRadius: "50%",
        background: "#e8622c", opacity: 0.4,
        transform: "translate(-50%, -50%)",
        transition: "left 0.2s ease-out, top 0.2s ease-out",
        pointerEvents: "none", zIndex: 9999, mixBlendMode: "difference",
      }} />
    </>
  );
}

// ═══════════════════════════════════════════
// SITE-WIDE GPU FLUID SIMULATION (Navier-Stokes)
// ═══════════════════════════════════════════
function MouseFluidCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;
    gl.getExtension("EXT_color_buffer_float");
    gl.getExtension("OES_texture_float_linear");

    let animId, W, H, simW, simH, dyeW, dyeH;
    const SIM_RES = 128, DYE_RES = 512;
    const SPLAT_RADIUS = 0.25, SPLAT_FORCE = 6000, PRESSURE_ITERS = 20, CURL_STR = 30;
    const VEL_DISS = 0.98, DYE_DISS = 0.97;
    const COLORS = [[0.9,0.38,0.17],[0.94,0.58,0.23],[0.4,0.15,0.8],[0.05,0.7,0.5],[0.0,0.45,1.0]];

    const doResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
      const aspect = W / H;
      simH = SIM_RES; simW = Math.round(simH * aspect);
      dyeH = DYE_RES; dyeW = Math.round(dyeH * aspect);
    };
    doResize();

    // Shader compilation
    const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const makeProg = (vs, fs) => {
      const p = gl.createProgram();
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      const u = {};
      for (let i = 0; i < gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i++) {
        const info = gl.getActiveUniform(p, i);
        u[info.name] = gl.getUniformLocation(p, info.name);
      }
      return { program: p, uniforms: u };
    };

    const baseVS = `#version 300 es
in vec2 aPos; out vec2 vUv;
void main(){vUv=aPos*0.5+0.5;gl_Position=vec4(aPos,0,1);}`;

    const splatFS = `#version 300 es
precision highp float;
uniform sampler2D uTex;uniform vec2 uPoint;uniform vec3 uColor;uniform float uRadius;uniform float uAspect;
in vec2 vUv;out vec4 fc;
void main(){vec2 p=vUv-uPoint;p.x*=uAspect;float d=dot(p,p);fc=vec4(texture(uTex,vUv).xyz+uColor*exp(-d/uRadius),1);}`;

    const curlFS = `#version 300 es
precision highp float;
uniform sampler2D uVelocity;uniform vec2 uTs;in vec2 vUv;out vec4 fc;
void main(){float L=texture(uVelocity,vUv-vec2(uTs.x,0)).y;float R=texture(uVelocity,vUv+vec2(uTs.x,0)).y;
float T=texture(uVelocity,vUv+vec2(0,uTs.y)).x;float B=texture(uVelocity,vUv-vec2(0,uTs.y)).x;fc=vec4(R-L-T+B,0,0,1);}`;

    const vortFS = `#version 300 es
precision highp float;
uniform sampler2D uVelocity;uniform sampler2D uCurl;uniform vec2 uTs;uniform float uStr;uniform float uDt;
in vec2 vUv;out vec4 fc;
void main(){float L=texture(uCurl,vUv-vec2(uTs.x,0)).x;float R=texture(uCurl,vUv+vec2(uTs.x,0)).x;
float T=texture(uCurl,vUv+vec2(0,uTs.y)).x;float B=texture(uCurl,vUv-vec2(0,uTs.y)).x;float C=texture(uCurl,vUv).x;
vec2 f=0.5*vec2(abs(T)-abs(B),abs(R)-abs(L));f=f/(length(f)+1e-4)*uStr*C;
fc=vec4(texture(uVelocity,vUv).xy+f*uDt,0,1);}`;

    const divFS = `#version 300 es
precision highp float;
uniform sampler2D uVelocity;uniform vec2 uTs;in vec2 vUv;out vec4 fc;
void main(){float L=texture(uVelocity,vUv-vec2(uTs.x,0)).x;float R=texture(uVelocity,vUv+vec2(uTs.x,0)).x;
float T=texture(uVelocity,vUv+vec2(0,uTs.y)).y;float B=texture(uVelocity,vUv-vec2(0,uTs.y)).y;
fc=vec4(0.5*(R-L+T-B),0,0,1);}`;

    const pressFS = `#version 300 es
precision highp float;
uniform sampler2D uPressure;uniform sampler2D uDiv;uniform vec2 uTs;in vec2 vUv;out vec4 fc;
void main(){float L=texture(uPressure,vUv-vec2(uTs.x,0)).x;float R=texture(uPressure,vUv+vec2(uTs.x,0)).x;
float T=texture(uPressure,vUv+vec2(0,uTs.y)).x;float B=texture(uPressure,vUv-vec2(0,uTs.y)).x;
fc=vec4((L+R+B+T-texture(uDiv,vUv).x)*0.25,0,0,1);}`;

    const gradFS = `#version 300 es
precision highp float;
uniform sampler2D uPressure;uniform sampler2D uVelocity;uniform vec2 uTs;in vec2 vUv;out vec4 fc;
void main(){float L=texture(uPressure,vUv-vec2(uTs.x,0)).x;float R=texture(uPressure,vUv+vec2(uTs.x,0)).x;
float T=texture(uPressure,vUv+vec2(0,uTs.y)).x;float B=texture(uPressure,vUv-vec2(0,uTs.y)).x;
fc=vec4(texture(uVelocity,vUv).xy-vec2(R-L,T-B)*0.5,0,1);}`;

    const advFS = `#version 300 es
precision highp float;
uniform sampler2D uVelocity;uniform sampler2D uSource;uniform vec2 uTs;uniform float uDt;uniform float uDiss;
in vec2 vUv;out vec4 fc;
void main(){vec2 coord=vUv-texture(uVelocity,vUv).xy*uTs*uDt;fc=texture(uSource,coord)*uDiss;}`;

    const dispFS = `#version 300 es
precision highp float;
uniform sampler2D uTex;uniform vec2 uTs;in vec2 vUv;out vec4 fc;
void main(){vec3 c=texture(uTex,vUv).rgb;
vec3 bl=vec3(0);float bs=4.0;
bl+=texture(uTex,vUv+vec2(bs,0)*uTs).rgb;bl+=texture(uTex,vUv-vec2(bs,0)*uTs).rgb;
bl+=texture(uTex,vUv+vec2(0,bs)*uTs).rgb;bl+=texture(uTex,vUv-vec2(0,bs)*uTs).rgb;
bl*=0.25;float lum=dot(bl,vec3(.2126,.7152,.0722));bl*=smoothstep(0.2,0.8,lum);
c+=bl*0.4;c=c/(c+0.8);float v=1.0-length(vUv-0.5)*0.7;
fc=vec4(c*v,1);}`;

    const splatP = makeProg(baseVS, splatFS);
    const curlP = makeProg(baseVS, curlFS);
    const vortP = makeProg(baseVS, vortFS);
    const divP = makeProg(baseVS, divFS);
    const pressP = makeProg(baseVS, pressFS);
    const gradP = makeProg(baseVS, gradFS);
    const advP = makeProg(baseVS, advFS);
    const dispP = makeProg(baseVS, dispFS);

    // Quad buffer
    const qBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, qBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);

    const hf = gl.HALF_FLOAT, lin = gl.LINEAR, near = gl.NEAREST;
    const makeFBO = (w, h, ifmt, fmt, tp, flt) => {
      const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, flt);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, flt);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, ifmt, w, h, 0, fmt, tp, null);
      const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { texture: tex, fb, w, h };
    };
    const makeDBL = (w, h, ifmt, fmt, tp, flt) => ({
      read: makeFBO(w, h, ifmt, fmt, tp, flt),
      write: makeFBO(w, h, ifmt, fmt, tp, flt),
      swap() { const t = this.read; this.read = this.write; this.write = t; }
    });

    let velocity = makeDBL(simW, simH, gl.RG16F, gl.RG, hf, lin);
    let dye = makeDBL(dyeW, dyeH, gl.RGBA16F, gl.RGBA, hf, lin);
    let curl = makeFBO(simW, simH, gl.R16F, gl.RED, hf, near);
    let divergence = makeFBO(simW, simH, gl.R16F, gl.RED, hf, near);
    let pressure = makeDBL(simW, simH, gl.R16F, gl.RED, hf, near);

    const blit = (target, w, h, prog, ...textures) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target);
      gl.viewport(0, 0, w, h);
      gl.useProgram(prog.program);
      textures.forEach((tex, i) => { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, tex); });
      gl.bindBuffer(gl.ARRAY_BUFFER, qBuf);
      const loc = gl.getAttribLocation(prog.program, "aPos");
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const pointer = { x: 0, y: 0, px: 0, py: 0, dx: 0, dy: 0, moved: false, color: [0,0,0] };
    let lastColorTime = 0;
    const pickColor = () => { const c = COLORS[Math.floor(Math.random() * COLORS.length)]; return [c[0]*0.8, c[1]*0.8, c[2]*0.8]; };

    const splat = (x, y, dx, dy, color, rMul = 1) => {
      const r = SPLAT_RADIUS * rMul / 100;
      const u = splatP.uniforms;
      gl.useProgram(splatP.program);
      gl.uniform1i(u.uTex, 0); gl.uniform2f(u.uPoint, x, y);
      gl.uniform3f(u.uColor, dx*SPLAT_FORCE*0.001, dy*SPLAT_FORCE*0.001, 0);
      gl.uniform1f(u.uRadius, r); gl.uniform1f(u.uAspect, W/H);
      blit(velocity.write.fb, simW, simH, splatP, velocity.read.texture); velocity.swap();
      gl.uniform3f(u.uColor, color[0], color[1], color[2]);
      gl.uniform1f(u.uRadius, r * 1.2);
      blit(dye.write.fb, dyeW, dyeH, splatP, dye.read.texture); dye.swap();
    };

    const step = (dt) => {
      const sTs = [1/simW, 1/simH], dTs = [1/dyeW, 1/dyeH];

      gl.useProgram(curlP.program); gl.uniform1i(curlP.uniforms.uVelocity, 0); gl.uniform2fv(curlP.uniforms.uTs, sTs);
      blit(curl.fb, simW, simH, curlP, velocity.read.texture);

      gl.useProgram(vortP.program); gl.uniform1i(vortP.uniforms.uVelocity, 0); gl.uniform1i(vortP.uniforms.uCurl, 1);
      gl.uniform2fv(vortP.uniforms.uTs, sTs); gl.uniform1f(vortP.uniforms.uStr, CURL_STR); gl.uniform1f(vortP.uniforms.uDt, dt);
      blit(velocity.write.fb, simW, simH, vortP, velocity.read.texture, curl.texture); velocity.swap();

      gl.useProgram(divP.program); gl.uniform1i(divP.uniforms.uVelocity, 0); gl.uniform2fv(divP.uniforms.uTs, sTs);
      blit(divergence.fb, simW, simH, divP, velocity.read.texture);

      gl.useProgram(pressP.program); gl.uniform1i(pressP.uniforms.uPressure, 0); gl.uniform1i(pressP.uniforms.uDiv, 1); gl.uniform2fv(pressP.uniforms.uTs, sTs);
      for (let i = 0; i < PRESSURE_ITERS; i++) { blit(pressure.write.fb, simW, simH, pressP, pressure.read.texture, divergence.texture); pressure.swap(); }

      gl.useProgram(gradP.program); gl.uniform1i(gradP.uniforms.uPressure, 0); gl.uniform1i(gradP.uniforms.uVelocity, 1); gl.uniform2fv(gradP.uniforms.uTs, sTs);
      blit(velocity.write.fb, simW, simH, gradP, pressure.read.texture, velocity.read.texture); velocity.swap();

      gl.useProgram(advP.program); gl.uniform1i(advP.uniforms.uVelocity, 0); gl.uniform1i(advP.uniforms.uSource, 1);
      gl.uniform2fv(advP.uniforms.uTs, sTs); gl.uniform1f(advP.uniforms.uDt, dt); gl.uniform1f(advP.uniforms.uDiss, VEL_DISS);
      blit(velocity.write.fb, simW, simH, advP, velocity.read.texture, velocity.read.texture); velocity.swap();

      gl.uniform2fv(advP.uniforms.uTs, dTs); gl.uniform1f(advP.uniforms.uDiss, DYE_DISS);
      blit(dye.write.fb, dyeW, dyeH, advP, velocity.read.texture, dye.read.texture); dye.swap();
    };

    // Random ambient splats
    const randomSplats = () => {
      for (let i = 0; i < 1 + Math.floor(Math.random() * 2); i++) {
        splat(Math.random(), Math.random(), (Math.random()-0.5)*1000, (Math.random()-0.5)*1000, pickColor(), 0.5);
      }
    };
    setTimeout(() => { for (let i = 0; i < 3; i++) randomSplats(); }, 200);
    const ambientInterval = setInterval(randomSplats, 5000);

    const onMouseMove = (e) => {
      pointer.px = pointer.x; pointer.py = pointer.y;
      pointer.x = e.clientX / W; pointer.y = 1 - e.clientY / H;
      pointer.dx = (pointer.x - pointer.px) * W; pointer.dy = (pointer.y - pointer.py) * H;
      pointer.moved = Math.abs(pointer.dx) > 0.5 || Math.abs(pointer.dy) > 0.5;
      const now = performance.now();
      if (now - lastColorTime > 300) { pointer.color = pickColor(); lastColorTime = now; }
    };
    const onTouch = (e) => {
      const t = e.touches[0];
      pointer.px = pointer.x; pointer.py = pointer.y;
      pointer.x = t.clientX / W; pointer.y = 1 - t.clientY / H;
      pointer.dx = (pointer.x - pointer.px) * W; pointer.dy = (pointer.y - pointer.py) * H;
      pointer.moved = true;
      const now = performance.now();
      if (now - lastColorTime > 300) { pointer.color = pickColor(); lastColorTime = now; }
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouch, { passive: true });

    let lastTime = performance.now();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016);
      lastTime = now;
      if (pointer.moved) { splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color); pointer.moved = false; }
      step(dt);
      gl.useProgram(dispP.program); gl.uniform1i(dispP.uniforms.uTex, 0); gl.uniform2f(dispP.uniforms.uTs, 1/W, 1/H);
      blit(null, W, H, dispP, dye.read.texture);
    };
    animate();

    const onResize = () => {
      doResize();
      velocity = makeDBL(simW, simH, gl.RG16F, gl.RG, hf, lin);
      dye = makeDBL(dyeW, dyeH, gl.RGBA16F, gl.RGBA, hf, lin);
      curl = makeFBO(simW, simH, gl.R16F, gl.RED, hf, near);
      divergence = makeFBO(simW, simH, gl.R16F, gl.RED, hf, near);
      pressure = makeDBL(simW, simH, gl.R16F, gl.RED, hf, near);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(ambientInterval);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 1, pointerEvents: "none" }} />
  );
}


// ═══════════════════════════════════════════
// LOADING OVERLAY
// ═══════════════════════════════════════════
function LoadingOverlay({ onComplete }) {
  const [phase, setPhase] = useState("loading");
  const [pct, setPct] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const duration = 2200;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const ease = elapsed < 0.5 ? 2 * elapsed * elapsed : 1 - Math.pow(-2 * elapsed + 2, 3) / 2;
      setPct(Math.round(ease * 100));
      if (elapsed < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const t1 = setTimeout(() => setPhase("revealing"), 2400);
    const t2 = setTimeout(() => { setPhase("done"); document.body.style.overflow = ""; onComplete(); }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "done") return null;

  const digits = String(pct).padStart(3, "0").split("");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "#000", pointerEvents: "none", opacity: phase === "revealing" ? 0 : 1, transform: phase === "revealing" ? "translateY(-100%)" : "translateY(0)", transition: phase === "revealing" ? "opacity 0.6s cubic-bezier(0.76, 0, 0.24, 1), transform 0.8s cubic-bezier(0.76, 0, 0.24, 1) 0.1s" : "none" }}>
      {/* Center logo + progress bar */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", opacity: pct > 15 ? 1 : 0, transform: pct > 15 ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <img src="/nocturn-logo.png" alt="Nocturn Labs" style={{ width: "48px", height: "48px", objectFit: "contain", filter: pct >= 100 ? "drop-shadow(0 0 16px rgba(240,148,58,0.5))" : "drop-shadow(0 0 8px rgba(240,148,58,0.25))", transition: "filter 0.6s ease" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "0.5px" }}>Nocturn Labs</span>
        </div>
        {/* Progress bar */}
        <div style={{ width: "120px", height: "2px", background: "rgba(255,255,255,0.1)", borderRadius: "1px", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "#fff", borderRadius: "1px", transition: "width 0.15s ease-out" }} />
        </div>
      </div>
      {/* Rolling odometer — bottom left */}
      <div style={{ position: "absolute", bottom: "40px", left: "48px", display: "flex", gap: "0", overflow: "hidden", height: "120px" }}>
        {digits.map((d, i) => (
          <div key={i} style={{ width: "72px", height: "120px", overflow: "hidden", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", transform: `translateY(${-parseInt(d) * 120}px)`, transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              {[0,1,2,3,4,5,6,7,8,9].map(n => (
                <span key={n} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "120px", fontWeight: 200, lineHeight: "120px", height: "120px", display: "block", color: "rgba(255,255,255,0.6)", letterSpacing: "-4px", fontVariantNumeric: "tabular-nums" }}>{n}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Corner frame marks */}
      <div style={{ position: "absolute", top: "24px", left: "24px", width: "30px", height: "30px", borderTop: "1px solid rgba(255,255,255,0.12)", borderLeft: "1px solid rgba(255,255,255,0.12)" }} />
      <div style={{ position: "absolute", top: "24px", right: "24px", width: "30px", height: "30px", borderTop: "1px solid rgba(255,255,255,0.12)", borderRight: "1px solid rgba(255,255,255,0.12)" }} />
      <div style={{ position: "absolute", bottom: "24px", right: "24px", width: "30px", height: "30px", borderBottom: "1px solid rgba(255,255,255,0.12)", borderRight: "1px solid rgba(255,255,255,0.12)" }} />
      {/* "Loading" label — top right */}
      <div style={{ position: "absolute", top: "32px", right: "64px", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "4px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>Loading</div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SMOOTH SCROLL WRAPPER
// ═══════════════════════════════════════════
function SmoothScrollWrapper({ children, enabled }) {
  const containerRef = useRef(null);
  const currentRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!enabled || IS_TOUCH) return;
    const container = containerRef.current;
    if (!container) return;

    const syncHeight = () => { document.body.style.height = container.scrollHeight + "px"; };
    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(container);

    const lerp = () => {
      const target = window.scrollY;
      currentRef.current += (target - currentRef.current) * 0.08;
      if (Math.abs(target - currentRef.current) < 0.5) currentRef.current = target;
      container.style.transform = `translateY(${-currentRef.current}px)`;
      rafRef.current = requestAnimationFrame(lerp);
    };
    rafRef.current = requestAnimationFrame(lerp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      document.body.style.height = "";
    };
  }, [enabled]);

  if (!enabled || IS_TOUCH) return <>{children}</>;

  return (
    <div ref={containerRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", willChange: "transform" }}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════
// NAVBAR
// ═══════════════════════════════════════════
function useDeviceDetect() {
  const [device, setDevice] = useState({ isMobile: false, isTablet: false, isTouch: false });
  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const check = () => setDevice({ isMobile: window.innerWidth < 768, isTablet: window.innerWidth >= 768 && window.innerWidth < 1024, isTouch });
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return device;
}

function MobileMenu({ isOpen, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#080812", opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none", transition: "opacity 0.4s", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "32px" }}>
      <button onClick={onClose} style={{ position: "absolute", top: "24px", right: "24px", background: "none", border: "none", color: "#e8622c", fontSize: "32px", cursor: "pointer" }}>✕</button>
      {["Work", "Services", "Pricing", "Contact"].map((item, i) => (
        <a key={item} href={`#${item.toLowerCase()}`} onClick={onClose}
          style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "48px", color: "rgba(255,255,255,0.9)", textDecoration: "none", opacity: isOpen ? 1 : 0, transform: isOpen ? "translateY(0)" : "translateY(20px)", transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? i * 0.08 : 0}s` }}>
          {item}
        </a>
      ))}
    </div>
  );
}

function Navbar({ scrolled, activeNav }) {
  const { isMobile } = useDeviceDetect();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, padding: isMobile ? "16px 20px" : "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: "none", transition: "all 0.5s" }}>
        <a href="#top" className="nav-logo-link" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <img src="/nocturn-logo.png" alt="Nocturn Labs" className="nav-logo-icon" style={{ width: "40px", height: "40px", objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(240,148,58,0.35))", transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 900, color: "#ffffff", letterSpacing: "0.5px" }}>Nocturn Labs</span>
        </a>
        {isMobile ? (
          <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: "6px", padding: "8px" }}>
            {[0,1,2].map(i => <span key={i} style={{ width: "24px", height: "2px", background: scrolled ? "#e8622c" : "#fff", display: "block", transition: "background 0.5s" }} />)}
          </button>
        ) : (
          <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
            {["Work", "Services", "Pricing", "Contact"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} data-hover
                style={{ color: activeNav === item.toLowerCase() ? "#e8622c" : "rgba(255,255,255,0.95)", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", transition: "color 0.3s" }}
                onMouseEnter={e => e.target.style.color = "#e8622c"}
                onMouseLeave={e => { if (activeNav !== item.toLowerCase()) e.target.style.color = "rgba(255,255,255,0.95)"; }}>
                {item}
              </a>
            ))}
            <MagneticButton as="a" href="#contact" data-hover-cta style={{ padding: "10px 28px", background: "#e8622c", color: "#ffffff", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", display: "inline-block" }}>
              START PROJECT
            </MagneticButton>
          </div>
        )}
      </nav>
    </>
  );
}

// ═══════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════
// 3D WEBGL HERO — V2 (FBM + SATELLITES + RINGS)
// ═══════════════════════════════════════════
const GLSL_NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;
  vec3 i1=min(g,l.zxy);vec3 i2=max(g,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p,float freq,float amp,int octaves){
  float val=0.;float f=freq;float a=amp;
  for(int i=0;i<8;i++){if(i>=octaves)break;val+=snoise(p*f)*a;f*=2.1;a*=0.48;}
  return val;
}
`;

const BLOB_V2_VERT = `
${GLSL_NOISE}
uniform float uTime;uniform float uNoiseAmp;uniform float uNoiseFreq;uniform float uNoiseSpeed;
uniform vec2 uMouse;uniform float uMouseInfluence;uniform float uPress;
varying vec3 vNormal;varying vec3 vWorldPos;varying float vDisp;varying float vFresnel;
void main(){
  vec3 pos=position;float t=uTime*uNoiseSpeed;
  float n=fbm(pos+t,uNoiseFreq,uNoiseAmp,5);
  vec3 warpedPos=pos+vec3(n*0.4,n*0.3,n*0.5);
  float n2=fbm(warpedPos+t*0.7,uNoiseFreq*1.5,uNoiseAmp*0.4,3);
  vec3 mDir=normalize(vec3(uMouse.x,-uMouse.y,0.4));
  float mDot=max(dot(normalize(pos),mDir),0.0);
  float mPull=pow(mDot,3.0)*uMouseInfluence*(1.0+uPress*2.0);
  float disp=n+n2+mPull*0.35;
  vec3 newPos=pos+normal*disp;
  float eps=0.001;
  vec3 tangent=normalize(cross(normal,vec3(0.0,1.0,0.0)));
  if(length(tangent)<0.01) tangent=normalize(cross(normal,vec3(1.0,0.0,0.0)));
  vec3 bitangent=normalize(cross(normal,tangent));
  float dn=fbm(pos+tangent*eps+t,uNoiseFreq,uNoiseAmp,5);
  float db=fbm(pos+bitangent*eps+t,uNoiseFreq,uNoiseAmp,5);
  vec3 modNormal=normalize(normal+(n-dn)/eps*tangent+(n-db)/eps*bitangent);
  vNormal=normalize(normalMatrix*modNormal);
  vWorldPos=(modelMatrix*vec4(newPos,1.0)).xyz;
  vDisp=disp;
  vec3 viewDir=normalize(cameraPosition-vWorldPos);
  vFresnel=pow(1.0-max(dot(viewDir,vNormal),0.0),3.5);
  gl_Position=projectionMatrix*modelViewMatrix*vec4(newPos,1.0);
}
`;

const BLOB_V2_FRAG = `
uniform float uTime;uniform vec3 uCol1;uniform vec3 uCol2;uniform vec3 uCol3;uniform vec3 uCol4;
uniform vec2 uMouse;uniform float uPress;
varying vec3 vNormal;varying vec3 vWorldPos;varying float vDisp;varying float vFresnel;
void main(){
  vec3 viewDir=normalize(cameraPosition-vWorldPos);
  float angle=atan(vNormal.z,vNormal.x);float hG=vNormal.y*0.5+0.5;
  float m1=sin(angle*2.0+uTime*0.3+vDisp*4.0)*0.5+0.5;
  float m2=cos(angle*3.0-uTime*0.2+hG*3.14)*0.5+0.5;
  float m3=sin(hG*5.0+uTime*0.15)*0.5+0.5;
  vec3 baseColor=mix(uCol1,uCol2,m1);baseColor=mix(baseColor,uCol3,m2*0.5);baseColor=mix(baseColor,uCol4,m3*0.2);
  vec3 lightDir=normalize(vec3(uMouse.x*2.0,-uMouse.y*2.0+1.5,2.5));
  float NdL=dot(vNormal,lightDir);float sss=smoothstep(-0.5,0.8,-NdL)*0.4;
  vec3 sssColor=mix(uCol1,uCol3,0.5)*sss;
  vec3 rimColor=mix(uCol2,uCol4,sin(uTime*0.4)*0.5+0.5);
  vec3 rim=rimColor*vFresnel*(1.3+uPress*0.5);
  vec3 halfDir=normalize(lightDir+viewDir);
  float spec1=pow(max(dot(vNormal,halfDir),0.0),128.0)*0.5;
  float spec2=pow(max(dot(vNormal,halfDir),0.0),32.0)*0.15;
  vec3 reflDir=reflect(-viewDir,vNormal);float envG=reflDir.y*0.5+0.5;
  vec3 envColor=mix(vec3(0.02,0.01,0.06),vec3(0.04,0.08,0.12),envG)*0.5;
  vec3 color=baseColor*0.12+sssColor+rim+envColor+vec3(1.0)*(spec1+spec2);
  color+=uCol1*smoothstep(0.2,0.6,vDisp)*0.15;color+=uCol4*smoothstep(0.4,0.8,vDisp)*0.08;
  gl_FragColor=vec4(color,1.0);
}
`;

const PARTICLE_V2_VERT = `
uniform float uTime;uniform float uPR;
attribute float aSize;attribute float aSpeed;attribute float aPhase;attribute vec3 aColor;
varying float vAlpha;varying vec3 vColor;
void main(){
  vec3 pos=position;
  pos.x+=sin(uTime*aSpeed+aPhase)*0.5;pos.y+=cos(uTime*aSpeed*0.6+aPhase*1.7)*0.6;pos.z+=sin(uTime*aSpeed*0.4+aPhase*2.3)*0.4;
  vec4 mv=modelViewMatrix*vec4(pos,1.0);
  gl_PointSize=aSize*uPR*(300.0/-mv.z);gl_Position=projectionMatrix*mv;
  vAlpha=smoothstep(18.0,2.0,-mv.z)*0.45;vColor=aColor;
}
`;

const PARTICLE_V2_FRAG = `varying float vAlpha;varying vec3 vColor;
void main(){float d=length(gl_PointCoord-0.5);float a=smoothstep(0.5,0.0,d)*vAlpha;gl_FragColor=vec4(vColor,a);}`;

const RING_VERT = `uniform float uTime;uniform float uIndex;varying float vAngle;
void main(){vAngle=atan(position.y,position.x);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const RING_FRAG = `uniform float uTime;uniform float uIndex;varying float vAngle;
void main(){float pulse=sin(vAngle*8.0+uTime*2.0+uIndex*2.09)*0.5+0.5;float alpha=mix(0.02,0.12,pulse);gl_FragColor=vec4(1.0,1.0,1.0,alpha);}`;

const SCREEN_VERT = `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}`;
const BRIGHT_FRAG = `uniform sampler2D tDiffuse;uniform float uThreshold;varying vec2 vUv;
void main(){vec4 c=texture2D(tDiffuse,vUv);float br=dot(c.rgb,vec3(0.2126,0.7152,0.0722));float contrib=max(0.0,br-uThreshold);float factor=contrib/max(br,0.001);gl_FragColor=vec4(c.rgb*factor,1.0);}`;
const BLUR_V2_FRAG = `uniform sampler2D tDiffuse;uniform vec2 uDir;uniform vec2 uRes;varying vec2 vUv;
void main(){vec2 ts=1.0/uRes;vec4 sum=vec4(0.0);float w[5];w[0]=0.227027;w[1]=0.1945946;w[2]=0.1216216;w[3]=0.054054;w[4]=0.016216;
sum+=texture2D(tDiffuse,vUv)*w[0];for(int i=1;i<5;i++){vec2 off=uDir*ts*float(i)*2.0;sum+=texture2D(tDiffuse,vUv+off)*w[i];sum+=texture2D(tDiffuse,vUv-off)*w[i];}gl_FragColor=sum;}`;

const COMPOSITE_V2_FRAG = `
uniform sampler2D tBase;uniform sampler2D tBloom;uniform float uBloomStr;uniform float uChromatic;
uniform float uVignette;uniform float uGrain;uniform float uColorTemp;uniform float uTime;uniform vec2 uRes;varying vec2 vUv;
float goldNoise(vec2 xy,float seed){return fract(tan(distance(xy*1.61803398875,xy)*seed)*xy.x);}
void main(){
  vec2 uv=vUv;vec2 dir=uv-0.5;float dist=length(dir);float str=dist*dist*uChromatic;
  float r=texture2D(tBase,uv+dir*str).r;float g=texture2D(tBase,uv).g;float b=texture2D(tBase,uv-dir*str).b;
  vec3 color=vec3(r,g,b)+texture2D(tBloom,uv).rgb*uBloomStr;
  color=color*(2.51*color+0.03)/(color*(2.43*color+0.59)+0.14);
  float lum=dot(color,vec3(0.2126,0.7152,0.0722));
  vec3 warm=color*vec3(1.06,1.0,0.92);vec3 cool=color*vec3(0.92,0.95,1.08);
  color=mix(cool,warm,smoothstep(0.0,1.0,lum))*(1.0-uColorTemp)+color*uColorTemp;
  color=mix(vec3(lum),color,1.15);
  float vig=1.0-dist*uVignette*1.4;color*=smoothstep(0.0,1.0,vig);
  float grain=(goldNoise(uv*uRes,fract(uTime*0.5))*2.0-1.0)*uGrain;
  color+=grain;
  gl_FragColor=vec4(color,1.0);
}
`;

const HERO_COLORS = {
  col1: [0.05, 0.85, 0.55], col2: [0.45, 0.15, 1.0],
  col3: [1.0, 0.12, 0.35], col4: [0.78, 1.0, 0.18],
};

function HeroVisual() {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let animId;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let pressing = 0, pressTarget = 0;
    const wH = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010108);
    scene.fog = new THREE.FogExp2(0x010108, 0.045);
    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5.2);
    const clock = new THREE.Clock();

    const makeBlobUniforms = (ampMul = 1, freqMul = 1, speedMul = 1, mouseInf = 0.35) => ({
      uTime: { value: 0 }, uNoiseAmp: { value: 0.38 * ampMul }, uNoiseFreq: { value: 1.1 * freqMul },
      uNoiseSpeed: { value: 0.12 * speedMul }, uMouse: { value: new THREE.Vector2() }, uMouseInfluence: { value: mouseInf }, uPress: { value: 0 },
      uCol1: { value: new THREE.Vector3(...HERO_COLORS.col1) }, uCol2: { value: new THREE.Vector3(...HERO_COLORS.col2) },
      uCol3: { value: new THREE.Vector3(...HERO_COLORS.col3) }, uCol4: { value: new THREE.Vector3(...HERO_COLORS.col4) },
    });

    // Main blob
    const blobGeo = new THREE.IcosahedronGeometry(1.65, 200);
    const blobMat = new THREE.ShaderMaterial({ vertexShader: BLOB_V2_VERT, fragmentShader: BLOB_V2_FRAG, uniforms: makeBlobUniforms(), side: THREE.DoubleSide });
    const blob = new THREE.Mesh(blobGeo, blobMat);
    scene.add(blob);

    // Satellites
    const satellites = [];
    for (let i = 0; i < 5; i++) {
      const r = 0.2 + Math.random() * 0.35;
      const sGeo = new THREE.IcosahedronGeometry(r, 80);
      const sMat = new THREE.ShaderMaterial({ vertexShader: BLOB_V2_VERT, fragmentShader: BLOB_V2_FRAG, uniforms: makeBlobUniforms(0.8, 1.4, 0.8 + Math.random() * 0.5, 0.15), side: THREE.DoubleSide });
      const sMesh = new THREE.Mesh(sGeo, sMat);
      sMesh.userData = { orbit: 2.8 + Math.random() * 1.7, speed: 0.15 + Math.random() * 0.2, phase: Math.random() * Math.PI * 2, tilt: (Math.random() - 0.5) * 1.2 };
      scene.add(sMesh);
      satellites.push(sMesh);
    }

    // Wireframe rings
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const radius = 2.5 + i * 0.9;
      const rGeo = new THREE.RingGeometry(radius, radius + 0.003, 128, 1);
      const rMat = new THREE.ShaderMaterial({ vertexShader: RING_VERT, fragmentShader: RING_FRAG, uniforms: { uTime: { value: 0 }, uIndex: { value: i } }, transparent: true, side: THREE.DoubleSide, depthWrite: false });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.rotation.x = Math.PI * 0.35 + i * 0.25; rMesh.rotation.z = i * 0.4;
      rMesh.userData = { baseRotX: rMesh.rotation.x, baseRotZ: rMesh.rotation.z, idx: i };
      scene.add(rMesh); rings.push(rMesh);
    }

    // Colored particles
    const pCount = 4000;
    const pPos = new Float32Array(pCount * 3), pSizes = new Float32Array(pCount), pSpeeds = new Float32Array(pCount), pPhases = new Float32Array(pCount), pColors = new Float32Array(pCount * 3);
    const palette = [HERO_COLORS.col1, HERO_COLORS.col2, HERO_COLORS.col3, HERO_COLORS.col4, [1,1,1]];
    for (let i = 0; i < pCount; i++) {
      const r = 14 * Math.cbrt(Math.random()), t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
      pPos[i*3] = r*Math.sin(p)*Math.cos(t); pPos[i*3+1] = r*Math.sin(p)*Math.sin(t); pPos[i*3+2] = r*Math.cos(p);
      pSizes[i] = 0.3 + Math.random() * 1.2; pSpeeds[i] = 0.08 + Math.random() * 0.25; pPhases[i] = Math.random() * Math.PI * 2;
      const c = palette[Math.floor(Math.random() * palette.length)];
      pColors[i*3] = c[0]; pColors[i*3+1] = c[1]; pColors[i*3+2] = c[2];
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("aSize", new THREE.BufferAttribute(pSizes, 1));
    pGeo.setAttribute("aSpeed", new THREE.BufferAttribute(pSpeeds, 1));
    pGeo.setAttribute("aPhase", new THREE.BufferAttribute(pPhases, 1));
    pGeo.setAttribute("aColor", new THREE.BufferAttribute(pColors, 3));
    const pMat = new THREE.ShaderMaterial({ vertexShader: PARTICLE_V2_VERT, fragmentShader: PARTICLE_V2_FRAG, uniforms: { uTime: { value: 0 }, uPR: { value: Math.min(window.devicePixelRatio, 2) } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const particleSys = new THREE.Points(pGeo, pMat);
    scene.add(particleSys);

    // Lights
    scene.add(new THREE.AmbientLight(0x0a0a1e, 0.6));
    const l1 = new THREE.PointLight(0x00ffa8, 2.5, 25); l1.position.set(4, 3, 4); scene.add(l1);
    const l2 = new THREE.PointLight(0x7722ff, 2.0, 25); l2.position.set(-4, -2, 3); scene.add(l2);
    const l3 = new THREE.PointLight(0xff1155, 1.5, 20); l3.position.set(1, 4, -4); scene.add(l3);
    const l4 = new THREE.PointLight(0xc8ff2d, 0.8, 15); l4.position.set(-2, -3, -2); scene.add(l4);

    // Post-processing
    const pr = Math.min(window.devicePixelRatio, 2);
    const w = container.clientWidth * pr, h = container.clientHeight * pr;
    const bW = Math.floor(w * 0.4), bH = Math.floor(h * 0.4);
    const rtOpts = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
    const baseRT = new THREE.WebGLRenderTarget(w, h, rtOpts);
    const brightRT = new THREE.WebGLRenderTarget(bW, bH, rtOpts);
    const blurRT_A = new THREE.WebGLRenderTarget(bW, bH, rtOpts);
    const blurRT_B = new THREE.WebGLRenderTarget(bW, bH, rtOpts);
    const quadGeo = new THREE.PlaneGeometry(2, 2);

    const brightMat = new THREE.ShaderMaterial({ vertexShader: SCREEN_VERT, fragmentShader: BRIGHT_FRAG, uniforms: { tDiffuse: { value: null }, uThreshold: { value: 0.35 } } });
    const brightScene = new THREE.Scene(); const brightCam = new THREE.Camera();
    brightScene.add(new THREE.Mesh(quadGeo, brightMat));

    const blurMat = new THREE.ShaderMaterial({ vertexShader: SCREEN_VERT, fragmentShader: BLUR_V2_FRAG, uniforms: { tDiffuse: { value: null }, uDir: { value: new THREE.Vector2(1, 0) }, uRes: { value: new THREE.Vector2(bW, bH) } } });
    const blurScene = new THREE.Scene(); const blurCam = new THREE.Camera();
    const blurQuad = new THREE.Mesh(quadGeo.clone(), blurMat);
    blurScene.add(blurQuad);

    const compMat = new THREE.ShaderMaterial({ vertexShader: SCREEN_VERT, fragmentShader: COMPOSITE_V2_FRAG, uniforms: { tBase: { value: null }, tBloom: { value: null }, uBloomStr: { value: 0.75 }, uChromatic: { value: 0.003 }, uVignette: { value: 0.55 }, uGrain: { value: 0.06 }, uColorTemp: { value: 0.15 }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(w, h) } } });
    const compScene = new THREE.Scene(); const compCam = new THREE.Camera();
    compScene.add(new THREE.Mesh(quadGeo.clone(), compMat));

    const onMouseMove = (e) => { mouse.tx = (e.clientX - wH.x) / wH.x; mouse.ty = (e.clientY - wH.y) / wH.y; };
    const onMouseDown = () => { pressTarget = 1; };
    const onMouseUp = () => { pressTarget = 0; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animId) animate();
    }, { threshold: 0 });
    observer.observe(container);

    const animate = () => {
      if (!isVisible) { animId = null; return; }
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      mouse.x += (mouse.tx - mouse.x) * 0.04; mouse.y += (mouse.ty - mouse.y) * 0.04;
      pressing += (pressTarget - pressing) * 0.08;
      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.36 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      blob.rotation.y = t * 0.06; blob.rotation.x = Math.sin(t * 0.04) * 0.15;
      blobMat.uniforms.uTime.value = t; blobMat.uniforms.uMouse.value.set(mouse.x, mouse.y); blobMat.uniforms.uPress.value = pressing;
      for (const sat of satellites) {
        const d = sat.userData, angle = t * d.speed + d.phase;
        sat.position.set(Math.cos(angle) * d.orbit, Math.sin(angle) * d.orbit * 0.4 + Math.sin(angle * 0.7) * d.tilt, Math.sin(angle) * d.orbit * 0.6);
        sat.rotation.y = t * 0.1;
        sat.material.uniforms.uTime.value = t; sat.material.uniforms.uMouse.value.set(mouse.x, mouse.y); sat.material.uniforms.uPress.value = pressing;
      }
      for (const ring of rings) {
        const d = ring.userData;
        ring.rotation.x = d.baseRotX + t * 0.02 * (d.idx + 1); ring.rotation.z = d.baseRotZ + t * 0.015;
        ring.material.uniforms.uTime.value = t;
      }
      pMat.uniforms.uTime.value = t; particleSys.rotation.y = t * 0.008; particleSys.rotation.x = Math.sin(t * 0.01) * 0.05;
      // Render pipeline
      renderer.setRenderTarget(baseRT); renderer.render(scene, camera);
      brightMat.uniforms.tDiffuse.value = baseRT.texture;
      renderer.setRenderTarget(brightRT); renderer.render(brightScene, brightCam);
      for (let i = 0; i < 3; i++) {
        blurMat.uniforms.tDiffuse.value = (i === 0 ? brightRT : blurRT_B).texture; blurMat.uniforms.uDir.value.set(1, 0);
        renderer.setRenderTarget(blurRT_A); renderer.render(blurScene, blurCam);
        blurMat.uniforms.tDiffuse.value = blurRT_A.texture; blurMat.uniforms.uDir.value.set(0, 1);
        renderer.setRenderTarget(blurRT_B); renderer.render(blurScene, blurCam);
      }
      compMat.uniforms.tBase.value = baseRT.texture; compMat.uniforms.tBloom.value = blurRT_B.texture; compMat.uniforms.uTime.value = t;
      renderer.setRenderTarget(null); renderer.render(compScene, compCam);
    };
    animate();

    const onResize = () => {
      const cw = container.clientWidth, ch = container.clientHeight;
      camera.aspect = cw / ch; camera.updateProjectionMatrix();
      renderer.setSize(cw, ch); wH.x = window.innerWidth / 2; wH.y = window.innerHeight / 2;
    };
    window.addEventListener("resize", onResize);

    return () => {
      isVisible = false;
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      blobGeo.dispose(); blobMat.dispose();
      satellites.forEach(s => { s.geometry.dispose(); s.material.dispose(); });
      rings.forEach(r => { r.geometry.dispose(); r.material.dispose(); });
      pGeo.dispose(); pMat.dispose();
      baseRT.dispose(); brightRT.dispose(); blurRT_A.dispose(); blurRT_B.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, zIndex: 0, background: "#010108" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2, background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.85) 100%)" }} />
    </div>
  );
}


function Hero({ heroReady }) {
  return (
    <section id="top" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "160px 40px 80px", position: "relative", overflow: "hidden", zIndex: 3 }}>
      <HeroVisual />

      <div style={{ maxWidth: "1400px", margin: "0 auto", width: "100%", position: "relative", zIndex: 10 }}>
        {/* Label */}
        <div style={{ opacity: heroReady ? 1 : 0, transition: "opacity 0.6s ease 0.8s", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "4px", color: "#e8622c", textTransform: "uppercase", marginBottom: "40px", display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} />
          WEB DESIGN AGENCY
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(48px, 9vw, 130px)", lineHeight: 0.92, color: "#ffffff", margin: "0 0 20px 0", fontWeight: 400, letterSpacing: "-3px", mixBlendMode: "difference" }}>
          <SplitText trigger={heroReady} delay={0.15} stagger={0.04}>{"We build sites"}</SplitText>
          <br />
          <span style={{ fontStyle: "italic", color: "#ffffff" }}>
            <SplitText trigger={heroReady} delay={0.3} stagger={0.04}>{"that make people"}</SplitText>
          </span>
          <br />
          <span style={{ position: "relative", display: "inline-block" }}>
            <SplitText trigger={heroReady} delay={0.55} stagger={0.04}>{"stop scrolling"}</SplitText>
            <span style={{ position: "absolute", bottom: "-4px", left: 0, width: heroReady ? "100%" : "0%", height: "2px", background: "#e8622c", transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.2s" }} />
          </span>
        </h1>

        {/* Subtext */}
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "18px", lineHeight: 1.7, color: "rgba(255,255,255,0.9)", maxWidth: "500px", margin: "0 0 32px 0", opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease 1.4s" }}>
          Premium web design for brands that refuse to blend in. We craft digital experiences that convert visitors into believers.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center", opacity: heroReady ? 1 : 0, transform: heroReady ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease 1.7s", flexWrap: "wrap" }}>
          <MagneticButton as="a" href="#contact" data-hover-cta style={{ padding: "14px 32px", background: "#e8622c", color: "#ffffff", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}>
            GET STARTED
          </MagneticButton>
          <MagneticButton as="a" href="#work" data-hover-cta style={{ padding: "14px 32px", background: "transparent", color: "#ffffff", border: "1px solid rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 500, cursor: "pointer" }}>
            VIEW WORK ↓
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: heroReady ? 1 : 0, transition: "opacity 1s 2.2s", zIndex: 10 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Scroll</span>
        <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)", animation: "pulse 2.5s infinite" }} />
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// PART 2: PHILOSOPHY STRIP, PORTFOLIO, CASE STUDIES, AWARDS
// ═══════════════════════════════════════════
function AnimatedDivider() {
  const [ref, vis] = useScrollReveal();
  return <div ref={ref} style={{ width: vis ? "100%" : "0%", height: "1px", background: "rgba(255,255,255,0.06)", transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }} />;
}

function ParallaxText({ text }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const handler = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      setOffset((window.innerHeight / 2 - center) * 0.15);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <div ref={ref} style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, -50%) translateY(${offset}px)`, zIndex: 0, pointerEvents: "none", width: "100%", textAlign: "center", overflow: "hidden" }}>
      <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(120px, 18vw, 280px)", color: "rgba(255,255,255,0.06)", letterSpacing: "-6px", fontWeight: 400, whiteSpace: "nowrap", display: "block" }}>{text}</span>
    </div>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} data-hover
      style={{ position: "fixed", bottom: "32px", right: "32px", zIndex: 900, width: "48px", height: "48px", borderRadius: "50%", background: "rgba(232,98,44,0.1)", border: "1px solid rgba(232,98,44,0.25)", color: "#e8622c", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", pointerEvents: show ? "auto" : "none", backdropFilter: "blur(10px)" }}>
      ↑
    </button>
  );
}

function MarqueeRow({ items, direction = "left", speed = 45 }) {
  const animName = direction === "left" ? "marquee" : "marqueeRight";
  return (
    <div style={{ overflow: "hidden", position: "relative", padding: "12px 0" }}>
      <div style={{ display: "inline-flex", alignItems: "center", animation: `${animName} ${speed}s linear infinite`, whiteSpace: "nowrap" }}
        onMouseEnter={e => e.currentTarget.style.animationPlayState = "paused"}
        onMouseLeave={e => e.currentTarget.style.animationPlayState = "running"}>
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item" style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap", gap: "clamp(20px, 3vw, 40px)", padding: "0 clamp(20px, 3vw, 40px)" }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(36px, 5vw, 72px)",
              fontWeight: 800,
              letterSpacing: "-2px",
              WebkitTextStroke: "1px rgba(255,255,255,0.2)",
              WebkitTextFillColor: "transparent",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              cursor: "default",
              textTransform: "uppercase",
            }}
              onMouseEnter={e => { e.target.style.WebkitTextFillColor = "#fff"; e.target.style.WebkitTextStroke = "1px #fff"; e.target.style.textShadow = "0 0 40px rgba(232,98,44,0.3)"; }}
              onMouseLeave={e => { e.target.style.WebkitTextFillColor = "transparent"; e.target.style.WebkitTextStroke = "1px rgba(255,255,255,0.2)"; e.target.style.textShadow = "none"; }}
            >{item}</span>
            <span style={{ width: "8px", height: "8px", background: "#e8622c", transform: "rotate(45deg)", flexShrink: 0, opacity: 0.6 }} />
          </span>
        ))}
      </div>
    </div>
  );
}

function Marquee() {
  const row1 = ["Web Design", "Brand Identity", "E-Commerce", "UI / UX", "Shopify", "React & Next.js", "Conversion Strategy", "Web Applications"];
  const row2 = ["Strategy", "Visual Design", "Development", "Motion Design", "Webflow", "Performance", "SEO", "Creative Direction"];
  return (
    <div style={{ background: "#0a0a1a", padding: "clamp(32px, 5vw, 64px) 0", overflow: "hidden", position: "relative" }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "50%", left: "20%", width: "400px", height: "200px", background: "radial-gradient(ellipse, rgba(232,98,44,0.06) 0%, transparent 70%)", filter: "blur(40px)", transform: "translateY(-50%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", right: "20%", width: "300px", height: "200px", background: "radial-gradient(ellipse, rgba(240,148,58,0.04) 0%, transparent 70%)", filter: "blur(40px)", transform: "translateY(-50%)", pointerEvents: "none" }} />
      <MarqueeRow items={row1} direction="left" speed={50} />
      <MarqueeRow items={row2} direction="right" speed={55} />
    </div>
  );
}

function PhilosophyStrip() {
  const sectionRef = useRef(null);
  const progress = useScrollProgress(sectionRef);
  const beliefs = [
    { num: "01", headline: "Design is leverage.", body: "A single page, built right, outperforms a team of ten. We build that page." },
    { num: "02", headline: "We engineer perception.", body: "We don't decorate. Every font, every whitespace, every animation is a conversion mechanism." },
    { num: "03", headline: "Your site never sleeps.", body: "Your website is your highest-leverage employee. It works 24/7 and talks to every customer you'll ever have. We make sure it closes." },
  ];
  return (
    <section ref={sectionRef} style={{ padding: "clamp(80px, 10vw, 140px) 40px", position: "relative", overflow: "hidden" }}>

      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(60px, 8vw, 100px)" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "4px", color: "#e8622c", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} /> OUR PHILOSOPHY <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} />
          </span>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(28px, 4vw, 48px)", color: "rgba(255,255,255,0.9)", margin: "20px 0 0", fontWeight: 400, letterSpacing: "-1px" }}>
            What we believe<span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>, in our own words</span>
          </h2>
        </div>

        {/* Beliefs grid */}
        <div className="philosophy-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }}>
          {beliefs.map((b, i) => {
            const colStart = i / 3;
            const colEnd = (i + 1) / 3;
            const colProgress = Math.max(0, Math.min(1, (progress - colStart) / (colEnd - colStart)));
            return (
              <div key={i} style={{ padding: "clamp(24px, 3vw, 48px)", position: "relative", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                {/* Number */}
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, display: "inline-block", marginBottom: "24px", backgroundImage: `linear-gradient(180deg, rgba(255,255,255,${0.35 + colProgress * 0.25}) 0%, rgba(232,98,44,${0.35 + colProgress * 0.45}) 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" }}>{b.num}</span>
                {/* Headline */}
                <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(22px, 2.5vw, 32px)", color: `rgba(255,255,255,${0.6 + colProgress * 0.35})`, margin: "0 0 16px", fontWeight: 400, lineHeight: 1.2, transition: "color 0.5s ease", letterSpacing: "-0.5px" }}>{b.headline}</h3>
                {/* Divider */}
                <div style={{ width: "40px", height: "2px", background: "#e8622c", marginBottom: "16px", opacity: 0.5 + colProgress * 0.5, transition: "opacity 0.6s" }} />
                {/* Body */}
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", lineHeight: 1.8, margin: 0, color: `rgba(255,255,255,${0.4 + colProgress * 0.3})`, transition: "color 0.5s ease" }}>{b.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// GALLERY STORY DATA
// ═══════════════════════════════════════════
const GALLERY_STORIES = [
  // Precision Auto (PROJECTS[0])
  [
    {l:'The Vision',h:'A detailing business as premium as the cars it services.',b:'Most detailing sites look like 2012. High-end service needs a site to match.',s:[{v:'Monmouth',l:'County'},{v:'Mobile',l:'Service'}]},
    {l:'The Challenge',h:'Standing apart from every GoDaddy template.',b:'In local service, the website IS the first impression.',s:[{v:'1st',l:'Impression'},{v:'3sec',l:'Decision'}]},
    {l:'The Approach',h:'Video-first, package-driven.',b:'Background video hero. Package-based pricing for easy decisions.'},
    {l:'The Result',h:'Site quality signals service quality.',b:'Professional presence converting browsers to bookings.'}
  ],
  // Cyrath (PROJECTS[1])
  [
    {l:'The Vision',h:'A dynasty platform that thinks three seasons ahead.',b:'Processing 427+ players across 32 routes into real-time AI-powered trade intelligence.',s:[{v:'32+',l:'Routes'},{v:'3',l:'Tiers'},{v:'427+',l:'Players'}]},
    {l:'The Challenge',h:'Turning raw data into decisions.',b:'Dynasty leagues generate thousands of data points per week. The AI surfaces actionable intelligence.',s:[{v:'XGBoost',l:'Engine'},{v:'Live',l:'Data'}]},
    {l:'The Approach',h:'Full-stack from database to deploy.',b:'React 18, FastAPI, Supabase PostgreSQL, Redis caching, Stripe billing.'},
    {l:'The Result',h:'Every click surfaces intelligence \u2014 not just data.',b:'A fully operational SaaS with live AI predictions.'}
  ],
  // PulsBrush (PROJECTS[2])
  [
    {l:'The Vision',h:'Make a $59 toothbrush feel like a $200 product.',b:'Commodity hardware, saturated market. The brand experience is the only differentiator.',s:[{v:'$59.99',l:'Price'},{v:'DTC',l:'Model'}]},
    {l:'The Challenge',h:'Standing out in a sea of identical products.',b:'Every sonic toothbrush looks the same. Win through experience.',s:[{v:'3sec',l:'Attention'},{v:'1',l:'Product'}]},
    {l:'The Approach',h:'Dark, techy, electric.',b:'Custom Shopify 2.0 theme with monolithic sections. Cyan and purple accents.'},
    {l:'The Result',h:'Visitors buy technology, not a toothbrush.',b:'Conversion-optimized design elevating a commodity.'}
  ],
  // Decantoir (PROJECTS[3])
  [
    {l:'The Vision',h:'A fragrance boutique that feels like Bergdorf\'s.',b:'100+ scents, 2ml to 20ml. The product is invisible \u2014 the experience creates desire.',s:[{v:'100+',l:'Scents'},{v:'2-20ml',l:'Range'}]},
    {l:'The Challenge',h:'Selling scent through a screen.',b:'You can\'t smell a website. Every design choice compensates.',s:[{v:'Invisible',l:'Product'},{v:'Premium',l:'Market'}]},
    {l:'The Approach',h:'Gold, black, editorial restraint.',b:'Gold accent design system, conversion psychology, luxury copywriting.'},
    {l:'The Result',h:'Shopping experience matches the price point.',b:'Design creates desire before the vial opens.'}
  ],
];

const GALLERY_POSITIONS = [
  { pos: [3, 0.3, -16], rot: [0, -0.22, 0.015] },
  { pos: [-3.5, 0.9, -34], rot: [0, 0.2, -0.02] },
  { pos: [4, -0.1, -52], rot: [0.02, -0.28, 0.01] },
  { pos: [-2.5, 0.2, -70], rot: [-0.01, 0.15, 0.02] },
];

const GALLERY_ACCENTS = ['#4488ff', '#7c6cff', '#00e5cc', '#c5a55a'];

// ═══════════════════════════════════════════
// SPACE GALLERY COMPONENT
// ═══════════════════════════════════════════
function SpaceGallery() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef({});
  const [focused, setFocused] = useState(false);
  const [fIdx, setFIdx] = useState(-1);
  const [sStg, setSStg] = useState(0);
  const [hudNum, setHudNum] = useState('01');
  const [labelName, setLabelName] = useState('');
  const [labelTags, setLabelTags] = useState('');
  const [labelVisible, setLabelVisible] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [closeVisible, setCloseVisible] = useState(false);
  const [kbVisible, setKbVisible] = useState(false);
  const [storyContent, setStoryContent] = useState(null);
  const [accentColor, setAccentColor] = useState('#c6ff00');
  const [scrollPct, setScrollPct] = useState(0);
  const sLkRef = useRef(false);
  const sAcRef = useRef(0);

  const doFocusRef = useRef(null);
  const doUnfocusRef = useRef(null);
  const advSRef = useRef(null);
  const setStgRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const isMob = window.innerWidth < 768 || IS_TOUCH;
    let W = window.innerWidth, H = window.innerHeight;
    const PR = Math.min(devicePixelRatio, isMob ? 1 : 1.5);
    const TD = 72;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMob, powerPreference: 'high-performance' });
    renderer.setSize(W, H);
    renderer.setPixelRatio(PR);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010108);
    scene.fog = new THREE.FogExp2(0x010108, 0.004);

    const cam = new THREE.PerspectiveCamera(52, W / H, 0.1, 400);
    cam.position.set(0, 0.5, 12);

    // State
    let t = 0, dt = 0, lastT = performance.now() / 1000;
    let mx = 0, my = 0, smx = 0, smy = 0, rmx = W / 2, rmy = H / 2;
    let scrollV = 0, scrollT = 0, scrollVel = 0, prevSV = 0;
    let _focused = false, _fIdx = -1, _sStg = 0;
    let dragging = false, dragS = null;
    const dragSt = new THREE.Vector2();
    let hovIdx = -1, prevHovIdx = -2;

    // Throttle React state updates to avoid 60fps re-renders
    let _lastLabelIdx = -2, _lastScrollPct = -1;
    const _tmpVec = new THREE.Vector3(); // reusable vector to reduce GC
    const _tmpVec2 = new THREE.Vector3();
    const _tmpEuler = new THREE.Euler();

    // Texture loading
    const texLoader = new THREE.TextureLoader();
    const textures = PROJECTS.map(p => {
      const tex = texLoader.load(p.image);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    });

    // CRT Shader — with static noise during boot, phosphor grid, chromatic aberration
    function createScreenMat(tex, ac) {
      return new THREE.ShaderMaterial({
        uniforms: {
          uTex: { value: tex }, uTime: { value: 0 }, uBoot: { value: 0 },
          uHover: { value: 0 }, uProx: { value: 0 }, uAccent: { value: ac },
          uFocus: { value: 0 },
        },
        vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `
          uniform sampler2D uTex;uniform float uTime,uBoot,uHover,uProx,uFocus;uniform vec3 uAccent;varying vec2 vUv;
          float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          void main(){
            vec2 uv=vUv;vec2 center=uv-.5;float dist=dot(center,center);
            uv=uv+center*dist*.06*uBoot;
            // Static noise during boot phase
            float noiseAmt=smoothstep(.0,.4,uBoot)*(1.-smoothstep(.3,.8,uBoot));
            float noise=hash(uv*200.+uTime*100.)*noiseAmt;
            // Chromatic aberration — stronger on hover + subtle on focus
            float caStr=max(uHover*.004,uFocus*.001);
            vec4 tex;
            float r=texture2D(uTex,uv+vec2(caStr,0.)).r;
            float g=texture2D(uTex,uv).g;
            float b=texture2D(uTex,uv-vec2(caStr,0.)).b;
            tex=vec4(r,g,b,1.);
            // Scanlines + phosphor grid
            float scan=sin(uv.y*400.+uTime*2.)*.5+.5;scan=mix(1.,scan,.07*uBoot);
            float phosphor=sin(uv.x*800.)*.5+.5;phosphor=mix(1.,phosphor,.018*uBoot);
            // Rolling scan line
            float rollY=fract(uTime*.08);float roll=1.-smoothstep(0.,.008,abs(uv.y-rollY))*.15*uBoot;
            float vig=1.-dist*1.8;vig=clamp(vig,0.,1.);
            float bootMask=smoothstep(0.,.5,uBoot);float wipe=smoothstep(0.,1.,uBoot*2.-abs(uv.y-.5)*2.);
            vec3 darkScreen=uAccent*.04;
            vec3 staticCol=vec3(noise)*uAccent*2.;
            vec3 imgCol=tex.rgb*scan*phosphor*vig*roll;
            vec3 color=mix(darkScreen,mix(staticCol,imgCol,smoothstep(.2,.6,uBoot)),bootMask*wipe);
            // Edge glow
            float edge=max(abs(center.x),abs(center.y));
            float edgeGlow=smoothstep(.44,.5,edge)*(uHover*.5+uFocus*.3);
            color+=uAccent*edgeGlow;
            // Flicker
            float flicker=1.+sin(uTime*30.+sin(uTime*7.)*3.)*.005*uBoot;color*=flicker;
            // Ambient accent tint
            color+=uAccent*(.01*uBoot+.015*uFocus);
            float alpha=mix(.1,1.,uBoot*.5+uProx*.5+uFocus*.3);
            gl_FragColor=vec4(color,alpha);
          }
        `,
        transparent: true,
      });
    }

    // Screens
    const sW = 5.2, sH = sW * 0.625;
    const ray = new THREE.Raycaster(), mNDC = new THREE.Vector2();
    const screens = [];

    for (let i = 0; i < PROJECTS.length; i++) {
      const p = PROJECTS[i];
      const gp = GALLERY_POSITIONS[i];
      const ac = new THREE.Color(GALLERY_ACCENTS[i]);
      const geo = new THREE.PlaneGeometry(sW, sH);
      const mat = createScreenMat(textures[i], ac);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...gp.pos);
      mesh.rotation.set(...gp.rot);
      mesh.userData = { idx: i };
      scene.add(mesh);

      // 3D Bezel frame — dark metallic border around screen
      const bD = 0.08, bW = sW + bD * 2, bH = sH + bD * 2;
      const bezelMat = new THREE.MeshStandardMaterial({ color: 0x0c0c14, metalness: 0.8, roughness: 0.3, transparent: true, opacity: 0.9 });
      // Top bezel
      const bT = new THREE.Mesh(new THREE.BoxGeometry(bW, bD, 0.06), bezelMat);
      bT.position.set(0, sH/2 + bD/2, -0.02); mesh.add(bT);
      // Bottom bezel
      const bB = new THREE.Mesh(new THREE.BoxGeometry(bW, bD, 0.06), bezelMat);
      bB.position.set(0, -sH/2 - bD/2, -0.02); mesh.add(bB);
      // Left bezel
      const bL = new THREE.Mesh(new THREE.BoxGeometry(bD, bH, 0.06), bezelMat);
      bL.position.set(-sW/2 - bD/2, 0, -0.02); mesh.add(bL);
      // Right bezel
      const bR = new THREE.Mesh(new THREE.BoxGeometry(bD, bH, 0.06), bezelMat);
      bR.position.set(sW/2 + bD/2, 0, -0.02); mesh.add(bR);

      // Chrome bar
      const chr = new THREE.Mesh(new THREE.PlaneGeometry(sW, sH * 0.05), new THREE.MeshBasicMaterial({ color: 0x16161e, transparent: true, opacity: 0.92 }));
      chr.position.set(0, sH * 0.5 + sH * 0.025, 0.015);
      mesh.add(chr);
      [0xff5f57, 0xffbd2e, 0x28ca41].forEach((c, d) => {
        const dot = new THREE.Mesh(new THREE.CircleGeometry(0.035, 12), new THREE.MeshBasicMaterial({ color: c }));
        dot.position.set(-sW * 0.44 + d * 0.11, 0, 0.001);
        chr.add(dot);
      });

      // URL text
      const urlCanvas = document.createElement('canvas');
      urlCanvas.width = 512; urlCanvas.height = 24;
      const uctx = urlCanvas.getContext('2d');
      uctx.fillStyle = 'rgba(237,232,224,0.35)';
      uctx.font = '11px monospace';
      uctx.fillText((p.url || '').replace('https://', ''), 10, 16);
      const urlTex = new THREE.CanvasTexture(urlCanvas);
      const urlMesh = new THREE.Mesh(new THREE.PlaneGeometry(sW * 0.6, sH * 0.03), new THREE.MeshBasicMaterial({ map: urlTex, transparent: true, opacity: 0.7 }));
      urlMesh.position.set(0.3, 0, 0.001);
      chr.add(urlMesh);

      // Holographic floating tag — project name
      const tagCanvas = document.createElement('canvas');
      tagCanvas.width = 512; tagCanvas.height = 48;
      const tctx = tagCanvas.getContext('2d');
      tctx.fillStyle = GALLERY_ACCENTS[i];
      tctx.font = 'bold 18px monospace';
      tctx.fillText((p.fullTitle || p.title).toUpperCase(), 8, 22);
      tctx.fillStyle = 'rgba(237,232,224,0.4)';
      tctx.font = '12px monospace';
      tctx.fillText(p.category, 8, 40);
      const tagTex = new THREE.CanvasTexture(tagCanvas);
      const tagMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.5, 0.24),
        new THREE.MeshBasicMaterial({ map: tagTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      tagMesh.position.set(-sW/2 + 1.2, -sH/2 - 0.35, 0.1);
      mesh.add(tagMesh);

      // Holographic connector line from tag to screen bottom
      const connGeo = new THREE.BufferGeometry();
      connGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0,sH/2+0.35-(-sH/2-0.2),0, 0,0,0]), 3));
      const connLine = new THREE.Line(connGeo, new THREE.LineBasicMaterial({ color: ac, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
      connLine.position.set(-sW/2 + 0.1, -sH/2 - 0.2, 0.05);
      mesh.add(connLine);

      // Glow edges
      const eM = () => new THREE.MeshBasicMaterial({ color: ac, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      const edges = [
        new THREE.Mesh(new THREE.PlaneGeometry(sW + 0.1, 0.03), eM()),
        new THREE.Mesh(new THREE.PlaneGeometry(sW + 0.1, 0.03), eM()),
        new THREE.Mesh(new THREE.PlaneGeometry(0.03, sH + 0.1), eM()),
        new THREE.Mesh(new THREE.PlaneGeometry(0.03, sH + 0.1), eM()),
      ];
      edges[0].position.set(0, sH / 2 + 0.02, 0.03);
      edges[1].position.set(0, -sH / 2 - 0.02, 0.03);
      edges[2].position.set(-sW / 2 - 0.02, 0, 0.03);
      edges[3].position.set(sW / 2 + 0.02, 0, 0.03);
      edges.forEach(e => mesh.add(e));

      const pl = new THREE.PointLight(ac, 0, 12);
      pl.position.set(0, 0, 2);
      mesh.add(pl);

      // Screen back-light glow
      const glowMat = new THREE.MeshBasicMaterial({ color: ac, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide });
      const glowPlane = new THREE.Mesh(new THREE.PlaneGeometry(sW * 1.3, sH * 1.3), glowMat);
      glowPlane.position.set(0, 0, -0.15);
      mesh.add(glowPlane);

      const refMat = new THREE.MeshBasicMaterial({ color: ac, transparent: true, opacity: 0.02, blending: THREE.AdditiveBlending, depthWrite: false });
      const ref = new THREE.Mesh(new THREE.PlaneGeometry(sW * 1.2, sH * 0.8), refMat);
      ref.position.set(0, -sH - 0.5, -0.1);
      ref.scale.y = -0.3;
      ref.rotation.x = 0.15;
      mesh.add(ref);

      const restPos = new THREE.Vector3(...gp.pos);
      const restRot = new THREE.Vector3(...gp.rot);
      screens.push({
        mesh, mat, edges, pl, refMat, glowMat, tagMesh, connLine,
        pos: restPos.clone(), restPos,
        vel: new THREE.Vector3(),
        rot: new THREE.Euler(...gp.rot), restRot,
        angVel: new THREE.Vector3(),
        hover: 0, prox: 0, boot: 0, focusAmt: 0,
      });
    }

    // Stars layer 1
    const S1N = isMob ? 2000 : 4000;
    const s1P = new Float32Array(S1N * 3), s1Sz = new Float32Array(S1N), s1Ph = new Float32Array(S1N), s1Col = new Float32Array(S1N * 3);
    for (let i = 0; i < S1N; i++) {
      s1P[i*3] = (Math.random()-0.5)*50; s1P[i*3+1] = (Math.random()-0.5)*30; s1P[i*3+2] = 20-Math.random()*110;
      s1Sz[i] = 0.3+Math.random()*1.8; s1Ph[i] = Math.random()*Math.PI*2;
      const temp = Math.random();
      if (temp > 0.85) { s1Col[i*3]=1;s1Col[i*3+1]=0.7;s1Col[i*3+2]=0.4; }
      else if (temp > 0.6) { s1Col[i*3]=0.7;s1Col[i*3+1]=0.8;s1Col[i*3+2]=1; }
      else { s1Col[i*3]=0.9;s1Col[i*3+1]=0.92;s1Col[i*3+2]=1; }
    }
    const s1G = new THREE.BufferGeometry();
    s1G.setAttribute('position', new THREE.BufferAttribute(s1P, 3));
    s1G.setAttribute('color', new THREE.BufferAttribute(s1Col, 3));
    s1G.setAttribute('size', new THREE.BufferAttribute(new Float32Array(S1N), 1));
    const s1Mesh = new THREE.Points(s1G, new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true, fog: false }));
    s1Mesh.renderOrder = -100; scene.add(s1Mesh);

    // Stars layer 2
    const S2N = isMob ? 150 : 300;
    const s2P = new Float32Array(S2N*3), s2Sz = new Float32Array(S2N), s2Ph = new Float32Array(S2N), s2Col = new Float32Array(S2N*3);
    for (let i = 0; i < S2N; i++) {
      s2P[i*3] = (Math.random()-0.5)*45; s2P[i*3+1] = (Math.random()-0.5)*25; s2P[i*3+2] = 15-Math.random()*100;
      s2Sz[i] = 2+Math.random()*4; s2Ph[i] = Math.random()*Math.PI*2;
      const h = Math.random();
      if (h > 0.7) { s2Col[i*3]=1;s2Col[i*3+1]=0.6;s2Col[i*3+2]=0.3; }
      else if (h > 0.4) { s2Col[i*3]=0.6;s2Col[i*3+1]=0.7;s2Col[i*3+2]=1; }
      else { s2Col[i*3]=1;s2Col[i*3+1]=1;s2Col[i*3+2]=1; }
    }
    const s2G = new THREE.BufferGeometry();
    s2G.setAttribute('position', new THREE.BufferAttribute(s2P, 3));
    s2G.setAttribute('color', new THREE.BufferAttribute(s2Col, 3));
    s2G.setAttribute('size', new THREE.BufferAttribute(new Float32Array(S2N), 1));
    const s2Mesh = new THREE.Points(s2G, new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true, fog: false }));
    s2Mesh.renderOrder = -99; scene.add(s2Mesh);

    // Constellation lines
    const constellations = [];
    if (!isMob) {
      const used = new Set();
      for (let i = 0; i < S2N && constellations.length < 15; i++) {
        if (used.has(i)) continue;
        const x1 = s2P[i*3], y1 = s2P[i*3+1], z1 = s2P[i*3+2];
        for (let j = i+1; j < S2N; j++) {
          if (used.has(j)) continue;
          const dx = s2P[j*3]-x1, dy = s2P[j*3+1]-y1, dz = s2P[j*3+2]-z1;
          const d = Math.sqrt(dx*dx+dy*dy+dz*dz);
          if (d > 3 && d < 8) {
            const pts = new Float32Array([x1,y1,z1,s2P[j*3],s2P[j*3+1],s2P[j*3+2]]);
            const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pts, 3));
            const m = new THREE.LineBasicMaterial({ color: 0x334466, transparent: true, opacity: 0.04, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
            const line = new THREE.Line(g, m); line.renderOrder = -98; scene.add(line);
            constellations.push({ line, m, phase: Math.random()*Math.PI*2 });
            used.add(i); used.add(j); break;
          }
        }
      }
    }

    // Nebulae
    const nebulae = [];
    const nebCfg = [
      {x:8,y:5,z:-20,r:12,c:0x1a3366,o:0.035},{x:-10,y:-3,z:-45,r:15,c:0x331a55,o:0.03},
      {x:5,y:7,z:-65,r:10,c:0x0d4433,o:0.025},{x:-6,y:4,z:-30,r:14,c:0x442244,o:0.028},
      {x:3,y:-2,z:-80,r:11,c:0x1a2244,o:0.032},{x:-8,y:6,z:-55,r:13,c:0x223355,o:0.022},
    ];
    for (const n of nebCfg) {
      const cs = 2 + Math.floor(Math.random()*3);
      for (let j = 0; j < cs; j++) {
        const r = n.r*(0.5+Math.random()*0.8);
        const g = new THREE.SphereGeometry(r, isMob?8:16, isMob?8:16);
        const m = new THREE.MeshBasicMaterial({ color: n.c, transparent: true, opacity: n.o*(0.6+Math.random()*0.4), blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(n.x+(Math.random()-0.5)*n.r*0.6, n.y+(Math.random()-0.5)*n.r*0.6, n.z+(Math.random()-0.5)*n.r*0.4);
        mesh.renderOrder = -95; scene.add(mesh);
        nebulae.push({ mesh, m, phase: Math.random()*Math.PI*2, speed: 0.02+Math.random()*0.03, baseOp: m.opacity, driftX: (Math.random()-0.5)*0.01, driftY: (Math.random()-0.5)*0.008 });
      }
    }

    // Dust lanes
    const dustLanes = [];
    for (let i = 0; i < 12; i++) {
      const w = 30+Math.random()*40, h = 0.3+Math.random()*0.5;
      const g = new THREE.PlaneGeometry(w, h);
      const hue = 0.55+Math.random()*0.3;
      const m = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(hue,0.3,0.15), transparent: true, opacity: 0.02+Math.random()*0.02, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set((Math.random()-0.5)*20,(Math.random()-0.5)*15,10-Math.random()*130);
      mesh.rotation.set((Math.random()-0.5)*0.3,(Math.random()-0.5)*0.5,(Math.random()-0.5)*1.2);
      mesh.renderOrder = -88; scene.add(mesh);
      dustLanes.push({ mesh, m, phase: Math.random()*Math.PI*2, speed: 0.05+Math.random()*0.08, baseOp: m.opacity });
    }

    // Shooting stars
    const shooters = [];
    let shT = 0;
    for (let i = 0; i < 8; i++) {
      const ps = new Float32Array(6), g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(ps, 3));
      const m = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
      const l = new THREE.Line(g, m); l.renderOrder = -80; scene.add(l);
      const gm = new THREE.MeshBasicMaterial({ color: 0xeeeeff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), gm); glow.renderOrder = -79; scene.add(glow);
      shooters.push({ l, g, m, glow, gm, on: false, x:0, y:0, z:0, vx:0, vy:0, vz:0, br:0, life:0 });
    }
    function spawnSh(fx,fy,fz) { for (const s of shooters) { if (!s.on) { s.on=true; s.x=fx??(Math.random()-0.5)*25; s.y=fy??3+Math.random()*10; s.z=fz??cam.position.z-5-Math.random()*30; const a=-0.3-Math.random()*1.2,sp=20+Math.random()*20; s.vx=Math.cos(a)*sp*(Math.random()>0.5?1:-1); s.vy=Math.sin(a)*sp; s.vz=-sp*0.25-Math.random()*5; s.br=0.9+Math.random()*0.3; s.life=0.4+Math.random()*0.7; return; } } }
    function updSh() {
      shT += dt;
      if (shT > 2+Math.random()*3.5) { spawnSh(); shT=0; }
      for (const s of shooters) {
        if (!s.on) { s.m.opacity=0; s.gm.opacity=0; continue; }
        s.x+=s.vx*dt; s.y+=s.vy*dt; s.z+=s.vz*dt; s.life-=dt;
        if (s.life<=0) { s.br-=dt*3.5; if (s.br<=0) { s.on=false; continue; } }
        const sp=Math.sqrt(s.vx**2+s.vy**2+s.vz**2)+0.01, nx=s.vx/sp, ny=s.vy/sp, nz=s.vz/sp;
        const pa=s.g.attributes.position;
        pa.array[0]=s.x-nx*2.5; pa.array[1]=s.y-ny*2.5; pa.array[2]=s.z-nz*2.5;
        pa.array[3]=s.x; pa.array[4]=s.y; pa.array[5]=s.z; pa.needsUpdate=true;
        s.m.opacity=s.br*0.7; s.glow.position.set(s.x,s.y,s.z); s.gm.opacity=s.br*0.9; s.glow.scale.setScalar(0.4+s.br*0.6);
      }
    }

    // Light shafts
    const shafts = [];
    for (let i = 0; i < 8; i++) {
      const h = 12+Math.random()*12;
      const g = new THREE.CylinderGeometry(0.015,0.25+Math.random()*0.35,h,6,1,true);
      const hue = 0.5+Math.random()*0.4;
      const m = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(hue,0.3,0.3), transparent: true, opacity: 0.015+Math.random()*0.015, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set((Math.random()-0.5)*18,h/2+1,5-Math.random()*100);
      mesh.rotation.z = (Math.random()-0.5)*0.4;
      mesh.renderOrder = -85; scene.add(mesh);
      shafts.push({ mesh, m, phase: Math.random()*Math.PI*2, speed: 0.08+Math.random()*0.12, baseOp: m.opacity });
    }

    // Crystal debris
    const crystals = [];
    const crystalN = isMob ? 25 : 50;
    for (let i = 0; i < crystalN; i++) {
      const geos = [new THREE.OctahedronGeometry(0.04+Math.random()*0.07,0), new THREE.TetrahedronGeometry(0.04+Math.random()*0.08,0)];
      const g = geos[Math.floor(Math.random()*2)];
      const hue = Math.random();
      const m = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(hue,0.3,0.45), transparent: true, opacity: 0.12+Math.random()*0.08, blending: THREE.AdditiveBlending, depthWrite: false });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set((Math.random()-0.5)*20,(Math.random()-0.5)*12,15-Math.random()*95);
      mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);
      scene.add(mesh);
      crystals.push({ mesh, rx:(Math.random()-0.5)*0.3, ry:(Math.random()-0.5)*0.4, rz:(Math.random()-0.5)*0.2, bob:Math.random()*Math.PI*2, bobSpd:0.2+Math.random()*0.3 });
    }

    // Wake particles
    const WN = 200;
    const wP = new Float32Array(WN*3), wV = [];
    for (let i = 0; i < WN; i++) { wP[i*3]=9999; wP[i*3+1]=9999; wP[i*3+2]=9999; wV.push({vx:0,vy:0,vz:0,life:0}); }
    const wG = new THREE.BufferGeometry(); wG.setAttribute('position', new THREE.BufferAttribute(wP, 3));
    scene.add(new THREE.Points(wG, new THREE.PointsMaterial({ color: 0x6688aa, size: 0.025, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true })));
    let wI = 0;
    function spawnWake() { const sp=Math.abs(scrollVel); if(sp<0.001)return; const n=Math.min(4,Math.floor(sp*400)); for(let i=0;i<n;i++){const idx=wI%WN;wI++;wP[idx*3]=cam.position.x+(Math.random()-0.5)*3;wP[idx*3+1]=cam.position.y+(Math.random()-0.5)*2;wP[idx*3+2]=cam.position.z+1;wV[idx]={vx:(Math.random()-0.5)*0.5,vy:(Math.random()-0.5)*0.5,vz:2+Math.random()*3,life:1+Math.random()*0.5};} }
    function updWake() { for(let i=0;i<WN;i++){const v=wV[i];if(v.life<=0)continue;v.life-=dt;wP[i*3]+=v.vx*dt;wP[i*3+1]+=v.vy*dt;wP[i*3+2]+=v.vz*dt;v.vx*=0.98;v.vy*=0.98;v.vz*=0.95;if(v.life<=0){wP[i*3]=9999;wP[i*3+1]=9999;wP[i*3+2]=9999;}}wG.attributes.position.needsUpdate=true; }

    // Ambient particles
    const APN = isMob?400:800; const apP = new Float32Array(APN*3);
    for(let i=0;i<APN;i++){apP[i*3]=(Math.random()-0.5)*25;apP[i*3+1]=(Math.random()-0.5)*14;apP[i*3+2]=18-Math.random()*100;}
    const apG = new THREE.BufferGeometry(); apG.setAttribute('position', new THREE.BufferAttribute(apP, 3));
    scene.add(new THREE.Points(apG, new THREE.PointsMaterial({color:0x334455,size:0.015,transparent:true,opacity:0.18,blending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true})));

    // Aurora ribbons — flowing light ribbons in the deep background
    const auroraRibbons = [];
    if (!isMob) {
      const aurColors = [0x2244aa, 0x44aa66, 0x6633aa, 0x2288aa];
      for (let i = 0; i < 4; i++) {
        const pts = [];
        const baseZ = -15 - i * 18;
        const baseY = 8 + Math.random() * 4;
        for (let j = 0; j <= 20; j++) {
          const frac = j / 20;
          pts.push(new THREE.Vector3(
            (frac - 0.5) * 40 + Math.sin(frac * Math.PI * 2 + i) * 3,
            baseY + Math.sin(frac * Math.PI * 3 + i * 2) * 2,
            baseZ + Math.sin(frac * Math.PI) * 5
          ));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        const tubePts = curve.getPoints(40);
        const tubeGeo = new THREE.BufferGeometry().setFromPoints(tubePts);
        const tubeMat = new THREE.LineBasicMaterial({ color: aurColors[i], transparent: true, opacity: 0.025, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
        const line = new THREE.Line(tubeGeo, tubeMat);
        line.renderOrder = -92; scene.add(line);
        auroraRibbons.push({ line, mat: tubeMat, pts, curve, baseOp: 0.025, phase: i * 1.5, speed: 0.15 + Math.random() * 0.1 });
      }
    }

    // Lens flare sprites near bright stars
    const flares = [];
    if (!isMob) {
      for (let i = 0; i < Math.min(S2N, 12); i++) {
        const br = s2Sz[i];
        if (br < 3.5) continue;
        const flareMat = new THREE.SpriteMaterial({ color: new THREE.Color(s2Col[i*3], s2Col[i*3+1], s2Col[i*3+2]), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
        const sprite = new THREE.Sprite(flareMat);
        sprite.position.set(s2P[i*3], s2P[i*3+1], s2P[i*3+2]);
        sprite.scale.setScalar(0.8);
        sprite.renderOrder = -97; scene.add(sprite);
        flares.push({ sprite, mat: flareMat, starIdx: i, baseScale: 0.5 + br * 0.15 });
      }
    }

    // Lights
    scene.add(new THREE.AmbientLight(0x060612, 0.5));
    const dl = new THREE.DirectionalLight(0x5566aa, 0.35); dl.position.set(3,5,5); scene.add(dl);
    // Spotlight for focus mode
    const spotLight = new THREE.SpotLight(0xffffff, 0, 20, Math.PI * 0.25, 0.5, 1);
    spotLight.visible = false; scene.add(spotLight); scene.add(spotLight.target);

    // Camera spline
    const splinePoints = [
      new THREE.Vector3(0,0.5,12), new THREE.Vector3(1.5,1,2), new THREE.Vector3(2,0.6,-8),
      new THREE.Vector3(1,0.8,-18), new THREE.Vector3(-1.5,1.2,-28), new THREE.Vector3(-2,0.7,-38),
      new THREE.Vector3(1.5,0.4,-48), new THREE.Vector3(2,0.9,-58), new THREE.Vector3(-1,0.5,-66),
      new THREE.Vector3(0,0.5,-TD),
    ];
    const camSpline = new THREE.CatmullRomCurve3(splinePoints);
    let camTP = new THREE.Vector3(0,0.5,12), camTL = new THREE.Vector3(0,0.5,4), camCP = new THREE.Vector3(0,0.5,12);

    // Focus/unfocus
    function doFocus(i) {
      if (_focused) return;
      _focused = true; _fIdx = i; _sStg = 0;
      setFocused(true); setFIdx(i); setSStg(0);
      setPanelOpen(true); setCtaVisible(true); setCloseVisible(true); setKbVisible(true);
      setLabelVisible(false);
      setAccentColor(GALLERY_ACCENTS[i]);
      const story = GALLERY_STORIES[i][0];
      setStoryContent(story);
    }
    doFocusRef.current = doFocus;

    function doUnfocus() {
      if (!_focused) return;
      _focused = false; _fIdx = -1; _sStg = 0;
      setFocused(false); setFIdx(-1); setSStg(0);
      setPanelOpen(false); setCtaVisible(false); setCloseVisible(false); setKbVisible(false);
      sLkRef.current = false; sAcRef.current = 0;
    }
    doUnfocusRef.current = doUnfocus;

    function advS(d) {
      if (sLkRef.current) return;
      const storyLen = GALLERY_STORIES[_fIdx].length;
      const n = _sStg + d;
      if (n < 0 || n >= storyLen) { doUnfocus(); return; }
      _sStg = n;
      setSStg(n);
      setStoryContent(GALLERY_STORIES[_fIdx][n]);
      sLkRef.current = true; sAcRef.current = 0;
      setTimeout(() => { sLkRef.current = false; sAcRef.current = 0; }, 800);
    }
    advSRef.current = advS;

    function setStgDirect(i) {
      if (_fIdx < 0 || i < 0 || i >= GALLERY_STORIES[_fIdx].length) return;
      _sStg = i;
      setSStg(i);
      setStoryContent(GALLERY_STORIES[_fIdx][i]);
    }
    setStgRef.current = setStgDirect;

    // Scroll handling (uses page scroll position relative to container)
    function handleScroll() {
      if (_focused) return;
      const rect = container.getBoundingClientRect();
      const sectionH = container.offsetHeight - H;
      if (sectionH <= 0) return;
      const scrolled = -rect.top;
      scrollT = Math.max(0, Math.min(1, scrolled / sectionH));
    }

    // Mouse
    function handleMouseMove(e) {
      if (isMob) return;
      rmx = e.clientX; rmy = e.clientY;
      mx = (e.clientX/W-0.5)*2; my = -(e.clientY/H-0.5)*2;
    }

    function handleMouseDown(e) {
      if (_focused || e.target.closest('.sg-ui')) return;
      if (hovIdx >= 0) { dragging = true; dragS = screens[hovIdx]; dragSt.set(mx, my); }
    }
    function handleMouseUp() {
      if (dragging) {
        const mv = Math.abs(mx-dragSt.x)+Math.abs(my-dragSt.y);
        if (mv < 0.05 && dragS) doFocus(dragS.mesh.userData.idx);
        dragging = false; dragS = null;
      }
    }

    // Touch
    let touchStartY = 0, touchMoved = false, touchStartTime = 0;
    function handleTouchStart(e) {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      touchMoved = false;
      rmx = e.touches[0].clientX; rmy = e.touches[0].clientY;
      mx = (rmx/W-0.5)*2; my = -(rmy/H-0.5)*2;
    }
    function handleTouchMove(e) {
      touchMoved = true;
      rmx = e.touches[0].clientX; rmy = e.touches[0].clientY;
      mx = (rmx/W-0.5)*2; my = -(rmy/H-0.5)*2;
      if (_focused) {
        const dy = touchStartY - e.touches[0].clientY;
        if (Math.abs(dy) > 10) {
          sAcRef.current += dy * 0.5;
          touchStartY = e.touches[0].clientY;
          if (Math.abs(sAcRef.current) >= 80) { advS(sAcRef.current > 0 ? 1 : -1); sAcRef.current = 0; }
        }
      }
    }
    function handleTouchEnd() {
      const elapsed = Date.now() - touchStartTime;
      if (!touchMoved && elapsed < 300 && hovIdx >= 0 && !_focused) doFocus(hovIdx);
    }

    function handleKey(e) {
      if (e.key === 'Escape' && _focused) doUnfocus();
      if (_focused && (e.key === 'ArrowDown' || e.key === ' ')) { e.preventDefault(); advS(1); }
      if (_focused && e.key === 'ArrowUp') { e.preventDefault(); advS(-1); }
      // Left/Right arrow to navigate between projects when not focused
      if (!_focused && e.key === 'ArrowRight') {
        let nI = -1, nD = 999;
        for (let i = 0; i < screens.length; i++) { const d = cam.position.distanceTo(screens[i].restPos); if (d < nD) { nD = d; nI = i; } }
        if (nI >= 0) doFocus(nI);
      }
    }

    // Mouse wheel during focus navigates story stages
    function handleWheel(e) {
      if (!_focused) return;
      e.preventDefault();
      sAcRef.current += e.deltaY * 0.3;
      if (Math.abs(sAcRef.current) >= 80) {
        advS(sAcRef.current > 0 ? 1 : -1);
        sAcRef.current = 0;
      }
    }

    function handleResize() {
      W = window.innerWidth; H = window.innerHeight;
      cam.aspect = W/H; cam.updateProjectionMatrix();
      renderer.setSize(W, H);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKey);
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    // Animation loop
    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      const now = performance.now()/1000; dt = Math.min(now-lastT, 0.033); lastT = now; t += dt;
      const dtN = dt * 60; // normalized dt (1.0 at 60fps)
      smx += (mx-smx)*Math.min(1, 2.5*dt); smy += (my-smy)*Math.min(1, 2.5*dt);
      prevSV = scrollV; scrollV += (scrollT-scrollV)*Math.min(1, 2.2*dt); scrollVel = scrollV-prevSV;

      // Throttle scroll pct updates (only when changed meaningfully)
      const roundedPct = Math.round(scrollV * 200) / 200;
      if (roundedPct !== _lastScrollPct) { _lastScrollPct = roundedPct; setScrollPct(scrollV); }

      // Camera
      const camLerpFactor = Math.min(1, (_focused ? 1.5 : 2.8) * dt);
      if (_focused && _fIdx >= 0) {
        const s = screens[_fIdx];
        _tmpVec.set(0,0,1); _tmpEuler.set(s.restRot.x,s.restRot.y,s.restRot.z);
        _tmpVec.applyEuler(_tmpEuler);
        camTP.copy(s.restPos).add(_tmpVec.multiplyScalar(6)); camTP.x -= 1.8;
        camTL.copy(s.restPos);
      } else {
        const pt = camSpline.getPointAt(Math.min(scrollV, 0.999));
        camTP.copy(pt);
        camTL.set(camTP.x+Math.sin(scrollV*Math.PI)*2, camTP.y, camTP.z-8);
      }
      camCP.lerp(camTP, camLerpFactor);
      cam.position.copy(camCP);
      // Camera micro-shake on fast scroll for visceral feel
      const shakeAmt = Math.min(0.06, Math.abs(scrollVel) * 8);
      if (shakeAmt > 0.002 && !_focused) {
        cam.position.x += Math.sin(t * 40) * shakeAmt;
        cam.position.y += Math.cos(t * 35) * shakeAmt * 0.6;
      }
      _tmpVec.copy(camTL); _tmpVec.x += smx*(_focused?1.5:3.5); _tmpVec.y += smy*(_focused?1:2.5);
      cam.lookAt(_tmpVec);

      // Focus mode spotlight
      if (_focused && _fIdx >= 0) {
        spotLight.visible = true;
        spotLight.position.copy(cam.position);
        spotLight.target.position.copy(screens[_fIdx].restPos);
        spotLight.intensity += (2 - spotLight.intensity) * Math.min(1, 2 * dt);
      } else {
        spotLight.intensity *= Math.max(0, 1 - 3 * dt);
        if (spotLight.intensity < 0.01) spotLight.visible = false;
      }

      spawnWake(); updWake();

      // Raycast
      mNDC.set(rmx/W*2-1,-(rmy/H)*2+1);
      ray.setFromCamera(mNDC, cam);
      const screenMeshes = screens.map(s => s.mesh);
      const hits = ray.intersectObjects(screenMeshes);
      hovIdx = hits.length ? hits[0].object.userData.idx : -1;

      // Cursor feedback on hover
      if (hovIdx !== prevHovIdx) {
        canvas.style.cursor = hovIdx >= 0 && !_focused ? 'pointer' : 'default';
        prevHovIdx = hovIdx;
      }

      // Screens
      const SP=14,DA=5,RSP=10,RDA=4;
      for (let i = 0; i < screens.length; i++) {
        const s = screens[i];
        s.prox = Math.max(0, 1-cam.position.distanceTo(s.restPos)/14);
        const hoverRate = Math.min(1, 5*dt);
        s.hover += ((hovIdx===i&&!_focused?1:0)-s.hover)*hoverRate;
        const bootTarget = s.prox > 0.15 ? 1 : 0;
        s.boot += (bootTarget-s.boot)*Math.min(1, 1.2*dt);

        _tmpVec.copy(s.restPos);
        let tRx = s.restRot.x, tRy = s.restRot.y, tRz = s.restRot.z;
        if (dragging && dragS === s) {
          _tmpVec2.subVectors(cam.position, s.restPos).normalize();
          _tmpVec.add(_tmpVec2.multiplyScalar(2)); tRy = s.restRot.y+(mx-dragSt.x)*2; tRx = s.restRot.x-(my-dragSt.y)*1.5;
        } else if (hovIdx===i && !_focused) {
          if (hits.length) _tmpVec.lerp(hits[0].point, 0.2);
          _tmpVec2.subVectors(cam.position, s.restPos).normalize();
          tRy = s.restRot.y+_tmpVec2.x*0.2; tRx = s.restRot.x+_tmpVec2.y*0.12;
        } else if (s.prox > 0.1 && !_focused) {
          _tmpVec2.subVectors(cam.position, s.restPos).normalize();
          tRy = s.restRot.y+_tmpVec2.x*s.prox*0.12;
        }

        // Chain reaction
        for (let j = 0; j < screens.length; j++) {
          if (j===i) continue;
          const d = s.restPos.distanceTo(screens[j].pos);
          if (d < 10) { const inf = screens[j].vel.length()*0.04*(1-d/10); s.vel.x += screens[j].vel.x*inf; s.vel.y += screens[j].vel.y*inf; }
        }

        s.vel.x += ((_tmpVec.x-s.pos.x)*SP-s.vel.x*DA)*dt;
        s.vel.y += ((_tmpVec.y-s.pos.y)*SP-s.vel.y*DA)*dt;
        s.vel.z += ((_tmpVec.z-s.pos.z)*SP-s.vel.z*DA)*dt;
        s.pos.x += s.vel.x*dt; s.pos.y += s.vel.y*dt; s.pos.z += s.vel.z*dt;
        s.angVel.x += ((tRx-s.rot.x)*RSP-s.angVel.x*RDA)*dt;
        s.angVel.y += ((tRy-s.rot.y)*RSP-s.angVel.y*RDA)*dt;
        s.angVel.z += ((tRz-s.rot.z)*RSP-s.angVel.z*RDA)*dt;
        s.rot.x += s.angVel.x*dt; s.rot.y += s.angVel.y*dt; s.rot.z += s.angVel.z*dt;
        s.mesh.position.copy(s.pos); s.mesh.position.y += Math.sin(t*0.4+i*1.5)*0.07;
        s.mesh.rotation.set(s.rot.x, s.rot.y, s.rot.z);

        s.mat.uniforms.uTime.value = t;
        s.mat.uniforms.uBoot.value = s.boot;
        s.mat.uniforms.uHover.value = s.hover;
        s.mat.uniforms.uProx.value = s.prox;
        // Focus amount smoothing
        const focusTarget = (_focused && i === _fIdx) ? 1 : 0;
        s.focusAmt += (focusTarget - s.focusAmt) * Math.min(1, 3 * dt);
        s.mat.uniforms.uFocus.value = s.focusAmt;

        // Breathing glow on edges when screen is booted
        const breathe = Math.sin(t*1.2+i*1.5)*0.06+0.06;
        s.edges.forEach(e => { e.material.opacity = s.hover*0.6+s.prox*0.2+s.boot*breathe+s.focusAmt*0.3; });
        s.pl.intensity = s.prox*0.5+s.hover*0.8+s.boot*0.2+s.focusAmt*1.5;
        s.refMat.opacity = 0.02+s.boot*0.04+s.hover*0.03+s.focusAmt*0.04;

        // Back-light glow
        s.glowMat.opacity = s.boot*0.015+s.hover*0.03+s.focusAmt*0.06;

        // Holographic tag visibility — fades in with proximity
        const tagOp = Math.max(0, s.prox * 0.6 + s.hover * 0.4 - (_focused && i !== _fIdx ? 0.8 : 0));
        s.tagMesh.material.opacity = tagOp;
        s.connLine.material.opacity = tagOp * 0.3;
        // Tag subtle float
        s.tagMesh.position.y = -sH/2 - 0.35 + Math.sin(t*0.8+i*2)*0.03;

        if (_focused) {
          if (i===_fIdx) { s.mat.uniforms.uProx.value = 1; }
          else { s.mat.uniforms.uBoot.value *= 0.12; s.pl.intensity *= 0.1; s.glowMat.opacity *= 0.1; }
        }
      }

      // Label — only update React state when nearest screen changes
      let nI=-1, nD=999;
      if (!_focused) for (let i=0;i<screens.length;i++) { const d=cam.position.distanceTo(screens[i].restPos); if(d<nD&&d<12){nD=d;nI=i;} }
      if (nI !== _lastLabelIdx) {
        _lastLabelIdx = nI;
        if (nI >= 0 && !_focused) {
          setLabelVisible(true); setLabelName(PROJECTS[nI].fullTitle||PROJECTS[nI].title); setLabelTags(PROJECTS[nI].category);
          setHudNum(String(nI+1).padStart(2,'0'));
        } else if (!_focused) { setLabelVisible(false); }
      }

      // Star layer parallax — subtle shift relative to camera for depth
      s1Mesh.position.x = cam.position.x * 0.02;
      s1Mesh.position.y = cam.position.y * 0.02;
      s2Mesh.position.x = cam.position.x * 0.05;
      s2Mesh.position.y = cam.position.y * 0.05;

      // Stars twinkle — only update every other frame for performance
      const twinkleFrame = Math.floor(t * 30) % 2 === 0;
      if (twinkleFrame) {
        const sa1 = s1G.attributes.size;
        for (let i=0;i<S1N;i++){const tw=Math.sin(t*(1+s1Ph[i]*2.5)+s1Ph[i]*12)*0.5+0.5;sa1.array[i]=s1Sz[i]*(0.2+tw*0.8);}
        sa1.needsUpdate=true;
      }
      const sa2 = s2G.attributes.size;
      for (let i=0;i<S2N;i++){const tw=Math.sin(t*(2+s2Ph[i]*3)+s2Ph[i]*8)*0.5+0.5;const pulse=Math.sin(t*0.5+s2Ph[i]*5)*0.3+0.7;sa2.array[i]=s2Sz[i]*(0.1+tw*0.9)*pulse;}
      sa2.needsUpdate=true;

      // Stars dim during focus
      s1Mesh.material.opacity = _focused ? 0.35 : 0.9;
      s2Mesh.material.opacity = _focused ? 0.4 : 0.95;

      // Dim environment during focus
      const envDim = _focused ? 0.25 : 1;
      constellations.forEach(c => { c.m.opacity = (0.02+Math.sin(t*0.3+c.phase)*0.02)*envDim; });
      nebulae.forEach(n => { n.mesh.position.x+=n.driftX*dt; n.mesh.position.y+=n.driftY*dt; n.m.opacity=n.baseOp*(Math.sin(t*n.speed+n.phase)*0.25+0.75)*envDim; });
      dustLanes.forEach(d => { d.m.opacity=d.baseOp*(Math.sin(t*d.speed+d.phase)*0.3+0.7)*envDim; });
      shafts.forEach(s => { s.m.opacity=s.baseOp*(Math.sin(t*s.speed+s.phase)*0.4+0.6)*envDim; });
      crystals.forEach(c => { c.mesh.rotation.x+=c.rx*dt; c.mesh.rotation.y+=c.ry*dt; c.mesh.rotation.z+=c.rz*dt; c.mesh.position.y+=Math.sin(t*c.bobSpd+c.bob)*0.0003; });
      updSh();

      // Aurora ribbon animation
      auroraRibbons.forEach(ar => {
        const positions = ar.line.geometry.attributes.position.array;
        for (let j = 0; j < positions.length; j += 3) {
          const frac = j / positions.length;
          positions[j+1] += Math.sin(t * ar.speed + frac * 6 + ar.phase) * 0.003;
          positions[j] += Math.cos(t * ar.speed * 0.7 + frac * 4 + ar.phase) * 0.002;
        }
        ar.line.geometry.attributes.position.needsUpdate = true;
        ar.mat.opacity = ar.baseOp * (Math.sin(t * 0.2 + ar.phase) * 0.4 + 0.6) * envDim;
      });

      // Lens flares — pulse based on star brightness and proximity to camera view
      flares.forEach(f => {
        const screenPos = f.sprite.position.clone().project(cam);
        const onScreen = Math.abs(screenPos.x) < 1.2 && Math.abs(screenPos.y) < 1.2 && screenPos.z < 1;
        const targetOp = onScreen ? 0.06 + Math.sin(t * 2 + f.starIdx) * 0.03 : 0;
        f.mat.opacity += (targetOp - f.mat.opacity) * Math.min(1, 3 * dt);
        f.sprite.scale.setScalar(f.baseScale * (1 + Math.sin(t * 1.5 + f.starIdx * 2) * 0.2));
        if (_focused) f.mat.opacity *= 0.2;
      });

      // Dynamic fog — thicker during focus for isolation
      scene.fog.density += ((_focused ? 0.008 : 0.004) - scene.fog.density) * Math.min(1, 2 * dt);

      renderer.render(scene, cam);
    }
    animate();

    stateRef.current = { renderer, scene, screens, textures, spotLight };

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.style.cursor = 'default';
      renderer.dispose();
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
      textures.forEach(tex => tex.dispose());
    };
  }, []);

  const storyLen = fIdx >= 0 ? GALLERY_STORIES[fIdx].length : 4;
  const proj = fIdx >= 0 ? PROJECTS[fIdx] : null;

  return (
    <section id="work" ref={containerRef} style={{ height: '400vh', position: 'relative', background: '#010108' }}>
      {/* Top gradient blend from previous section */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to bottom, #080812, #010108)', zIndex: 1, pointerEvents: 'none' }} />
      {/* Bottom gradient blend into next section */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to top, #080812, #010108)', zIndex: 1, pointerEvents: 'none' }} />
      <style>{`
        .sg-canvas{position:sticky;top:0;width:100%;height:100vh;z-index:0;overflow:hidden}
        .sg-ov{position:absolute;inset:0;pointer-events:none}
        .sg-hud{position:absolute;top:2.2rem;left:2.5rem;display:flex;align-items:baseline;gap:.8rem;pointer-events:none;z-index:4}
        .sg-hud-n{font-family:'JetBrains Mono',monospace;font-weight:200;font-size:clamp(1.6rem,4vw,2.8rem);color:rgba(237,232,224,.08)}
        .sg-hud-l{font-family:'DM Sans',sans-serif;font-weight:300;font-size:12px;letter-spacing:.5em;text-transform:uppercase;color:rgba(237,232,224,.4)}
        .sg-plbl{position:absolute;bottom:5.5rem;left:50%;transform:translateX(-50%);text-align:center;pointer-events:none;z-index:4;transition:opacity .6s,transform .6s}
        .sg-plbl-n{font-family:'Instrument Serif',Georgia,serif;font-weight:400;font-style:italic;font-size:clamp(1.8rem,3.5vw,2.8rem);letter-spacing:-.02em;text-shadow:0 0 50px rgba(1,1,8,1),0 0 100px rgba(1,1,8,.7)}
        .sg-plbl-t{font-family:'DM Sans',sans-serif;font-weight:300;font-size:12px;letter-spacing:.4em;text-transform:uppercase;color:rgba(237,232,224,.55);margin-top:.5rem}
        .sg-plbl-h{font-family:'JetBrains Mono',monospace;font-weight:200;font-size:10px;letter-spacing:.35em;text-transform:uppercase;color:rgba(237,232,224,.18);margin-top:.8rem}
        .sg-dbar{position:absolute;right:2rem;top:50%;transform:translateY(-50%);width:1px;height:28vh;background:rgba(255,255,255,.04);z-index:4;transition:opacity .6s}
        .sg-dpip{position:absolute;left:-3px;width:7px;height:7px;border-radius:50%;border:1px solid rgba(237,232,224,.25);background:rgba(237,232,224,.1);transition:top .4s cubic-bezier(.22,1,.36,1);box-shadow:0 0 6px rgba(237,232,224,.1)}
        .sg-dmark:hover div{opacity:1!important}
        .sg-hint{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);font-family:'JetBrains Mono',monospace;font-weight:200;font-size:10px;letter-spacing:.35em;text-transform:uppercase;color:rgba(237,232,224,.2);z-index:4;transition:opacity .5s;display:flex;flex-direction:column;align-items:center;gap:8px}
        .sg-hint-arrow{width:1px;height:24px;background:linear-gradient(to bottom,transparent,rgba(237,232,224,.15));position:relative;animation:sg-bob 2s ease-in-out infinite}
        @keyframes sg-bob{0%,100%{transform:translateY(0);opacity:.5}50%{transform:translateY(6px);opacity:1}}
        .sg-xbtn{position:absolute;top:24px;right:24px;z-index:10;width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .5s cubic-bezier(.22,1,.36,1);backdrop-filter:blur(8px)}
        .sg-xbtn:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.3);transform:scale(1.1)}
        .sg-xbtn::before,.sg-xbtn::after{content:'';position:absolute;top:50%;left:50%;width:15px;height:1.5px;background:#ede8e0;transform-origin:center;transition:transform .3s}
        .sg-xbtn::before{transform:translate(-50%,-50%) rotate(45deg)}
        .sg-xbtn::after{transform:translate(-50%,-50%) rotate(-45deg)}
        .sg-xbtn:hover::before{transform:translate(-50%,-50%) rotate(135deg)}
        .sg-xbtn:hover::after{transform:translate(-50%,-50%) rotate(225deg)}
        .sg-lbar{position:absolute;left:0;right:0;height:0;background:#010108;z-index:6;transition:height .8s cubic-bezier(.22,1,.36,1);pointer-events:none}
        .sg-lbar-t{top:0}
        .sg-lbar-b{bottom:0}
        .sg-spnl{position:absolute;top:0;left:0;width:42%;height:100%;background:linear-gradient(to right,rgba(1,1,8,.92) 0%,rgba(1,1,8,.88) 40%,rgba(1,1,8,.5) 75%,transparent 100%);backdrop-filter:blur(12px);display:flex;flex-direction:column;justify-content:center;padding:4rem 2rem 4rem 3rem;z-index:7;transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1);pointer-events:none}
        .sg-spnl.on{opacity:1;transform:translateX(0);pointer-events:all}
        .sg-sl{font-family:'JetBrains Mono',monospace;font-weight:300;font-size:11px;letter-spacing:.6em;text-transform:uppercase;margin-bottom:.8rem;opacity:.9}
        .sg-sh{font-family:'Instrument Serif',Georgia,serif;font-weight:400;font-style:italic;font-size:clamp(1.5rem,2.8vw,2.2rem);line-height:1.15;margin-bottom:.8rem;color:rgba(237,232,224,.95)}
        .sg-sb{font-family:'DM Sans',sans-serif;font-weight:300;font-size:14px;line-height:1.9;color:rgba(237,232,224,.6);max-width:380px}
        .sg-ss{display:flex;gap:2.2rem;margin-top:1.4rem;padding:1rem 0;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06)}
        .sg-ssv{font-family:'JetBrains Mono',monospace;font-weight:500;font-size:1.3rem;letter-spacing:.02em}
        .sg-ssl{font-family:'JetBrains Mono',monospace;font-weight:300;font-size:9px;letter-spacing:.25em;text-transform:uppercase;color:rgba(237,232,224,.4);margin-top:.2rem}
        .sg-sdots{display:flex;gap:10px;margin-top:1.8rem}
        .sg-sdot{width:24px;height:3px;border-radius:2px;background:rgba(255,255,255,.08);cursor:pointer;transition:all .5s cubic-bezier(.22,1,.36,1);border:none}
        .sg-sdot.active{width:40px}
        .sg-sdot:hover{background:rgba(255,255,255,.2);transform:scaleY(1.5)}
        .sg-snv{display:flex;justify-content:space-between;align-items:center;margin-top:1.6rem;max-width:380px}
        .sg-snb{font-family:'JetBrains Mono',monospace;font-weight:300;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:rgba(237,232,224,.35);background:none;border:none;cursor:pointer;transition:all .3s;padding:6px 0}
        .sg-snb:hover{color:var(--sg-ac,#e8622c);transform:translateX(3px)}
        .sg-spr{font-family:'JetBrains Mono',monospace;font-weight:200;font-size:10px;color:rgba(237,232,224,.2);letter-spacing:.15em}
        .sg-vcta{position:absolute;bottom:12%;right:5%;display:inline-flex;align-items:center;gap:10px;padding:14px 30px;border-radius:28px;color:#010108;font-family:'JetBrains Mono',monospace;font-weight:500;font-size:11px;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;cursor:pointer;z-index:7;transition:all .6s cubic-bezier(.22,1,.36,1);box-shadow:0 4px 30px rgba(0,0,0,.2),0 0 40px var(--sg-glow,rgba(255,255,255,.1))}
        .sg-vcta:hover{filter:brightness(1.15);transform:translateY(-2px);box-shadow:0 8px 40px rgba(0,0,0,.3),0 0 60px var(--sg-glow,rgba(255,255,255,.15))}
        .sg-kbh{position:absolute;bottom:2rem;right:2rem;display:flex;flex-direction:column;gap:.4rem;z-index:4;pointer-events:none}
        .sg-kb{display:flex;align-items:center;gap:.5rem;font-family:'JetBrains Mono',monospace;font-weight:200;font-size:9px;letter-spacing:.15em;color:rgba(237,232,224,.15)}
        .sg-kbk{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:16px;padding:0 4px;border:1px solid rgba(237,232,224,.1);border-radius:3px;font-size:8px;color:rgba(237,232,224,.25)}
        @media(max-width:768px){
          .sg-spnl{width:100%;padding:6rem 1.5rem 3rem;background:linear-gradient(to top,rgba(1,1,8,.97) 0%,rgba(1,1,8,.92) 60%,rgba(1,1,8,.5) 90%,transparent 100%);justify-content:flex-end;backdrop-filter:blur(8px)}
          .sg-dbar{display:none}
          .sg-kbh{display:none}
          .sg-lbar{display:none}
          .sg-vcta{bottom:6%;right:50%;transform:translateX(50%)}
          .sg-hud{top:1.2rem;left:1.2rem}
          .sg-plbl-h{display:none}
        }
      `}</style>

      <div className="sg-canvas">
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

        {/* Overlays — vignette intensifies with scroll speed */}
        <div className="sg-ov" style={{ zIndex: 1, background: 'radial-gradient(ellipse at 50% 50%,transparent 10%,rgba(1,1,8,.1) 30%,rgba(1,1,8,.4) 60%,rgba(1,1,8,.8) 100%)' }} />
        <div className="sg-ov" style={{ zIndex: 2, opacity: 0.03, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.15) 2px,rgba(0,0,0,.15) 4px)" }} />
        {/* Speed lines overlay — visible during fast scroll */}
        <div className="sg-ov" style={{ zIndex: 1, background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(1,1,8,0.5) 100%)', opacity: Math.min(1, Math.abs(scrollPct) * 0.3), transition: 'opacity 0.3s', pointerEvents: 'none' }} />

        {/* Cinematic letterbox bars during focus */}
        <div className="sg-lbar sg-lbar-t" style={{ height: focused ? '48px' : '0' }} />
        <div className="sg-lbar sg-lbar-b" style={{ height: focused ? '48px' : '0' }} />

        {/* HUD */}
        <div className="sg-hud" style={{ opacity: focused ? 0 : 1, transition: 'opacity 0.6s' }}>
          <span className="sg-hud-n">{hudNum}</span>
          <span className="sg-hud-l" style={{ opacity: 0.5 }}>{PROJECTS.length} Projects</span>
        </div>

        {/* Project Label */}
        <div className="sg-plbl" style={{ opacity: labelVisible && !focused ? 1 : 0, transform: `translateX(-50%) translateY(${labelVisible && !focused ? 0 : 15}px)` }}>
          <div style={{ width: '30px', height: '1px', background: 'rgba(237,232,224,0.15)', margin: '0 auto 12px' }} />
          <div className="sg-plbl-n">{labelName}</div>
          <div className="sg-plbl-t">{labelTags}</div>
          <div className="sg-plbl-h">Click to explore · Drag to rotate</div>
        </div>

        {/* Depth Bar with project markers */}
        <div className="sg-dbar" style={{ opacity: focused ? 0.2 : 1, transition: 'opacity 0.6s' }}>
          {GALLERY_POSITIONS.map((gp, i) => {
            const projZ = gp.pos[2];
            const pct = Math.max(0, Math.min(1, (12 - projZ) / (12 + 72)));
            return (
              <div key={i} className="sg-dmark" style={{ position: 'absolute', left: '-5px', top: `${pct * 100}%`, cursor: 'pointer', padding: '4px' }}
                title={PROJECTS[i].title}
                onClick={() => {
                  const sectionEl = containerRef.current;
                  if (!sectionEl) return;
                  const sectionH = sectionEl.offsetHeight - window.innerHeight;
                  const targetScroll = sectionEl.offsetTop + pct * sectionH;
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }}>
                <div style={{ width: '11px', height: '2px', background: GALLERY_ACCENTS[i], opacity: Math.abs(scrollPct - pct) < 0.08 ? 0.9 : 0.25, transition: 'opacity 0.4s' }} />
              </div>
            );
          })}
          <div className="sg-dpip" style={{ top: `${scrollPct * 100}%` }} />
        </div>

        {/* Scroll Hint */}
        <div className="sg-hint" style={{ opacity: scrollPct > 0.02 || focused ? 0 : 1 }}>
          <span>Scroll to explore</span>
          <div className="sg-hint-arrow" />
        </div>

        {/* Close Button */}
        {closeVisible && (
          <button className="sg-xbtn sg-ui" onClick={() => doUnfocusRef.current && doUnfocusRef.current()} style={{ pointerEvents: 'all' }} />
        )}

        {/* Side Panel */}
        <div className={`sg-spnl sg-ui ${panelOpen ? 'on' : ''}`} style={{ opacity: panelOpen ? 1 : 0, transform: panelOpen ? 'translateX(0)' : 'translateX(-30px)' }}>
          {proj && (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '.4em', color: 'rgba(237,232,224,0.2)', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              {String(fIdx + 1).padStart(2,'0')} / {String(PROJECTS.length).padStart(2,'0')} — {proj.title}
            </div>
          )}
          {storyContent && (
            <>
              <div className="sg-sl" style={{ color: accentColor }}>{storyContent.l}</div>
              <div className="sg-sh">{storyContent.h}</div>
              <div className="sg-sb">{storyContent.b}</div>
              {storyContent.s && (
                <div className="sg-ss">
                  {storyContent.s.map((x, xi) => (
                    <div key={xi}>
                      <div className="sg-ssv" style={{ color: accentColor }}>{x.v}</div>
                      <div className="sg-ssl">{x.l}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          <div className="sg-sdots">
            {Array.from({ length: storyLen }).map((_, i) => (
              <button key={i} className={`sg-sdot ${i === sStg ? 'active' : ''}`}
                style={{ background: i === sStg ? accentColor : undefined }}
                onClick={() => {
                  if (!sLkRef.current && i !== sStg && fIdx >= 0 && setStgRef.current) {
                    setStgRef.current(i);
                  }
                }} />
            ))}
          </div>
          <div className="sg-snv">
            <button className="sg-snb" style={{ '--sg-ac': accentColor }}
              onClick={() => { if (sStg === 0) { doUnfocusRef.current && doUnfocusRef.current(); } else { advSRef.current && advSRef.current(-1); } }}>
              ← Back
            </button>
            <div className="sg-spr">{sStg + 1} / {storyLen}</div>
            <button className="sg-snb" style={{ '--sg-ac': accentColor }}
              onClick={() => advSRef.current && advSRef.current(1)}>
              Next →
            </button>
          </div>
        </div>

        {/* CTA */}
        {ctaVisible && proj && (
          <a className="sg-vcta sg-ui" href={proj.url} target="_blank" rel="noopener noreferrer"
            style={{ background: accentColor, opacity: ctaVisible ? 1 : 0, pointerEvents: 'all', '--sg-glow': accentColor + '40' }}>
            Visit Live Site →
          </a>
        )}

        {/* Keyboard Hints */}
        {kbVisible && (
          <div className="sg-kbh">
            <div className="sg-kb"><span className="sg-kbk">ESC</span> Close</div>
            <div className="sg-kb"><span className="sg-kbk">↑</span><span className="sg-kbk">↓</span> Navigate</div>
          </div>
        )}
      </div>
    </section>
  );
}

function PortfolioCard({ project }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} data-hover-project
      style={{ width: "55vw", minWidth: "55vw", height: "75vh", position: "relative", border: hovered ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.04)", overflow: "hidden", cursor: "pointer", flexShrink: 0, transition: "border-color 0.4s" }}
      onClick={() => project.url && window.open(project.url, "_blank")}>
      {project.image ? (
        <div style={{ position: "absolute", inset: "-5%", width: "110%", height: "110%", backgroundImage: `url(${project.image})`, backgroundSize: "cover", backgroundPosition: "center", filter: hovered ? "brightness(0.8) scale(1.05)" : "brightness(0.65)", transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      ) : (
        <div style={{ position: "absolute", inset: "-5%", width: "110%", height: "110%", background: `linear-gradient(135deg, ${project.color}22 0%, ${project.color}08 50%, #b5afa8 100%)` }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: hovered ? "rgba(0,0,0,0.2)" : "transparent", transition: "background 0.4s", zIndex: 1 }} />
      <span style={{ position: "absolute", top: "24px", left: "40px", zIndex: 2, fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: project.image ? "#ffffff" : "#0a0a18", letterSpacing: "1px" }}>{project.year}</span>
      <span style={{ position: "absolute", top: "24px", right: "40px", zIndex: 2, fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "2px", color: project.image ? "#fff" : project.color, textTransform: "uppercase", padding: "6px 16px", border: project.image ? "1px solid rgba(255,255,255,0.5)" : `1px solid ${project.color}40`, background: project.image ? "rgba(0,0,0,0.4)" : "transparent", fontWeight: 600 }}>{project.category}</span>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, -50%) scale(${hovered ? 1 : 0.9})`, opacity: hovered ? 1 : 0, transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 2, textAlign: "center" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "3px", color: project.image ? "#fff" : project.color, textTransform: "uppercase", border: project.image ? "1px solid rgba(255,255,255,0.5)" : `1px solid ${project.color}60`, padding: "12px 28px", display: "inline-block", background: project.image ? "rgba(0,0,0,0.5)" : "transparent", backdropFilter: "blur(8px)", fontWeight: 600 }}>{project.url ? "VISIT SITE →" : "VIEW PROJECT →"}</span>
      </div>
      <div style={{ position: "absolute", bottom: "40px", left: "40px", right: "40px", zIndex: 2 }}>
        {project.logo ? (
          <img src={project.logo} alt={project.title} style={{ maxHeight: "60px", maxWidth: "280px", objectFit: "contain", filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.5))", transform: hovered ? "translateY(-8px)" : "translateY(0)", transition: "transform 0.4s ease" }} />
        ) : (
          <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", color: "#ffffff", margin: 0, fontWeight: 400, letterSpacing: "-2px", transform: hovered ? "translateY(-8px)" : "translateY(0)", transition: "transform 0.4s ease", textShadow: "0 2px 20px rgba(0,0,0,0.5)", lineHeight: 1.1 }}>
            {project.title}<span style={{ color: "rgba(255,255,255,0.8)" }}>.</span>
          </h3>
        )}
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: project.image ? "rgba(255,255,255,0.95)" : "#0a0a18", maxWidth: "450px", margin: "12px 0 0", opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(10px)", transition: "all 0.4s ease 0.05s", lineHeight: 1.6, textShadow: project.image ? "0 1px 8px rgba(0,0,0,0.5)" : "none" }}>{project.desc}</p>
      </div>
    </div>
  );
}

function HorizontalPortfolio() {
  const sectionRef = useRef(null);
  const [horizontalProgress, setHorizontalProgress] = useState(0);
  const [currentCard, setCurrentCard] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [headingRef, headingVis] = useScrollReveal();
  const totalCards = PROJECTS.length;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let raf;
    const update = () => {
      if (!sectionRef.current) { raf = requestAnimationFrame(update); return; }
      const vw = window.innerWidth;
      const cardW = vw * 0.55;
      const gap = 32;
      const trackW = totalCards * (cardW + gap);
      const maxScroll = trackW - vw + 200;
      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      const scrolled = window.scrollY - sectionTop;
      const p = Math.max(0, Math.min(1, scrolled / maxScroll));
      setHorizontalProgress(p * trackW);
      setCurrentCard(Math.min(totalCards, Math.floor(p * totalCards) + 1));
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [isMobile, totalCards]);

  const getSectionHeight = () => {
    if (typeof window === "undefined") return 3000;
    const vw = window.innerWidth;
    const cardW = vw * 0.55;
    const trackW = totalCards * (cardW + 32);
    return Math.max(2500, trackW - vw + 200 + window.innerHeight);
  };

  if (isMobile) {
    return (
      <section id="work" style={{ padding: "80px 20px" }}>
        <div style={{ marginBottom: "40px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "4px", color: "#e8622c", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} /> SELECTED WORK
          </span>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(36px, 8vw, 56px)", color: "rgba(255,255,255,0.9)", margin: 0, fontWeight: 400, letterSpacing: "-2px" }}>
            Projects that<br /><span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>speak for themselves</span>
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {PROJECTS.map((p) => (
            <div key={p.id} onClick={() => p.url && window.open(p.url, "_blank")} style={{ width: "100%", height: "380px", position: "relative", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", cursor: p.url ? "pointer" : "default", borderRadius: "4px" }}>
              {p.image ? (
                <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${p.image})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.45)" }} />
              ) : (
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${p.color}22 0%, ${p.color}08 50%, #b5afa8 100%)` }} />
              )}
              {/* Bottom gradient for text readability */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)", zIndex: 1 }} />
              <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 2 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#fff", textTransform: "uppercase", padding: "4px 12px", border: "1px solid rgba(255,255,255,0.5)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", fontWeight: 600 }}>{p.category}</span>
              </div>
              <div style={{ position: "absolute", bottom: "24px", left: "24px", right: "24px", zIndex: 2 }}>
                <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(28px, 6vw, 40px)", color: "#fff", margin: "0 0 8px", fontWeight: 400, textShadow: "0 2px 12px rgba(0,0,0,0.5)", lineHeight: 1.1 }}>{p.title}<span style={{ color: "rgba(255,255,255,0.9)" }}>.</span></h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.95)", margin: "0 0 8px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</p>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.9)", letterSpacing: "1px" }}>{p.category} · {p.year}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="work" ref={sectionRef} style={{ height: `${getSectionHeight()}px`, position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div ref={headingRef} style={{ padding: "60px 40px 30px", flexShrink: 0, opacity: headingVis ? 1 : 0, transform: headingVis ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "4px", color: "#e8622c", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} /> SELECTED WORK
          </span>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(36px, 5vw, 72px)", color: "rgba(255,255,255,0.9)", margin: 0, fontWeight: 400, letterSpacing: "-2px" }}>
            Projects that<br /><span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>speak for themselves</span>
          </h2>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: "32px", transform: `translateX(-${horizontalProgress}px)`, padding: "0 5vw", willChange: "transform" }}>
            {PROJECTS.map((p) => <PortfolioCard key={p.id} project={p} />)}
          </div>
        </div>
        <div style={{ padding: "20px 40px", flexShrink: 0, display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.9)", letterSpacing: "1px", minWidth: "60px" }}>
            {String(currentCard).padStart(2, "0")} / {String(totalCards).padStart(2, "0")}
          </span>
          <div style={{ flex: 1, height: "2px", background: "rgba(255,255,255,0.06)", position: "relative" }}>
            <div style={{ height: "100%", background: "#e8622c", width: `${(currentCard / totalCards) * 100}%`, transition: "width 0.3s ease" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ project, index, onHover }) {
  const [hovered, setHovered] = useState(false);
  const [ref, vis] = useScrollReveal();
  return (
    <div ref={ref} data-hover-project onMouseEnter={() => { setHovered(true); onHover(project); }} onMouseLeave={() => { setHovered(false); onHover(null); }}
      style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)", transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s`, borderBottom: "1px solid rgba(255,255,255,0.12)", padding: "50px 0", cursor: "pointer", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, bottom: 0, width: hovered ? "100%" : "0%", height: "1px", background: project.color, transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      <div className="project-row-grid" style={{ display: "grid", gridTemplateColumns: "80px 1fr 300px 100px", alignItems: "center", gap: "40px", padding: "0 40px" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.9)", letterSpacing: "1px" }}>{project.year}</span>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", transition: "all 0.4s", transform: hovered ? "translateX(20px)" : "translateX(0)" }}>
            {project.logo && (
              <img src={project.logo} alt={project.title} style={{ height: "40px", objectFit: "contain", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }} />
            )}
            <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: hovered ? "52px" : "48px", color: "rgba(255,255,255,0.9)", margin: 0, fontWeight: 400, letterSpacing: "-2px", transition: "font-size 0.4s" }}>
              {project.fullTitle || project.title}<span style={{ color: project.color, opacity: hovered ? 1 : 0, transition: "opacity 0.3s", marginLeft: "4px" }}>.</span>
            </h3>
          </div>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.9)", lineHeight: 1.6, margin: 0, opacity: hovered ? 0.8 : 0.4, transition: "opacity 0.3s" }}>{project.desc}</p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "2px", color: project.color, textTransform: "uppercase", padding: "6px 16px", border: `1px solid ${project.color}40`, opacity: hovered ? 1 : 0.5, transition: "opacity 0.3s" }}>{project.category}</span>
        </div>
      </div>
    </div>
  );
}

function ProjectListSection() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef(0);
  const [rotation, setRotation] = useState(0);

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    const deltaX = e.clientX - prevMouseRef.current.x;
    rotationRef.current += (deltaX * 0.3 - rotationRef.current) * 0.1;
    rotationRef.current = Math.max(-8, Math.min(8, rotationRef.current));
    setRotation(rotationRef.current);
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  return (
    <section style={{ padding: "120px 0 0" }} onMouseMove={handleMouseMove}>
      <div style={{ padding: "0 40px", maxWidth: "1400px", margin: "0 auto 60px" }}>
        <AnimatedText>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "4px", color: "#e8622c", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} /> COMPLETE PORTFOLIO
          </span>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(36px, 5vw, 72px)", color: "rgba(255,255,255,0.9)", margin: 0, fontWeight: 400, letterSpacing: "-2px" }}>
            All work<span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>, no fluff</span>
          </h2>
        </AnimatedText>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
        {PROJECTS.map((p, i) => <ProjectRow key={p.id} project={p} index={i} onHover={setHoveredProject} />)}
      </div>
      {!IS_TOUCH && (
        <div style={{ position: "fixed", left: mousePos.x, top: mousePos.y, width: "360px", height: "240px", borderRadius: "6px", overflow: "hidden", pointerEvents: "none", zIndex: 100, boxShadow: hoveredProject ? "0 25px 60px rgba(0,0,0,0.2)" : "none", opacity: hoveredProject ? 1 : 0, transform: `translate(-50%, -50%) scale(${hoveredProject ? 1 : 0.8}) rotate(${rotation}deg)`, transition: "opacity 0.3s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s" }}>
          {hoveredProject && (
            <>
              {hoveredProject.image ? (
                <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${hoveredProject.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              ) : (
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${hoveredProject.color}44, ${hoveredProject.color}11)` }} />
              )}
              <div style={{ position: "absolute", inset: 0, background: hoveredProject.image ? "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" : "transparent" }} />
              <span style={{ position: "absolute", bottom: "20px", left: "20px", fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "28px", color: hoveredProject.image ? "#fff" : "#0a0a18", textShadow: hoveredProject.image ? "0 2px 12px rgba(0,0,0,0.5)" : "none" }}>{hoveredProject.title}</span>
              <span style={{ position: "absolute", top: "16px", right: "16px", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: hoveredProject.image ? "#fff" : hoveredProject.color, textTransform: "uppercase", padding: "4px 12px", background: hoveredProject.image ? "rgba(0,0,0,0.3)" : "transparent", border: hoveredProject.image ? "1px solid rgba(255,255,255,0.2)" : "none" }}>{hoveredProject.category}</span>
            </>
          )}
        </div>
      )}
    </section>
  );
}

function CountUpNumber({ value, prefix = "", suffix = "", trigger }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const duration = 1000;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [trigger, value]);
  return <span>{prefix}{display}{suffix}</span>;
}

function CaseStudyCard({ study }) {
  const [ref, vis] = useScrollReveal();
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} data-hover onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ minWidth: "clamp(300px, 80vw, 400px)", width: "clamp(300px, 80vw, 400px)", background: "rgba(0,0,0,0.02)", border: hovered ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.06)", flexShrink: 0, cursor: "pointer", overflow: "hidden", transform: hovered ? "scale(1.02)" : "scale(1)", transition: "all 0.4s ease", scrollSnapAlign: "start" }}>
      <div style={{ height: "200px", position: "relative", overflow: "hidden", background: study.image ? `url(${study.image}) center/cover no-repeat` : `linear-gradient(135deg, ${study.color}33, ${study.color}0a)` }}>
        <div style={{ position: "absolute", inset: 0, background: hovered ? "rgba(0,0,0,0.3)" : "transparent", transition: "background 0.3s", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "2px", color: study.image ? "#fff" : "#0a0a18", textTransform: "uppercase", opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)", transition: "all 0.3s", padding: "8px 20px", background: study.image ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)" }}>Explore Study →</span>
        </div>
      </div>
      <div style={{ padding: "28px" }}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: study.color, textTransform: "uppercase", padding: "4px 10px", border: `1px solid ${study.color}40` }}>{study.category}</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", padding: "4px 10px", border: "1px solid rgba(255,255,255,0.12)" }}>{study.tag}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 8px" }}>
          {study.logo && <img src={study.logo} alt={study.title} style={{ height: "24px", objectFit: "contain", filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.3))" }} />}
          <h4 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "24px", color: "rgba(255,255,255,0.9)", margin: 0, fontWeight: 400 }}>{study.title}</h4>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.9)", margin: "0 0 24px", lineHeight: 1.5 }}>{study.desc}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Challenge</span>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.9)", lineHeight: 1.6, margin: 0 }}>{study.challenge}</p>
          </div>
          <div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Solution</span>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.9)", lineHeight: 1.6, margin: 0 }}>{study.solution}</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "20px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", display: "block", marginBottom: "16px" }}>Results</span>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${study.results.length}, 1fr)`, gap: "16px" }}>
            {study.results.map((r, ri) => (
              <div key={ri}>
                <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "32px", color: study.color, letterSpacing: "-1px" }}>
                  <CountUpNumber value={r.value} prefix={r.prefix || ""} suffix={r.suffix || ""} trigger={vis} />
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "1px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", marginTop: "4px" }}>{r.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseStudies() {
  return (
    <section style={{ padding: "120px 0" }}>
      <div style={{ padding: "0 40px", maxWidth: "1400px", margin: "0 auto 60px" }}>
        <AnimatedText>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "4px", color: "#e8622c", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} /> CASE STUDIES
          </span>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(36px, 5vw, 72px)", color: "rgba(255,255,255,0.9)", margin: 0, fontWeight: 400, letterSpacing: "-2px" }}>
            Impact you can<br /><span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>measure</span>
          </h2>
        </AnimatedText>
      </div>
      <div style={{ display: "flex", gap: "24px", overflowX: "auto", padding: "0 40px 40px", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
        <style>{`.case-scroll::-webkit-scrollbar { display: none; }`}</style>
        {CASE_STUDIES.map((s) => <CaseStudyCard key={s.id} study={s} />)}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", padding: "20px", opacity: 0.3 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" }}>← DRAG TO EXPLORE →</span>
      </div>
    </section>
  );
}

function AwardsMarquee() {
  const stats = [
    { end: 50, suffix: "+", label: "Projects Shipped" },
    { end: 340, suffix: "%", label: "Conversion Lift" },
    { prefix: "$", end: 2, suffix: "M+", label: "Revenue Generated" },
    { end: 100, suffix: "%", label: "Client Retention" },
  ];
  const [ref, vis] = useScrollReveal();
  const [counts, setCounts] = useState(stats.map(() => 0));
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (vis && !hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 2200;
      const start = performance.now();
      const step = (now) => {
        const elapsed = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - elapsed, 4);
        setCounts(stats.map(s => Math.round(s.end * ease)));
        if (elapsed < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [vis]);

  return (
    <section ref={ref} style={{ padding: "clamp(100px, 12vw, 180px) 40px", position: "relative", overflow: "hidden" }}>
      <div className="stats-grid" style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0", position: "relative", zIndex: 1 }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ textAlign: "center", position: "relative", padding: "clamp(24px, 4vw, 48px) 0", opacity: vis ? 1 : 0, transform: vis ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)", transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.12}s` }}>
            {/* Vertical divider */}
            {i > 0 && <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: "1px", background: "linear-gradient(180deg, transparent, rgba(232,98,44,0.15), transparent)" }} />}
            {/* Number */}
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(56px, 8vw, 96px)", fontWeight: 800, letterSpacing: "-4px", lineHeight: 0.9, marginBottom: "20px", background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(232,98,44,0.6) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {s.prefix || ""}{counts[i]}{s.suffix}
            </div>
            {/* Label */}
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, letterSpacing: "4px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  const [headingRef, headingVis] = useScrollReveal();
  const [quoteRef, quoteVis] = useScrollReveal();
  const paras = [
    "We started with a conviction: the internet is full of mediocre websites, and every one of them is a missed opportunity. A missed sale. A missed impression. A missed relationship. We exist to eliminate that waste for the brands ambitious enough to care.",
    "We don't use templates. We don't outsource. Every site we ship is a ground-up build — strategy, design, and engineering unified under one obsessive creative vision. The result isn't just a website. It's a revenue engine disguised as art.",
    "Today, we partner with founders who refuse to settle. Who understand that their website isn't a cost center — it's their most powerful growth lever. If that sounds like you, we should talk.",
  ];
  const stats = [
    { value: 50, suffix: "+", label: "Projects Delivered" },
    { value: 2, prefix: "$", suffix: "M+", label: "Revenue for Clients" },
    { value: 340, suffix: "%", label: "Avg Conversion Lift" },
    { value: 100, suffix: "%", label: "Client Retention" },
  ];
  const avatars = [
    { initials: "MC", color: "#e8622c" },
    { initials: "SB", color: "#d4561e" },
    { initials: "DO", color: "#f0943a" },
    { initials: "AK", color: "#ff6b35" },
  ];
  const [statsRef, statsVis] = useScrollReveal();
  const [proofRef, proofVis] = useScrollReveal();
  const [linkHovered, setLinkHovered] = useState(false);

  return (
    <section style={{ padding: "clamp(100px, 12vw, 200px) 40px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header — centered */}
      <div ref={headingRef} style={{ textAlign: "center", marginBottom: "clamp(60px, 8vw, 100px)", opacity: headingVis ? 1 : 0, transform: headingVis ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "4px", color: "#e8622c", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} /> OUR STORY <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} />
        </span>
        <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(36px, 5vw, 72px)", color: "rgba(255,255,255,0.9)", margin: "20px 0 0", fontWeight: 400, letterSpacing: "-2px", lineHeight: 1.1 }}>
          <SplitText trigger={headingVis} delay={0.1} stagger={0.03}>{"Built different,"}</SplitText>
          <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>
            <SplitText trigger={headingVis} delay={0.5} stagger={0.03}>{" by design"}</SplitText>
          </span>
        </h2>
      </div>

      {/* Pull quote */}
      <div ref={quoteRef} style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center", marginBottom: "clamp(60px, 8vw, 100px)", position: "relative", opacity: quoteVis ? 1 : 0, transform: quoteVis ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s" }}>
        <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "120px", color: "rgba(232,98,44,0.12)", position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)", lineHeight: 1, userSelect: "none" }}>"</span>
        <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(24px, 3vw, 36px)", color: "rgba(255,255,255,0.9)", lineHeight: 1.5, fontWeight: 400, fontStyle: "italic", margin: 0, letterSpacing: "-0.5px" }}>
          We exist to eliminate mediocrity for the brands ambitious enough to care.
        </p>
        <div style={{ width: "40px", height: "2px", background: "#e8622c", margin: "32px auto 0" }} />
      </div>

      {/* Two-column narrative */}
      <div className="about-layout" style={{ display: "flex", gap: "clamp(40px, 6vw, 80px)", alignItems: "flex-start", maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ flex: 1 }}>
          <AnimatedText delay={0}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "18px", lineHeight: 1.9, color: "rgba(255,255,255,0.9)", margin: "0 0 32px", fontWeight: 400 }}>{paras[0]}</p>
          </AnimatedText>
        </div>
        <div style={{ flex: 1 }}>
          <AnimatedText delay={0.15}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", lineHeight: 1.9, color: "rgba(255,255,255,0.9)", margin: "0 0 28px" }}>{paras[1]}</p>
          </AnimatedText>
          <AnimatedText delay={0.3}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", lineHeight: 1.9, color: "rgba(255,255,255,0.9)", margin: "0 0 32px" }}>{paras[2]}</p>
          </AnimatedText>
          <AnimatedText delay={0.4}>
            <a href="#contact" data-hover
              onMouseEnter={() => setLinkHovered(true)} onMouseLeave={() => setLinkHovered(false)}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "2px", color: "#e8622c", textDecoration: "none", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(232,98,44,0.3)", paddingBottom: "4px" }}>
              Let's talk <span style={{ transition: "transform 0.3s", transform: linkHovered ? "translateX(8px)" : "translateX(0)", display: "inline-block" }}>→</span>
            </a>
          </AnimatedText>
        </div>
      </div>

      {/* Count-up stats */}
      <div ref={statsRef} className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0", marginTop: "clamp(60px, 8vw, 120px)", borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "60px" }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ textAlign: "center", padding: "0 20px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none", opacity: statsVis ? 1 : 0, transform: statsVis ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s` }}>
            <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(40px, 5vw, 56px)", color: "rgba(255,255,255,0.9)", letterSpacing: "-2px", marginBottom: "8px" }}>
              <CountUpNumber value={s.value} prefix={s.prefix || ""} suffix={s.suffix || ""} trigger={statsVis} />
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Client Logo Strip */}
      <div ref={proofRef} style={{ marginTop: "clamp(60px, 8vw, 100px)", opacity: proofVis ? 1 : 0, transform: proofVis ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div style={{ width: "60px", height: "1px", background: "rgba(10,10,24,0.15)", margin: "0 auto 40px" }} />
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", letterSpacing: "5px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", fontWeight: 800 }}>Brands we've built for</span>
        </div>
        <div className="client-logos" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {[
            { name: "Precision Auto Detailing", logo: "/precision-logo.png", url: "https://precisionautodetailnj.com" },
            { name: "Cyrath", logo: "/cyrath-logo.png", url: "https://cyrath.com" },
            { name: "PulsBrush", logo: "/pulsbrush-logo.png", url: "https://pulsbrush.com" },
            { name: "Decantoir", logo: "/decantoir-logo.png", url: "https://decantoir.com" },
          ].map((client, i) => (
            <a key={client.name} href={client.url} target="_blank" rel="noopener noreferrer" data-hover
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textDecoration: "none", padding: "48px 24px", background: "transparent", border: "1px solid transparent", borderRadius: "8px", opacity: proofVis ? 1 : 0, transform: proofVis ? "translateY(0)" : "translateY(15px)", transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.1}s` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,98,44,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(232,98,44,0.25)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.querySelector('img').style.transform = 'scale(1.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.querySelector('img').style.transform = 'scale(1)'; }}>
              <img src={client.logo} alt={client.name} style={{ width: "80px", height: "80px", objectFit: "contain", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(11px, 2.5vw, 15px)", fontWeight: 800, color: "rgba(255,255,255,0.9)", letterSpacing: "1px", textTransform: "uppercase", textAlign: "center", lineHeight: 1.3 }}>{client.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function GlowCard({ children, style = {}, ...props }) {
  const cardRef = useRef(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} data-hover
      style={{ ...style, background: isHovered ? `radial-gradient(circle 250px at ${glowPos.x}px ${glowPos.y}px, rgba(232,98,44,0.1), rgba(255,255,255,0.06) 70%)` : "rgba(0,0,0,0.03)", border: isHovered ? "1px solid rgba(232,98,44,0.12)" : "1px solid rgba(255,255,255,0.05)", transition: "border-color 0.3s" }}
      {...props}>
      {children}
    </div>
  );
}

function ServiceItem({ service, index, activeService, setActiveService }) {
  const [ref, vis] = useScrollReveal();
  const isActive = activeService === index;
  return (
    <div ref={ref} data-hover onMouseEnter={() => setActiveService(index)} onMouseLeave={() => setActiveService(null)}
      className="service-item"
      style={{ opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(-40px)", transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s`, borderTop: "1px solid rgba(255,255,255,0.08)", padding: "40px 0", cursor: "pointer", display: "grid", gridTemplateColumns: "60px 1fr 1fr", gap: "40px", alignItems: "start" }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: isActive ? "#e8622c" : "rgba(255,255,255,0.4)", transition: "color 0.3s", letterSpacing: "1px" }}>{service.num}</span>
      <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "36px", color: "rgba(255,255,255,0.9)", margin: 0, fontWeight: 400, letterSpacing: "-1px", transform: isActive ? "translateX(16px)" : "translateX(0)", transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>{service.title}</h3>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.9)", lineHeight: 1.7, margin: 0, opacity: isActive ? 1 : 0.85, transition: "opacity 0.3s", maxHeight: isActive ? "200px" : "50px", overflow: "hidden" }}>{service.desc}</p>
    </div>
  );
}

function Services() {
  const [activeService, setActiveService] = useState(null);
  return (
    <section id="services" style={{ padding: "160px 40px", maxWidth: "1400px", margin: "0 auto" }}>
      <AnimatedText>
        <div className="services-header" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", marginBottom: "100px" }}>
          <div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "4px", color: "#e8622c", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
              <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} /> WHAT WE DO
            </span>
            <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(36px, 5vw, 72px)", color: "rgba(255,255,255,0.9)", margin: 0, fontWeight: 400, letterSpacing: "-2px" }}>
              Services built<br /><span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>for ambition</span>
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "17px", color: "rgba(255,255,255,0.9)", lineHeight: 1.8, margin: 0 }}>
              We don't do templates. We don't do generic. Every engagement is a ground-up build — strategy, design, and engineering unified under one obsessive creative vision.
            </p>
          </div>
        </div>
      </AnimatedText>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {SERVICES.map((s, i) => <ServiceItem key={s.num} service={s} index={i} activeService={activeService} setActiveService={setActiveService} />)}
      </div>
    </section>
  );
}

function ProcessStep({ step, index }) {
  const [ref, vis] = useScrollReveal();
  const [hov, setHov] = useState(false);
  return (
    <div ref={ref} data-hover onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)", transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`, padding: "36px 28px", borderLeft: index === 0 ? "none" : "1px solid rgba(255,255,255,0.06)", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: hov ? "2px" : "0px", background: "#e8622c", transition: "height 0.3s" }} />
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "42px", fontWeight: 200, color: hov ? "#e8622c" : "rgba(255,255,255,0.08)", transition: "color 0.3s", display: "block", marginBottom: "20px" }}>{step.num}</span>
      <h4 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "24px", color: "rgba(255,255,255,0.9)", margin: "0 0 12px", fontWeight: 400 }}>{step.title}</h4>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.9)", lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
    </div>
  );
}

function Process() {
  const steps = [
    { num: "01", title: "Discovery", desc: "Deep-dive into your brand, audience, and goals. We map the strategic landscape before touching a single pixel." },
    { num: "02", title: "Strategy", desc: "Information architecture, user flows, and conversion mapping. We engineer the experience before we design it." },
    { num: "03", title: "Design", desc: "High-fidelity mockups with obsessive attention to typography, spacing, and visual hierarchy. Nothing generic. Ever." },
    { num: "04", title: "Build", desc: "Pixel-perfect development with buttery animations, blazing performance, and clean architecture." },
    { num: "05", title: "Launch", desc: "Rigorous QA, performance optimization, and a deployment strategy that ensures zero-downtime perfection." },
  ];
  return (
    <section style={{ padding: "160px 40px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <AnimatedText>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "4px", color: "#e8622c", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} /> OUR PROCESS
          </span>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(36px, 5vw, 72px)", color: "rgba(255,255,255,0.9)", margin: "0 0 80px", fontWeight: 400, letterSpacing: "-2px" }}>
            Engineered to<br /><span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>deliver perfection</span>
          </h2>
        </AnimatedText>
        <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "2px" }}>
          {steps.map((s, i) => <ProcessStep key={s.num} step={s} index={i} />)}
        </div>
      </div>
    </section>
  );
}
function WhyUs() {
  const blocks = [
    { num: "01", title: "No templates, ever.", body: "Every site we build starts with a blank canvas. Your brand isn't generic, and neither is our process. We architect from scratch — strategy, wireframes, design, code." },
    { num: "02", title: "Obsessive about conversion.", body: "A beautiful site that doesn't convert is just expensive art. We optimize layouts, engineer CTAs, and track every metric that matters." },
    { num: "03", title: "We build like we own equity.", body: "We treat your project like our own company launch. That means we over-deliver, stress-test everything, and refuse to ship until we'd put our own name on it." },
    { num: "04", title: "Post-launch, we don't disappear.", body: "Your site isn't done when it goes live. We monitor performance, fix issues, and iterate based on real data. Growth is ongoing." },
  ];
  const blockRefs = useRef([]);
  const [activeBlock, setActiveBlock] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const viewCenter = window.innerHeight / 2;
      let closest = 0, closestDist = Infinity;
      blockRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const blockCenter = rect.top + rect.height / 2;
        const dist = Math.abs(blockCenter - viewCenter);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      setActiveBlock(closest);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section style={{ padding: "120px 40px", maxWidth: "1400px", margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
      <div style={{ display: "flex", gap: "80px" }}>
        {!isMobile && (
          <div style={{ width: "35%", position: "sticky", top: "30vh", alignSelf: "flex-start", height: "fit-content" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "4px", color: "#e8622c", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
              <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} /> WHY US
            </span>
            <div style={{ position: "relative", height: "240px", overflow: "hidden" }}>
              {blocks.map((b, i) => (
                <div key={i} style={{ position: "absolute", top: 0, left: 0, opacity: activeBlock === i ? 1 : 0, transform: activeBlock === i ? "translateY(0)" : (activeBlock > i ? "translateY(-20px)" : "translateY(20px)"), transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                  <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "120px", lineHeight: 1, display: "block", background: "linear-gradient(180deg, #0a0a18 0%, rgba(232,98,44,0.4) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{b.num}</span>
                  <div style={{ width: "40px", height: "2px", background: "#e8622c", margin: "20px 0" }} />
                  <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "28px", color: "rgba(255,255,255,0.9)" }}>{b.title}</span>
                </div>
              ))}
            </div>
            {/* Progress dots */}
            <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
              {blocks.map((_, i) => (
                <div key={i} style={{ width: activeBlock === i ? "24px" : "8px", height: "4px", borderRadius: "2px", background: activeBlock === i ? "#e8622c" : "rgba(255,255,255,0.12)", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }} />
              ))}
            </div>
          </div>
        )}
        <div style={{ width: isMobile ? "100%" : "65%" }}>
          {blocks.map((b, i) => (
            <div key={i} ref={el => blockRefs.current[i] = el} style={{ minHeight: "70vh", display: "flex", alignItems: "center", padding: "40px 0" }}>
              <div>
                {isMobile && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#e8622c", letterSpacing: "2px", display: "block", marginBottom: "12px" }}>{b.num} —</span>}
                <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "32px", color: activeBlock === i ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.3)", margin: "0 0 20px", fontWeight: 400, transition: "color 0.5s" }}>{b.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: activeBlock === i ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)", lineHeight: 1.8, margin: 0, maxWidth: "500px", transition: "color 0.5s" }}>{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  const autoRef = useRef(null);
  const pauseRef = useRef(false);
  const total = TESTIMONIALS.length;

  const goTo = useCallback((idx) => {
    setActive((idx + total) % total);
    pauseRef.current = true;
    clearTimeout(autoRef.current);
    autoRef.current = setTimeout(() => { pauseRef.current = false; }, 10000);
  }, [total]);

  useEffect(() => {
    const t = setInterval(() => { if (!pauseRef.current) setActive(p => (p + 1) % total); }, 6000);
    return () => { clearInterval(t); clearTimeout(autoRef.current); };
  }, [total]);

  const initials = (name) => name.split(" ").map(w => w[0]).join("");
  const avatarColors = ["linear-gradient(135deg, #e8622c, #d4561e)", "linear-gradient(135deg, #f0943a, #d4561e)", "linear-gradient(135deg, #ff6b35, #e8622c)"];

  return (
    <section style={{ padding: "160px 40px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg, rgba(232,98,44,0.02) 0%, transparent 50%, rgba(240,148,58,0.02) 100%)" }} />
      <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
        <AnimatedText>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "4px", color: "#e8622c", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "16px", marginBottom: "60px" }}>
            <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} /> CLIENT VOICES <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} />
          </span>
        </AnimatedText>

        {/* Big quote mark */}
        <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "160px", color: "rgba(232,98,44,0.25)", lineHeight: 0.5, marginBottom: "20px", userSelect: "none" }}>“</div>

        {/* Quote carousel */}
        <div style={{ position: "relative", minHeight: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              position: i === active ? "relative" : "absolute",
              opacity: i === active ? 1 : 0,
              transform: i === active ? "translateY(0) scale(1)" : (i < active ? "translateY(-30px) scale(0.97)" : "translateY(30px) scale(0.97)"),
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              pointerEvents: i === active ? "auto" : "none",
              width: "100%",
            }}>
              <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", color: "rgba(255,255,255,0.9)", lineHeight: 1.5, fontWeight: 400, fontStyle: "italic", margin: "0 0 48px", padding: "0 20px" }}>
                "{t.quote}"
              </p>
              {/* Stars */}
              <div style={{ marginBottom: "24px" }}>
                {"★★★★★".split("").map((s, si) => (
                  <span key={si} style={{ color: "#f5a623", fontSize: "16px", marginRight: "3px" }}>{s}</span>
                ))}
              </div>
              {/* Attribution */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: avatarColors[i % avatarColors.length], display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(232,98,44,0.2)" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: 700, color: "#fff" }}>{initials(t.name)}</span>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.9)", marginTop: "2px" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", marginTop: "60px" }}>
          <button data-hover onClick={() => goTo(active - 1)} style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.9)", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e8622c'; e.currentTarget.style.color = '#e8622c'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>←</button>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} data-hover style={{ width: i === active ? "40px" : "8px", height: "3px", background: i === active ? "#e8622c" : "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)", borderRadius: "2px" }} />
            ))}
          </div>
          <button data-hover onClick={() => goTo(active + 1)} style={{ width: "44px", height: "44px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.9)", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e8622c'; e.currentTarget.style.color = '#e8622c'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>→</button>
        </div>

        {/* Counter */}
        <div style={{ marginTop: "20px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.9)", letterSpacing: "2px" }}>
            {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}


function PricingCard({ plan, index }) {
  const [ref, vis] = useScrollReveal();
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(60px)", transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s` }}>
      <GlowCard style={{ padding: "48px 40px", height: "100%", position: "relative", ...(plan.featured ? { background: "rgba(232,98,44,0.025)", border: "1px solid rgba(232,98,44,0.12)" } : {}) }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {plan.featured && <div style={{ position: "absolute", top: "16px", right: "16px", fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#ffffff", background: "#e8622c", padding: "4px 12px", textTransform: "uppercase", fontWeight: 600 }}>POPULAR</div>}
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "3px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", marginBottom: "24px" }}>{plan.tier}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
          {plan.price !== "Contact" && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.9)", fontWeight: 300 }}>$</span>}
          <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: plan.price === "Contact" ? "40px" : "56px", color: "rgba(255,255,255,0.9)", fontWeight: 400, letterSpacing: "-2px" }}>{plan.price === "Contact" ? "Contact Us" : plan.price}</span>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.9)", margin: "0 0 36px", lineHeight: 1.5 }}>{plan.desc}</p>
        <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "28px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "40px" }}>
          {plan.features.map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: plan.featured ? "#e8622c" : "rgba(255,255,255,0.4)", flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.9)" }}>{f}</span>
            </div>
          ))}
        </div>
        <MagneticButton data-hover-cta style={{ width: "100%", padding: "16px", background: plan.featured ? "#e8622c" : "transparent", color: plan.featured ? "#ffffff" : "rgba(255,255,255,0.8)", border: plan.featured ? "none" : "1px solid rgba(255,255,255,0.15)", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", transition: "all 0.3s", ...(hovered && !plan.featured ? { borderColor: "#e8622c", color: "#e8622c", background: "rgba(232,98,44,0.06)" } : {}), ...(hovered && plan.featured ? { background: "#d4561e" } : {}) }}>
          GET STARTED
        </MagneticButton>
      </GlowCard>
    </div>
  );
}

function Pricing() {
  return (
    <section id="pricing" style={{ padding: "120px 40px", maxWidth: "1400px", margin: "0 auto" }}>
      <AnimatedText>
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "4px", color: "#e8622c", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} /> INVESTMENT <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} />
          </span>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(36px, 5vw, 72px)", color: "rgba(255,255,255,0.9)", margin: "0 0 20px", fontWeight: 400, letterSpacing: "-2px" }}>
            Transparent pricing<span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>,</span><br />
            <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>extraordinary results</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.9)", maxWidth: "550px", margin: "0 auto", lineHeight: 1.7 }}>Every package includes strategy, design, development, and post-launch support.</p>
        </div>
      </AnimatedText>
      <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px" }}>
        {PRICING.map((plan, i) => <PricingCard key={plan.tier} plan={plan} index={i} />)}
      </div>

      {/* FAQ Section */}
      <div style={{ maxWidth: "1200px", margin: "120px auto 0", padding: "0 40px", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "80px", alignItems: "start" }} className="faq-layout">
        {/* Left — Sticky heading */}
        <div style={{ position: "sticky", top: "120px" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "4px", color: "#e8622c", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
            <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} /> FAQ
          </span>
          <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(32px, 4vw, 48px)", color: "rgba(255,255,255,0.9)", margin: "0 0 16px", fontWeight: 400, letterSpacing: "-1px", lineHeight: 1.1 }}>
            Questions<br /><span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>we get asked</span>
          </h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.9)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: "320px" }}>Everything you need to know about working with us. Can't find what you're looking for?</p>
          <a href="#contact" data-hover style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "2px", color: "#e8622c", textDecoration: "none", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(232,98,44,0.3)", paddingBottom: "4px" }}>
            Get in touch <span style={{ transition: "transform 0.3s", display: "inline-block" }}>→</span>
          </a>
        </div>
        {/* Right — Accordion */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          {[
            { q: "What's included in a revision round?", a: "Each round includes a full review of the current design with detailed feedback. We implement your changes and present the updated version within 2-3 business days. Additional rounds can be added for $500 each." },
            { q: "Do you work with Shopify?", a: "Yes — Shopify, Webflow, custom React/Next.js, WordPress, and headless architectures. We recommend the best platform based on your specific needs and growth plans." },
            { q: "What's your typical project timeline?", a: "Starter projects take about 1 week. Professional packages run 2-3 weeks. Enterprise projects vary based on complexity — we'll scope the timeline together during our discovery call." },
            { q: "Can I upgrade my package mid-project?", a: "Absolutely. If your needs evolve during the project, we'll adjust scope and pricing transparently. No surprise invoices." },
            { q: "Do I own the code and design files?", a: "100%. Upon final payment, you receive full ownership of all code, design files, assets, and content. No licensing fees, no strings attached. It's yours forever." },
            { q: "Do you offer ongoing maintenance?", a: "Yes. We offer post-launch retainer packages for hosting, security updates, performance monitoring, and iterative improvements. Most clients see continued conversion gains through ongoing optimization." },
            { q: "What if I already have a website?", a: "We can redesign and rebuild your existing site from the ground up, migrating your content and improving performance, SEO, and conversion rates. Most redesign projects see a 200%+ improvement in key metrics within 90 days." },
            { q: "How do payments work?", a: "We require a 50% deposit to begin work, with the remaining 50% due upon project completion and your final approval. Enterprise projects can be structured with milestone-based payments. We accept bank transfer and all major credit cards." },
            { q: "Do you handle hosting and domains?", a: "We can recommend the best hosting solution for your project and help set everything up, but we encourage clients to own their own hosting accounts and domains for full control. We'll guide you through the entire process." },
            { q: "What makes you different from other agencies?", a: "We build from scratch — no templates, no page builders, no shortcuts. Every project gets the same obsessive attention to detail whether it's a $3,500 launch or a $50,000 platform. Our clients stay because the work speaks for itself." },
          ].map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} num={String(i + 1).padStart(2, "0")} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer, num }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} data-hover style={{ borderBottom: "1px solid rgba(255,255,255,0.12)", cursor: "pointer", position: "relative" }}>
      {/* Active left accent bar */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "2px", background: "#e8622c", opacity: open ? 1 : 0, transition: "opacity 0.3s" }} />
      <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", padding: "24px 0 24px 20px" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: open ? "#e8622c" : "rgba(255,255,255,0.6)", letterSpacing: "1px", fontWeight: 500, transition: "color 0.3s", flexShrink: 0, paddingTop: "3px" }}>{num}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", fontWeight: 500, color: open ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.6)", transition: "color 0.3s", lineHeight: 1.4 }}>{question}</span>
            <span style={{ color: "#e8622c", fontSize: "20px", fontWeight: 300, transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)", flexShrink: 0, marginLeft: "20px", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>+</span>
          </div>
          <div style={{ maxHeight: open ? "300px" : "0px", opacity: open ? 1 : 0, overflow: "hidden", transition: "max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease" }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.9)", lineHeight: 1.8, margin: "12px 0 0", paddingRight: "44px" }}>{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", project: "", budget: "", details: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);
  const inputStyle = (key) => ({
    background: "rgba(255,255,255,0.06)", border: focused === key ? "1px solid rgba(232,98,44,0.3)" : "1px solid rgba(255,255,255,0.08)",
    boxShadow: focused === key ? "0 0 20px rgba(232,98,44,0.05)" : "none",
    padding: "16px 20px", color: "rgba(255,255,255,0.9)", fontFamily: "'DM Sans', sans-serif", fontSize: "15px", outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s", width: "100%", boxSizing: "border-box",
  });
  const labelStyle = { fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", display: "block", marginBottom: "8px" };

  return (
    <section id="contact" style={{ padding: "160px 40px", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(180deg, transparent 0%, rgba(232,98,44,0.04) 100%)" }} />
      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "80px 0", animation: "fadeIn 0.5s ease" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid #e8622c", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
              <span style={{ color: "#e8622c", fontSize: "28px" }}>✓</span>
            </div>
            <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "36px", color: "rgba(255,255,255,0.9)", fontWeight: 400, margin: "0 0 12px" }}>We'll be in touch</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.9)" }}>Expect a response within 24 hours.</p>
          </div>
        ) : (
          <div className="contact-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "80px", alignItems: "start" }}>
            {/* Left — Info */}
            <AnimatedText>
              <div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "4px", color: "#e8622c", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                  <span style={{ width: "40px", height: "1px", background: "#e8622c", display: "inline-block" }} /> START YOUR PROJECT
                </span>
                <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "clamp(36px, 4vw, 60px)", color: "rgba(255,255,255,0.9)", margin: "0 0 24px", fontWeight: 400, letterSpacing: "-2px", lineHeight: 1.1 }}>
                  Let's build something<br /><span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.9)" }}>extraordinary</span>
                </h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "rgba(255,255,255,0.9)", lineHeight: 1.7, margin: "0 0 48px", maxWidth: "400px" }}>Tell us about your vision. We'll handle the strategy, design, and engineering.</p>

                {/* Contact details */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {[
                    { label: "EMAIL", value: "hello@nocturnlabs.com", href: "mailto:hello@nocturnlabs.com" },
                    { label: "RESPONSE TIME", value: "< 24 hours" },
                    { label: "LOCATION", value: "Remote-First / Worldwide" },
                  ].map(item => (
                    <div key={item.label}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>{item.label}</span>
                      {item.href ? (
                        <a href={item.href} data-hover style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#e8622c", textDecoration: "none", borderBottom: "1px solid rgba(232,98,44,0.2)", paddingBottom: "2px" }}>{item.value}</a>
                      ) : (
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.9)" }}>{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Consultation CTA */}
                <div style={{ marginTop: "48px", padding: "28px", background: "rgba(232,98,44,0.03)", border: "1px solid rgba(232,98,44,0.25)" }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.9)", margin: "0 0 16px", lineHeight: 1.6 }}>Rather hop on a quick call?</p>
                  <MagneticButton data-hover-cta onClick={() => {}} style={{ padding: "12px 24px", background: "transparent", border: "1px solid rgba(232,98,44,0.3)", color: "#e8622c", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>
                    Book a Free 15-Min Call →
                  </MagneticButton>
                </div>
              </div>
            </AnimatedText>

            {/* Right — Form */}
            <AnimatedText delay={0.2}>
              <div style={{ background: "rgba(0,0,0,0.015)", border: "1px solid rgba(255,255,255,0.06)", padding: "48px" }}>
                <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                  {[
                    { key: "name", label: "YOUR NAME", placeholder: "John Smith" },
                    { key: "email", label: "EMAIL", placeholder: "john@company.com" },
                    { key: "project", label: "PROJECT TYPE", placeholder: "Website Redesign..." },
                    { key: "budget", label: "BUDGET RANGE", placeholder: "$3,500 — $20,000+" },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={labelStyle}>{field.label}</label>
                      <input data-hover value={formData[field.key]} onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder}
                        style={inputStyle(field.key)} onFocus={() => setFocused(field.key)} onBlur={() => setFocused(null)} />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "24px" }}>
                  <label style={labelStyle}>PROJECT DETAILS</label>
                  <textarea data-hover rows={4} placeholder="Tell us about your project, goals, and timeline..." value={formData.details}
                    onChange={e => setFormData(p => ({ ...p, details: e.target.value }))}
                    style={{ ...inputStyle("details"), resize: "vertical" }} onFocus={() => setFocused("details")} onBlur={() => setFocused(null)} />
                </div>
                <MagneticButton data-hover-cta onClick={() => setSubmitted(true)}
                  style={{ marginTop: "32px", width: "100%", padding: "20px", background: "#e8622c", color: "#ffffff", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 700, cursor: "pointer", transition: "all 0.3s" }}>
                  SUBMIT INQUIRY →
                </MagneticButton>

                {/* Trust indicators */}
                <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "24px", flexWrap: "wrap" }}>
                  {["No spam", "Free consultation", "NDA on request"].map(item => (
                    <span key={item} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.9)", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#e8622c", opacity: 0.5 }} />{item}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedText>
          </div>
        )}
      </div>
    </section>
  );
}

function Footer() {
  const [watermarkRef, watermarkVis] = useScrollReveal();
  const avatars = [
    { initials: "MC", color: "#e8622c" },
    { initials: "SB", color: "#d4561e" },
    { initials: "DO", color: "#f0943a" },
    { initials: "AK", color: "#ff6b35" },
  ];
  return (
    <>
      {/* Watermark */}
      <div ref={watermarkRef} style={{ textAlign: "center", margin: "60px 0", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", gap: "24px" }}>
        <img src="/nocturn-logo.png" alt="" style={{ width: "clamp(80px, 12vw, 160px)", height: "clamp(80px, 12vw, 160px)", objectFit: "contain", opacity: watermarkVis ? 0.3 : 0.08, transition: "opacity 1s ease", filter: "grayscale(80%)" }} />
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(48px, 10vw, 140px)", fontWeight: 900, color: watermarkVis ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)", transition: "color 1s ease", letterSpacing: "2px", display: "block", textTransform: "uppercase" }}>
          Nocturn Labs
        </span>
      </div>
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.12)", padding: "80px 40px 60px" }}>
        <div className="footer-grid" style={{ maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 0.8fr 0.8fr 1fr", gap: "60px", alignItems: "start" }}>
          {/* Col 1 — Brand */}
          <div>
            <div className="nav-logo-link" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <img src="/nocturn-logo.png" alt="Nocturn Labs" className="nav-logo-icon" style={{ width: "36px", height: "36px", objectFit: "contain", filter: "drop-shadow(0 0 6px rgba(240,148,58,0.3))", transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "22px", fontWeight: 900, color: "rgba(255,255,255,0.9)", letterSpacing: "0.5px" }}>Nocturn Labs</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.9)", marginTop: "16px", lineHeight: 1.7, maxWidth: "300px" }}>Premium web design for brands that refuse to blend in. We build from scratch — no templates, no shortcuts.</p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "24px" }}>
              <div style={{ display: "flex" }}>
                {["/precision-logo.png", "/cyrath-logo.png", "/pulsbrush-logo.png", "/decantoir-logo.png"].map((logo, i) => (
                  <div key={i} style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: i > 0 ? "-8px" : "0", border: "2px solid #080812", zIndex: 4 - i, overflow: "hidden" }}>
                    <img src={logo} alt="" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
                  </div>
                ))}
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.9)" }}>50+ happy clients</span>
            </div>
          </div>
          {/* Col 2: Navigation */}
          <div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", display: "block", marginBottom: "20px" }}>NAVIGATION</span>
            {["Work", "Services", "Pricing", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} data-hover style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.9)", textDecoration: "none", padding: "6px 0", transition: "color 0.3s" }}
                onMouseEnter={e => e.target.style.color = "#e8622c"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}>{l}</a>
            ))}
          </div>
          {/* Col 3: Social */}
          <div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", display: "block", marginBottom: "20px" }}>SOCIAL</span>
            {[{ name: "Twitter / X", url: "https://x.com" }, { name: "Dribbble", url: "https://dribbble.com" }, { name: "LinkedIn", url: "https://linkedin.com" }, { name: "Instagram", url: "https://instagram.com" }].map(l => (
              <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer" data-hover style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.9)", textDecoration: "none", padding: "6px 0", transition: "color 0.3s" }}
                onMouseEnter={e => e.target.style.color = "#e8622c"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}>{l.name}</a>
            ))}
          </div>
          {/* Col 4: Contact */}
          <div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase", display: "block", marginBottom: "20px" }}>GET IN TOUCH</span>
            <a href="mailto:hello@nocturnlabs.com" data-hover style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#e8622c", textDecoration: "none", padding: "6px 0", borderBottom: "1px solid rgba(232,98,44,0.15)", marginBottom: "8px" }}>hello@nocturnlabs.com</a>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.9)", display: "block", marginTop: "12px", lineHeight: 1.6 }}>Response within 24 hours</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.9)", display: "block", lineHeight: 1.6 }}>Remote-First / Worldwide</span>
            <a href="#contact" data-hover style={{ display: "inline-block", fontFamily: "'DM Sans', sans-serif", fontSize: "12px", letterSpacing: "2px", color: "#e8622c", textDecoration: "none", textTransform: "uppercase", marginTop: "16px", borderBottom: "1px solid rgba(232,98,44,0.3)", paddingBottom: "4px" }}>Start a Project →</a>
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{ maxWidth: "1400px", margin: "48px auto 0", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.9)" }}>© {new Date().getFullYear()} Nocturn Labs. All rights reserved.</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.9)" }}>·</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.9)", textTransform: "uppercase" }}>Designed by</span>
              <a href="https://nocturnlabs.com" target="_blank" rel="noopener noreferrer" className="nav-logo-link" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#0a0a18", padding: "6px 14px 6px 8px", borderRadius: "20px", boxShadow: "0 4px 12px rgba(15,15,35,0.15)", border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,15,35,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(15,15,35,0.15)"; }}
              >
                <img src="/nocturn-logo.png" alt="Nocturn Labs" className="nav-logo-icon" style={{ width: "36px", height: "36px", objectFit: "contain", flexShrink: 0, filter: "drop-shadow(0 0 6px rgba(240,148,58,0.6))", transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#ffffff", fontWeight: 900, letterSpacing: "0.5px", textShadow: "0 0 8px rgba(240,148,58,0.6), 0 0 20px rgba(232,98,44,0.3)" }}>Nocturn Labs</span>
              </a>
            </div>
          </div>
          <button className="footer-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} data-hover style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#e8622c"; e.currentTarget.style.color = "#e8622c"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>↑</button>
        </div>
      </footer>
    </>
  );
}


// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function AgencySite() {
  const [scrolled, setScrolled] = useState(false);
  const [loadComplete, setLoadComplete] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const { isTouch } = useDeviceDetect();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ids = ["work", "services", "pricing", "contact"];
    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActiveNav(id); }, { rootMargin: "-50% 0px -50% 0px" });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(obs => obs?.disconnect());
  }, []);

  const handleLoadComplete = useCallback(() => {
    setLoadComplete(true);
    setTimeout(() => setHeroReady(true), 300);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Instrument+Serif:ital@0;1&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #080812; color: #e8e4df; overflow-x: hidden; max-width: 100vw; }
        ::selection { background: #e8622c; color: #fff; }
        .nav-logo-link:hover .nav-logo-icon { transform: rotate(-8deg) scale(1.05) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #e8622c; }

        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes loadingBar { 0% { width: 0%; } 100% { width: 100%; } }
        @keyframes pulseRing { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.8); opacity: 0; } }
        @keyframes marqueeLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
        @keyframes marqueeRight { 0% { transform: translateX(-33.333%); } 100% { transform: translateX(0); } }
        @keyframes placeholderMorph { 0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: rotate(0deg); } 50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; transform: rotate(5deg); } }
        @keyframes scaleIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0px) translateX(0px); } 25% { transform: translateY(-15px) translateX(5px); } 50% { transform: translateY(-25px) translateX(-5px); } 75% { transform: translateY(-10px) translateX(8px); } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }

        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.4); }
        @media (pointer: coarse) { * { cursor: auto !important; } }
        @media (pointer: fine) { * { cursor: none !important; } }

        @media (max-width: 1023px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .about-layout { flex-direction: column !important; }
          .about-layout > div:first-child { width: 100% !important; position: static !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .services-header { grid-template-columns: 1fr !important; gap: 32px !important; }
          .contact-layout { grid-template-columns: 1fr !important; gap: 48px !important; }
          .faq-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .process-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .service-item { grid-template-columns: 1fr !important; gap: 12px !important; }
          .service-item p { opacity: 1 !important; max-height: none !important; }
        }
        @media (max-width: 767px) {
          section:not(#work) { padding-left: 20px !important; padding-right: 20px !important; overflow-x: hidden !important; }
          section#work { padding-left: 0 !important; padding-right: 0 !important; }
          footer { padding-left: 20px !important; padding-right: 20px !important; }
          .philosophy-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .process-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .project-row-grid { grid-template-columns: 1fr !important; gap: 12px !important; padding: 0 20px !important; }
          .project-row-grid > *:nth-child(1) { display: none !important; }
          .project-row-grid > *:nth-child(3) { display: none !important; }
          .project-row-grid > *:nth-child(4) { display: none !important; }
          .project-row-grid h3 { font-size: 28px !important; }
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .faq-layout { padding: 0 !important; }
          .faq-layout > div:first-child { position: static !important; }
          .client-logos { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
          .client-logos a { padding: 24px 12px !important; gap: 12px !important; }
          .client-logos img { width: 56px !important; height: 56px !important; }
          .services-header { grid-template-columns: 1fr !important; gap: 24px !important; }
          .about-layout { flex-direction: column !important; }
          .about-layout > div:first-child { width: 100% !important; position: static !important; }
          .contact-layout { grid-template-columns: 1fr !important; gap: 40px !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .service-item { grid-template-columns: 1fr !important; gap: 8px !important; padding: 24px 0 !important; }
          .service-item p { opacity: 1 !important; max-height: none !important; overflow: visible !important; }
          #top { padding: 120px 20px 60px !important; min-height: auto !important; }
          h2 { font-size: clamp(28px, 8vw, 48px) !important; line-height: 1.15 !important; }
          section[style*="padding: "] { padding-top: clamp(60px, 10vw, 100px) !important; padding-bottom: clamp(60px, 10vw, 100px) !important; }
          .footer-top-btn { display: none !important; }
        }
      `}</style>

      <LoadingOverlay onComplete={handleLoadComplete} />
      <ScrollProgressBar />
      <GrainOverlay />
      {!isTouch && <MouseFluidCanvas />}
      {!isTouch && <CustomCursor />}
      <BackToTop />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "100vw" }}>
      <SmoothScrollWrapper enabled={false}>
        <Navbar scrolled={scrolled} activeNav={activeNav} />
        <Hero heroReady={heroReady} />
        <PhilosophyStrip />
        <AwardsMarquee />
        <div style={{ position: "relative" }}>
          <ParallaxText text="WORK" />
          <SpaceGallery />
        </div>

        <AboutSection />
        <div style={{ position: "relative" }}>
          <ParallaxText text="CRAFT" />
          <Services />
        </div>

        <Process />
        <WhyUs />
        <Testimonials />
        <Pricing />
        <div style={{ position: "relative" }}>
          <ParallaxText text="LET'S TALK" />
          <Contact />
        </div>
        <Footer />
      </SmoothScrollWrapper>
      </div>
    </>
  );
}
