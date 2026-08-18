import React from 'react';
import VoiceOrb from '@/components/ActiveCallDetail';

const ActiveCallView = ({
  compact = false,
  connecting,
  connected,
  assistantIsSpeaking,
  volumeLevel,
  onEndCall,
}) => {
  const isLive = connecting || connected;

  return (
    <>
      {isLive && (
        <div className="relative flex flex-col items-center justify-center h-full w-full">
          <VoiceOrb
            compact={compact}
            assistantIsSpeaking={assistantIsSpeaking}
            volumeLevel={volumeLevel}
            onEndCallClick={onEndCall}
          />
          {connecting && !connected && (
            <p className="mt-2 text-xs font-medium text-slate-600 animate-pulse">
              Connecting...
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default ActiveCallView;
