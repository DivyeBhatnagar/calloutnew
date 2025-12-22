'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Icon3DProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  color?: string;
  hover?: boolean;
}

export default function Icon3D({ 
  icon: IconComponent, 
  size = 24, 
  className = '', 
  color = '#3B82F6',
  hover = true 
}: Icon3DProps) {
  return (
    <div 
      className={`icon-3d-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 0.3s ease',
        cursor: hover ? 'pointer' : 'default'
      }}
    >
      {/* Shadow layer for 3D effect */}
      <IconComponent
        size={size}
        style={{
          position: 'absolute',
          color: 'rgba(59, 130, 246, 0.2)',
          transform: 'translate(2px, 2px)',
          zIndex: 1
        }}
        strokeWidth={2.5}
      />
      
      {/* Main icon */}
      <IconComponent
        size={size}
        style={{
          position: 'relative',
          color: color,
          filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))',
          zIndex: 2
        }}
        strokeWidth={2.5}
      />
      
      <style jsx>{`
        .icon-3d-wrapper:hover {
          transform: ${hover ? 'scale(1.05) translateY(-1px)' : 'none'};
        }
        
        .icon-3d-wrapper:hover svg:last-child {
          filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.4));
        }
        
        .icon-3d-wrapper:active {
          transform: ${hover ? 'scale(0.98)' : 'none'};
        }
      `}</style>
    </div>
  );
}