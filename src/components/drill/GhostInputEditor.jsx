import React, { useRef, useEffect } from 'react';

export function GhostInputEditor({ value, onChange, ghostTemplate = '', ghostTier = 'full' }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [ghostTemplate]);

  const renderGhostOverlay = () => {
    if (ghostTier === 'blind' || !ghostTemplate) return null;
    const typedLength = value.length;
    const remainingGhost = ghostTemplate.slice(typedLength);

    return (
      <span className="pointer-events-none select-none">
        <span className="opacity-0">{value}</span>
        <span className="text-slate-600/90 font-mono font-semibold">{remainingGhost}</span>
      </span>
    );
  };

  return (
    <div className="group relative w-full rounded-2xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 shadow-2xl transition-all focus-within:border-emerald-500/80 focus-within:ring-4 focus-within:ring-emerald-500/10">
      <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
        <span>Pattern Input</span>
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Regex
        </span>
      </div>

      <div className="relative flex items-center font-mono text-xl sm:text-2xl tracking-wider">
        {/* Ghost Overlay Layer */}
        <div className="absolute inset-0 flex items-center overflow-hidden whitespace-pre">
          {renderGhostOverlay()}
        </div>

        {/* Native Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={ghostTier === 'blind' ? 'Type pattern...' : ''}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          className="w-full bg-transparent text-emerald-300 placeholder-slate-700 outline-none z-10 font-mono text-xl sm:text-2xl tracking-wider font-semibold"
        />
      </div>
    </div>
  );
}
