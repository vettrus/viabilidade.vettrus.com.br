"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function fmt(s: number): string {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

export function VideoPlayer({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [show, setShow] = useState(true);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const onFs = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const armHide = () => {
    setShow(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShow(false);
    }, 2600);
  };

  const play = () => videoRef.current?.play();
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };
  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else wrapRef.current?.requestFullscreen?.();
  };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !dur) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * dur;
    setCur(v.currentTime);
  };

  const pct = dur ? (cur / dur) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      onMouseMove={() => started && armHide()}
      onMouseLeave={() => playing && setShow(false)}
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-[15px] bg-[#0c0c0c] shadow-ambient ring-1 ring-white/10",
        className,
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        onClick={toggle}
        onPlay={() => {
          setPlaying(true);
          setStarted(true);
          armHide();
        }}
        onPause={() => {
          setPlaying(false);
          setShow(true);
        }}
        onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onEnded={() => {
          setPlaying(false);
          setShow(true);
        }}
        className="h-full w-full object-cover"
      />

      {/* Overlay de play (antes de iniciar / quando pausado) */}
      {!playing && (
        <button
          type="button"
          onClick={play}
          aria-label="Reproduzir vídeo"
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-colors",
            started ? "bg-black/25" : "bg-black/40",
          )}
        >
          <span className="grid size-20 place-items-center rounded-full bg-primary/95 text-primary-foreground shadow-gold transition-transform duration-300 hover:scale-105">
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 size-9">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      {/* Barra de controles */}
      {started && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pb-3 pt-12 transition-opacity duration-300",
            show ? "opacity-100" : "opacity-0",
          )}
        >
          {/* Progresso */}
          <div
            onClick={seek}
            className="group/bar relative h-1.5 cursor-pointer rounded-full bg-white/25"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              style={{ width: `${pct}%` }}
            />
            <div
              className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 shadow transition-opacity group-hover/bar:opacity-100"
              style={{ left: `${pct}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-center gap-4 text-white">
            <button type="button" onClick={toggle} aria-label={playing ? "Pausar" : "Reproduzir"}>
              {playing ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button type="button" onClick={toggleMute} aria-label={muted ? "Ativar som" : "Mudo"}>
              {muted ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-1.3-3.16l-1.06 1.06A3 3 0 0115 12l1.5 0zM19 12a7 7 0 00-2.05-4.95l-1.06 1.06A5.5 5.5 0 0117.5 12 5.5 5.5 0 0115.9 15.9l1.06 1.06A7 7 0 0019 12z" />
                  <path d="M2 3.3L20.7 22 22 20.7 3.3 2z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12zM14 3.23v2.06A7 7 0 0119 12a7 7 0 01-5 6.71v2.06A9 9 0 0021 12 9 9 0 0014 3.23z" />
                </svg>
              )}
            </button>

            <span className="text-xs font-medium tabular-nums text-white/80">
              {fmt(cur)} / {fmt(dur)}
            </span>

            <button
              type="button"
              onClick={toggleFull}
              aria-label={full ? "Sair da tela cheia" : "Tela cheia"}
              className="ml-auto"
            >
              {full ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M14 14h5v2h-3v3h-2v-5zm-4 0v5H8v-3H5v-2h5zM8 5v3H5V5h3V3H5a2 2 0 00-2 2v3h2zm11-2h-3v2h3v3h2V5a2 2 0 00-2-2z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path d="M4 4h6v2H6v4H4V4zm10 0h6v6h-2V6h-4V4zM4 14h2v4h4v2H4v-6zm14 0h2v6h-6v-2h4v-4z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
