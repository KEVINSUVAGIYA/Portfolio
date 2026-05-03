"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Pencil, Eraser, Minus, Square, Circle, Undo2, Redo2, Trash2, Type, ArrowUpRight, Shuffle, Users, CheckCheck, Wifi, WifiOff, Hand, Keyboard, LocateFixed, ChevronDown, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { ref, set, push, onValue, off, onDisconnect, remove, update } from "firebase/database";
import { copyToClipboard } from "@/lib/utils";

type DrawTool = "pen" | "eraser" | "line" | "rect" | "circle" | "arrow" | "hand";
type TextNote = { id: string; x: number; y: number; text: string; color: string; size: number };
type UndoItem = 
  | { type: "stroke"; stroke: Stroke }
  | { type: "clear"; strokes: Stroke[]; notes: TextNote[] };

interface Point { x: number; y: number; }
interface Stroke {
  tool: DrawTool; color: string; width: number; points: Point[]; start?: Point; end?: Point;
}

const MAX_STROKES = 1000;

const adjectives = ["Swift","Quiet","Bold","Calm","Bright","Nova","Sage","Zephyr","Echo","Mist"];
const nouns = ["Fox","River","Star","Hawk","Moon","Wave","Pine","Ash","Reed","Stone"];
function generateName() {
  return adjectives[Math.floor(Math.random()*adjectives.length)] + nouns[Math.floor(Math.random()*nouns.length)];
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

const suggestions = ["design-draft","mindmap","wireframe","flowchart","brainstorm","doodles","team-board"];

const renderStroke = (ctx: CanvasRenderingContext2D, s: Stroke, zoom: number = 1) => {
  if (!s) return;
  ctx.save();
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  if (s.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(0,0,0,1)"; ctx.lineWidth = s.width * 4 / zoom; 
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = s.color; ctx.lineWidth = s.width;
  }
  if (s.tool === "pen" || s.tool === "eraser") {
    if (!s.points || s.points.length < 2) { ctx.restore(); return; }
    ctx.beginPath(); ctx.moveTo(s.points[0].x, s.points[0].y);
    s.points.slice(1).forEach(p => ctx.lineTo(p.x, p.y)); ctx.stroke();
  } else if (s.tool === "line" && s.start && s.end) {
    ctx.beginPath(); ctx.moveTo(s.start.x, s.start.y); ctx.lineTo(s.end.x, s.end.y); ctx.stroke();
  } else if (s.tool === "arrow" && s.start && s.end) {
    const dx = s.end.x - s.start.x, dy = s.end.y - s.start.y;
    const angle = Math.atan2(dy, dx);
    const len = 14 + s.width * 2;
    const shorten = len * 0.8;
    ctx.beginPath(); 
    ctx.moveTo(s.start.x, s.start.y); 
    ctx.lineTo(s.end.x - shorten * Math.cos(angle), s.end.y - shorten * Math.sin(angle)); 
    ctx.stroke();
    
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

function NotConfigured() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mx-auto mb-6 text-3xl">🔧</div>
        <h2 className="text-xl font-bold text-white mb-2">Firebase Not Configured</h2>
        <p className="text-slate-400 text-sm mb-4">
          Copy <code className="text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded">.env.local.example</code> to <code className="text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded">.env.local</code> and add your Firebase credentials.
        </p>
      </div>
    </div>
  );
}

function WhiteboardEntry({ onOpen }: { onOpen: (key: string) => void }) {
  const [key, setKey] = useState("");
  const [name, setName] = useState("");

  const handleJoin = () => {
    if (name.trim()) sessionStorage.setItem("whiteboard-name", name.trim());
    onOpen(key);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/tools" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-10"><ArrowLeft className="w-4 h-4" /> Back to Tools</Link>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
            <Pencil className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Infinite Whiteboard</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">A real-time collaborative canvas. Zoom, pan, and draw together with live cursors.</p>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">room:</div>
              <input type="text" value={key} onChange={(e) => setKey(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleJoin()} placeholder="my-board-name" className="w-full bg-slate-900 border border-white/10 text-white pl-16 pr-10 py-4 rounded-xl text-base outline-none focus:border-orange-500/50 font-mono" />
              <button onClick={() => setKey(suggestions[Math.floor(Math.random()*suggestions.length)])} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-orange-400 hover:bg-orange-500/10"><Shuffle className="w-4 h-4" /></button>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono">name:</div>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleJoin()} placeholder="(Optional) Your alias..." className="w-full bg-slate-900/50 border border-white/5 text-white pl-16 pr-10 py-3 rounded-xl text-sm outline-none focus:border-orange-500/50 font-mono" />
            </div>
            <button onClick={handleJoin} className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2">Join Board →</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SharedWhiteboard({ roomKey }: { roomKey: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<DrawTool | "text">("pen");
  const [color, setColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(4);
  const [drawing, setDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  
  const [strokesObj, setStrokesObj] = useState<Record<string, Stroke>>({});
  const [myStrokeKeys, setMyStrokeKeys] = useState<string[]>([]);
  const [undoneStrokes, setUndoneStrokes] = useState<UndoItem[]>([]);
  
  const [textNotesObj, setTextNotesObj] = useState<Record<string, TextNote>>({});
  const [localNotes, setLocalNotes] = useState<TextNote[]>([]);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  
  const [canvasSize, setCanvasSize] = useState({ w: 1920, h: 1080 });

  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [myName, setMyName] = useState("");
  const [activeUsers, setActiveUsers] = useState<any[]>([]);

  const drawingRef = useRef(false);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const myNameRef = useRef("");
  const lastPanRef = useRef({ x: 0, y: 0 });
  const lastCursorUpdateRef = useRef(0);

  useEffect(() => { drawingRef.current = drawing; }, [drawing]);

  useEffect(() => {
    const stored = sessionStorage.getItem("whiteboard-name");
    const name = stored || generateName();
    if (!stored) sessionStorage.setItem("whiteboard-name", name);
    myNameRef.current = name;
    setMyName(name);
  }, []);

  useEffect(() => {
    if (!myName) return;
    const db = getFirebaseDb();
    const strokesRefPath = `tools/whiteboard/${roomKey}/strokes`;
    const notesRefPath = `tools/whiteboard/${roomKey}/notes`;
    const presenceRefPath = `tools/whiteboard/${roomKey}/presence`;
    
    const strokesRef = ref(db, strokesRefPath);
    const notesRef = ref(db, notesRefPath);
    const myPresenceRef = ref(db, `${presenceRefPath}/${myName}`);
    const allPresenceRef = ref(db, presenceRefPath);

    set(myPresenceRef, { name: myName, online: true, joinedAt: Date.now() });
    onDisconnect(myPresenceRef).remove();

    const unsubPresence = onValue(allPresenceRef, (snap) => {
      const data = snap.val() || {};
      const users = Object.values(data) as any[];
      setActiveUsers(users);
    });

    const unsubStrokes = onValue(strokesRef, (snap) => setStrokesObj(snap.val() || {}));
    const unsubNotes = onValue(notesRef, (snap) => setTextNotesObj(snap.val() || {}));

    setConnected(true);
    return () => { 
      off(strokesRef); unsubStrokes(); 
      off(notesRef); unsubNotes(); 
      off(allPresenceRef); unsubPresence(); 
      remove(myPresenceRef); 
    };
  }, [myName, roomKey]);

  // Room cleanup: if I'm the last user, tell Firebase to wipe data on my disconnect.
  // If others are present, cancel that cleanup so their work is preserved.
  useEffect(() => {
    if (!myName) return;
    const db = getFirebaseDb();
    const strokesRef = ref(db, `tools/whiteboard/${roomKey}/strokes`);
    const notesRef = ref(db, `tools/whiteboard/${roomKey}/notes`);
    const presenceRef = ref(db, `tools/whiteboard/${roomKey}/presence`);
    
    const amIAlone = activeUsers.length <= 1;
    if (amIAlone) {
      onDisconnect(strokesRef).remove();
      onDisconnect(notesRef).remove();
      onDisconnect(presenceRef).remove();
    } else {
      onDisconnect(strokesRef).cancel();
      onDisconnect(notesRef).cancel();
    }
  }, [activeUsers, myName, roomKey]);

  const sortedStrokes = React.useMemo(() => Object.keys(strokesObj).sort().map(k => strokesObj[k]), [strokesObj]);
  const sortedStrokesRef = useRef<Stroke[]>([]);
  useEffect(() => { sortedStrokesRef.current = sortedStrokes; }, [sortedStrokes]);

  const allTextNotes = [...Object.values(textNotesObj), ...localNotes];

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent | WheelEvent | MouseEvent, raw?: boolean): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    let rawX = 0, rawY = 0;
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e && e.touches.length > 0) {
      rawX = (e.touches[0].clientX - rect.left) * scaleX;
      rawY = (e.touches[0].clientY - rect.top) * scaleY;
    } else if ("clientX" in e) {
      rawX = ((e as React.MouseEvent).clientX - rect.left) * scaleX;
      rawY = ((e as React.MouseEvent).clientY - rect.top) * scaleY;
    }
    
    if (raw) return { x: rawX, y: rawY };
    return { x: (rawX - pan.x) / zoom, y: (rawY - pan.y) / zoom };
  }, [pan, zoom]);

  const redraw = useCallback((strokesToDraw: Stroke[], live?: Stroke) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    ctx.scale(zoom, zoom);

    strokesToDraw.forEach(s => renderStroke(ctx, s, zoom));
    if (live) renderStroke(ctx, live, zoom);
    
    ctx.restore();
  }, [pan, zoom]);

  useEffect(() => { redraw(sortedStrokes, currentStrokeRef.current || undefined); }, [sortedStrokes, redraw]);

  useEffect(() => {
    const obs = new ResizeObserver(entries => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { width, height } = entries[0].contentRect;
      setCanvasSize({ w: Math.round(width), h: Math.round(height) });
      requestAnimationFrame(() => { redraw(sortedStrokesRef.current, currentStrokeRef.current || undefined); });
    });
    if (wrapperRef.current) obs.observe(wrapperRef.current);
    return () => obs.disconnect();
  }, [redraw]);

  // Handle native wheel events on wrapper for smooth zooming/panning
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        // Zoom
        const zoomSensitivity = 0.005;
        const delta = -e.deltaY * zoomSensitivity;
        setZoom(z => {
          const newZoom = Math.min(Math.max(0.1, z + delta), 5);
          const rawPos = getPos(e, true);
          const zoomRatio = newZoom / z;
          setPan(p => ({
            x: rawPos.x - (rawPos.x - p.x) * zoomRatio,
            y: rawPos.y - (rawPos.y - p.y) * zoomRatio
          }));
          return newZoom;
        });
      } else {
        // Pan
        setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
      }
    };
    wrapper.addEventListener("wheel", handleWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", handleWheel);
  }, [getPos]);

  useEffect(() => {
    const map: Record<string, DrawTool | "text"> = { p:"pen", e:"eraser", t:"text", l:"line", a:"arrow", r:"rect", c:"circle", h:"hand" };
    const h = (ev: KeyboardEvent) => {
      if (["INPUT","TEXTAREA"].includes((ev.target as Element).tagName)) return;
      if (ev.key === " ") { ev.preventDefault(); setTool("hand"); }
      if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "z") {
        ev.preventDefault();
        if (ev.shiftKey) redo();
        else undo();
      }
      if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "y") {
        ev.preventDefault();
        redo();
      }
      if (map[ev.key.toLowerCase()]) setTool(map[ev.key.toLowerCase()]);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }); // eslint-disable-line

  const onStart = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    if (tool === "hand" || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      lastPanRef.current = getPos(e, true);
      return;
    }
    if (tool === "text") {
      e.preventDefault();
      const pos = getPos(e);
      const id = `note-${Date.now()}`;
      setLocalNotes(prev => [...prev, { id, x: pos.x, y: pos.y, text: "", color, size: brushSize * 2 + 12 }]);
      setEditingNote(id);
      return;
    }
    e.preventDefault();
    const pos = getPos(e);
    const stroke: Stroke = { tool: tool as DrawTool, color, width: brushSize, points: [pos], start: pos, end: pos };
    currentStrokeRef.current = stroke;
    setDrawing(true); drawingRef.current = true;
  };

  const onMove = (e: React.PointerEvent) => {
    e.preventDefault();
    if (e.buttons === 0 && (drawingRef.current || isPanning)) {
      onEnd();
      return;
    }
    
    const rawPos = getPos(e, true);
    let canvasPos = { x: (rawPos.x - pan.x) / zoom, y: (rawPos.y - pan.y) / zoom };
    
    if (e.shiftKey && currentStrokeRef.current?.start && ["rect", "circle", "line", "arrow"].includes(tool)) {
      const start = currentStrokeRef.current.start;
      const dx = canvasPos.x - start.x;
      const dy = canvasPos.y - start.y;
      
      if (tool === "rect" || tool === "circle") {
        const maxDist = Math.max(Math.abs(dx), Math.abs(dy));
        canvasPos = {
          x: start.x + Math.sign(dx || 1) * maxDist,
          y: start.y + Math.sign(dy || 1) * maxDist
        };
      } else if (tool === "line" || tool === "arrow") {
        const angle = Math.atan2(dy, dx);
        const snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
        const dist = Math.sqrt(dx * dx + dy * dy);
        canvasPos = {
          x: start.x + dist * Math.cos(snappedAngle),
          y: start.y + dist * Math.sin(snappedAngle)
        };
      }
    }
    
    // Broadcast live cursor
    if (Date.now() - lastCursorUpdateRef.current > 60) {
      lastCursorUpdateRef.current = Date.now();
      const db = getFirebaseDb();
      update(ref(db, `tools/whiteboard/${roomKey}/presence/${myNameRef.current}`), { cursor: canvasPos, isDrawing: drawingRef.current });
    }

    if (isPanning) {
      const dx = rawPos.x - lastPanRef.current.x;
      const dy = rawPos.y - lastPanRef.current.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPanRef.current = rawPos;
      return;
    }

    if (!drawingRef.current || !currentStrokeRef.current) return;
    const updated: Stroke = { ...currentStrokeRef.current, points: [...currentStrokeRef.current.points, canvasPos], end: canvasPos };
    currentStrokeRef.current = updated;
    redraw(sortedStrokesRef.current, updated);
  };

  const onEnd = () => {
    if (isPanning) { setIsPanning(false); return; }
    if (!drawingRef.current || !currentStrokeRef.current) return;
    const strokeToSave = currentStrokeRef.current;
    
    const db = getFirebaseDb();
    const newRef = push(ref(db, `tools/whiteboard/${roomKey}/strokes`));
    set(newRef, strokeToSave);
    
    setMyStrokeKeys(prev => [...prev, newRef.key!]);
    setUndoneStrokes([]);
    
    if (sortedStrokesRef.current.length > MAX_STROKES) {
      const keys = Object.keys(strokesObj).sort();
      const numToRemove = keys.length - MAX_STROKES;
      keys.slice(0, numToRemove).forEach(k => remove(ref(db, `tools/whiteboard/${roomKey}/strokes/${k}`)));
    }

    currentStrokeRef.current = null;
    setDrawing(false); drawingRef.current = false;
    
    // Update presence to isDrawing = false immediately
    update(ref(db, `tools/whiteboard/${roomKey}/presence/${myNameRef.current}`), { isDrawing: false });
  };

  const undo = () => {
    // Check if the last undone item is a clear snapshot
    if (myStrokeKeys.length === 0 && undoneStrokes.length > 0) {
      const last = undoneStrokes[undoneStrokes.length - 1];
      if (last.type === "clear") {
        setUndoneStrokes(prev => prev.slice(0, -1));
        const db = getFirebaseDb();
        const newKeys: string[] = [];
        last.strokes.forEach(s => {
          const r = push(ref(db, `tools/whiteboard/${roomKey}/strokes`));
          set(r, s);
          newKeys.push(r.key!);
        });
        last.notes.forEach(n => {
          set(ref(db, `tools/whiteboard/${roomKey}/notes/${n.id}`), n);
        });
        setMyStrokeKeys(newKeys);
        return;
      }
    }
    
    if (myStrokeKeys.length === 0) return;
    const keyToRemove = myStrokeKeys[myStrokeKeys.length - 1];
    const strokeObj = strokesObj[keyToRemove];
    
    setMyStrokeKeys(prev => prev.slice(0, -1));
    if (strokeObj) {
      setUndoneStrokes(prev => [...prev, { type: "stroke", stroke: strokeObj }]);
    }
    
    const db = getFirebaseDb();
    remove(ref(db, `tools/whiteboard/${roomKey}/strokes/${keyToRemove}`));
  };

  const redo = () => {
    if (undoneStrokes.length === 0) return;
    const last = undoneStrokes[undoneStrokes.length - 1];
    setUndoneStrokes(prev => prev.slice(0, -1));
    const db = getFirebaseDb();
    if (last.type === "clear") {
      last.strokes.forEach(s => {
        const r = push(ref(db, `tools/whiteboard/${roomKey}/strokes`));
        set(r, s);
      });
      last.notes.forEach(n => {
        set(ref(db, `tools/whiteboard/${roomKey}/notes/${n.id}`), n);
      });
      return;
    }
    const newRef = push(ref(db, `tools/whiteboard/${roomKey}/strokes`));
    set(newRef, last.stroke);
    setMyStrokeKeys(prev => [...prev, newRef.key!]);
  };

  const clear = () => { 
    const snapshot = [...sortedStrokes];
    const notesSnapshot = Object.values(textNotesObj) as TextNote[];
    if (snapshot.length === 0 && notesSnapshot.length === 0 && localNotes.length === 0) return;
    setUndoneStrokes(prev => [...prev, { type: "clear", strokes: snapshot, notes: notesSnapshot }]);
    setMyStrokeKeys([]);
    const db = getFirebaseDb();
    remove(ref(db, `tools/whiteboard/${roomKey}/strokes`));
    remove(ref(db, `tools/whiteboard/${roomKey}/notes`));
    setLocalNotes([]);
  };

  const download = (type: "visible" | "full" = "visible") => {
    const offCanvas = document.createElement("canvas");
    
    if (type === "visible") {
      const src = canvasRef.current!;
      offCanvas.width = src.width; 
      offCanvas.height = src.height;
      const ctx = offCanvas.getContext("2d")!;
      ctx.fillStyle = "#0f172a"; 
      ctx.fillRect(0, 0, offCanvas.width, offCanvas.height);
      ctx.drawImage(src, 0, 0);
      
      allTextNotes.forEach(n => {
        const screenX = n.x * zoom + pan.x;
        const screenY = n.y * zoom + pan.y;
        ctx.save(); ctx.font = `bold ${n.size * zoom}px Inter, sans-serif`; ctx.fillStyle = n.color;
        ctx.fillText(n.text, screenX, screenY); ctx.restore();
      });
    } else {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      sortedStrokes.forEach(s => {
        s.points?.forEach(p => {
          if (p.x < minX) minX = p.x; if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x; if (p.y > maxY) maxY = p.y;
        });
      });
      
      allTextNotes.forEach(n => {
        if (n.x < minX) minX = n.x; if (n.y < minY) minY = n.y;
        const estimatedWidth = n.text.length * n.size * 0.6;
        if (n.x + estimatedWidth > maxX) maxX = n.x + estimatedWidth;
        if (n.y + n.size > maxY) maxY = n.y + n.size;
      });

      if (minX === Infinity) {
        minX = 0; minY = 0; maxX = canvasSize.w; maxY = canvasSize.h;
      }

      const padding = 50;
      minX -= padding; minY -= padding;
      maxX += padding; maxY += padding;
      
      const width = maxX - minX;
      const height = maxY - minY;

      offCanvas.width = width; 
      offCanvas.height = height;
      const ctx = offCanvas.getContext("2d")!;
      ctx.fillStyle = "#0f172a"; 
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(-minX, -minY);

      sortedStrokes.forEach(s => renderStroke(ctx, s, 1));

      allTextNotes.forEach(n => {
        ctx.save(); ctx.font = `bold ${n.size}px Inter, sans-serif`; ctx.fillStyle = n.color;
        ctx.fillText(n.text, n.x, n.y); ctx.restore();
      });
      
      ctx.restore();
    }

    const a = document.createElement("a"); a.download = `whiteboard-${roomKey}.png`; a.href = offCanvas.toDataURL(); a.click();
  };

  const copyLink = async () => { await copyToClipboard(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const DRAW_TOOLS: { id: DrawTool | "text"; Icon: any; label: string }[] = [
    { id: "hand", Icon: Hand, label: "Pan/Move (H or Spacebar)" },
    { id: "pen", Icon: Pencil, label: "Pen (P)" },
    { id: "eraser", Icon: Eraser, label: "Eraser (E)" },
    { id: "text", Icon: Type, label: "Text (T)" },
    { id: "line", Icon: Minus, label: "Line (L)" },
    { id: "arrow", Icon: ArrowUpRight, label: "Arrow (A)" },
    { id: "rect", Icon: Square, label: "Rectangle (R)" },
    { id: "circle", Icon: Circle, label: "Ellipse (C)" },
  ];

  const COLORS = ["#ffffff","#f87171","#fb923c","#facc15","#4ade80","#38bdf8","#818cf8","#f472b6","#e879f9","#000000"];

  return (
    <div className={`bg-slate-950 flex flex-col min-h-screen overscroll-none`}>
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md flex-shrink-0 z-50">
        <div className="max-w-full mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
          <Link href="/tools" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-700 flex items-center justify-center"><Pencil className="w-4 h-4 text-white" /></div>
          
          <div className="flex flex-col ml-1 mr-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold hidden sm:inline leading-none">{roomKey}</span>
              {connected ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-slate-500" />}
            </div>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:block">Zoom: {Math.round(zoom * 100)}%</span>
          </div>

          {/* Tools */}
          <div className="flex items-center gap-1 bg-slate-800 border border-white/10 rounded-xl p-1">
            {DRAW_TOOLS.map(({ id, Icon, label }) => (
              <button key={id} onClick={() => setTool(id)} title={label}
                className={`p-2 rounded-lg transition-all ${tool === id ? "bg-orange-500 text-white" : "text-slate-400 hover:text-white"}`}
              ><Icon className="w-4 h-4" /></button>
            ))}
          </div>

          {/* Colors */}
          <div className="flex items-center gap-1">
            {COLORS.map(c => (
              <button key={c} onClick={() => { setColor(c); if (tool === "eraser" || tool === "hand") setTool("pen"); }}
                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${color === c && tool !== "eraser" && tool !== "hand" ? "border-white scale-125" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input type="color" value={color} onChange={e => { setColor(e.target.value); if (tool === "eraser" || tool === "hand") setTool("pen"); }}
              className="w-6 h-6 rounded-full cursor-pointer bg-transparent border-0 p-0" title="Custom color"
            />
          </div>

          {/* Brush size */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-4 text-right font-mono">{brushSize}</span>
            <input type="range" min={1} max={30} value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} className="w-16 sm:w-20 accent-orange-500" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Presence */}
            <div className="hidden lg:flex items-center gap-1 mr-2">
              <Users className="w-4 h-4 text-slate-500 mr-1" />
              {activeUsers.map((u, i) => (
                <div key={i} className={`text-[10px] px-2 py-0.5 rounded border border-white/5 font-semibold ${u.name === myName ? "bg-white/5" : "bg-slate-800"}`} style={{ color: stringToColor(u.name) }}>
                  {u.name}
                </div>
              ))}
            </div>

            <button onClick={() => setShowShortcuts(true)} title="Shortcuts Guide" className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors mr-1">
              <Keyboard className="w-4 h-4" />
            </button>
            <button onClick={() => { setPan({x: 0, y: 0}); setZoom(1); }} title="Recenter Canvas" className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors mr-1">
              <LocateFixed className="w-4 h-4" />
            </button>
            
            <button onClick={undo} disabled={myStrokeKeys.length === 0} title="Undo (Ctrl+Z)" className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-colors"><Undo2 className="w-4 h-4" /></button>
            <button onClick={redo} disabled={undoneStrokes.length === 0} title="Redo (Ctrl+Y)" className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-colors"><Redo2 className="w-4 h-4" /></button>
            <button onClick={clear} disabled={sortedStrokes.length === 0 && allTextNotes.length === 0} title="Clear All" className="p-2 rounded-lg text-slate-400 hover:text-red-400 disabled:opacity-30 transition-colors mr-2"><Trash2 className="w-4 h-4" /></button>
            
            <div className="relative flex items-center bg-slate-800 rounded-lg group">
              <button onClick={() => download("visible")} title="Download Visible Area" className="p-2 text-slate-400 hover:text-white transition-colors rounded-l-lg hover:bg-white/10">
                <Download className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-white/10" />
              <button onClick={() => setShowDownloadMenu(!showDownloadMenu)} className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-r-lg hover:bg-white/10">
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {showDownloadMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowDownloadMenu(false)} />
                  <div className="absolute top-full right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-xl w-48 overflow-hidden z-50 py-1 origin-top-right animate-in fade-in zoom-in-95 duration-100">
                    <button onClick={() => { download("visible"); setShowDownloadMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3">
                      <ImageIcon className="w-4 h-4 text-slate-400" />
                      Visible Canvas
                    </button>
                    <button onClick={() => { download("full"); setShowDownloadMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-3">
                      <LocateFixed className="w-4 h-4 text-orange-400 group-hover:text-white" />
                      Export Full Canvas
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Canvas container */}
      <div ref={wrapperRef} className="flex-1 relative overflow-hidden bg-[#0f172a]" style={{ touchAction: "none" }}>
        
        {/* Infinite Grid Background (Optional enhancement for pan/zoom orientation) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
            backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`
        }} />

        <canvas
          ref={canvasRef}
          width={canvasSize.w}
          height={canvasSize.h}
          className={`absolute inset-0 w-full h-full ${tool === "hand" ? (isPanning ? "cursor-grabbing" : "cursor-grab") : tool === "eraser" ? "cursor-cell" : tool === "text" ? "cursor-text" : "cursor-crosshair"}`}
          style={{ touchAction: "none" }}
          onPointerDown={onStart} onPointerMove={onMove} onPointerUp={onEnd} onPointerCancel={onEnd}
        />

        {/* Live Cursors */}
        {activeUsers.map(u => {
          if (u.name === myName || !u.cursor) return null;
          const screenX = u.cursor.x * zoom + pan.x;
          const screenY = u.cursor.y * zoom + pan.y;
          return (
            <div key={u.name} className="absolute pointer-events-none transition-all duration-75 ease-linear z-40" style={{ left: screenX, top: screenY }}>
              <ArrowUpRight className="w-5 h-5 -rotate-90 origin-top-left drop-shadow-md" style={{ color: stringToColor(u.name), fill: stringToColor(u.name) }} />
              <div className="text-[10px] px-1.5 py-0.5 rounded font-bold text-white shadow-md absolute top-4 left-4 whitespace-nowrap" style={{ backgroundColor: stringToColor(u.name) }}>
                {u.name} {u.isDrawing && "✎"}
              </div>
            </div>
          );
        })}

        {/* Text notes overlay */}
        {allTextNotes.map(note => {
          const screenX = note.x * zoom + pan.x;
          const screenY = note.y * zoom + pan.y;
          return (
            <div key={note.id} className="absolute pointer-events-none" style={{ left: screenX, top: screenY, transform: "translateY(-100%)" }}>
              {editingNote === note.id ? (
                <input
                  autoFocus
                  value={note.text}
                  onChange={e => setLocalNotes(prev => prev.map(n => n.id === note.id ? { ...n, text: e.target.value } : n))}
                  onBlur={() => { 
                    setEditingNote(null); 
                    if (note.text.trim()) {
                      const db = getFirebaseDb();
                      set(ref(db, `tools/whiteboard/${roomKey}/notes/${note.id}`), note);
                    }
                    setLocalNotes(prev => prev.filter(n => n.id !== note.id));
                  }}
                  onKeyDown={e => { if (e.key === "Enter") { e.currentTarget.blur(); } }}
                  className="bg-transparent outline-none border-b border-dashed border-white/40 min-w-[80px] pointer-events-auto"
                  style={{ color: note.color, fontSize: note.size * zoom, fontWeight: "bold", fontFamily: "Inter, sans-serif" }}
                />
              ) : (
                <div
                  onClick={() => setEditingNote(note.id)}
                  className="cursor-text select-none hover:opacity-80 transition-opacity drop-shadow-md pointer-events-auto"
                  style={{ color: note.color, fontSize: note.size * zoom, fontWeight: "bold", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}
                >{note.text || <span className="opacity-30 text-sm">click to edit</span>}</div>
              )}
            </div>
          );
        })}

        {tool === "text" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-white/10 rounded-lg px-4 py-2 text-xs text-slate-400 pointer-events-none">
            Click anywhere on the canvas to place a text box
          </div>
        )}

      </div>

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Keyboard className="w-5 h-5 text-orange-500"/> Shortcuts</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between items-center border-b border-white/5 pb-2"><span>Pan Tool</span><kbd className="px-2 py-1 bg-slate-800 border border-white/10 rounded font-mono text-xs text-white">H / Space</kbd></div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2"><span>Pen</span><kbd className="px-2 py-1 bg-slate-800 border border-white/10 rounded font-mono text-xs text-white">P</kbd></div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2"><span>Eraser</span><kbd className="px-2 py-1 bg-slate-800 border border-white/10 rounded font-mono text-xs text-white">E</kbd></div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2"><span>Text</span><kbd className="px-2 py-1 bg-slate-800 border border-white/10 rounded font-mono text-xs text-white">T</kbd></div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2"><span>Perfect Shapes</span><kbd className="px-2 py-1 bg-slate-800 border border-white/10 rounded font-mono text-xs text-white">Hold Shift</kbd></div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2"><span>Undo</span><kbd className="px-2 py-1 bg-slate-800 border border-white/10 rounded font-mono text-xs text-white">Ctrl+Z / ⌘Z</kbd></div>
              <div className="flex justify-between items-center"><span>Redo</span><kbd className="px-2 py-1 bg-slate-800 border border-white/10 rounded font-mono text-xs text-white">Ctrl+Y / ⌘⇧Z</kbd></div>
            </div>
            <button onClick={() => setShowShortcuts(false)} className="mt-6 w-full py-2.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 transition-colors font-semibold border border-orange-500/20">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function WhiteboardInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const key = searchParams.get("room");
  
  if (!isFirebaseConfigured()) return <NotConfigured />;
  
  function handleOpen(roomKey: string) {
    const k = (roomKey || `board-${Date.now()}`).trim().replace(/\s+/g, "-").toLowerCase();
    router.push(`/tools/whiteboard?room=${encodeURIComponent(k)}`);
  }
  
  if (!key) return <WhiteboardEntry onOpen={handleOpen} />;
  return <SharedWhiteboard roomKey={key} />;
}

export default function WhiteboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <WhiteboardInner />
    </Suspense>
  );
}
