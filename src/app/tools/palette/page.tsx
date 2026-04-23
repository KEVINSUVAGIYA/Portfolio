"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, CheckCheck, RefreshCw, Pipette, ImageIcon, Lock, Unlock } from "lucide-react";
import Link from "next/link";

// ── Color math helpers ──────────────────────────────────────────────────────
function randomHex() { return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0"); }
function hexToRgb(hex: string) {
  return { r: parseInt(hex.slice(1,3),16), g: parseInt(hex.slice(3,5),16), b: parseInt(hex.slice(5,7),16) };
}
function hexToHsl(hex: string) {
  let { r, g, b } = hexToRgb(hex);
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b); let h=0,s=0; const l=(max+min)/2;
  if (max!==min) { const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;case b:h=((r-g)/d+4)/6;break;} }
  return { h:Math.round(h*360), s:Math.round(s*100), l:Math.round(l*100) };
}
function hslToHex(h:number,s:number,l:number) {
  s/=100;l/=100; const a=s*Math.min(l,1-l);
  const f=(n:number)=>{ const k=(n+h/30)%12; return Math.round(255*(l-a*Math.max(Math.min(k-3,9-k,1),-1))).toString(16).padStart(2,"0"); };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (c: number) => { const s = c/255; return s<=0.04045?s/12.92:Math.pow((s+0.055)/1.055,2.4); };
  return 0.2126*toLinear(r)+0.7152*toLinear(g)+0.0722*toLinear(b);
}
function contrastRatio(hex1: string, hex2: string) {
  const l1=relativeLuminance(hex1), l2=relativeLuminance(hex2);
  return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
}
function wcagGrade(ratio: number, large=false) {
  if (large) return ratio>=3?"AA":ratio>=1.5?"A":"Fail";
  return ratio>=7?"AAA":ratio>=4.5?"AA":ratio>=3?"AA Large":"Fail";
}
function isLight(hex: string) { const {r,g,b}=hexToRgb(hex); return 0.299*r+0.587*g+0.114*b>128; }

// Named color lookup (approximate)
const COLOR_NAMES: [number,number,number,string][] = [
  [255,0,0,"Red"],[0,128,0,"Green"],[0,0,255,"Blue"],[255,255,0,"Yellow"],
  [255,165,0,"Orange"],[128,0,128,"Purple"],[255,192,203,"Pink"],[0,0,0,"Black"],
  [255,255,255,"White"],[128,128,128,"Gray"],[165,42,42,"Brown"],[0,255,255,"Cyan"],
  [255,0,255,"Magenta"],[255,215,0,"Gold"],[192,192,192,"Silver"],[75,0,130,"Indigo"],
  [240,128,128,"LightCoral"],[32,178,170,"LightSeaGreen"],[100,149,237,"CornflowerBlue"],
  [220,20,60,"Crimson"],[0,128,128,"Teal"],[244,164,96,"SandyBrown"],
];
function nearestColorName(hex: string) {
  const {r,g,b}=hexToRgb(hex);
  let best="";let bestD=Infinity;
  for (const [cr,cg,cb,name] of COLOR_NAMES) {
    const d=(r-cr)**2+(g-cg)**2+(b-cb)**2;
    if (d<bestD) {bestD=d;best=name;}
  }
  return best;
}

type Scheme = "analogous"|"complementary"|"triadic"|"split"|"random";

function generatePalette(scheme: Scheme): string[] {
  const base = Math.floor(Math.random()*360);
  if (scheme==="analogous") return [
    hslToHex(base,80,35), hslToHex((base+20)%360,75,48), hslToHex((base+35)%360,70,60),
    hslToHex((base-20+360)%360,65,55), hslToHex((base-35+360)%360,60,42),
  ];
  if (scheme==="complementary") { const c=(base+180)%360; return [
    hslToHex(base,80,35), hslToHex(base,70,55), hslToHex(base,60,70),
    hslToHex(c,75,50), hslToHex(c,65,65),
  ]; }
  if (scheme==="triadic") return [
    hslToHex(base,80,40), hslToHex((base+120)%360,75,45), hslToHex((base+240)%360,70,50),
    hslToHex(base,60,65), hslToHex((base+120)%360,55,60),
  ];
  if (scheme==="split") { const s1=(base+150)%360, s2=(base+210)%360; return [
    hslToHex(base,80,40), hslToHex(s1,70,50), hslToHex(s2,70,50),
    hslToHex(base,50,70), hslToHex(s1,50,65),
  ]; }
  // random
  return [randomHex(),randomHex(),randomHex(),randomHex(),randomHex()];
}

