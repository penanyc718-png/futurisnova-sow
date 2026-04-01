import { useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #070C18; --ink2: #0C1220; --ink3: #101828;
    --gold: #D4A030; --gold-bright: #F0C060; --gold-dim: rgba(212,160,48,0.15); --gold-line: rgba(212,160,48,0.28);
    --cream: #E8D8B8; --fog: #A8997A; --fog2: #6A5E48;
    --display: 'Cinzel', serif; --serif: 'Cormorant Garamond', serif; --mono: 'DM Mono', monospace;
    --err: #E07060;
  }
  body { background: var(--ink); }
  .sow { background: var(--ink); min-height: 100vh; font-family: var(--serif); color: var(--cream); display: flex; flex-direction: column; }

  /* MODAL */
  .modal-bg { display: none; position: fixed; inset: 0; background: rgba(7,12,24,0.93); z-index: 1000; align-items: center; justify-content: center; padding: 24px; }
  .modal-bg.open { display: flex; }
  .modal { background: var(--ink2); border: 1px solid var(--gold-line); border-radius: 4px; max-width: 520px; width: 100%; padding: 36px; position: relative; max-height: 82vh; overflow-y: auto; }
  .modal-x { position: absolute; top: 16px; right: 20px; background: none; border: none; color: var(--fog); cursor: pointer; font-size: 1.2rem; }
  .modal-eye { font-family: var(--mono); font-size: 0.54rem; font-weight: 600; letter-spacing: 0.18em; color: var(--gold); margin-bottom: 8px; }
  .modal-ttl { font-family: var(--display); font-size: 1.4rem; color: var(--cream); margin-bottom: 16px; }
  .modal-body { font-size: 0.9rem; color: var(--fog); line-height: 1.85; }
  .modal-body p { margin-bottom: 12px; }
  .modal-body strong { color: var(--cream); }
  .modal-btn { margin-top: 24px; font-family: var(--mono); font-size: 0.56rem; font-weight: 600; letter-spacing: 0.12em; background: var(--gold); color: var(--ink); border: none; padding: 11px 24px; border-radius: 2px; cursor: pointer; }

  /* HEADER */
  .sow-header { background: rgba(7,12,24,0.97); border-bottom: 1px solid var(--gold-line); padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
  .sow-brand { display: flex; align-items: center; gap: 12px; }
  .sow-logo { font-family: var(--display); font-size: 0.92rem; letter-spacing: 0.2em; color: var(--gold); }
  .sow-doc-label { font-family: var(--mono); font-size: 0.56rem; letter-spacing: 0.18em; color: var(--fog2); font-weight: 600; }

  /* PROGRESS */
  .sow-progress { padding: 0 40px; background: var(--ink2); border-bottom: 1px solid var(--gold-dim); overflow-x: auto; }
  .sow-steps { display: flex; min-width: max-content; }
  .sow-step { display: flex; align-items: center; gap: 8px; padding: 13px 15px; cursor: pointer; font-family: var(--mono); font-size: 0.5rem; font-weight: 600; letter-spacing: 0.11em; color: var(--fog2); border-bottom: 2px solid transparent; transition: all 0.2s; white-space: nowrap; background: none; border-top: none; border-left: none; border-right: none; }
  .sow-step.done { color: var(--fog); }
  .sow-step.done .step-num { background: var(--gold); color: var(--ink); border-color: var(--gold); }
  .sow-step.active { color: var(--gold-bright); border-bottom-color: var(--gold); }
  .sow-step.active .step-num { background: var(--gold-bright); color: var(--ink); border-color: var(--gold-bright); }
  .step-num { width: 18px; height: 18px; border-radius: 50%; background: var(--ink3); border: 1px solid var(--fog2); display: flex; align-items: center; justify-content: center; font-size: 0.46rem; font-weight: 600; flex-shrink: 0; transition: all 0.2s; }

  /* MAIN */
  .sow-main { max-width: 800px; margin: 0 auto; padding: 48px 32px 80px; flex: 1; width: 100%; }
  .step-eye { font-family: var(--mono); font-size: 0.56rem; font-weight: 600; letter-spacing: 0.2em; color: var(--gold); margin-bottom: 6px; }
  .step-title { font-family: var(--display); font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 600; color: var(--cream); margin-bottom: 8px; }
  .step-desc { font-size: 0.98rem; color: var(--fog); line-height: 1.8; margin-bottom: 36px; max-width: 660px; }
  .divider { height: 1px; background: var(--gold-dim); margin: 26px 0; }
  .sub-label { font-family: var(--mono); font-size: 0.52rem; font-weight: 600; letter-spacing: 0.16em; color: var(--gold); margin-bottom: 12px; margin-top: 4px; }

  /* FIELDS */
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .grid.one { grid-template-columns: 1fr; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field.s2 { grid-column: span 2; }
  .field-label { font-family: var(--mono); font-size: 0.52rem; font-weight: 600; letter-spacing: 0.14em; color: var(--gold); display: flex; align-items: center; gap: 5px; }
  .req { color: var(--err); }
  .fi, .fs, .fta { background: var(--ink2); border: 1px solid rgba(212,160,48,0.2); border-radius: 2px; padding: 11px 14px; font-family: var(--serif); font-size: 0.98rem; color: var(--cream); width: 100%; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .fi::placeholder, .fta::placeholder { color: var(--fog2); }
  .fi:focus, .fs:focus, .fta:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(212,160,48,0.07); }
  .fi.err, .fs.err { border-color: var(--err); }
  .err-msg { font-family: var(--mono); font-size: 0.5rem; font-weight: 600; color: var(--err); letter-spacing: 0.08em; margin-top: 2px; }
  .fs { cursor: pointer; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7' viewBox='0 0 11 7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%23D4A030' stroke-width='1.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 34px; }
  .fs option { background: #0C1220; color: #E8D8B8; }
  .fta { resize: vertical; min-height: 88px; line-height: 1.65; }
  .grid-span { grid-column: span 2; }

  /* INFO BOX */
  .info-box { border-left: 2px solid var(--gold); background: rgba(212,160,48,0.04); padding: 12px 16px; margin-bottom: 18px; border-radius: 0 2px 2px 0; }
  .info-box p { font-size: 0.9rem; color: var(--fog); line-height: 1.7; }
  .info-box strong { color: var(--cream); }

  /* PRICE HINT */
  .price-hint { background: rgba(212,160,48,0.06); border: 1px solid rgba(212,160,48,0.22); border-radius: 2px; padding: 14px 18px; margin-top: 4px; display: flex; gap: 12px; align-items: flex-start; }
  .ph-icon { color: var(--gold); font-size: 1rem; flex-shrink: 0; margin-top: 2px; }
  .ph-label { font-family: var(--mono); font-size: 0.48rem; font-weight: 600; letter-spacing: 0.12em; color: var(--gold); margin-bottom: 4px; }
  .ph-range { font-family: var(--display); font-size: 1.1rem; color: var(--gold-bright); margin-bottom: 4px; }
  .ph-desc { font-size: 0.88rem; color: var(--fog); line-height: 1.6; }
  .ph-apply { font-family: var(--mono); font-size: 0.48rem; font-weight: 600; letter-spacing: 0.1em; color: var(--gold); background: none; border: 1px solid rgba(212,160,48,0.28); border-radius: 2px; padding: 5px 12px; cursor: pointer; margin-top: 8px; transition: all 0.2s; }
  .ph-apply:hover { background: rgba(212,160,48,0.08); }

  /* CHECKBOXES */
  .check-group { display: flex; flex-direction: column; gap: 9px; }
  .check-item { display: flex; align-items: flex-start; gap: 11px; cursor: pointer; font-size: 0.93rem; color: var(--fog); padding: 10px 14px; border: 1px solid rgba(212,160,48,0.12); border-radius: 2px; transition: all 0.2s; background: var(--ink2); line-height: 1.55; user-select: none; }
  .check-item:hover { border-color: rgba(212,160,48,0.26); color: var(--cream); }
  .check-item.on { border-color: rgba(212,160,48,0.42); color: var(--cream); background: rgba(212,160,48,0.04); }
  .check-box { width: 17px; height: 17px; border-radius: 2px; background: var(--ink); border: 1px solid var(--fog2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; transition: all 0.2s; }
  .check-item.on .check-box { background: var(--gold); border-color: var(--gold); }
  .check-tick { color: var(--ink); font-size: 0.64rem; font-weight: 700; display: none; }
  .check-item.on .check-tick { display: block; }

  /* TABLE */
  .t { width: 100%; border-collapse: collapse; }
  .t th { font-family: var(--mono); font-size: 0.48rem; font-weight: 600; letter-spacing: 0.12em; color: var(--gold); padding: 9px 10px; text-align: left; border-bottom: 1px solid rgba(212,160,48,0.18); background: rgba(212,160,48,0.04); }
  .t td { padding: 5px 5px; border-bottom: 1px solid rgba(212,160,48,0.07); vertical-align: top; }
  .ti { background: transparent; border: none; border-bottom: 1px solid rgba(212,160,48,0.17); color: var(--cream); font-family: var(--serif); font-size: 0.92rem; padding: 6px 4px; width: 100%; outline: none; }
  .ti:focus { border-bottom-color: var(--gold); }
  .ti::placeholder { color: var(--fog2); font-style: italic; }
  .ts { background: transparent; border: none; border-bottom: 1px solid rgba(212,160,48,0.17); color: var(--cream); font-family: var(--serif); font-size: 0.92rem; padding: 6px 4px; width: 100%; outline: none; cursor: pointer; appearance: none; -webkit-appearance: none; }
  .ts option { background: #0C1220; }
  .add-row { margin-top: 9px; font-family: var(--mono); font-size: 0.5rem; font-weight: 600; letter-spacing: 0.11em; color: var(--gold); background: none; border: 1px dashed rgba(212,160,48,0.2); border-radius: 2px; padding: 7px 16px; cursor: pointer; transition: all 0.2s; width: 100%; }
  .add-row:hover { background: rgba(212,160,48,0.04); border-color: var(--gold); }
  .rem { background: none; border: none; color: var(--fog2); cursor: pointer; font-size: 0.95rem; padding: 4px 5px; transition: color 0.2s; }
  .rem:hover { color: var(--err); }

  /* PRICING */
  .price-row { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; }
  .price-row .fi { flex: 1; }
  .p-amt { width: 130px; flex-shrink: 0; }
  .total-bar { display: flex; justify-content: space-between; align-items: center; padding: 13px 18px; background: rgba(212,160,48,0.07); border: 1px solid rgba(212,160,48,0.22); border-radius: 2px; margin-top: 14px; }
  .total-label { font-family: var(--mono); font-size: 0.54rem; font-weight: 600; letter-spacing: 0.14em; color: var(--gold); }
  .total-val { font-family: var(--display); font-size: 1.4rem; color: var(--gold-bright); }

  /* KPI */
  .kpi-card { background: var(--ink2); border: 1px solid rgba(212,160,48,0.14); border-radius: 2px; padding: 18px 20px; margin-bottom: 13px; position: relative; }

  /* TERMS */
  .terms-block { background: var(--ink2); border: 1px solid rgba(212,160,48,0.12); border-radius: 2px; padding: 16px 20px; margin-bottom: 12px; }
  .terms-title { font-family: var(--display); font-size: 0.98rem; color: var(--cream); margin-bottom: 6px; }
  .terms-text { font-size: 0.87rem; color: var(--fog); line-height: 1.8; }

  /* SIG */
  .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; margin-top: 8px; }
  .sig-box { background: var(--ink2); border: 1px solid rgba(212,160,48,0.17); border-radius: 2px; padding: 22px; }
  .sig-party { font-family: var(--mono); font-size: 0.5rem; font-weight: 600; letter-spacing: 0.16em; color: var(--gold); margin-bottom: 12px; }
  .sig-name { font-family: var(--display); font-size: 1.05rem; color: var(--cream); margin-bottom: 4px; }
  .sig-role { font-size: 0.88rem; color: var(--fog); margin-bottom: 20px; }
  .sig-line { border-top: 1px solid rgba(212,160,48,0.22); padding-top: 8px; margin-top: 28px; font-family: var(--mono); font-size: 0.48rem; color: var(--fog2); letter-spacing: 0.1em; font-weight: 600; }

  /* REVIEW */
  .review-box { background: var(--ink2); border: 1px solid var(--gold-line); border-radius: 3px; padding: 26px; }
  .review-sec { font-family: var(--display); font-size: 1rem; color: var(--cream); margin: 18px 0 8px; padding-bottom: 5px; border-bottom: 1px solid var(--gold-dim); }
  .review-sec:first-child { margin-top: 0; }
  .review-row { display: flex; gap: 14px; padding: 8px 0; border-bottom: 1px solid rgba(212,160,48,0.06); }
  .review-k { font-family: var(--mono); font-size: 0.48rem; font-weight: 600; letter-spacing: 0.1em; color: var(--gold); width: 155px; flex-shrink: 0; padding-top: 2px; }
  .review-v { font-size: 0.92rem; color: var(--cream); line-height: 1.6; flex: 1; }

  /* NAV */
  .sow-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 44px; padding-top: 22px; border-top: 1px solid var(--gold-dim); }
  .btn-next { font-family: var(--mono); font-size: 0.58rem; font-weight: 600; letter-spacing: 0.14em; color: var(--ink); background: var(--gold); border: none; padding: 13px 28px; border-radius: 2px; cursor: pointer; transition: all 0.2s; }
  .btn-next:hover { background: var(--gold-bright); }
  .btn-back { font-family: var(--mono); font-size: 0.56rem; font-weight: 600; letter-spacing: 0.12em; color: var(--fog); background: transparent; border: 1px solid rgba(212,160,48,0.22); padding: 12px 24px; border-radius: 2px; cursor: pointer; transition: all 0.2s; }
  .btn-back:hover { border-color: var(--gold); color: var(--cream); }

  /* FOOTER */
  .sow-footer { border-top: 1px solid var(--gold-dim); padding: 16px 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .ft-brand { font-family: var(--mono); font-size: 0.5rem; font-weight: 600; letter-spacing: 0.12em; color: var(--fog2); }
  .ft-links { display: flex; gap: 18px; }
  .ft-link { font-family: var(--mono); font-size: 0.5rem; font-weight: 600; letter-spacing: 0.1em; color: var(--fog2); background: none; border: none; cursor: pointer; padding: 0; transition: color 0.2s; text-decoration: none; }
  .ft-link:hover { color: var(--fog); }

  /* SUCCESS */
  .sow-success { text-align: center; padding: 80px 32px; }
  .sc-icon { font-size: 2.2rem; color: var(--gold); margin-bottom: 22px; }
  .sc-title { font-family: var(--display); font-size: 2rem; color: var(--cream); margin-bottom: 12px; }
  .sc-desc { font-size: 0.98rem; color: var(--fog); max-width: 480px; margin: 0 auto 20px; line-height: 1.8; }
  .sc-num { font-family: var(--mono); font-size: 0.68rem; font-weight: 600; color: var(--gold); letter-spacing: 0.14em; margin-bottom: 28px; }
  .sc-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

  @media (max-width: 640px) {
    .grid { grid-template-columns: 1fr; }
    .field.s2 { grid-column: span 1; }
    .grid-span { grid-column: span 1; }
    .sig-grid { grid-template-columns: 1fr; }
    .sow-main { padding: 28px 18px 60px; }
    .sow-header { padding: 16px 20px; }
    .sow-footer { padding: 14px 20px; }
  }
`;

// ── REVISED PRICING — built from scratch, new market rates ──
const PRICING = {
  "Track One — Leadership & Organizational Consulting": {
    "Leadership Diagnostic":            { range: "$1,500 – $2,500",  base: 1500,  desc: "Discovery interviews, leadership assessment, written report, and debrief session." },
    "Leadership Performance Engagement":{ range: "$4,500 – $8,500",  base: 4500,  desc: "Structured engagement with workshops, framework development, and 90-day support." },
    "Organizational Transformation":    { range: "From $12,000",     base: 12000, desc: "Comprehensive multi-phase engagement scoped per organization size and complexity." },
  },
  "Track Two — AI Strategy & Leadership Advisory": {
    "AI Readiness Assessment":  { range: "$1,500 – $2,500",  base: 1500, desc: "Current-state review, gap analysis, and prioritized AI adoption roadmap." },
    "AI Integration Advisory":  { range: "$5,500 – $12,000", base: 5500, desc: "Full strategy, tool selection, workflow integration, and leader enablement." },
    "AI Leadership Workshop":   { range: "$2,500 – $4,500",  base: 2500, desc: "Half or full-day facilitated workshop for senior leaders. Virtual or in person." },
  },
  "Speaking & Workshop Engagement": {
    "Keynote Address":             { range: "$2,500 – $6,000", base: 2500, desc: "Custom keynote tailored to your audience. Up to 60 minutes plus Q&A." },
    "Leadership Workshop":         { range: "$3,500 – $7,500", base: 3500, desc: "Half or full-day interactive workshop with materials and follow-up session." },
    "Panel & Advisory Appearance": { range: "$750 – $2,000",   base: 750,  desc: "Expert panel or advisory participation. Up to 2 hours. Virtual or in person." },
  },
  "Executive Coaching (1:1 or Group)": {
    "Single Session Intensive":            { range: "$250 – $400",    base: 250,  desc: "90-minute focused coaching session with action plan and one-week follow-up access." },
    "Executive Coaching Program (90 days)":{ range: "$2,000 – $3,500", base: 2000, desc: "6 bi-weekly sessions, leadership assessment, resources, and 90-day forward plan." },
    "Monthly Retainer — Essential":        { range: "$900 / month",   base: 900,  desc: "2 sessions per month plus email support. Billed monthly." },
    "Monthly Retainer — Executive":        { range: "$1,800 / month", base: 1800, desc: "4 sessions per month, priority access, and on-demand advisory. Billed monthly." },
    "Monthly Retainer — Enterprise":       { range: "Custom",         base: null, desc: "Group coaching for up to 6 leaders with bi-weekly sessions and strategy access." },
  },
  "Custom / Combined Engagement": {
    "Custom": { range: "Custom", base: null, desc: "Scope and investment determined collaboratively based on your specific needs." },
  },
};

const SERVICE_LANES   = Object.keys(PRICING);
const PAYMENT_TYPES   = ["Project-Based (fixed scope, fixed fee)","Retainer (ongoing monthly)","Per Session / Per Diem","Milestone-Based"];
const PAYMENT_METHODS = ["ACH / Bank Transfer","Wire Transfer","Check","Zelle","PayPal / Venmo (approved)"];
const DELIVERY        = ["In Person","Virtual","Both"];
const CADENCE_OPT     = ["Weekly","Bi-Weekly","Monthly","As Needed"];
const KPI_TYPES       = ["Completion Rate","Participant Satisfaction Score","Leadership Assessment Improvement","Culture Survey Delta","AI Adoption Rate","Custom"];

const STEPS = [
  { id:"client",       label:"Client Info"    },
  { id:"services",     label:"Services"       },
  { id:"deliverables", label:"Deliverables"   },
  { id:"kpis",         label:"KPIs & Success" },
  { id:"governance",   label:"Governance"     },
  { id:"assumptions",  label:"Assumptions"    },
  { id:"investment",   label:"Investment"     },
  { id:"terms",        label:"Terms"          },
  { id:"signatures",   label:"Signatures"     },
  { id:"review",       label:"Review"         },
];

function genSOW() {
  const n = new Date();
  return `FN-SOW-${n.getFullYear()}${String(n.getMonth()+1).padStart(2,"0")}-${Math.floor(Math.random()*9000+1000)}`;
}
function fmt(v) {
  const n = parseFloat(String(v).replace(/[^0-9.]/g,""));
  if (isNaN(n)) return "";
  return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:0}).format(n);
}
function calcTotal(items) {
  return items.reduce((s,i)=>{ const n=parseFloat(String(i.amount).replace(/[^0-9.]/g,"")); return s+(isNaN(n)?0:n); },0);
}

// ── ATOMS ──
function Field({label,required,s2,error,children}) {
  return (
    <div className={`field${s2?" s2":""}`}>
      <label className="field-label">{label.toUpperCase()}{required&&<span className="req"> *</span>}</label>
      {children}
      {error&&<div className="err-msg">{error}</div>}
    </div>
  );
}
function FI({value,onChange,placeholder,type="text",error}) {
  return <input className={`fi${error?" err":""}`} type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>;
}
function FS({value,onChange,options,placeholder,error}) {
  return (
    <select className={`fs${error?" err":""}`} value={value||""} onChange={e=>onChange(e.target.value)}>
      <option value="">{placeholder||"Select..."}</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );
}
function FTA({value,onChange,placeholder,rows=4}) {
  return <textarea className="fta" rows={rows} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>;
}
function Check({label,checked,onChange}) {
  return (
    <div className={`check-item${checked?" on":""}`} onClick={()=>onChange(!checked)}>
      <div className="check-box"><span className="check-tick">✓</span></div>
      <span>{label}</span>
    </div>
  );
}
function PriceHint({lane,pkg,onApply}) {
  if (!lane||!pkg) return null;
  const h = PRICING[lane]?.[pkg];
  if (!h) return null;
  return (
    <div className="price-hint">
      <span className="ph-icon">✦</span>
      <div>
        <div className="ph-label">SUGGESTED INVESTMENT RANGE</div>
        <div className="ph-range">{h.range}</div>
        <div className="ph-desc">{h.desc}</div>
        {h.base&&<button className="ph-apply" onClick={()=>onApply(h.base,pkg)}>APPLY AS STARTING POINT →</button>}
      </div>
    </div>
  );
}

// ── PRIVACY MODAL ──
function PrivacyModal({onClose}) {
  return (
    <div className="modal-bg open" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <button className="modal-x" onClick={onClose}>×</button>
        <div className="modal-eye">DATA PRIVACY & SECURITY</div>
        <div className="modal-ttl">How We Handle Your Information</div>
        <div className="modal-body">
          <p><strong>What we collect.</strong> Only the information you provide to generate your Statement of Work. Nothing else.</p>
          <p><strong>How it is protected.</strong> This application runs entirely in your browser. No data is transmitted to external servers without your explicit action. All connections are secured via HTTPS with TLS encryption.</p>
          <p><strong>What we do not do.</strong> Futuris Nova LLC does not sell, share, or distribute your information to any third party. We do not use your data for marketing without consent.</p>
          <p><strong>Confidentiality.</strong> All information shared is treated as confidential per the terms outlined in your Statement of Work.</p>
          <p><strong>Your rights.</strong> You may request deletion of any data at any time by contacting connect@futurisnova.com.</p>
          <p style={{fontSize:"0.82rem",marginTop:14,color:"#6A5E48"}}>Futuris Nova LLC · California · connect@futurisnova.com</p>
        </div>
        <button className="modal-btn" onClick={onClose}>UNDERSTOOD</button>
      </div>
    </div>
  );
}

// ── STEPS ──
function S1({d,s,e}) {
  return <>
    <div className="step-eye">STEP 01</div>
    <div className="step-title">Client Information</div>
    <p className="step-desc">Enter the details of the client organization and primary point of contact for this engagement.</p>
    <div className="grid">
      <Field label="Client Name" required s2 error={e.clientName}><FI value={d.clientName} onChange={v=>s("clientName",v)} placeholder="Full legal name or organization" error={!!e.clientName}/></Field>
      <Field label="Organization"><FI value={d.org} onChange={v=>s("org",v)} placeholder="Organization name"/></Field>
      <Field label="Client Title / Role"><FI value={d.clientTitle} onChange={v=>s("clientTitle",v)} placeholder="e.g. CEO, Commanding Officer"/></Field>
      <Field label="Contact Email" required error={e.email}><FI value={d.email} onChange={v=>s("email",v)} placeholder="name@org.com" type="email" error={!!e.email}/></Field>
      <Field label="Phone"><FI value={d.phone} onChange={v=>s("phone",v)} placeholder="(000) 000-0000"/></Field>
      <Field label="Organization Type"><FS value={d.orgType} onChange={v=>s("orgType",v)} options={["Military Unit / Command","Corporate Organization","Government Agency","Nonprofit / Veteran Org","Individual / Executive","Other"]} placeholder="Select type"/></Field>
      <Field label="City / State"><FI value={d.location} onChange={v=>s("location",v)} placeholder="City, State"/></Field>
      <div className="divider grid-span"/>
      <Field label="SOW Date" required error={e.sowDate}><FI value={d.sowDate} onChange={v=>s("sowDate",v)} type="date" error={!!e.sowDate}/></Field>
      <Field label="SOW Reference Number"><FI value={d.sowNumber} onChange={v=>s("sowNumber",v)} placeholder={d._auto}/></Field>
    </div>
  </>;
}

function S2({d,s,e}) {
  const pkgs = d.lane ? Object.keys(PRICING[d.lane]||{}) : [];
  return <>
    <div className="step-eye">STEP 02</div>
    <div className="step-title">Services & Scope</div>
    <p className="step-desc">Select the service lane, engagement package, and delivery mode. Define scope and client responsibilities.</p>
    <div className="grid">
      <Field label="Service Lane" required s2 error={e.lane}><FS value={d.lane} onChange={v=>{s("lane",v);s("package","");}} options={SERVICE_LANES} placeholder="Select service lane" error={!!e.lane}/></Field>
      {d.lane&&<Field label="Package / Engagement Type" required s2 error={e.package}><FS value={d.package} onChange={v=>s("package",v)} options={pkgs} placeholder="Select package" error={!!e.package}/></Field>}
      {d.lane&&d.package&&<div className="field s2"><PriceHint lane={d.lane} pkg={d.package} onApply={(base,name)=>s("_ph",{base,name})}/></div>}
      <Field label="Delivery Mode" required error={e.delivery}><FS value={d.delivery} onChange={v=>s("delivery",v)} options={DELIVERY} placeholder="Select" error={!!e.delivery}/></Field>
      <Field label="Estimated Duration"><FI value={d.duration} onChange={v=>s("duration",v)} placeholder="e.g. 90 days, 6 weeks"/></Field>
      <Field label="Start Date"><FI value={d.startDate} onChange={v=>s("startDate",v)} type="date"/></Field>
      <Field label="Target Completion"><FI value={d.endDate} onChange={v=>s("endDate",v)} type="date"/></Field>
      <Field label="Scope of Work" required s2 error={e.scopeDesc}><FTA value={d.scopeDesc} onChange={v=>s("scopeDesc",v)} placeholder="Describe the specific work to be performed, sessions, workshops, advisory activities, and key objectives..." rows={5}/></Field>
      <Field label="Out of Scope (optional)" s2><FTA value={d.outOfScope} onChange={v=>s("outOfScope",v)} placeholder="List anything explicitly excluded..." rows={3}/></Field>
    </div>
    <div className="divider"/>
    <div className="sub-label">CLIENT RESPONSIBILITIES</div>
    <div className="check-group">
      {["Client will designate a primary point of contact","Client will provide timely access to relevant personnel and information","Client will review deliverables within 5 business days of receipt","Client leadership will be available for all scheduled sessions"].map((item,i)=>(
        <Check key={i} label={item} checked={(d.resp||[]).includes(item)} onChange={c=>{const x=d.resp||[];s("resp",c?[...x,item]:x.filter(v=>v!==item));}}/>
      ))}
    </div>
  </>;
}

function S3({d,s}) {
  const rows=d.rows||[{del:"",fmt:"",due:"",acc:""}];
  const ur=(i,k,v)=>s("rows",rows.map((r,idx)=>idx===i?{...r,[k]:v}:r));
  const phases=d.phases||[{phase:"",date:"",notes:""}];
  const up=(i,k,v)=>s("phases",phases.map((r,idx)=>idx===i?{...r,[k]:v}:r));
  return <>
    <div className="step-eye">STEP 03</div>
    <div className="step-title">Deliverables & Timeline</div>
    <p className="step-desc">Define what Futuris Nova will deliver, acceptance criteria for each item, and key engagement milestones.</p>
    <div className="info-box"><p><strong>Acceptance Criteria</strong> — Define what "done and approved" looks like for each deliverable. This protects both parties at closeout.</p></div>
    <div className="sub-label">DELIVERABLES & ACCEPTANCE CRITERIA</div>
    <table className="t">
      <thead><tr><th style={{width:"26%"}}>Deliverable</th><th style={{width:"16%"}}>Format</th><th style={{width:"15%"}}>Due Date</th><th style={{width:"37%"}}>Acceptance Criteria</th><th style={{width:"6%"}}></th></tr></thead>
      <tbody>{rows.map((r,i)=>(
        <tr key={i}>
          <td><input className="ti" value={r.del} onChange={e=>ur(i,"del",e.target.value)} placeholder="e.g. Leadership Report"/></td>
          <td><input className="ti" value={r.fmt} onChange={e=>ur(i,"fmt",e.target.value)} placeholder="PDF, Session..."/></td>
          <td><input className="ti" type="date" value={r.due} onChange={e=>ur(i,"due",e.target.value)}/></td>
          <td><input className="ti" value={r.acc} onChange={e=>ur(i,"acc",e.target.value)} placeholder="e.g. Written approval within 5 days"/></td>
          <td>{rows.length>1&&<button className="rem" onClick={()=>s("rows",rows.filter((_,idx)=>idx!==i))}>×</button>}</td>
        </tr>
      ))}</tbody>
    </table>
    <button className="add-row" onClick={()=>s("rows",[...rows,{del:"",fmt:"",due:"",acc:""}])}>+ ADD DELIVERABLE</button>
    <div className="divider"/>
    <div className="sub-label">ENGAGEMENT TIMELINE</div>
    <table className="t">
      <thead><tr><th style={{width:"36%"}}>Phase / Milestone</th><th style={{width:"22%"}}>Target Date</th><th style={{width:"36%"}}>Notes</th><th style={{width:"6%"}}></th></tr></thead>
      <tbody>{phases.map((r,i)=>(
        <tr key={i}>
          <td><input className="ti" value={r.phase} onChange={e=>up(i,"phase",e.target.value)} placeholder="e.g. Kickoff / Discovery"/></td>
          <td><input className="ti" type="date" value={r.date} onChange={e=>up(i,"date",e.target.value)}/></td>
          <td><input className="ti" value={r.notes} onChange={e=>up(i,"notes",e.target.value)} placeholder="Notes..."/></td>
          <td>{phases.length>1&&<button className="rem" onClick={()=>s("phases",phases.filter((_,idx)=>idx!==i))}>×</button>}</td>
        </tr>
      ))}</tbody>
    </table>
    <button className="add-row" onClick={()=>s("phases",[...phases,{phase:"",date:"",notes:""}])}>+ ADD MILESTONE</button>
  </>;
}

function S4({d,s}) {
  const kpis=d.kpis||[{metric:"",def:"",base:"",target:"",cadence:"",method:""}];
  const uk=(i,k,v)=>s("kpis",kpis.map((r,idx)=>idx===i?{...r,[k]:v}:r));
  return <>
    <div className="step-eye">STEP 04</div>
    <div className="step-title">KPIs & Success Metrics</div>
    <p className="step-desc">Define how success will be measured. Strong engagements set measurable outcomes upfront so both parties know what winning looks like.</p>
    <div className="info-box"><p><strong>Why this matters.</strong> KPIs turn deliverables into outcomes. Without them, success is subjective. With them, the value of this engagement is undeniable.</p></div>
    {kpis.map((k,i)=>(
      <div key={i} className="kpi-card">
        {kpis.length>1&&<button className="rem" style={{position:"absolute",top:10,right:10}} onClick={()=>s("kpis",kpis.filter((_,idx)=>idx!==i))}>×</button>}
        <div className="grid" style={{gap:14}}>
          <Field label="Metric / KPI"><FS value={k.metric} onChange={v=>uk(i,"metric",v)} options={KPI_TYPES} placeholder="Select metric type"/></Field>
          <Field label="Reporting Cadence"><FS value={k.cadence} onChange={v=>uk(i,"cadence",v)} options={CADENCE_OPT} placeholder="Select cadence"/></Field>
          <Field label="Definition" s2><FTA value={k.def} onChange={v=>uk(i,"def",v)} placeholder="How is this metric defined? What does it measure?" rows={2}/></Field>
          <Field label="Baseline (Current State)"><FI value={k.base} onChange={v=>uk(i,"base",v)} placeholder="e.g. 62% satisfaction"/></Field>
          <Field label="Target (End State)"><FI value={k.target} onChange={v=>uk(i,"target",v)} placeholder="e.g. 80% satisfaction"/></Field>
          <Field label="Measurement Method" s2><FI value={k.method} onChange={v=>uk(i,"method",v)} placeholder="e.g. Post-session survey, 360 assessment"/></Field>
        </div>
      </div>
    ))}
    <button className="add-row" onClick={()=>s("kpis",[...kpis,{metric:"",def:"",base:"",target:"",cadence:"",method:""}])}>+ ADD KPI</button>
    <div className="divider"/>
    <div className="sub-label">OVERALL SUCCESS DEFINITION</div>
    <div className="grid one"><Field label="How will overall success be defined?"><FTA value={d.successDef} onChange={v=>s("successDef",v)} placeholder="Describe what a successful outcome looks like for this client. What changes? What improves?" rows={4}/></Field></div>
  </>;
}

function S5({d,s}) {
  const contacts=d.contacts||[{name:"Alberto Pena",role:"Engagement Lead",email:"connect@futurisnova.com",auth:"Approve Deliverables",org:"Futuris Nova LLC"}];
  const uc=(i,k,v)=>s("contacts",contacts.map((r,idx)=>idx===i?{...r,[k]:v}:r));
  return <>
    <div className="step-eye">STEP 05</div>
    <div className="step-title">Governance & Oversight</div>
    <p className="step-desc">Define the working structure — meeting cadence, decision rights, escalation path, and change control process.</p>
    <div className="sub-label">MEETING CADENCE</div>
    <div className="grid" style={{marginBottom:24}}>
      <Field label="Check-In Frequency"><FS value={d.cadence} onChange={v=>s("cadence",v)} options={CADENCE_OPT} placeholder="Select frequency"/></Field>
      <Field label="Meeting Format"><FS value={d.meetFmt} onChange={v=>s("meetFmt",v)} options={["Virtual","In Person","Both"]} placeholder="Select format"/></Field>
      <Field label="Agenda Owner"><FS value={d.agendaOwner} onChange={v=>s("agendaOwner",v)} options={["Futuris Nova LLC","Client","Shared"]} placeholder="Who sets the agenda?"/></Field>
      <Field label="Notes Owner"><FS value={d.notesOwner} onChange={v=>s("notesOwner",v)} options={["Futuris Nova LLC","Client","Shared"]} placeholder="Who documents notes?"/></Field>
    </div>
    <div className="sub-label">KEY CONTACTS & DECISION RIGHTS</div>
    <div className="info-box" style={{marginBottom:16}}><p><strong>Decision Rights</strong> — Identify who is authorized to approve deliverables, request changes, and escalate issues.</p></div>
    {contacts.map((c,i)=>(
      <div key={i} className="kpi-card">
        {contacts.length>1&&<button className="rem" style={{position:"absolute",top:10,right:10}} onClick={()=>s("contacts",contacts.filter((_,idx)=>idx!==i))}>×</button>}
        <div className="grid" style={{gap:12}}>
          <Field label="Name"><FI value={c.name} onChange={v=>uc(i,"name",v)} placeholder="Full name"/></Field>
          <Field label="Organization"><FS value={c.org} onChange={v=>uc(i,"org",v)} options={["Futuris Nova LLC","Client"]} placeholder="Which side?"/></Field>
          <Field label="Role / Title"><FI value={c.role} onChange={v=>uc(i,"role",v)} placeholder="e.g. Primary POC, Executive Sponsor"/></Field>
          <Field label="Decision Authority"><FS value={c.auth} onChange={v=>uc(i,"auth",v)} options={["Approve Deliverables","Approve Scope Changes","Escalation Contact","Observer / Informed"]} placeholder="Select authority"/></Field>
          <Field label="Email" s2><FI value={c.email} onChange={v=>uc(i,"email",v)} placeholder="contact@org.com" type="email"/></Field>
        </div>
      </div>
    ))}
    <button className="add-row" onClick={()=>s("contacts",[...contacts,{name:"",role:"",email:"",auth:"",org:""}])}>+ ADD CONTACT</button>
    <div className="divider"/>
    <div className="sub-label">ESCALATION PATH</div>
    <div className="grid" style={{marginBottom:24}}>
      <Field label="Client Escalation Contact"><FI value={d.clientEsc} onChange={v=>s("clientEsc",v)} placeholder="Name and title"/></Field>
      <Field label="Futuris Nova Escalation"><FI value={d.fnEsc} onChange={v=>s("fnEsc",v)} placeholder="Alberto Pena, Founder & CEO"/></Field>
      <Field label="Escalation Process" s2><FTA value={d.escProcess} onChange={v=>s("escProcess",v)} placeholder="How issues are raised, response timeframe, and resolution steps..." rows={3}/></Field>
    </div>
    <div className="sub-label">CHANGE ORDER PROCESS</div>
    <div className="info-box" style={{marginBottom:16}}><p><strong>Change Control</strong> — Any request to modify scope, timeline, or deliverables must follow this process. Undocumented changes are not binding on Futuris Nova LLC.</p></div>
    <div className="grid">
      <Field label="Who Can Request Changes"><FS value={d.changeReq} onChange={v=>s("changeReq",v)} options={["Client Only","Futuris Nova Only","Either Party"]} placeholder="Select"/></Field>
      <Field label="Approval Required From"><FS value={d.changeAppr} onChange={v=>s("changeAppr",v)} options={["Both Parties (written)","Client POC Only","Alberto Pena Only"]} placeholder="Select"/></Field>
      <Field label="Turnaround Time"><FS value={d.changeTurn} onChange={v=>s("changeTurn",v)} options={["3 Business Days","5 Business Days","7 Business Days","Per Request"]} placeholder="Select"/></Field>
      <Field label="Change Pricing Method"><FS value={d.changePrice} onChange={v=>s("changePrice",v)} options={["Fixed Rate Per Hour","Fixed Rate Per Day","Mutually Agreed","Included Up to 10% Variance"]} placeholder="Select"/></Field>
    </div>
  </>;
}

function S6({d,s}) {
  const assum=d.assum||[{val:""}];
  const deps=d.deps||[{dep:"",owner:""}];
  return <>
    <div className="step-eye">STEP 06</div>
    <div className="step-title">Assumptions & Dependencies</div>
    <p className="step-desc">Document the assumptions Futuris Nova is operating under and the dependencies required to deliver successfully.</p>
    <div className="info-box"><p><strong>Why this matters.</strong> If an assumption proves false or a dependency is not met, scope or pricing may need to be renegotiated. Documenting these protects both parties.</p></div>
    <div className="sub-label">FUTURIS NOVA ASSUMPTIONS</div>
    {assum.map((a,i)=>(
      <div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"center"}}>
        <input className="fi" style={{flex:1}} value={a.val} onChange={e=>s("assum",assum.map((r,idx)=>idx===i?{val:e.target.value}:r))} placeholder={`Assumption ${i+1}: e.g. Client leadership will attend all scheduled sessions`}/>
        {assum.length>1&&<button className="rem" onClick={()=>s("assum",assum.filter((_,idx)=>idx!==i))}>×</button>}
      </div>
    ))}
    <button className="add-row" onClick={()=>s("assum",[...assum,{val:""}])}>+ ADD ASSUMPTION</button>
    <div className="divider"/>
    <div className="sub-label">DEPENDENCIES</div>
    <table className="t">
      <thead><tr><th style={{width:"62%"}}>Dependency</th><th style={{width:"32%"}}>Owner</th><th style={{width:"6%"}}></th></tr></thead>
      <tbody>{deps.map((dep,i)=>(
        <tr key={i}>
          <td><input className="ti" value={dep.dep} onChange={e=>s("deps",deps.map((r,idx)=>idx===i?{...r,dep:e.target.value}:r))} placeholder="e.g. Access to leadership team for interviews"/></td>
          <td>
            <select className="ts" value={dep.owner} onChange={e=>s("deps",deps.map((r,idx)=>idx===i?{...r,owner:e.target.value}:r))}>
              <option value="">Select...</option>
              <option value="Client">Client</option>
              <option value="Futuris Nova LLC">Futuris Nova LLC</option>
              <option value="Shared">Shared</option>
            </select>
          </td>
          <td>{deps.length>1&&<button className="rem" onClick={()=>s("deps",deps.filter((_,idx)=>idx!==i))}>×</button>}</td>
        </tr>
      ))}</tbody>
    </table>
    <button className="add-row" onClick={()=>s("deps",[...deps,{dep:"",owner:""}])}>+ ADD DEPENDENCY</button>
    <div className="divider"/>
    <div className="sub-label">NON-SOLICITATION</div>
    <div className="info-box"><p><strong>Standard Terms.</strong> During this engagement and for the selected period following its conclusion, neither party shall directly solicit or hire the other party's personnel actively involved in this engagement without prior written consent.</p></div>
    <div className="grid">
      <Field label="Non-Solicitation Period"><FS value={d.nsPeriod} onChange={v=>s("nsPeriod",v)} options={["6 Months","12 Months","18 Months","24 Months"]} placeholder="Select period"/></Field>
      <Field label="Scope"><FS value={d.nsScope} onChange={v=>s("nsScope",v)} options={["Both Parties","Client Only","Futuris Nova Only"]} placeholder="Select scope"/></Field>
      <Field label="Additional Terms (optional)" s2><FTA value={d.nsNotes} onChange={v=>s("nsNotes",v)} placeholder="Any exceptions or additional terms..." rows={2}/></Field>
    </div>
  </>;
}

function S7({d,s,svc}) {
  const hint = svc.lane&&svc.package ? PRICING[svc.lane]?.[svc.package] : null;
  const li=d.li||[{desc:"",amount:""}];
  const ul=(i,k,v)=>s("li",li.map((r,idx)=>idx===i?{...r,[k]:v}:r));
  const total=calcTotal(li);
  useEffect(()=>{
    if(svc._ph?.base){
      const only=li.length===1&&!li[0].desc&&!li[0].amount;
      if(only) s("li",[{desc:svc._ph.name,amount:String(svc._ph.base)}]);
    }
  },[svc._ph]);
  return <>
    <div className="step-eye">STEP 07</div>
    <div className="step-title">Investment & Payment</div>
    <p className="step-desc">Define the total investment and payment structure for this engagement.</p>
    {hint&&<div style={{marginBottom:24}}><PriceHint lane={svc.lane} pkg={svc.package} onApply={(base,name)=>s("li",[{desc:name,amount:String(base)}])}/></div>}
    <div className="grid">
      <Field label="Engagement Type" required><FS value={d.payType} onChange={v=>s("payType",v)} options={PAYMENT_TYPES} placeholder="Select type"/></Field>
      <Field label="Preferred Payment Method"><FS value={d.payMethod} onChange={v=>s("payMethod",v)} options={PAYMENT_METHODS} placeholder="Select method"/></Field>
    </div>
    <div className="divider"/>
    <div className="sub-label">LINE ITEMS</div>
    {li.map((item,i)=>(
      <div key={i} className="price-row">
        <input className="fi" value={item.desc} onChange={e=>ul(i,"desc",e.target.value)} placeholder="Service description..."/>
        <input className="fi p-amt" value={item.amount} onChange={e=>ul(i,"amount",e.target.value)} placeholder="$0"/>
        {li.length>1&&<button className="rem" onClick={()=>s("li",li.filter((_,idx)=>idx!==i))}>×</button>}
      </div>
    ))}
    <button className="add-row" onClick={()=>s("li",[...li,{desc:"",amount:""}])}>+ ADD LINE ITEM</button>
    {total>0&&<div className="total-bar"><span className="total-label">TOTAL INVESTMENT</span><span className="total-val">{fmt(total)}</span></div>}
    <div className="divider"/>
    <div className="sub-label">PAYMENT SCHEDULE</div>
    <div className="check-group">
      {["50% deposit due upon execution of this agreement","Remaining balance due upon final deliverable","Milestone-based payment schedule","Monthly retainer billed on the 1st of each month"].map((item,i)=>(
        <Check key={i} label={item} checked={(d.paySched||[]).includes(item)} onChange={c=>{const x=d.paySched||[];s("paySched",c?[...x,item]:x.filter(v=>v!==item));}}/>
      ))}
    </div>
    <div className="grid" style={{marginTop:20}}>
      <Field label="Expenses Policy"><FS value={d.expenses} onChange={v=>s("expenses",v)} options={["No expenses — all inclusive","Pre-approved expenses billed at cost","Expenses billed at cost plus 10%","Expenses included up to $500","To be agreed separately"]} placeholder="Select policy"/></Field>
      <Field label="Invoice Terms"><FS value={d.invoiceTerms} onChange={v=>s("invoiceTerms",v)} options={["Net 15","Net 30","Net 45","Due on Receipt"]} placeholder="Select terms"/></Field>
      <Field label="Late Payment Fee"><FS value={d.lateFee} onChange={v=>s("lateFee",v)} options={["1.5% per month after 15 days","2% per month after 30 days","No late fee","To be agreed"]} placeholder="Select"/></Field>
      <Field label="Additional Payment Notes"><FTA value={d.payNotes} onChange={v=>s("payNotes",v)} placeholder="Any specific terms or exceptions..." rows={2}/></Field>
    </div>
  </>;
}

function S8({d,s,e}) {
  const terms=[
    {t:"Confidentiality",b:"Both parties agree to maintain the confidentiality of all proprietary information shared during this engagement. Futuris Nova LLC will not disclose client information to third parties without written consent. This obligation survives termination of this agreement."},
    {t:"Intellectual Property",b:"All frameworks, tools, methodologies, and original content developed by Futuris Nova LLC prior to or independent of this engagement remain the sole property of Futuris Nova LLC. Deliverables created specifically for the Client under this SOW are transferred to the Client upon receipt of full payment."},
    {t:"Non-Solicitation",b:"During this engagement and for the period defined in Step 06, neither party shall directly solicit, recruit, or hire the other party's personnel actively involved in this engagement without prior written consent."},
    {t:"Modifications to Scope",b:"Any changes to scope, timeline, or deliverables must follow the change order process defined in Step 05 and be agreed upon in writing. Undocumented changes are not binding on Futuris Nova LLC."},
    {t:"Cancellation Policy",b:"14 or more days notice: deposit fully refundable. 7 to 13 days notice: 50% of deposit retained. Less than 7 days notice: deposit non-refundable. Futuris Nova LLC reserves the right to cancel due to non-payment or breach of terms."},
    {t:"Warranties",b:"Futuris Nova LLC warrants that services will be performed in a professional manner consistent with industry standards. Futuris Nova LLC does not warrant specific business outcomes, as results depend on client implementation and organizational factors beyond its control."},
    {t:"Limitation of Liability",b:"Futuris Nova LLC total liability under this agreement shall not exceed the total fees paid by the Client. Futuris Nova LLC is not liable for indirect, consequential, or incidental damages."},
    {t:"Governing Law",b:"This Statement of Work shall be governed by the laws of the State of California. Any disputes shall be resolved through binding arbitration in California before initiating any legal action."},
  ];
  return <>
    <div className="step-eye">STEP 08</div>
    <div className="step-title">Terms & Conditions</div>
    <p className="step-desc">Standard Futuris Nova LLC engagement terms. Review each section carefully and confirm acceptance below.</p>
    {terms.map((t,i)=><div key={i} className="terms-block"><div className="terms-title">{t.t}</div><div className="terms-text">{t.b}</div></div>)}
    <div className="divider"/>
    <div className="grid one"><Field label="Special Conditions or Amendments"><FTA value={d.special} onChange={v=>s("special",v)} placeholder="Any client-specific conditions or amendments..." rows={4}/></Field></div>
    <div style={{marginTop:16}}>
      <Check label="I have read, understood, and agree to the standard terms and conditions above." checked={d.accepted} onChange={v=>s("accepted",v)}/>
      {e.accepted&&<div className="err-msg" style={{marginTop:8}}>{e.accepted}</div>}
    </div>
  </>;
}

function S9({d,s,e}) {
  return <>
    <div className="step-eye">STEP 09</div>
    <div className="step-title">Authorization & Signatures</div>
    <p className="step-desc">Both parties confirm agreement to the full terms, scope, governance, and investment outlined in this Statement of Work.</p>
    <div className="sig-grid">
      <div className="sig-box">
        <div className="sig-party">FUTURIS NOVA LLC</div>
        <div className="sig-name">Alberto Pena</div>
        <div className="sig-role">Founder & CEO</div>
        <div className="grid one" style={{gap:14}}><Field label="Signature Date"><FI value={d.fnDate} onChange={v=>s("fnDate",v)} type="date"/></Field></div>
        <div className="sig-line">AUTHORIZED SIGNATORY</div>
      </div>
      <div className="sig-box">
        <div className="sig-party">CLIENT</div>
        <div className="grid one" style={{gap:14}}>
          <Field label="Printed Name" required error={e.sigName}><FI value={d.sigName} onChange={v=>s("sigName",v)} placeholder="Full name" error={!!e.sigName}/></Field>
          <Field label="Title / Role"><FI value={d.sigTitle} onChange={v=>s("sigTitle",v)} placeholder="e.g. CEO, Director"/></Field>
          <Field label="Signature Date"><FI value={d.sigDate} onChange={v=>s("sigDate",v)} type="date"/></Field>
        </div>
        <div className="sig-line">AUTHORIZED SIGNATORY</div>
      </div>
    </div>
  </>;
}

function S10({c,svc,del,kpi,gov,assum,inv,sig}) {
  const total=calcTotal(inv.li||[]);
  const R=({k,v})=>v?<div className="review-row"><div className="review-k">{k}</div><div className="review-v">{v}</div></div>:null;
  return <>
    <div className="step-eye">STEP 10</div>
    <div className="step-title">Review & Confirm</div>
    <p className="step-desc">Review the complete Statement of Work before finalizing.</p>
    <div className="review-box">
      <div className="review-sec">Client Details</div>
      <R k="Client" v={c.clientName}/><R k="Organization" v={c.org}/><R k="Email" v={c.email}/><R k="Type" v={c.orgType}/><R k="SOW Date" v={c.sowDate}/><R k="SOW Number" v={c.sowNumber||c._auto}/>
      <div className="review-sec">Services & Scope</div>
      <R k="Lane" v={svc.lane}/><R k="Package" v={svc.package}/><R k="Delivery" v={svc.delivery}/><R k="Duration" v={svc.duration}/><R k="Scope" v={svc.scopeDesc}/>
      <div className="review-sec">KPIs & Success</div>
      <R k="Success Definition" v={kpi.successDef}/>
      {(kpi.kpis||[]).map((k,i)=>k.metric?<R key={i} k={`KPI ${i+1}`} v={`${k.metric}${k.target?" — Target: "+k.target:""}`}/>:null)}
      <div className="review-sec">Governance</div>
      <R k="Cadence" v={gov.cadence}/><R k="Change Approver" v={gov.changeAppr}/><R k="Escalation (Client)" v={gov.clientEsc}/>
      <div className="review-sec">Assumptions</div>
      {(assum.assum||[]).map((a,i)=>a.val?<R key={i} k={`Assumption ${i+1}`} v={a.val}/>:null)}
      <R k="Non-Solicitation" v={assum.nsPeriod?`${assum.nsPeriod} — ${assum.nsScope||"Both Parties"}`:null}/>
      <div className="review-sec">Investment</div>
      <R k="Type" v={inv.payType}/><R k="Method" v={inv.payMethod}/><R k="Total" v={total>0?fmt(total):"—"}/><R k="Invoice Terms" v={inv.invoiceTerms}/><R k="Expenses" v={inv.expenses}/>
      <div className="review-sec">Signatories</div>
      <R k="Futuris Nova" v="Alberto Pena, Founder & CEO"/><R k="Client" v={sig.sigName}/><R k="Client Title" v={sig.sigTitle}/>
    </div>
  </>;
}

// ── VALIDATION ──
function validate(step,c,svc,terms,sig) {
  const e={};
  if(step===0){
    if(!c.clientName?.trim()) e.clientName="Required";
    if(!c.email?.trim()) e.email="Required";
    else if(!/\S+@\S+\.\S+/.test(c.email)) e.email="Enter a valid email";
    if(!c.sowDate) e.sowDate="Required";
  }
  if(step===1){
    if(!svc.lane) e.lane="Select a service lane";
    if(svc.lane&&!svc.package) e.package="Select a package";
    if(!svc.delivery) e.delivery="Required";
    if(!svc.scopeDesc?.trim()) e.scopeDesc="Scope description is required";
  }
  if(step===7){ if(!terms.accepted) e.accepted="You must accept the terms to proceed"; }
  if(step===8){ if(!sig.sigName?.trim()) e.sigName="Required"; }
  return e;
}

// ── APP ──
export default function DigitalSOW() {
  const [step,setStep]=useState(0);
  const [submitted,setSubmitted]=useState(false);
  const [showPrivacy,setShowPrivacy]=useState(false);
  const [errors,setErrors]=useState({});
  const [autoSOW]=useState(genSOW);

  const [c,setCR]=useState({_auto:autoSOW,sowDate:new Date().toISOString().slice(0,10)});
  const [svc,setSvcR]=useState({resp:[]});
  const [del,setDelR]=useState({rows:[{del:"",fmt:"",due:"",acc:""}],phases:[{phase:"Kickoff / Discovery",date:"",notes:""}]});
  const [kpi,setKpiR]=useState({kpis:[{metric:"",def:"",base:"",target:"",cadence:"",method:""}]});
  const [gov,setGovR]=useState({contacts:[{name:"Alberto Pena",role:"Engagement Lead",email:"connect@futurisnova.com",auth:"Approve Deliverables",org:"Futuris Nova LLC"}]});
  const [assum,setAssumR]=useState({assum:[{val:""}],deps:[{dep:"",owner:""}]});
  const [inv,setInvR]=useState({li:[{desc:"",amount:""}],paySched:[]});
  const [terms,setTermsR]=useState({});
  const [sig,setSigR]=useState({fnDate:new Date().toISOString().slice(0,10)});

  const sc=(k,v)=>setCR(p=>({...p,[k]:v}));
  const ss=(k,v)=>setSvcR(p=>({...p,[k]:v}));
  const sd=(k,v)=>setDelR(p=>({...p,[k]:v}));
  const sk=(k,v)=>setKpiR(p=>({...p,[k]:v}));
  const sg=(k,v)=>setGovR(p=>({...p,[k]:v}));
  const sa=(k,v)=>setAssumR(p=>({...p,[k]:v}));
  const si=(k,v)=>setInvR(p=>({...p,[k]:v}));
  const st=(k,v)=>setTermsR(p=>({...p,[k]:v}));
  const sx=(k,v)=>setSigR(p=>({...p,[k]:v}));

  const tryNext=()=>{
    const e=validate(step,c,svc,terms,sig);
    if(Object.keys(e).length>0){setErrors(e);return;}
    setErrors({});
    if(step<STEPS.length-1) setStep(s=>s+1);
    else setSubmitted(true);
  };

  const panels=[
    <S1 d={c} s={sc} e={errors}/>,
    <S2 d={svc} s={ss} e={errors}/>,
    <S3 d={del} s={sd}/>,
    <S4 d={kpi} s={sk}/>,
    <S5 d={gov} s={sg}/>,
    <S6 d={assum} s={sa}/>,
    <S7 d={inv} s={si} svc={svc}/>,
    <S8 d={terms} s={st} e={errors}/>,
    <S9 d={sig} s={sx} e={errors}/>,
    <S10 c={c} svc={svc} del={del} kpi={kpi} gov={gov} assum={assum} inv={inv} sig={sig}/>,
  ];

  if(submitted) return (
    <>
      <style>{css}</style>
      <div className="sow">
        <div className="sow-success">
          <div className="sc-icon">✦</div>
          <div className="sc-title">Statement of Work Complete</div>
          <p className="sc-desc">Your SOW has been finalized. Send to your client for countersignature and retain a copy for your records.</p>
          <div className="sc-num">{c.sowNumber||autoSOW}</div>
          <div className="sc-btns">
            <button className="btn-back" onClick={()=>{setSubmitted(false);setStep(0);}}>START NEW SOW</button>
            <button className="btn-next" onClick={()=>window.print()}>PRINT / SAVE PDF</button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      {showPrivacy&&<PrivacyModal onClose={()=>setShowPrivacy(false)}/>}
      <div className="sow">

        <header className="sow-header">
          <div className="sow-brand">
            <svg width="26" height="30" viewBox="0 0 28 32" fill="none">
              <path d="M14 2L2 7v10c0 7 5 12 12 14 7-2 12-7 12-14V7L14 2z" stroke="#D4A030" strokeWidth="1.4" fill="none"/>
              <path d="M14 9v10M10 14h8" stroke="#D4A030" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="sow-logo">FUTURIS NOVA</span>
          </div>
          <span className="sow-doc-label">STATEMENT OF WORK</span>
        </header>

        <div className="sow-progress">
          <div className="sow-steps">
            {STEPS.map((s,i)=>(
              <button key={s.id} className={`sow-step${i===step?" active":i<step?" done":""}`} onClick={()=>i<step&&setStep(i)}>
                <div className="step-num">{i<step?"✓":i+1}</div>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sow-main">
          {panels[step]}
          <div className="sow-nav">
            {step>0?<button className="btn-back" onClick={()=>{setErrors({});setStep(s=>s-1);}}>← BACK</button>:<span/>}
            <button className="btn-next" onClick={tryNext}>
              {step<STEPS.length-1?"CONTINUE →":"FINALIZE SOW ✦"}
            </button>
          </div>
        </div>

        <footer className="sow-footer">
          <span className="ft-brand">© FUTURIS NOVA LLC · EXCELLENCE. EXECUTED.</span>
          <div className="ft-links">
            <button className="ft-link" onClick={()=>setShowPrivacy(true)}>PRIVACY POLICY</button>
            <a className="ft-link" href="mailto:connect@futurisnova.com">CONTACT</a>
          </div>
        </footer>

      </div>
    </>
  );
}
