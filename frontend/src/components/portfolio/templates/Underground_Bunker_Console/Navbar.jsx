import React from 'react';
import { motion } from 'framer-motion';

export default function Navbar({ data }) {
  const [active, setActive] = React.useState('#top');

  const links = [
    { id: '#top', label: 'TERMINAL' },
    { id: '#about', label: 'DOSSIER' },
    { id: '#skills', label: 'SPECS' },
    { id: '#projects', label: 'MISSIONS' },
    { id: '#experience', label: 'RECORD' },
    { id: '#contact', label: 'TRANSMIT' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10, 10, 10, 0.95)',
      borderBottom: '1px solid rgba(51, 255, 51, 0.2)',
      padding: '12px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: '#ff6600', fontWeight: 700, fontSize: '0.875rem' }}>
          &#x25B6; BUNKER_OS
        </span>
        <span style={{ color: '#666', fontSize: '0.625rem' }}>
          v{new Date().getFullYear()}.{new Date().getMonth() + 1}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {links.map(l => (
          <a key={l.id} href={l.id}
            onClick={(e) => { e.preventDefault(); setActive(l.id); document.querySelector(l.id)?.scrollIntoView({ behavior: 'smooth' }); }}
            style={{
              color: active === l.id ? '#33ff33' : '#666',
              textDecoration: 'none', textTransform: 'uppercase',
              letterSpacing: '0.1em', fontSize: '0.625rem',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#33ff33'}
            onMouseLeave={e => e.target.style.color = active === l.id ? '#33ff33' : '#666'}
          >
            {'> '}{l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
