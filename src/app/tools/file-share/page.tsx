"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Check, X, Monitor, Smartphone, Tablet, File, Folder, Loader2, Download, ShieldCheck, RefreshCw, Edit2 } from "lucide-react";
import Link from "next/link";
import { getFirebaseDb } from "@/lib/firebase";
import { ref, set, onValue, onDisconnect, remove, serverTimestamp } from "firebase/database";
import type Peer from "peerjs";
import type { DataConnection } from "peerjs";
import JSZip from "jszip";

const ADJECTIVES = ["Neon", "Cosmic", "Quantum", "Cyber", "Sonic", "Astral", "Plasma", "Solar", "Lunar", "Galactic"];
const ANIMALS = ["Tiger", "Wolf", "Dragon", "Phoenix", "Bear", "Falcon", "Panther", "Shark", "Eagle", "Fox"];
function generateRandomName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${adj} ${animal}`;
}

function getDeviceType() {
  if (typeof window === "undefined") return "desktop";
  const ua = window.navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
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

const PeerIcon = ({ type, className }: { type?: string, className?: string }) => {
  if (type === "mobile") return <Smartphone className={className} />;
  if (type === "tablet") return <Tablet className={className} />;
  return <Monitor className={className} />;
};

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
  deviceType?: "desktop" | "mobile" | "tablet";
};

type FileRequest = {
  fileId: string;
  filename: string;
  size: number;
  senderId: string;
  senderName: string;
  isBatch?: boolean;
  batchFiles?: { fileId: string; filename: string; size: number }[];
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
  speed?: number;
  timeRemaining?: number;
  startTime?: number;
  batchId?: string;
};

const CHUNK_SIZE = 64 * 1024; // 64KB - Better for network stability

export default function FileSharePage() {
  const [myName, setMyName] = useState("");
  const [myPeerId, setMyPeerId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [peers, setPeers] = useState<DiscoveredPeer[]>([]);
  const [selectedPeers, setSelectedPeers] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [shouldZip, setShouldZip] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [expandedBatches, setExpandedBatches] = useState<string[]>([]);

  const [incomingRequests, setIncomingRequests] = useState<FileRequest[]>([]);
  const [transfers, setTransfers] = useState<TransferState[]>([]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState("");

  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<Record<string, DataConnection>>({});
  const receivedChunksRef = useRef<Record<string, (ArrayBuffer | Uint8Array)[]>>({});
  const receivedSizesRef = useRef<Record<string, number>>({});
  const selectedFilesRef = useRef<File[]>([]);
  const pendingFilesRef = useRef<Record<string, File>>({});
  const pendingBatchesRef = useRef<Record<string, string[]>>({}); // batchId -> fileIds
  const myNameRef = useRef<string>("");
  const transfersRef = useRef<TransferState[]>([]);
  const cancelledTransfersRef = useRef<Set<string>>(new Set());
  
  // High-performance streaming refs
  const fileHandlesRef = useRef<Record<string, any>>({});
  const writablesRef = useRef<Record<string, any>>({});

  useEffect(() => {
    transfersRef.current = transfers;
  }, [transfers]);

  useEffect(() => {
    selectedFilesRef.current = selectedFiles;
  }, [selectedFiles]);

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

    const initPeer = () => {
      const peer = new PeerConstructor();
      peerRef.current = peer;

      peer.on("open", async (id) => {
        setMyPeerId(id);
        const rId = await getRoomId();
        setRoomId(rId);

        // Setup Firebase presence
        const db = getFirebaseDb();
        const myPresenceRef = ref(db, `tools/file_share/${rId}/${id}`);
        const deviceType = getDeviceType();

        // Remove presence on disconnect
        onDisconnect(myPresenceRef).remove();

        // Set presence
        set(myPresenceRef, {
          name: storedName,
          deviceId: devId,
          deviceType: deviceType,
          timestamp: serverTimestamp()
        });

        // Listen for others in the room
        const roomRef = ref(db, `tools/file_share/${rId}`);
        const unsubscribe = onValue(roomRef, (snapshot) => {
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
                    deviceType: data[peerId].deviceType,
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
      };
    };

      const cleanupPeer = initPeer();
      return () => {
        if (cleanupPeer) cleanupPeer();
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
      deviceType: getDeviceType(),
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
              senderName: data.senderName,
              isBatch: data.isBatch,
              batchFiles: data.batchFiles
            }];
          });
        } else if (data.type === "accept") {
          if (data.isBatch && pendingBatchesRef.current[data.fileId]) {
            pendingBatchesRef.current[data.fileId].forEach(fId => {
              startSendingFile(fId, conn);
            });
            delete pendingBatchesRef.current[data.fileId];
          } else {
            startSendingFile(data.fileId, conn);
          }
        } else if (data.type === "reject") {
          const batchId = data.fileId.trim();
          setTransfers(prev => prev.map(t => {
            if (t.id === `${batchId}-${conn.peer}` || t.batchId === batchId) {
              return { ...t, status: "failed", errorText: "Declined" };
            }
            return t;
          }));
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
      } else if (data instanceof ArrayBuffer || (data && data.byteLength !== undefined)) {
        // Raw Binary Chunk with 8-byte header
        const buffer = data as ArrayBuffer;
        if (buffer.byteLength >= 8) {
          const view = new Uint8Array(buffer);
          const fileIdBytes = view.subarray(0, 8);
          const fileId = new TextDecoder().decode(fileIdBytes).trim();
          const chunk = view.subarray(8);
          handleReceivedChunk(fileId, chunk, conn.peer);
        }
      }
    });

    conn.on("close", () => {
      delete connectionsRef.current[conn.peer];
      // Clean up any pending files for this peer
      Object.keys(pendingFilesRef.current).forEach(fileId => {
        const transferId = `${fileId}-${conn.peer}`;
        if (transfersRef.current.find(t => t.id === transferId)) {
          delete pendingFilesRef.current[fileId];
        }
      });
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

    // Direct-to-Disk Stream Writing
    const writable = writablesRef.current[fileId];
    if (writable) {
      try {
        // We don't await here to keep the data channel moving at max speed
        // The writable stream has its own internal buffering
        writable.write(chunk).catch((err: any) => console.error("Disk write error", err));
        // Clear the chunk from memory immediately
        receivedChunksRef.current[fileId] = []; 
      } catch (err) {
        console.error("Failed to write to disk", err);
      }
    }

    const currentSize = receivedSizesRef.current[fileId];
    const now = Date.now();

    // Find total size from the incoming request to calculate progress
    setTransfers(prev => {
      const idx = prev.findIndex(t => t.id === `${fileId}-${senderId}`);
      if (idx !== -1) {
          const t = prev[idx];
        if (t.size) {
          const newProgress = Math.floor((currentSize / t.size) * 100);
          
          // Use the existing startTime or initialize it if missing
          const tStartTime = t.startTime || now;
          const elapsed = (now - tStartTime) / 1000;
          
          // Only calculate speed and ETA after a small stabilization period (e.g., 0.5s)
          const speed = elapsed > 0.5 ? currentSize / elapsed : (t.speed || 0);
          const timeRemaining = speed > 0 ? (t.size - currentSize) / speed : 0;

          // Update state if: progress changed, speed was missing, 500ms passed, OR we just set the startTime
          const lastUpdate = (t as any).lastUpdate || 0;
          if (newProgress > t.progress || currentSize === t.size || !t.speed || !t.startTime || (now - lastUpdate > 500)) {
            const newTransfers = [...prev];
            newTransfers[idx] = {
              ...t,
              startTime: tStartTime, // IMPORTANT: Persist the start time!
              progress: newProgress,
              transferred: currentSize,
              speed: isFinite(speed) ? speed : 0,
              timeRemaining: isFinite(timeRemaining) ? timeRemaining : 0,
              lastUpdate: now
            } as any;
            return newTransfers;
          }
        }
      }
      return prev;
    });
  };

  const handleTransferComplete = async (fileId: string, filename: string, senderId: string) => {
    const transferId = `${fileId}-${senderId}`;
    updateTransferState(transferId, { status: "completed", progress: 100 });

    const writable = writablesRef.current[fileId];
    if (writable) {
      try {
        await writable.close();
        delete writablesRef.current[fileId];
        delete fileHandlesRef.current[fileId];
        return; // File is already saved to disk!
      } catch (err) {
        console.error("Failed to close writable stream", err);
      }
    }

    const chunks = receivedChunksRef.current[fileId];
    if (chunks) {
      const blob = new Blob(chunks as BlobPart[]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      delete receivedChunksRef.current[fileId];
      delete receivedSizesRef.current[fileId];
    }
    delete pendingFilesRef.current[fileId];
    
    setTransfers(prev => prev.map(t => 
      t.fileId === fileId ? { ...t, status: "completed", progress: 100 } : t
    ));
  };

  const updateTransferState = (id: string, updates: Partial<TransferState>) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const acceptRequest = async (req: FileRequest) => {
    const conn = connectionsRef.current[req.senderId];
    if (!conn) return;

    setIncomingRequests(prev => prev.filter(r => r.fileId !== req.fileId));

    // Check for Direct-to-Disk support
    const supportsFileSystem = typeof window !== "undefined" && 'showSaveFilePicker' in window;
    let directoryHandle = null;

    if (supportsFileSystem) {
      try {
        if (req.isBatch) {
          // For batches, we ask for a directory once
          if ('showDirectoryPicker' in window) {
            directoryHandle = await (window as any).showDirectoryPicker({
              mode: 'readwrite',
              startIn: 'downloads'
            });
          }
        }
      } catch (err) {
        console.log("User cancelled directory picker, falling back to RAM", err);
      }
    }

    if (req.isBatch && req.batchFiles) {
      const batchFilesTransfers: TransferState[] = await Promise.all(req.batchFiles.map(async f => {
        const fId = f.fileId.trim();
        
        // Setup direct writing for each file in the batch if directory is picked
        if (directoryHandle) {
          try {
            const fileHandle = await directoryHandle.getFileHandle(f.filename, { create: true });
            const writable = await fileHandle.createWritable();
            fileHandlesRef.current[fId] = fileHandle;
            writablesRef.current[fId] = writable;
          } catch (err) {
            console.error("Error setting up batch file stream", err);
          }
        }

        return {
          id: `${fId}-${req.senderId}`,
          fileId: fId,
          batchId: req.fileId.trim(),
          targetId: req.senderId,
          filename: f.filename,
          targetName: req.senderName,
          progress: 0,
          status: "transferring",
          isIncoming: true,
          size: f.size,
          transferred: 0,
          startTime: Date.now()
        };
      }));

      setTransfers(prev => [...prev, ...batchFilesTransfers]);
      conn.send({ type: "accept", fileId: req.fileId, isBatch: true });
    } else {
      const fileId = req.fileId.trim();
      
      // Setup direct writing for single file
      if (supportsFileSystem) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: req.filename,
            startIn: 'downloads'
          });
          const writable = await fileHandle.createWritable();
          fileHandlesRef.current[fileId] = fileHandle;
          writablesRef.current[fileId] = writable;
        } catch (err) {
          console.log("User cancelled file picker, falling back to RAM", err);
        }
      }

      const newTransfer: TransferState = {
        id: `${fileId}-${req.senderId}`,
        fileId,
        targetId: req.senderId,
        filename: req.filename,
        targetName: req.senderName,
        progress: 0,
        status: "transferring",
        isIncoming: true,
        size: req.size,
        transferred: 0,
        startTime: Date.now()
      };
      setTransfers(prev => [...prev, newTransfer]);
      conn.send({ type: "accept", fileId: req.fileId, isBatch: false });
    }
  };

  const rejectRequest = (req: FileRequest) => {
    setIncomingRequests(prev => prev.filter(r => r.fileId !== req.fileId));
    const conn = connectionsRef.current[req.senderId];
    if (conn) {
      conn.send({ type: "reject", fileId: req.fileId });
    }
  };

  const cancelTransfer = async (gid: string) => {
    cancelledTransfersRef.current.add(gid);
    
    // Cleanup any active streams/chunks
    setTransfers(prev => prev.map(t => {
      if (t.id === gid || t.batchId === gid) {
        const fileId = t.fileId;
        
        // Close writable if exists
        const writable = writablesRef.current[fileId];
        if (writable) {
          try { (writable as any).abort(); } catch (e) {}
          delete writablesRef.current[fileId];
          delete fileHandlesRef.current[fileId];
        }
        
        // Clear RAM chunks
        delete receivedChunksRef.current[fileId];
        delete receivedSizesRef.current[fileId];
        
        // Notify peer
        const conn = connectionsRef.current[t.targetId];
        if (conn && conn.open) {
          conn.send({ type: "cancel", fileId: t.fileId });
        }
        
        return { ...t, status: "failed" as const, errorText: "Cancelled" };
      }
      return t;
    }));
  };

  const handleSend = async () => {
    if (selectedFiles.length === 0 || selectedPeers.length === 0) return;

    let filesToSend: File[] = [...selectedFiles];
    
    if (shouldZip) {
      setIsZipping(true);
      try {
        const zip = new JSZip();
        selectedFiles.forEach(file => {
          const path = (file as any).webkitRelativePath || file.name;
          zip.file(path, file);
        });
        const blob = await zip.generateAsync({ type: "blob" });
        const zipFile = new (window.File as any)([blob], "Sooom_Transfer.zip", { type: "application/zip" });
        filesToSend = [zipFile];
      } catch (err) {
        console.error("Zipping failed", err);
        return;
      } finally {
        setIsZipping(false);
      }
    }

    selectedPeers.forEach(peerId => {
      const targetPeer = peers.find(p => p.id === peerId);
      if (!targetPeer) return;

      let conn = connectionsRef.current[peerId];
      if (!conn || !conn.open) {
        conn = peerRef.current!.connect(peerId);
        setupConnection(conn);
      }

      if (filesToSend.length > 1) {
        // Send as Batch
        const rawBatchId = Math.random().toString(36).substring(2, 10).padEnd(8, " ");
        const batchId = rawBatchId.trim();
        
        const batchFiles = filesToSend.map(file => {
          const rawFileId = Math.random().toString(36).substring(2, 10).padEnd(8, " ");
          const fileId = rawFileId.trim();
          pendingFilesRef.current[fileId] = file;
          
          const transferId = `${fileId}-${peerId}`;
          setTransfers(prev => [...prev, {
            id: transferId,
            fileId,
            batchId: batchId,
            targetId: peerId,
            filename: file.name,
            targetName: targetPeer.name,
            progress: 0,
            status: "waiting",
            isIncoming: false,
            size: file.size
          }]);
          
          return { fileId: rawFileId, filename: file.name, size: file.size };
        });
        pendingBatchesRef.current[batchId] = batchFiles.map(f => f.fileId.trim());

        const sendBatchReq = () => {
          conn.send({
            type: "request",
            fileId: rawBatchId,
            filename: `${filesToSend.length} items`,
            size: filesToSend.reduce((acc, f) => acc + f.size, 0),
            senderName: myName,
            isBatch: true,
            batchFiles
          });
        };

        if (conn.open) sendBatchReq();
        else conn.once("open", sendBatchReq);

      } else if (filesToSend.length === 1) {
        // Send single file
        const file = filesToSend[0];
        const fileId = Math.random().toString(36).substring(2, 10).padEnd(8, " ");
        pendingFilesRef.current[fileId] = file;
        const transferId = `${fileId}-${peerId}`;

        setTransfers(prev => [...prev, {
          id: transferId,
          fileId,
          targetId: peerId,
          filename: file.name,
          targetName: targetPeer.name,
          progress: 0,
          status: "waiting",
          isIncoming: false,
          size: file.size
        }]);

        const sendReq = () => {
          conn.send({
            type: "request",
            fileId,
            filename: file.name,
            size: file.size,
            senderName: myName
          });
        };

        if (conn.open) sendReq();
        else conn.once("open", sendReq);
      }
    });
  };

  const startSendingFile = (fileId: string, conn: DataConnection) => {
    const currentFile = pendingFilesRef.current[fileId];
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


    const waitForBuffer = async () => {
      const dataChannel = (conn as any).dataChannel as RTCDataChannel;
      if (!dataChannel) return;
      
      if (dataChannel.bufferedAmount > 1024 * 1024) {
        return new Promise<void>(resolve => {
          const check = () => {
            if (dataChannel.bufferedAmount < 512 * 1024) {
              resolve();
            } else {
              setTimeout(check, 50);
            }
          };
          check();
        });
      }
    };

    const readChunk = async () => {
      if (!conn.open) {
        updateTransferState(transferId, { status: "failed", errorText: "Disconnected" });
        return;
      }
      if (cancelledTransfersRef.current.has(fileId)) {
        return;
      }

      await waitForBuffer();

      const slice = currentFile.slice(offset, offset + CHUNK_SIZE);
      reader.readAsArrayBuffer(slice);
    };

    reader.onload = (e) => {
      if (!e.target || !e.target.result) return;

      const chunk = e.target.result as ArrayBuffer;
      
      // Prepend 8-byte fileId to the chunk
      const fileIdBytes = new TextEncoder().encode(fileId.padEnd(8, " "));
      const payload = new Uint8Array(8 + chunk.byteLength);
      payload.set(fileIdBytes, 0);
      payload.set(new Uint8Array(chunk), 8);
      
      conn.send(payload.buffer);

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
                          <PeerIcon type={p.deviceType} className={`w-8 h-8 ${isSelected ? "text-white" : "text-slate-300"}`} />
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
              className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl mb-12"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* File Selection Area */}
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex gap-2">
                      <label className="flex-1 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-2xl p-4 text-center cursor-pointer transition-all group">
                        <input 
                          type="file" 
                          multiple 
                          className="hidden" 
                          onChange={e => setSelectedFiles(prev => [...prev, ...Array.from(e.target.files || [])])}
                        />
                        <File className="w-6 h-6 text-indigo-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold text-slate-300">Add Files</span>
                      </label>
                      
                      <label className="flex-1 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-2xl p-4 text-center cursor-pointer transition-all group">
                        <input 
                          type="file" 
                          {...({ webkitdirectory: "", directory: "" } as any)} 
                          className="hidden" 
                          onChange={e => setSelectedFiles(prev => [...prev, ...Array.from(e.target.files || [])])}
                        />
                        <Folder className="w-6 h-6 text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold text-slate-300">Add Folder</span>
                      </label>
                    </div>

                    {/* Selection List */}
                    <div className="bg-slate-950/50 rounded-2xl border border-white/5 p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
                      {selectedFiles.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 py-4">
                          <p className="text-xs">No files selected</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedFiles.slice(0, 15).map((f, i) => (
                            <div key={i} className="flex items-center justify-between gap-3 bg-white/5 rounded-lg p-2 group">
                              <div className="flex items-center gap-2 min-w-0">
                                <File className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                <span className="text-xs text-slate-200 truncate font-medium">
                                  {(f as any).webkitRelativePath || f.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 whitespace-nowrap">{formatBytes(f.size)}</span>
                                <button 
                                  onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                  className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors text-slate-600"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                          {selectedFiles.length > 15 && (
                            <div className="text-center py-2 border-t border-white/5 mt-2">
                              <p className="text-[10px] text-slate-500 font-medium">
                                + {selectedFiles.length - 15} more items in queue
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Settings Area */}
                  <div className="w-full lg:w-64 flex flex-col gap-4">
                    <div className="bg-slate-800/50 border border-white/5 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-indigo-400" />
                          <span className="text-sm font-bold text-white">Zip & Send</span>
                        </div>
                        <button 
                          onClick={() => setShouldZip(!shouldZip)}
                          className={`w-10 h-5 rounded-full relative transition-colors ${shouldZip ? "bg-indigo-500" : "bg-slate-700"}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${shouldZip ? "right-1" : "left-1"}`} />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Combine all items into one .zip file before sending. Preserves folder structures.
                      </p>
                    </div>

                    <div className="flex-1 flex flex-col justify-end gap-2">
                      <div className="flex items-center justify-between px-2 py-1">
                        <span className="text-[10px] text-slate-500 font-medium">Batch Summary</span>
                        <span className="text-[10px] text-indigo-400 font-bold">
                          {selectedFiles.length} Items · {formatBytes(selectedFiles.reduce((acc, f) => acc + f.size, 0))}
                        </span>
                      </div>
                      <button 
                        onClick={handleSend}
                        disabled={selectedFiles.length === 0 || isZipping}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-3 transition-colors shadow-lg shadow-indigo-500/20"
                      >
                        {isZipping ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Zipping...
                          </>
                        ) : (
                          <>
                            Send to {selectedPeers.length} {selectedPeers.length === 1 ? 'Device' : 'Devices'}
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => setSelectedFiles([])}
                        className="text-xs text-slate-500 hover:text-white py-2 transition-colors"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
              className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl mb-4"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  {req.isBatch ? <Folder className="w-6 h-6 text-indigo-400" /> : <File className="w-6 h-6 text-indigo-400" />}
                </div>
                <div>
                  <h3 className="text-white font-bold">{req.filename}</h3>
                  <p className="text-slate-400 text-xs">
                    {req.isBatch ? "Batch transfer" : formatBytes(req.size)} • from {req.senderName}
                  </p>
                  {req.isBatch && req.batchFiles && (
                    <div className="mt-2 flex gap-2">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-white/5">
                        {req.batchFiles.length} files
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-white/5">
                        {formatBytes(req.size)} total
                      </span>
                    </div>
                  )}
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
        <div className="space-y-4">
          {(() => {
            const groups: Record<string, TransferState[]> = {};
            transfers.forEach(t => {
              const gid = t.batchId || t.id;
              if (!groups[gid]) groups[gid] = [];
              groups[gid].push(t);
            });

            return Object.entries(groups).map(([gid, items]) => {
              const isBatch = items.length > 1 || items[0].batchId;
              const main = items[0];
              const isExpanded = expandedBatches.includes(gid);
              
              const totalSize = items.reduce((acc, i) => acc + (i.size || 0), 0);
              const totalTransferred = items.reduce((acc, i) => acc + (i.transferred || 0), 0);
              const avgProgress = totalSize > 0 ? (totalTransferred / totalSize) * 100 : 0;
              const avgSpeed = items.reduce((acc, i) => acc + (i.speed || 0), 0);
              const completedCount = items.filter(i => i.status === "completed").length;
              const maxTimeRemaining = Math.max(...items.map(i => i.timeRemaining || 0));
              
              const status = items.every(i => i.status === "completed") ? "completed" : 
                            items.some(i => i.status === "failed") ? "failed" :
                            items.some(i => i.status === "transferring" || (i.isIncoming && (i.transferred || 0) > 0)) ? "transferring" : "waiting";

              return (
                <motion.div 
                  key={gid} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-white/5 rounded-3xl p-6 shadow-xl overflow-hidden relative group"
                >
                  {/* Full Tile Fill Progress Bar - Only if not expanded */}
                  {(!isBatch || !isExpanded) && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${avgProgress}%` }}
                      className="absolute inset-0 bg-indigo-500/10 pointer-events-none transition-all duration-300"
                    />
                  )}

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        status === "completed" ? "bg-emerald-500/10" : status === "failed" ? "bg-red-500/10" : "bg-indigo-500/10"
                      }`}>
                        {isBatch ? <Folder className={`w-6 h-6 ${status === "completed" ? "text-emerald-400" : "text-indigo-400"}`} /> : 
                                  <File className={`w-6 h-6 ${status === "completed" ? "text-emerald-400" : "text-indigo-400"}`} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-bold truncate">
                          {isBatch 
                            ? `${status === 'completed' ? (main.isIncoming ? 'Received' : 'Sent') : (main.isIncoming ? 'Receiving' : 'Sending')} ${completedCount}/${items.length} items ${main.isIncoming ? 'from' : 'to'} ${main.targetName}` 
                            : main.filename}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                          <p className="text-slate-400 text-xs">
                            {status === "completed" ? "All transfers complete" : 
                             status === "failed" ? (items.some(i => i.errorText === "Declined") ? "Transfer declined" : "Transfer failed") : 
                             status === "waiting" ? "Waiting for accept..." : 
                             `${completedCount} of ${items.length} files complete · ${formatBytes(totalTransferred)} of ${formatBytes(totalSize)}`}
                          </p>
                          {(status === "transferring" || totalTransferred > 0) && status !== "completed" && (
                            <div className="flex items-center gap-3">
                              {avgSpeed >= 0 && (
                                <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/20 px-2 py-0.5 rounded whitespace-nowrap">
                                  {formatBytes(avgSpeed)}/s
                                </span>
                              )}
                              {maxTimeRemaining > 0 && maxTimeRemaining < 86400 && (
                                <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                                  {Math.ceil(maxTimeRemaining)}s remaining
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {status === "transferring" && (
                        <div className="flex items-center gap-4 sm:gap-6">
                          {items.some(i => writablesRef.current[i.fileId]) && (
                            <span className="hidden xs:flex text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded items-center gap-1.5 whitespace-nowrap">
                              <ShieldCheck className="w-3 h-3" /> Direct Write
                            </span>
                          )}
                          <div className="text-right">
                            <div className="text-indigo-400 font-bold text-lg">{Math.round(avgProgress)}%</div>
                          </div>
                          <button 
                            onClick={() => cancelTransfer(gid)}
                            className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-xl transition-all outline-none"
                            title="Cancel Transfer"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                      {status === "completed" && <div className="text-emerald-400 text-sm font-bold flex items-center gap-2"><Check className="w-4 h-4" /> Done</div>}
                      {status === "failed" && (
                        <div className="text-red-400 text-sm font-bold flex items-center gap-2">
                          <X className="w-4 h-4" /> 
                          {items.some(i => i.errorText === "Declined") ? "Declined" : (items.some(i => i.errorText === "Cancelled") ? "Cancelled" : "Failed")}
                        </div>
                      )}
                    </div>
                  </div>

                  {isBatch && (
                    <div className="mt-6 border-t border-white/5 pt-4 relative z-10">
                      <button 
                        onClick={() => setExpandedBatches(prev => prev.includes(gid) ? prev.filter(b => b !== gid) : [...prev, gid])}
                        className="text-[10px] text-slate-500 font-bold uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors flex items-center gap-2 outline-none"
                      >
                        <span className={`transition-transform text-[8px] ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                        {isExpanded ? 'Hide Details' : 'Show Individual File Progress'}
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {items.map(item => (
                                <div key={item.id} className="flex items-center justify-between bg-white/5 rounded-2xl p-3 border border-transparent hover:border-white/5 transition-all relative overflow-hidden group/item">
                                  {/* Individual File Progress Fill */}
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.progress}%` }}
                                    className="absolute inset-0 bg-indigo-500/10 pointer-events-none transition-all duration-300"
                                  />
                                  
                                  <div className="flex items-center gap-3 min-w-0 relative z-10">
                                    <File className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    <span className="text-xs text-slate-300 truncate font-medium">{item.filename}</span>
                                  </div>
                                  <div className="flex items-center gap-4 flex-shrink-0 relative z-10">
                                    <span className="text-[10px] text-slate-500">{formatBytes(item.size || 0)}</span>
                                    <span className={`text-[10px] font-bold ${
                                      item.status === "completed" ? "text-emerald-400" : "text-indigo-400"
                                    }`}>
                                      {item.status === "completed" ? "100%" : `${Math.round(item.progress)}%`}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              );
            });

          })()}
        </div>

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
