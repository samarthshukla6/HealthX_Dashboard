import React from 'react';
import InitialConsultationView from './InitialConsultationView';
import ActiveCallView from './ActiveCallView';
import PleaseSetYourPublicKeyMessage from './PleaseSetYourPublicKeyMessage';
import ReturnToDocsLink from './ReturnToDocsLink';

const ConsultationCard = ({
  compact = false,
  connecting,
  connected,
  assistantIsSpeaking,
  volumeLevel,
  showPublicKeyInvalidMessage,
  vapiInitialized,
  onStartCall,
  onEndCall,
}) => {
  const isCallActive = connecting || connected;

  return (
    <div
      className={`relative z-10 w-full mx-auto flex flex-col items-center justify-center ${
        compact
          ? "h-full p-2"
          : "max-w-xl p-8 rounded-2xl bg-transparent backdrop-blur-sm min-h-[150px]"
      }`}
    >

      {!isCallActive ? (
        <div className="flex flex-col items-center justify-center text-center w-full h-full">
          <InitialConsultationView
            compact={compact}
            onStartCall={onStartCall}
            connecting={connecting}
            vapiInitialized={vapiInitialized}
          />
          {showPublicKeyInvalidMessage && (
            <PleaseSetYourPublicKeyMessage isDiagnosisPage={true} />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <ActiveCallView
            compact={compact}
            connecting={connecting}
            connected={connected}
            assistantIsSpeaking={assistantIsSpeaking}
            volumeLevel={volumeLevel}
            onEndCall={onEndCall}
          />
        </div>
      )}
    </div>
  );
};

export default ConsultationCard;