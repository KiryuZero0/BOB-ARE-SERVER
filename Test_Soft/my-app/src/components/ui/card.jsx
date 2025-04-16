import React from 'react';

export function Card({ children, className = '' }) {
    return (
        <div
            className={
                `bg-galactic-indigo/60 border-2 border-nebula-teal 
         rounded-lg shadow-[0_0_20px_rgba(15,76,117,0.5)]
         ${className}`
            }
        >
            {children}
        </div>
    );
}

export function CardContent({ children, className = '' }) {
    return (
        <div className={`p-6 space-y-4 text-starlight-white ${className}`}>
            {children}
        </div>
    );
}
