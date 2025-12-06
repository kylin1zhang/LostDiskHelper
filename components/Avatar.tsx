import React from 'react';

interface AvatarProps {
  emotion?: 'happy' | 'worry' | 'talking';
}

export const Avatar: React.FC<AvatarProps> = ({ emotion = 'happy' }) => {
  // Simple SVG Avatar construction
  return (
    <div className="relative w-32 h-32 mx-auto animate-bounce-slow">
      <div className="absolute inset-0 bg-blue-100 rounded-full shadow-lg border-4 border-white flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600">
           {/* Face Base */}
           <circle cx="50" cy="50" r="40" fill="#bfdbfe" />
           
           {/* Eyes */}
           {emotion === 'worry' ? (
             <>
               <circle cx="35" cy="45" r="3" fill="#1e3a8a" />
               <circle cx="65" cy="45" r="3" fill="#1e3a8a" />
               <path d="M 30 38 Q 35 35 40 38" stroke="#1e3a8a" strokeWidth="2" fill="none"/>
               <path d="M 60 38 Q 65 35 70 38" stroke="#1e3a8a" strokeWidth="2" fill="none"/>
             </>
           ) : (
             <>
              <ellipse cx="35" cy="45" rx="4" ry="6" fill="#1e3a8a" />
              <ellipse cx="65" cy="45" rx="4" ry="6" fill="#1e3a8a" />
             </>
           )}

           {/* Mouth */}
           {emotion === 'talking' ? (
              <circle cx="50" cy="70" r="8" fill="#1e40af" />
           ) : emotion === 'worry' ? (
              <path d="M 40 75 Q 50 65 60 75" stroke="#1e40af" strokeWidth="3" fill="none" />
           ) : (
              <path d="M 35 65 Q 50 80 65 65" stroke="#1e40af" strokeWidth="3" fill="none" strokeLinecap="round" />
           )}
           
           {/* Cheeks */}
           <circle cx="25" cy="55" r="5" fill="#fca5a5" opacity="0.6" />
           <circle cx="75" cy="55" r="5" fill="#fca5a5" opacity="0.6" />
        </svg>
      </div>
      {/* Decorative Elements */}
      <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow">
         <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      </div>
    </div>
  );
};