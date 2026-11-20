import React, { useState } from 'react';
import { Monitor, Check, Copy } from 'lucide-react';
import { useCubeStore } from '../../store/cubeStore';

export const MobileDesktopNotice: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const showToast = useCubeStore((s) => s.showToast);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Link copied. Open on your desktop to play.');
      setTimeout(() => setCopied(false), 2600);
    } catch {
      showToast('Copy link: ' + window.location.href);
    }
  };

  return (
    <div className="mobile-only-notice-container">
      <div className="mobile-notice-pill">
        <div className="mobile-notice-icon">
          <Monitor size={16} />
        </div>

        <div className="mobile-notice-text">
          <span className="mobile-notice-title">Full experience on desktop</span>
          <span className="mobile-notice-desc">
            Keyboard controls, inspect timer, and the solver work best on a computer. Drag freely to inspect and spin the cube here.
          </span>
        </div>

        <button
          type="button"
          className="mobile-copy-btn"
          onClick={handleCopyLink}
          title="Copy link to open on computer"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? 'Copied' : 'Copy link'}</span>
        </button>
      </div>
    </div>
  );
};
