"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Check, X, Laptop, Smartphone, File, Loader2, Download, ShieldCheck, RefreshCw, Edit2 } from "lucide-react";
import Link from "next/link";
import { getFirebaseDb } from "@/lib/firebase";
import { ref, set, onValue, onDisconnect, remove, serverTimestamp } from "firebase/database";
import type Peer from "peerjs";
import type { DataConnection } from "peerjs";

const ADJECTIVES = ["Neon", "Cosmic", "Quantum", "Cyber", "Sonic", "Astral", "Plasma", "Solar", "Lunar", "Galactic"];
const ANIMALS = ["Tiger", "Wolf", "Dragon", "Phoenix", "Bear", "Falcon", "Panther", "Shark", "Eagle", "Fox"];
function generateRandomName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adj} ${animal}`;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "Calculating...";
  if (seconds < 60) return `${Math.ceil(seconds)}s left`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.ceil(seconds % 60);
  return `${mins}m ${secs}s left`;
}

async function getRoomId() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    // Simple hash to obscure IP slightly
    return btoa(data.ip).replace(/=/g, "");
  } catch (err) {
    // Fallback if IP fails
    return "global-fallback-room";
  }
}

type DiscoveredPeer = {
  id: string;
  name: string;
  timestamp: number;
  deviceId?: string;
};

type FileRequest = {
  fileId: string;
  filename: string;
  size: number;
  senderId: string;
  senderName: string;
};

type TransferState = {
  id: string; // fileId + targetId
  fileId: string;
  targetId: string;
  filename: string;
  targetName: string;
  progress: number; // 0 to 100
  status: "waiting" | "transferring" | "completed" | "failed";
  errorText?: string;
  isIncoming: boolean;
  size?: number;
  transferred?: number;
  speed?: number; // bytes per second
  timeRemaining?: number; // seconds
  startTime?: number;
};

const CHUNK_SIZE = 64 * 1024; // 64KB - Better for network stability

export default function FileSharePage() {
  const [myName, setMyName] = useState("");
  const [myPeerId, setMyPeerId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [peers, setPeers] = useState<DiscoveredPeer[]>([]);
  const [selectedPeers, setSelectedPeers] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [incomingRequests, setIncomingRequests] = useState<FileRequest[]>([]);
  const [transfers, setTransfers] = useState<TransferState[]>([]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");

  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<Record<string, DataConnection>>({});
  const receivedChunksRef = useRef<Record<string, (ArrayBuffer | Uint8Array)[]>>({});
  const receivedSizesRef = useRef<Record<string, number>>({});
  const selectedFileRef = useRef<File | null>(null);
  const myNameRef = useRef<string>("");
  const transfersRef = useRef<TransferState[]>([]);
  const cancelledTransfersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    transfersRef.current = transfers;
  }, [transfers]);

  useEffect(() => {
    selectedFileRef.current = selectedFile;
  }, [selectedFile]);

  useEffect(() => {
    myNameRef.current = myName;
  }, [myName]);

  useEffect(() => {
    // Dynamically import peerjs so it doesn't break SSR
    import("peerjs").then(({ default: PeerConstructor }) => {
      let devId = localStorage.getItem("fast-share-device-id");
      if (!devId) {
        devId = Math.random().toString(36).substring(2, 15);
        localStorage.setItem("fast-share-device-id", devId);
      }

      let storedName = localStorage.getItem("fast-share-name");
      if (!storedName) {
        storedName = generateRandomName();
        localStorage.setItem("fast-share-name", storedName);
      }

      setMyName(storedName);
      setEditNameValue(storedName);

      const peer = new PeerConstructor();
      peerRef.current = peer;

      peer.on("open", async (id) => {
        setMyPeerId(id);
        const rId = await getRoomId();
        setRoomId(rId);

        // Setup Firebase presence
        const db = getFirebaseDb();
        const myPresenceRef = ref(db, `tools/file_share/${rId}/${id}`);

        // Remove presence on disconnect
        onDisconnect(myPresenceRef).remove();

        // Set presence
        set(myPresenceRef, {
          name: storedName,
          deviceId: devId,
          timestamp: serverTimestamp()
        });

        // Listen for others in the room
        const roomRef = ref(db, `tools/file_share/${rId}`);
        onValue(roomRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const now = Date.now();
            const activePeers: DiscoveredPeer[] = [];
            const deviceMap: Record<string, DiscoveredPeer> = {};

            Object.keys(data).forEach(peerId => {
              if (peerId !== id && data[peerId].deviceId !== devId) {
                // Ignore peers older than 5 minutes (stale)
                const ts = data[peerId].timestamp || 0;
                if (now - ts < 5 * 60 * 1000) {
                  const p = {
                    id: peerId,
                    name: data[peerId].name,
                    deviceId: data[peerId].deviceId,
                    timestamp: ts
                  };
                  if (p.deviceId) {
                    if (!deviceMap[p.deviceId] || deviceMap[p.deviceId].timestamp < p.timestamp) {
                      deviceMap[p.deviceId] = p;
                    }
                  } else {
                    activePeers.push(p);
                  }
                }
              }
            });
            const deduplicatedPeers = [...activePeers, ...Object.values(deviceMap)];

            // Enforce unique names visually
            const finalPeers: DiscoveredPeer[] = [];
            const nameCounts: Record<string, number> = {};

            if (myNameRef.current) {
              nameCounts[myNameRef.current] = 1;
            }

            deduplicatedPeers.forEach(p => {
              let finalName = p.name;
              let suffix = 1;
              while (nameCounts[finalName]) {
                suffix++;
                finalName = `${p.name} ${suffix}`;
              }
              nameCounts[finalName] = 1;
              finalPeers.push({ ...p, name: finalName });
            });

            setPeers(finalPeers);

            // Auto-cleanup stale selected peers
            setSelectedPeers(prev => prev.filter(pId => finalPeers.some(p => p.id === pId)));
          } else {
            setPeers([]);
          }
        });
      });

      peer.on("connection", (conn) => {
        setupConnection(conn);
      });

      return () => {
        peer.destroy();
        if (roomId && myPeerId) {
          const db = getFirebaseDb();
          remove(ref(db, `tools/file_share/${roomId}/${myPeerId}`));
        }
      };
    });
  }, []);

  const updatePresenceName = (newName: string) => {
    if (!myPeerId || !roomId) return;
    setMyName(newName);
    setIsEditingName(false);

    localStorage.setItem("fast-share-name", newName);

    const devId = localStorage.getItem("fast-share-device-id");
    const db = getFirebaseDb();
    set(ref(db, `tools/file_share/${roomId}/${myPeerId}`), {
      name: newName,
      deviceId: devId,
      timestamp: serverTimestamp()
    });
  };

  const setupConnection = (conn: DataConnection) => {
    if (connectionsRef.current[conn.peer]) return;
    connectionsRef.current[conn.peer] = conn;

    conn.on("data", (data: any) => {
      if (data && typeof data === "object" && data.type) {
        // Signaling Message
        if (data.type === "request") {
          setIncomingRequests(prev => {
            if (prev.some(r => r.fileId === data.fileId)) return prev;
            return [...prev, {
              fileId: data.fileId,
              filename: data.filename,
              size: data.size,
              senderId: conn.peer,
              senderName: data.senderName
            }];
          });
        } else if (data.type === "accept") {
          startSendingFile(data.fileId, conn);
        } else if (data.type === "reject") {
          updateTransferState(`${data.fileId}-${conn.peer}`, { status: "failed", errorText: "Declined" });
        } else if (data.type === "cancel") {
          cancelledTransfersRef.current.add(data.fileId);
          const errorText = data.bySender ? "Cancelled by sender" : "Cancelled by receiver";
          updateTransferState(`${data.fileId}-${conn.peer}`, { status: "failed", errorText });
          if (receivedChunksRef.current[data.fileId]) {
            delete receivedChunksRef.current[data.fileId];
            delete receivedSizesRef.current[data.fileId];
          }
        } else if (data.type === "done") {
          handleTransferComplete(data.fileId, data.filename, conn.peer);
        }
      } else {
        // Raw Binary Chunk
        const activeTransfer = transfersRef.current.find(t =>
          t.targetId === conn.peer &&
          t.status === "transferring" &&
          t.isIncoming
        );
        if (activeTransfer) {
          handleReceivedChunk(activeTransfer.fileId, data, conn.peer);
        }
      }
    });

    conn.on("close", () => {
      delete connectionsRef.current[conn.peer];
      setTransfers(prev => prev.map(t => {
        if (t.targetId === conn.peer && (t.status === "transferring" || t.status === "waiting")) {
          return { ...t, status: "failed", errorText: "Disconnected" };
        }
        return t;
      }));
    });
  };

  const handleReceivedChunk = (fileId: string, chunk: any, senderId: string) => {
    if (!receivedChunksRef.current[fileId]) {
      receivedChunksRef.current[fileId] = [];
      receivedSizesRef.current[fileId] = 0;
    }

    receivedChunksRef.current[fileId].push(chunk);

    const chunkSize = chunk.byteLength || chunk.size || chunk.length || 0;
    receivedSizesRef.current[fileId] += chunkSize;

    const currentSize = receivedSizesRef.current[fileId];
    const now = Date.now();

    // Find total size from the incoming request to calculate progress
    setTransfers(prev => {
      const idx = prev.findIndex(t => t.id === `${fileId}-${senderId}`);
      if (idx !== -1) {
        const t = prev[idx];
        if (t.size) {
          const newProgress = Math.floor((currentSize / t.size) * 100);
          if (newProgress > t.progress || currentSize === t.size) {
            const elapsed = (now - (t.startTime || now)) / 1000;
            const speed = elapsed > 0 ? currentSize / elapsed : 0;
            const timeRemaining = speed > 0 ? (t.size - currentSize) / speed : 0;

            const newTransfers = [...prev];
            newTransfers[idx] = {
              ...t,
              progress: newProgress,
              transferred: currentSize,
              speed,
              timeRemaining
            };
            return newTransfers;
          }
        }
      }
      return prev;
    });
  };

  const handleTransferComplete = (fileId: string, filename: string, senderId: string) => {
    const chunks = receivedChunksRef.current[fileId];
    if (chunks) {
      const blob = new Blob(chunks);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      delete receivedChunksRef.current[fileId];
      delete receivedSizesRef.current[fileId];

      updateTransferState(`${fileId}-${senderId}`, { status: "completed", progress: 100 });
    }
  };

  const updateTransferState = (id: string, updates: Partial<TransferState>) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const acceptRequest = (req: FileRequest) => {
    setIncomingRequests(prev => prev.filter(r => r.fileId !== req.fileId));

    setTransfers(prev => [...prev, {
      id: `${req.fileId}-${req.senderId}`,
      fileId: req.fileId,
      targetId: req.senderId,
      filename: req.filename,
      targetName: req.senderName,
      progress: 0,
      status: "transferring",
      isIncoming: true,
      size: req.size,
      transferred: 0,
      startTime: Date.now()
    }]);

    const conn = connectionsRef.current[req.senderId];
    if (conn) {
      conn.send({ type: "accept", fileId: req.fileId });
    }
  };

  const rejectRequest = (req: FileRequest) => {
    setIncomingRequests(prev => prev.filter(r => r.fileId !== req.fileId));
    const conn = connectionsRef.current[req.senderId];
    if (conn) {
      conn.send({ type: "reject", fileId: req.fileId });
    }
  };

  const cancelTransfer = (fileId: string, targetId: string) => {
    cancelledTransfersRef.current.add(fileId);

    setTransfers(prev => {
      const t = prev.find(tr => tr.id === `${fileId}-${targetId}`);
      if (t) {
        const conn = connectionsRef.current[targetId];
        if (conn && conn.open) {
          conn.send({ type: "cancel", fileId, bySender: !t.isIncoming });
        }
      }
      return prev;
    });

    updateTransferState(`${fileId}-${targetId}`, { status: "failed", errorText: "Cancelled by you" });

    if (receivedChunksRef.current[fileId]) {
      delete receivedChunksRef.current[fileId];
      delete receivedSizesRef.current[fileId];
    }
  };

  const handleSend = () => {
    if (!selectedFile || selectedPeers.length === 0 || !peerRef.current) return;

    selectedPeers.forEach(peerId => {
      const targetPeer = peers.find(p => p.id === peerId);
      if (!targetPeer) return;

      const fileId = Math.random().toString(36).substring(2, 10).padEnd(8, '0');
      const transferId = `${fileId}-${peerId}`;
      setTransfers(prev => [...prev, {
        id: transferId,
        fileId,
        targetId: peerId,
        filename: selectedFile.name,
        targetName: targetPeer.name,
        progress: 0,
        status: "waiting",
        isIncoming: false,
        size: selectedFile.size
      }]);

      let conn = connectionsRef.current[peerId];
      if (!conn) {
        conn = peerRef.current!.connect(peerId);
        setupConnection(conn);
      }

      // Wait for connection to open before sending request
      const sendReq = () => {
        conn.send({
          type: "request",
          fileId,
          filename: selectedFile.name,
          size: selectedFile.size,
          senderName: myName
        });
      };

      if (conn.open) {
        sendReq();
      } else {
        conn.once("open", sendReq);
      }
    });
  };

  const startSendingFile = (fileId: string, conn: DataConnection) => {
    const currentFile = selectedFileRef.current;
    if (!currentFile) return;

    const transferId = `${fileId}-${conn.peer}`;
    const startTime = Date.now();
    updateTransferState(transferId, {
      status: "transferring",
      startTime,
      size: currentFile.size,
      transferred: 0
    });

    const reader = new FileReader();
    let offset = 0;
    let lastProgress = 0;

    const readChunk = () => {
      if (!conn.open) {
        updateTransferState(transferId, { status: "failed", errorText: "Disconnected" });
        return;
      }
      if (cancelledTransfersRef.current.has(fileId)) {
        return;
      }

      // Implement event-driven backpressure for absolute maximum throughput
      const dataChannel = (conn as any).dataChannel as RTCDataChannel;
      if (dataChannel && dataChannel.bufferedAmount > 2 * 1024 * 1024) {
        if ("onbufferedamountlow" in dataChannel) {
          dataChannel.bufferedAmountLowThreshold = 1024 * 1024; // 1MB
          dataChannel.onbufferedamountlow = () => {
            dataChannel.onbufferedamountlow = null;
            readChunk();
          };
        } else {
          setTimeout(readChunk, 5); // Fallback for ancient browsers
        }
        return;
      }

      const slice = currentFile.slice(offset, offset + CHUNK_SIZE);
      reader.readAsArrayBuffer(slice);
    };

    reader.onload = (e) => {
      if (!e.target || !e.target.result) return;

      const chunk = e.target.result as ArrayBuffer;

      // Mixed Mode Optimization: Send raw binary for chunks
      conn.send(chunk);

      offset += chunk.byteLength;

      const progress = Math.floor((offset / currentFile.size) * 100);
      if (progress > lastProgress || progress === 100) {
        lastProgress = progress;

        const elapsed = (Date.now() - startTime) / 1000;
        const speed = elapsed > 0 ? offset / elapsed : 0;
        const timeRemaining = speed > 0 ? (currentFile.size - offset) / speed : 0;

        updateTransferState(transferId, {
          progress,
          transferred: offset,
          speed,
          timeRemaining
        });
      }

      if (offset < currentFile.size) {
        // Read next chunk immediately
        readChunk();
      } else {
        conn.send({
          type: "done",
          fileId,
          filename: currentFile.name
        });
        updateTransferState(transferId, { status: "completed", progress: 100 });
      }
    };

    readChunk();
  };

  const togglePeerSelection = (id: string) => {
    setSelectedPeers(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">Sooom - File Transfer</span>
          </div>

          {myPeerId ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-white/5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {isEditingName ? (
                  <input
                    autoFocus
                    value={editNameValue}
                    onChange={e => setEditNameValue(e.target.value)}
                    onBlur={() => updatePresenceName(editNameValue)}
                    onKeyDown={e => e.key === "Enter" && updatePresenceName(editNameValue)}
                    className="bg-transparent text-sm text-white font-medium w-32 outline-none border-b border-indigo-400"
                  />
                ) : (
                  <span className="text-sm font-medium text-white">{myName}</span>
                )}
                {!isEditingName && (
                  <button onClick={() => setIsEditingName(true)} className="text-slate-400 hover:text-white ml-1">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Connecting...
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Radar / Discovered Peers Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              Nearby Devices
              {peers.length > 0 && <span className="text-sm bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-full font-semibold">{peers.length} found</span>}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-white/5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              Scanning local network
            </div>
          </div>

          <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 min-h-[300px] flex items-center justify-center relative overflow-hidden">
            {/* Radar Background */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
              <div className="w-64 h-64 border border-indigo-500/20 rounded-full absolute" />
              <div className="w-[400px] h-[400px] border border-indigo-500/10 rounded-full absolute" />
              <div className="w-[600px] h-[600px] border border-indigo-500/5 rounded-full absolute" />
            </div>

            {peers.length === 0 ? (
              <div className="text-center z-10">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin opacity-50" />
                  <Smartphone className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Waiting for others...</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Open this page on another device connected to the same Wi-Fi network.</p>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-6 z-10 w-full">
                <AnimatePresence>
                  {peers.map(p => {
                    const isSelected = selectedPeers.includes(p.id);
                    return (
                      <motion.button
                        key={p.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => togglePeerSelection(p.id)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all ${isSelected
                            ? "bg-indigo-500/20 border-indigo-500/50 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]"
                            : "bg-slate-800/50 border-white/5 hover:bg-slate-800 hover:border-white/10"
                          } border w-32`}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center relative ${isSelected ? "bg-indigo-500" : "bg-slate-700"}`}>
                          <Laptop className={`w-8 h-8 ${isSelected ? "text-white" : "text-slate-300"}`} />
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="text-center w-full">
                          <div className="text-sm font-bold text-white truncate px-1" title={p.name}>{p.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">Ready</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <AnimatePresence>
          {selectedPeers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl mb-12 flex flex-col sm:flex-row gap-6 items-center"
            >
              <div className="flex-1 w-full">
                <label className="block border-2 border-dashed border-indigo-500/30 rounded-2xl p-6 text-center hover:border-indigo-500/60 hover:bg-indigo-500/5 transition-colors cursor-pointer group">
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <File className="w-8 h-8 text-indigo-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  {selectedFile ? (
                    <div>
                      <div className="text-indigo-300 font-semibold truncate max-w-xs mx-auto">{selectedFile.name}</div>
                      <div className="text-slate-400 text-xs mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-indigo-400 font-semibold">Select a file to send</div>
                      <div className="text-slate-500 text-xs mt-1">Any file type, securely transferred P2P</div>
                    </div>
                  )}
                </label>
              </div>

              <button
                onClick={handleSend}
                disabled={!selectedFile}
                className="w-full sm:w-auto px-8 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-lg shadow-indigo-500/20"
              >
                Send to {selectedPeers.length} {selectedPeers.length === 1 ? 'Device' : 'Devices'}
                <Send className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Incoming Requests */}
        <AnimatePresence>
          {incomingRequests.map((req, i) => (
            <motion.div
              key={req.fileId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-sky-900/30 border border-sky-500/30 rounded-2xl p-5 mb-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl shadow-sky-900/20"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <Download className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <div className="text-sky-100 font-semibold flex items-center gap-2">
                    {req.senderName} wants to send you a file
                  </div>
                  <div className="text-sky-300/70 text-sm mt-0.5 truncate max-w-[200px] sm:max-w-md">
                    {req.filename} • {(req.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => acceptRequest(req)} className="flex-1 sm:flex-none px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition-colors">Accept</button>
                <button onClick={() => rejectRequest(req)} className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">Decline</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Active Transfers */}
        {transfers.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-white mb-4">Transfers</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {transfers.map(transfer => (
                  <motion.div
                    key={transfer.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-slate-900 border border-white/10 rounded-2xl p-4 overflow-hidden relative"
                  >
                    {/* Progress Bar Background */}
                    <div
                      className="absolute inset-0 bg-indigo-500/10 pointer-events-none transition-all duration-300 ease-out"
                      style={{ width: `${transfer.progress}%` }}
                    />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between p-1">
                      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${transfer.isIncoming ? "bg-sky-500/20 text-sky-400" : "bg-indigo-500/20 text-indigo-400"}`}>
                          {transfer.isIncoming ? <Download className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 pt-0.5">
                          <div className="text-white font-semibold text-sm truncate">
                            {transfer.filename}
                          </div>

                          <div className="text-[11px] sm:text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 leading-tight">
                            {transfer.transferred !== undefined && transfer.size ? (
                              <span className="font-medium text-slate-300">
                                {formatBytes(transfer.transferred)} / {formatBytes(transfer.size)}
                              </span>
                            ) : null}
                            <span className="hidden sm:inline">•</span>
                            <span>{transfer.isIncoming ? "From" : "To"} {transfer.targetName}</span>

                            {transfer.status === "transferring" && transfer.speed && transfer.speed > 0 ? (
                              <>
                                <span>•</span>
                                <span className="text-emerald-400 font-mono">{formatBytes(transfer.speed)}/s</span>
                                <span>•</span>
                                <span>{formatTime(transfer.timeRemaining || 0)}</span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end flex-shrink-0 pl-12 sm:pl-0 mt-2 sm:mt-0">
                        {transfer.status === "waiting" && <span className="text-amber-400 text-sm font-medium animate-pulse">Waiting for accept...</span>}
                        {transfer.status === "transferring" && (
                          <div className="flex items-center gap-4">
                            <span className="text-indigo-400 font-mono font-bold text-lg">{transfer.progress}%</span>
                            <button
                              onClick={() => cancelTransfer(transfer.fileId, transfer.targetId)}
                              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-red-400 transition-colors shadow-sm"
                              title="Cancel Transfer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {transfer.status === "completed" && <span className="text-emerald-400 flex items-center gap-1.5 font-medium"><Check className="w-4 h-4" /> Done</span>}
                        {transfer.status === "failed" && <span className="text-red-400 flex items-center gap-1.5 font-medium text-sm"><X className="w-4 h-4" /> {transfer.errorText || "Failed"}</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="mt-16 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <ShieldCheck className="w-4 h-4" />
            End-to-End Encrypted via WebRTC
          </div>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            Files are transferred directly between devices using your local network when possible. No files are ever uploaded to any server.
          </p>
        </div>

      </div>
    </div>
  );
}
