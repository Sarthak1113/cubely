import React from 'react';
import { useCubeStore } from '../../store/cubeStore';

export const ToastNotification: React.FC = () => {
  const toastMessage = useCubeStore((s) => s.toastMessage);

  if (!toastMessage) return null;

  return (
    <div className="cubely-toast-container">
      <div className="cubely-toast-pill">
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
