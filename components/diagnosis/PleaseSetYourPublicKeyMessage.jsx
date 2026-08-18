import React from 'react';
import { motion } from 'framer-motion';

const PleaseSetYourPublicKeyMessage = ({ isDiagnosisPage = false }) => {
  // The isDiagnosisPage prop seems unused in the current implementation,
  // but kept it in case it's needed for future variations.
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="mt-4 px-4 py-3 bg-red-100 text-red-700 rounded-xl shadow-sm text-sm text-center w-full"
    >
      Set <code>NEXT_PUBLIC_ELEVENLABS_AGENT_ID</code> in <code>.env</code>.
      Your agent must be <strong>public</strong> — no override toggles needed.
    </motion.div>
  );
};

export default PleaseSetYourPublicKeyMessage;