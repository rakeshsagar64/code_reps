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
      <span className="ghost-overlay-wrapper">
        <span className="ghost-hidden-text">{value}</span>
        <span className="ghost-remaining-text">{remainingGhost}</span>
      </span>
    );
  };

  return (
    <div className="ghost-editor-card">
      {/* Top Header Label */}
      <div className="ghost-editor-header">
        <span>Pattern Input</span>
        <span className="ghost-editor-status">
          <span className="ghost-editor-dot" />
          Live Regex
        </span>
      </div>

      {/* Input + Ghost Layer Wrapper */}
      <div className="ghost-editor-field-group">
        {/* Ghost Overlay Layer */}
        <div className="ghost-overlay-layer">
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
          className="ghost-native-input"
        />
      </div>
    </div>
  );
}