function extractPaletteFromImageData(data: Uint8ClampedArray, w: number, h: number): string[] {
  const n=5; const sw=Math.floor(w/n); const colors: string[]=[];
  for (let s=0;s<n;s++) {
    const samples: number[][]=[];
    for (let k=0;k<50;k++) {
      const x=sw*s+Math.floor(Math.random()*sw), y=Math.floor(Math.random()*h);
      const idx=(y*w+x)*4;
      if (data[idx+3]>10) samples.push([data[idx],data[idx+1],data[idx+2]]);
    }
    if (!samples.length) { colors.push(randomHex()); continue; }
    const r=samples.map(s=>s[0]).sort((a,b)=>a-b)[Math.floor(samples.length/2)];
    const g=samples.map(s=>s[1]).sort((a,b)=>a-b)[Math.floor(samples.length/2)];
    const b=samples.map(s=>s[2]).sort((a,b)=>a-b)[Math.floor(samples.length/2)];
    colors.push(`#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`);
  }
  return colors;
}

// Colorblind simulation matrix (Brettel et al.)
function simulateColorblind(hex: string, type: "protanopia"|"deuteranopia"|"tritanopia"): string {
  const {r,g,b}=hexToRgb(hex);
  let rr=r/255, gr=g/255, br=b/255;
  let ro=rr, go=gr, bo=br;
  if (type==="protanopia") { ro=0.56667*gr+0.43333*br; go=0.55833*gr+0.44167*br; bo=0.24167*gr+0.75833*br; }
  else if (type==="deuteranopia") { ro=0.625*rr+0.375*br; go=0.7*rr+0.3*br; bo=0.3*rr+0.7*br; }
  else { ro=0.95*rr+0.05*gr; go=0.43333*gr+0.56667*br; bo=0.475*gr+0.525*br; }
  const clamp=(n:number)=>Math.max(0,Math.min(255,Math.round(n*255)));
  return `#${clamp(ro).toString(16).padStart(2,"0")}${clamp(go).toString(16).padStart(2,"0")}${clamp(bo).toString(16).padStart(2,"0")}`;
}

