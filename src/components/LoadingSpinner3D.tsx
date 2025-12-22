'use client';

import { motion } from 'framer-motion';
import { RefreshIcon } from './icons';

export default function LoadingSpinner3D({ size = 32, text = 'Loading...' }) {
  return (
    <div className="dashboard-loading">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <RefreshIcon size={size} />
      </motion.div>
      <p style={{ 
        color: '#64748B', 
        fontWeight: '600', 
        marginTop: '1rem',
        fontSize: '1rem'
      }}>
        {text}
      </p>
    </div>
  );
}