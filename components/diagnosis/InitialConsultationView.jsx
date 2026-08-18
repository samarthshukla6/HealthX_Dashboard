import React from 'react';
import Button from '@/components/base/Button';

const InitialConsultationView = ({ onStartCall, connecting, vapiInitialized, compact = false }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center w-full h-full gap-3">
      {!compact && (
        <h1 className="text-indigo-700 text-2xl sm:text-3xl font-semibold">
          Symptom Assessment Assistant
        </h1>
      )}
      <p className={`max-w-sm text-slate-600 ${compact ? "text-xs leading-relaxed" : "text-base sm:text-lg"}`}>
        Discuss your symptoms with Dr. Morgan. The assistant will ask brief questions to gather information.
      </p>
      <Button
        label="Start Consultation"
        onClick={onStartCall}
        isLoading={connecting}
        disabled={connecting || !vapiInitialized}
        className={`rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 font-medium disabled:opacity-60 disabled:cursor-not-allowed ${
          compact ? "px-5 py-2 text-sm" : "px-8 py-3"
        }`}
      />
    </div>
  );
};

export default InitialConsultationView;