export default function ColorPalettePage() {
  const [colors, setColors] = useState<string[]>(() => generatePalette("analogous"));
  const [locked, setLocked] = useState<boolean[]>([false,false,false,false,false]);
  const [copiedIdx, setCopiedIdx] = useState<number|null>(null);
  const [format, setFormat] = useState<"hex"|"rgb"|"hsl">("hex");
  const [scheme, setScheme] = useState<Scheme>("analogous");
  const [contrastBg, setContrastBg] = useState("#ffffff");
  const [showContrast, setShowContrast] = useState(false);
  const [cbType, setCbType] = useState<"none"|"protanopia"|"deuteranopia"|"tritanopia">("none");
  const fileRef = useRef<HTMLInputElement>(null);

  const regenerate = useCallback((s: Scheme = scheme) => {
    const newPalette = generatePalette(s);
    setColors(prev => prev.map((c,i) => locked[i] ? c : newPalette[i]));
  }, [locked, scheme]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code==="Space" && !["INPUT","TEXTAREA","BUTTON"].includes((e.target as Element).tagName)) {
        e.preventDefault(); regenerate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [regenerate]);

  const copy = (hex: string, idx: number) => {
    let val=hex;
    if (format==="rgb") { const {r,g,b}=hexToRgb(hex); val=`rgb(${r}, ${g}, ${b})`; }
    if (format==="hsl") { const {h,s,l}=hexToHsl(hex); val=`hsl(${h}, ${s}%, ${l}%)`; }
    navigator.clipboard.writeText(val);
    setCopiedIdx(idx); setTimeout(()=>setCopiedIdx(null),1500);
  };

  const displayValue = (hex: string) => {
    if (format==="rgb") { const {r,g,b}=hexToRgb(hex); return `rgb(${r},${g},${b})`; }
    if (format==="hsl") { const {h,s,l}=hexToHsl(hex); return `hsl(${h},${s}%,${l}%)`; }
    return hex;
  };

  const extractFromImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file=e.target.files?.[0]; if (!file) return;
    const url=URL.createObjectURL(file);
    const img=new Image();
    img.onload=()=>{
      const canvas=document.createElement("canvas");
      const scale=Math.min(1,400/Math.max(img.width,img.height));
      canvas.width=Math.floor(img.width*scale); canvas.height=Math.floor(img.height*scale);
      const ctx=canvas.getContext("2d")!; ctx.drawImage(img,0,0,canvas.width,canvas.height);
      const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
      setColors(extractPaletteFromImageData(data,canvas.width,canvas.height));
      setLocked([false,false,false,false,false]);
      URL.revokeObjectURL(url);
    };
    img.src=url; e.target.value="";
  };

  const copyCSS = () => {
    const css=colors.map((c,i)=>`--color-${i+1}: ${c};`).join("\n");
    navigator.clipboard.writeText(`:root {\n${css}\n}`);
  };

  const displayColors = cbType==="none" ? colors : colors.map(c=>simulateColorblind(c,cbType as any));

  const SCHEMES: Scheme[] = ["analogous","complementary","triadic","split","random"];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center"><Pipette className="w-4 h-4 text-white" /></div>
            <span className="text-white font-bold">Color Palette</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-slate-900 border border-white/10 rounded-lg p-0.5 text-xs">
              {(["hex","rgb","hsl"] as const).map(f=>(
                <button key={f} onClick={()=>setFormat(f)} className={`px-3 py-1.5 rounded-md font-semibold transition-colors uppercase ${format===f?"bg-pink-600 text-white":"text-slate-400 hover:text-white"}`}>{f}</button>
              ))}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={extractFromImage}/>
            <button onClick={()=>fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-sm transition-colors">
              <ImageIcon className="w-4 h-4"/> Extract
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <h1 className="text-3xl font-black text-white mb-1">Color Palette Generator</h1>
          <p className="text-slate-400 text-sm">Lock colors you like, regenerate the rest. Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-xs font-mono border border-white/10">Space</kbd> to generate.</p>
        </motion.div>

        {/* Scheme selector */}
        <div className="flex gap-2 flex-wrap">
          {SCHEMES.map(s=>(
            <button key={s} onClick={()=>{setScheme(s);regenerate(s);}}
              className={`px-4 py-2 rounded-xl text-xs font-bold border capitalize transition-all ${scheme===s?"bg-pink-600 border-pink-600 text-white":"border-white/10 text-slate-400 hover:text-white"}`}
            >{s}</button>
          ))}
        </div>

        {/* Palette strip */}
        <div className="flex rounded-3xl overflow-hidden h-72 shadow-2xl shadow-slate-950">
          {displayColors.map((hex, i) => (
            <motion.div layout key={i} className="flex-1 relative flex flex-col justify-end cursor-pointer group"
              style={{ backgroundColor: hex }} onClick={()=>copy(colors[i], i)}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {copiedIdx===i ? <CheckCheck className={`w-6 h-6 ${isLight(hex)?"text-black/70":"text-white/70"}`}/> : <Copy className={`w-6 h-6 ${isLight(hex)?"text-black/70":"text-white/70"}`}/>}
              </div>
              <div className={`p-3 ${isLight(hex)?"text-black/80":"text-white/90"}`}>
                <p className="text-[10px] font-semibold opacity-70 mb-0.5">{nearestColorName(colors[i])}</p>
                <p className="text-xs font-bold font-mono">{displayValue(colors[i])}</p>
              </div>
              <button onClick={e=>{e.stopPropagation();setLocked(l=>l.map((v,j)=>j===i?!v:v));}}
                className={`absolute top-2 right-2 p-1.5 rounded-full border font-semibold transition-all ${locked[i]?"bg-white/20 border-white/40":"border-transparent opacity-0 group-hover:opacity-100"}`}
                title={locked[i]?"Unlock":"Lock"}
              >
                {locked[i] ? <Lock className={`w-3 h-3 ${isLight(hex)?"text-black/70":"text-white/70"}`}/> : <Unlock className={`w-3 h-3 ${isLight(hex)?"text-black/70":"text-white/70"}`}/>}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button onClick={()=>regenerate()} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/20">
            <RefreshCw className="w-4 h-4"/> Generate
          </button>
          <button onClick={copyCSS} className="flex items-center gap-2 px-5 py-3 bg-slate-800 border border-white/10 text-slate-300 hover:text-white rounded-xl font-semibold transition-colors text-sm">
            <Copy className="w-4 h-4"/> CSS Vars
          </button>
          <button onClick={()=>setShowContrast(c=>!c)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-colors text-sm border ${showContrast?"bg-pink-500/10 border-pink-500/30 text-pink-300":"bg-slate-800 border-white/10 text-slate-300 hover:text-white"}`}>
            WCAG Contrast
          </button>
        </div>

        {/* Colorblind simulator */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Colorblind Simulator</p>
          <div className="flex gap-2 flex-wrap mb-4">
            {([["none","Normal"],["protanopia","Protanopia (Red-blind)"],["deuteranopia","Deuteranopia (Green-blind)"],["tritanopia","Tritanopia (Blue-blind)"]] as const).map(([v,label])=>(
              <button key={v} onClick={()=>setCbType(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${cbType===v?"bg-pink-600 border-pink-600 text-white":"border-white/10 text-slate-400 hover:text-white"}`}
              >{label}</button>
            ))}
          </div>
          {cbType!=="none" && (
            <div className="flex gap-2 rounded-xl overflow-hidden h-12">
              {displayColors.map((hex,i)=>(
                <div key={i} className="flex-1 transition-colors" style={{backgroundColor:hex}} title={`Simulated: ${hex}`}/>
              ))}
            </div>
          )}
        </div>

        {/* WCAG Contrast checker */}
        {showContrast && (
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">WCAG Contrast vs Background</p>
              <label className="flex items-center gap-2 text-sm text-slate-400">
                Background: <input type="color" value={contrastBg} onChange={e=>setContrastBg(e.target.value)} className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent" />
                <span className="font-mono text-xs text-slate-500">{contrastBg}</span>
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {colors.map((hex,i)=>{
                const ratio=contrastRatio(hex,contrastBg);
                const grade=wcagGrade(ratio);
                const gradeLarge=wcagGrade(ratio,true);
                const pass=ratio>=4.5;
                return (
                  <div key={i} className={`border rounded-xl p-3 ${pass?"border-emerald-500/20 bg-emerald-500/5":"border-red-500/20 bg-red-500/5"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-md border border-white/10" style={{backgroundColor:hex}}/>
                      <span className="font-mono text-xs text-slate-400">{hex}</span>
                    </div>
                    <div className="text-xs space-y-0.5">
                      <p className="text-slate-400">Ratio: <span className="font-bold text-white">{ratio.toFixed(2)}:1</span></p>
                      <p>Normal text: <span className={`font-bold ${grade==="AAA"?"text-emerald-400":grade==="AA"?"text-green-400":grade.includes("Large")?"text-amber-400":"text-red-400"}`}>{grade}</span></p>
                      <p>Large text: <span className={`font-bold ${gradeLarge==="AA"?"text-emerald-400":gradeLarge==="A"?"text-amber-400":"text-red-400"}`}>{gradeLarge}</span></p>
                    </div>
                    <div className="mt-2 rounded-md px-2 py-1 text-xs font-bold text-center" style={{backgroundColor:contrastBg,color:hex}}>
                      Sample text
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gradient preview */}
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gradient Preview</p>
          <div className="h-14 rounded-xl" style={{background:`linear-gradient(to right, ${colors.join(", ")})`}}/>
          <div className="h-14 rounded-xl" style={{background:`linear-gradient(135deg, ${colors.join(", ")})`}}/>
        </div>
      </div>
    </div>
  );
}
