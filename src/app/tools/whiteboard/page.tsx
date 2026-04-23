"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Download, Maximize2, Minimize2, Pencil, Eraser, Minus, Square, Circle, Undo2, Trash2, Type, ArrowUpRight } from "lucide-react";
import Link from "next/link";

type DrawTool = "pen" | "eraser" | "line" | "rect" | "circle" | "arrow";
type TextNote = { id: string; x: number; y: number; text: string; color: string; size: number };

interface Point { x: number; y: number; }
interface Stroke {
  tool: DrawTool; color: string; width: number; points: Point[]; start?: Point; end?: Point;
}

const MAX_STROKES = 500;

export default function WhiteboardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<DrawTool | "text">("pen");
  const [color, setColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(4);
  const [drawing, setDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const strokesRef = useRef<Stroke[]>([]); // always-current ref for resize
  const [textNotes, setTextNotes] = useState<TextNote[]>([]);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: 1920, h: 1080 });

  const drawingRef = useRef(false);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => { drawingRef.current = drawing; }, [drawing]);
  // Keep strokesRef in sync so resize can access current strokes
  useEffect(() => { strokesRef.current = strokes; }, [strokes]);



  const getPos = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const redraw = useCallback((strokesToDraw: Stroke[], live?: Stroke) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawStroke = (s: Stroke) => {
      ctx.save();
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      if (s.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)"; ctx.lineWidth = s.width * 4;
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = s.color; ctx.lineWidth = s.width;
      }
      if (s.tool === "pen" || s.tool === "eraser") {
        if (s.points.length < 2) { ctx.restore(); return; }
        ctx.beginPath(); ctx.moveTo(s.points[0].x, s.points[0].y);
        s.points.slice(1).forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
      } else if (s.tool === "line" && s.start && s.end) {
        ctx.beginPath(); ctx.moveTo(s.start.x, s.start.y); ctx.lineTo(s.end.x, s.end.y); ctx.stroke();
      } else if (s.tool === "arrow" && s.start && s.end) {
        const dx = s.end.x - s.start.x, dy = s.end.y - s.start.y;
        const angle = Math.atan2(dy, dx);
        const len = 14 + s.width;
        ctx.beginPath(); ctx.moveTo(s.start.x, s.start.y); ctx.lineTo(s.end.x, s.end.y); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(s.end.x, s.end.y);
        ctx.lineTo(s.end.x - len * Math.cos(angle - Math.PI / 6), s.end.y - len * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(s.end.x - len * Math.cos(angle + Math.PI / 6), s.end.y - len * Math.sin(angle + Math.PI / 6));
        ctx.closePath(); ctx.fillStyle = s.color; ctx.fill();
      } else if (s.tool === "rect" && s.start && s.end) {
        ctx.strokeRect(s.start.x, s.start.y, s.end.x - s.start.x, s.end.y - s.start.y);
      } else if (s.tool === "circle" && s.start && s.end) {
        const rx = Math.abs(s.end.x - s.start.x) / 2, ry = Math.abs(s.end.y - s.start.y) / 2;
        const cx = (s.start.x + s.end.x) / 2, cy = (s.start.y + s.end.y) / 2;
        ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI); ctx.stroke();
      }
      ctx.restore();
    };

    strokesToDraw.forEach(drawStroke);
    if (live) drawStroke(live);
  }, []);

  useEffect(() => { redraw(strokes); }, [strokes, redraw]);

  // Resize canvas — redraw strokes after canvas dimensions change
  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { width, height } = entries[0].contentRect;
      const currentStrokes = strokesRef.current;
      setCanvasSize({ w: Math.round(width), h: Math.round(height) });
      requestAnimationFrame(() => { redraw(currentStrokes); });
    });
    if (wrapperRef.current) obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, [redraw]);


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); setStrokes(s => s.slice(0, -1)); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const onStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (tool === "text") {
      e.preventDefault();
      const pos = getPos(e);
      const id = `note-${Date.now()}`;
      setTextNotes(prev => [...prev, { id, x: pos.x, y: pos.y, text: "", color, size: brushSize * 4 + 8 }]);
      setEditingNote(id);
      return;
    }
    e.preventDefault();
    const pos = getPos(e);
    const stroke: Stroke = { tool: tool as DrawTool, color, width: brushSize, points: [pos], start: pos, end: pos };
    currentStrokeRef.current = stroke;
    setDrawing(true); drawingRef.current = true;
  };

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawingRef.current || !currentStrokeRef.current) return;
    const pos = getPos(e);
    const updated: Stroke = { ...currentStrokeRef.current, points: [...currentStrokeRef.current.points, pos], end: pos };
    currentStrokeRef.current = updated;
    redraw(strokes, updated);
  };

  const onEnd = () => {
    if (!drawingRef.current || !currentStrokeRef.current) return;
    setStrokes(s => { const next = [...s, currentStrokeRef.current!]; return next.length > MAX_STROKES ? next.slice(-MAX_STROKES) : next; });
    currentStrokeRef.current = null;
    setDrawing(false); drawingRef.current = false;
  };

  const undo = () => setStrokes(s => s.slice(0, -1));
  const clear = () => { setStrokes([]); setTextNotes([]); };

  const download = () => {
    const src = canvasRef.current!;
    const off = document.createElement("canvas");
    off.width = src.width; off.height = src.height;
    const ctx = off.getContext("2d")!;
    ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, off.width, off.height);
    ctx.drawImage(src, 0, 0);
    // Also draw text notes
    textNotes.forEach(n => {
      ctx.save(); ctx.font = `bold ${n.size}px Inter, sans-serif`; ctx.fillStyle = n.color;
      ctx.fillText(n.text, n.x, n.y); ctx.restore();
    });
    const a = document.createElement("a"); a.download = "whiteboard.png"; a.href = off.toDataURL(); a.click();
  };

  const DRAW_TOOLS: { id: DrawTool | "text"; Icon: any; label: string }[] = [
    { id: "pen", Icon: Pencil, label: "Pen (P)" },
    { id: "eraser", Icon: Eraser, label: "Eraser (E)" },
    { id: "text", Icon: Type, label: "Text (T)" },
    { id: "line", Icon: Minus, label: "Line (L)" },
    { id: "arrow", Icon: ArrowUpRight, label: "Arrow (A)" },
    { id: "rect", Icon: Square, label: "Rectangle (R)" },
    { id: "circle", Icon: Circle, label: "Ellipse (C)" },
  ];

  const COLORS = ["#ffffff","#f87171","#fb923c","#facc15","#4ade80","#38bdf8","#818cf8","#f472b6","#e879f9","#000000"];

  // Keyboard shortcuts
  useEffect(() => {
    const map: Record<string, DrawTool | "text"> = { p:"pen", e:"eraser", t:"text", l:"line", a:"arrow", r:"rect", c:"circle" };
    const h = (ev: KeyboardEvent) => {
      if (["INPUT","TEXTAREA"].includes((ev.target as Element).tagName)) return;
      if (map[ev.key.toLowerCase()]) setTool(map[ev.key.toLowerCase()]);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div className={`bg-slate-950 flex flex-col ${fullscreen ? "fixed inset-0 z-50" : "min-h-screen"}`}>
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md flex-shrink-0">
        <div className="max-w-full mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
          {!fullscreen && <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center"><Pencil className="w-4 h-4 text-white" /></div>
          <span className="text-white font-bold">Whiteboard</span>

          {/* Tools */}
          <div className="flex items-center gap-1 bg-slate-800 border border-white/10 rounded-xl p-1 ml-2">
            {DRAW_TOOLS.map(({ id, Icon, label }) => (
              <button key={id} onClick={() => setTool(id)} title={label}
                className={`p-2 rounded-lg transition-all ${tool === id ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"}`}
              ><Icon className="w-4 h-4" /></button>
            ))}
          </div>

          {/* Colors */}
          <div className="flex items-center gap-1">
            {COLORS.map(c => (
              <button key={c} onClick={() => { setColor(c); if (tool === "eraser") setTool("pen"); }}
                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${color === c && tool !== "eraser" ? "border-white scale-125" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input type="color" value={color} onChange={e => { setColor(e.target.value); if (tool === "eraser") setTool("pen"); }}
              className="w-6 h-6 rounded-full cursor-pointer bg-transparent border-0 p-0" title="Custom color"
            />
          </div>

          {/* Brush size */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-4 text-right font-mono">{brushSize}</span>
            <input type="range" min={1} max={30} value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} className="w-20 accent-orange-500" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs text-slate-600 mr-2 hidden sm:block">Ctrl+Z undo · Shortcuts: P E T L A R C</span>
            {strokes.length >= MAX_STROKES - 10 && <span className="text-[10px] text-amber-400 mr-1">{MAX_STROKES - strokes.length} left</span>}
            <button onClick={undo} disabled={strokes.length === 0} title="Undo (Ctrl+Z)" className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-colors"><Undo2 className="w-4 h-4" /></button>
            <button onClick={clear} disabled={strokes.length === 0 && textNotes.length === 0} className="p-2 rounded-lg text-slate-400 hover:text-red-400 disabled:opacity-30 transition-colors"><Trash2 className="w-4 h-4" /></button>
            <button onClick={download} className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"><Download className="w-4 h-4" /></button>
            <button onClick={() => setFullscreen(!fullscreen)} className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors">
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Canvas container */}
      <div ref={wrapperRef} className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          width={canvasSize.w}
          height={canvasSize.h}
          className={`absolute inset-0 w-full h-full ${tool === "eraser" ? "cursor-cell" : tool === "text" ? "cursor-text" : "cursor-crosshair"}`}
          style={{ touchAction: "none", background: "#0f172a" }}
          onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd}
          onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
        />

        {/* Text notes overlay */}
        {textNotes.map(note => (
          <div key={note.id} className="absolute" style={{ left: note.x, top: note.y, transform: "translateY(-100%)" }}>
            {editingNote === note.id ? (
              <input
                autoFocus
                value={note.text}
                onChange={e => setTextNotes(prev => prev.map(n => n.id === note.id ? { ...n, text: e.target.value } : n))}
                onBlur={() => { setEditingNote(null); if (!note.text.trim()) setTextNotes(prev => prev.filter(n => n.id !== note.id)); }}
                onKeyDown={e => { if (e.key === "Enter") { setEditingNote(null); } }}
                className="bg-transparent outline-none border-b border-dashed border-white/40 min-w-[80px]"
                style={{ color: note.color, fontSize: note.size, fontWeight: "bold", fontFamily: "Inter, sans-serif" }}
              />
            ) : (
              <div
                onClick={() => setEditingNote(note.id)}
                className="cursor-text select-none hover:opacity-80 transition-opacity"
                style={{ color: note.color, fontSize: note.size, fontWeight: "bold", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}
              >{note.text || <span className="opacity-30 text-sm">click to edit</span>}</div>
            )}
          </div>
        ))}

        {/* Tool hint */}
        {tool === "text" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-400 pointer-events-none">
            Click anywhere on the canvas to place a text box
          </div>
        )}
      </div>
    </div>
  );
}
