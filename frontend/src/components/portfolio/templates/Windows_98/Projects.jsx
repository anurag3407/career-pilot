import React, { useState, useEffect, useRef } from 'react';
import data from '../../../../data/dummy_data.json';

/* ─── Windows 98 Design Tokens ─── */
const W = {
  desktop: '#008080',
  silver: '#C0C0C0',
  darkGray: '#808080',
  lightGray: '#DFDFDF',
  white: '#FFFFFF',
  black: '#000000',
  navy: '#000080',
  titleActive: 'linear-gradient(90deg, #000080, #1084d0)',
};

const raised = {
  borderTop: '2px solid #FFFFFF',
  borderLeft: '2px solid #FFFFFF',
  borderBottom: '2px solid #000000',
  borderRight: '2px solid #000000',
};

const sunken = {
  borderTop: '2px solid #000000',
  borderLeft: '2px solid #000000',
  borderBottom: '2px solid #FFFFFF',
  borderRight: '2px solid #FFFFFF',
};

const outerRaised = {
  borderTop: '1px solid #FFFFFF',
  borderLeft: '1px solid #FFFFFF',
  borderBottom: '1px solid #808080',
  borderRight: '1px solid #808080',
  boxShadow: 'inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #808080',
};

/* ─── Injected CSS ─── */
const STYLES = `
  .w98-proj-file-item {
    cursor: default;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 4px;
    font-family: 'MS Sans Serif', Tahoma, Arial, sans-serif;
    font-size: 11px;
  }

  .w98-proj-file-item:hover,
  .w98-proj-file-item.selected {
    background: #000080;
    color: #fff;
  }

  .w98-proj-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 6px;
    cursor: default;
    user-select: none;
    min-width: 72px;
    max-width: 80px;
    text-align: center;
  }

  .w98-proj-btn {
    border-top: 2px solid #FFFFFF;
    border-left: 2px solid #FFFFFF;
    border-bottom: 2px solid #000000;
    border-right: 2px solid #000000;
    background: #C0C0C0;
    cursor: pointer;
    font-family: 'MS Sans Serif', Tahoma, Arial, sans-serif;
    font-size: 11px;
    padding: 3px 12px;
    min-width: 70px;
    color: #000;
  }

  .w98-proj-btn:active {
    border-top: 2px solid #000 !important;
    border-left: 2px solid #000 !important;
    border-bottom: 2px solid #fff !important;
    border-right: 2px solid #fff !important;
    padding-top: 4px !important;
    padding-left: 13px !important;
  }

  .w98-proj-toolbar-btn {
    border-top: 2px solid #FFFFFF;
    border-left: 2px solid #FFFFFF;
    border-bottom: 2px solid #000000;
    border-right: 2px solid #000000;
    background: #C0C0C0;
    cursor: pointer;
    font-size: 14px;
    width: 24px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
  }

  .w98-proj-toolbar-btn:active {
    border-top: 2px solid #000 !important;
    border-left: 2px solid #000 !important;
    border-bottom: 2px solid #fff !important;
    border-right: 2px solid #fff !important;
  }

  .w98-scrollbar::-webkit-scrollbar { width: 16px; }
  .w98-scrollbar::-webkit-scrollbar-track { background: #C0C0C0; border: 1px solid #808080; }
  .w98-scrollbar::-webkit-scrollbar-thumb {
    background: #C0C0C0;
    border-top: 2px solid #FFFFFF;
    border-left: 2px solid #FFFFFF;
    border-bottom: 2px solid #000000;
    border-right: 2px solid #000000;
  }
`;

/* ─── Right-click context menu ─── */
function ContextMenu({ x, y, project, onClose, onOpen }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = () => onClose();
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [onClose]);

  const items = [
    { label: 'Open', action: () => { onOpen(project); onClose(); } },
    { label: 'Open with... Internet Explorer', action: () => { window.open(project.liveUrl, '_blank'); onClose(); } },
    { divider: true },
    { label: 'Copy URL', action: () => { navigator.clipboard?.writeText(project.liveUrl); onClose(); } },
    { label: 'Send to Desktop', action: onClose },
    { divider: true },
    { label: 'Properties', action: () => { onOpen(project); onClose(); } },
  ];

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 9999,
        background: W.silver,
        ...outerRaised,
        minWidth: '180px',
        fontSize: '11px',
        fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
      }}
      onClick={e => e.stopPropagation()}
    >
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} style={{ height: '1px', background: W.darkGray, margin: '2px 0' }} />
        ) : (
          <div
            key={i}
            onClick={item.action}
            style={{ padding: '4px 16px', cursor: 'pointer', color: '#000' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#000'; }}
          >
            {item.label}
          </div>
        )
      )}
    </div>
  );
}

/* ─── Project Properties dialog ─── */
function ProjectProperties({ project, onClose }) {
  const [activeTab, setActiveTab] = useState('general');
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'details', label: 'Details' },
    { id: 'links', label: 'Links' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.2)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: W.silver,
        ...outerRaised,
        width: 'min(380px, calc(100vw - 32px))',
      }}>
        {/* Title bar */}
        <div style={{
          background: W.titleActive,
          padding: '3px 4px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          userSelect: 'none',
        }}>
          <span style={{ fontSize: '14px' }}>📁</span>
          <span style={{
            color: W.white,
            fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
            fontSize: '12px',
            fontWeight: 'bold',
            flex: 1,
          }}>
            {project.title} — Properties
          </span>
          <button onClick={onClose} className="w98-proj-btn"
            style={{ ...raised, width: '16px', height: '14px', padding: '0', minWidth: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div style={{ padding: '8px 8px 0', display: 'flex', borderBottom: `1px solid ${W.darkGray}` }}>
          {tabs.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '4px 12px',
                fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                fontSize: '11px',
                cursor: 'pointer',
                background: activeTab === tab.id ? W.silver : W.lightGray,
                borderTop: activeTab === tab.id ? '2px solid #FFFFFF' : '1px solid #808080',
                borderLeft: activeTab === tab.id ? '2px solid #FFFFFF' : '1px solid #808080',
                borderRight: '1px solid #808080',
                borderBottom: activeTab === tab.id ? `2px solid ${W.silver}` : 'none',
                marginBottom: activeTab === tab.id ? '-1px' : '0',
                zIndex: activeTab === tab.id ? 2 : 1,
                position: 'relative',
                color: '#000',
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Tab content */}
        <div style={{
          ...sunken,
          margin: '0 8px',
          background: W.white,
          minHeight: '200px',
          padding: '12px',
        }}>
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '36px' }}>📁</span>
                <div>
                  <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '14px', fontWeight: 'bold', color: '#000' }}>
                    {project.title}
                  </div>
                  <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: W.darkGray }}>
                    Application Project Folder
                  </div>
                </div>
              </div>
              <div style={{ height: '1px', background: W.darkGray, margin: '4px 0' }} />
              {[
                { key: 'Type', val: 'Project Folder' },
                { key: 'Location', val: `C:\\Projects\\${project.title.replace(/\s/g, '_')}` },
                { key: 'Created', val: '01/01/2024 09:00 AM' },
                { key: 'Modified', val: 'Today' },
              ].map(({ key, val }) => (
                <div key={key} style={{ display: 'flex', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', borderBottom: `1px dotted ${W.lightGray}`, padding: '2px 0' }}>
                  <span style={{ width: '80px', flexShrink: 0, fontWeight: 'bold', color: W.navy }}>{key}:</span>
                  <span style={{ color: '#000', wordBreak: 'break-word' }}>{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ ...raised, background: W.navy, color: W.white, padding: '2px 8px', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', fontWeight: 'bold' }}>
                📄 Description
              </div>
              <div style={{ ...sunken, background: '#f8f8f8', padding: '6px', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', lineHeight: '1.6', color: '#000' }}>
                {project.description}
              </div>
              <div style={{ ...raised, background: W.navy, color: W.white, padding: '2px 8px', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', fontWeight: 'bold' }}>
                ⚙️ Tech Stack
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {project.techStack.map((tech) => (
                  <span key={tech} style={{ ...raised, padding: '2px 8px', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', background: W.silver, color: '#000' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: '#000' }}>
                Web addresses for this project:
              </div>
              {[
                { label: 'Live Demo', icon: '🌐', url: project.liveUrl },
                { label: 'Source Code', icon: '🐙', url: project.githubUrl },
              ].map(({ label, icon, url }) => (
                <div key={label}>
                  <div style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', fontWeight: 'bold', color: W.navy, marginBottom: '3px' }}>
                    {icon} {label}:
                  </div>
                  <div style={{ ...sunken, padding: '3px 6px', background: W.white, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: W.navy, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {url}
                    </span>
                    <button className="w98-proj-btn" onClick={() => window.open(url, '_blank')} style={{ flexShrink: 0, padding: '2px 8px', fontSize: '10px', minWidth: '50px' }}>
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ padding: '6px 8px', display: 'flex', justifyContent: 'flex-end', gap: '6px', borderTop: `1px solid ${W.darkGray}` }}>
          <button className="w98-proj-btn" onClick={() => window.open(project.liveUrl, '_blank')}>Launch</button>
          <button className="w98-proj-btn" onClick={() => window.open(project.githubUrl, '_blank')}>GitHub</button>
          <button className="w98-proj-btn" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Projects component ─── */
export default function Projects() {
  const { projects } = data;
  const [viewMode, setViewMode] = useState('icons');
  const [selected, setSelected] = useState(null);
  const [openProject, setOpenProject] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const sortedProjects = [...projects].sort((a, b) => a.title.localeCompare(b.title));

  const handleContextMenu = (e, project) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(project.title);
    setContextMenu({ x: e.clientX, y: e.clientY, project });
  };

  return (
    <section
      id="projects"
      style={{
        background: W.desktop,
        padding: '40px 16px 60px',
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <style>{STYLES}</style>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          project={contextMenu.project}
          onClose={() => setContextMenu(null)}
          onOpen={setOpenProject}
        />
      )}

      {openProject && (
        <ProjectProperties project={openProject} onClose={() => setOpenProject(null)} />
      )}

      {/* Label */}
      <div style={{ position: 'absolute', top: '12px', left: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '24px' }}>🗂️</span>
        <span style={{ color: W.white, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '12px', fontWeight: 'bold', textShadow: '1px 1px 2px #000' }}>
          My Projects
        </span>
      </div>

      {/* Explorer window */}
      <div
        style={{ background: W.silver, ...outerRaised, width: 'min(740px, calc(100vw - 32px))', margin: '48px auto 0', display: 'flex', flexDirection: 'column' }}
        onClick={() => setContextMenu(null)}
      >
        {/* Title bar */}
        <div style={{ background: W.titleActive, padding: '3px 4px', display: 'flex', alignItems: 'center', gap: '4px', userSelect: 'none' }}>
          <span style={{ fontSize: '14px' }}>🗂️</span>
          <span style={{ color: W.white, fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '12px', fontWeight: 'bold', flex: 1 }}>
            My Projects
          </span>
          {['_', '□', '✕'].map((ch, i) => (
            <div key={i} style={{ ...raised, width: '16px', height: '14px', background: W.silver, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', cursor: 'default', color: '#000' }}>
              {ch}
            </div>
          ))}
        </div>

        {/* Menu bar */}
        <div style={{ display: 'flex', padding: '2px 4px', borderBottom: `1px solid ${W.darkGray}` }}>
          {['File', 'Edit', 'View', 'Go', 'Favorites', 'Help'].map((m) => (
            <button key={m}
              style={{ background: 'none', border: 'none', padding: '2px 6px', cursor: 'pointer', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: '#000' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#000'; }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '3px 4px', borderBottom: `1px solid ${W.darkGray}`, flexWrap: 'wrap' }}>
          {['⬅', '➡', '⬆'].map((icon, i) => (
            <button key={i} className="w98-proj-toolbar-btn">{icon}</button>
          ))}
          <div style={{ width: '1px', height: '20px', background: W.darkGray, margin: '0 2px' }} />
          <div style={{ ...sunken, flex: 1, padding: '2px 6px', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: '#000', minWidth: '80px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '12px' }}>📁</span>
            {`C:\\Users\\${data.personal.name.split(' ')[0]}\\Projects`}
          </div>
          <div style={{ display: 'flex', gap: '1px', marginLeft: '4px' }}>
            {[
              { mode: 'icons', icon: '⊞', title: 'Large Icons' },
              { mode: 'list', icon: '☰', title: 'List' },
              { mode: 'details', icon: '≡', title: 'Details' },
            ].map(({ mode, icon, title }) => (
              <button key={mode} className="w98-proj-toolbar-btn" title={title} onClick={() => setViewMode(mode)}
                style={{ background: viewMode === mode ? '#808080' : W.silver, color: '#000', fontSize: '14px' }}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flex: 1, minHeight: '380px' }}>
          {/* Left pane */}
          <div style={{ width: '130px', flexShrink: 0, ...sunken, margin: '4px', padding: '4px', background: W.white, overflow: 'auto', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px' }} className="w98-scrollbar">
            {[
              { depth: 0, icon: '🖥️', label: 'Desktop' },
              { depth: 1, icon: '📁', label: 'My Documents' },
              { depth: 1, icon: '🗂️', label: 'Projects', active: true },
              { depth: 2, icon: '📁', label: 'Web Apps' },
              { depth: 2, icon: '📁', label: 'Mobile' },
              { depth: 2, icon: '📁', label: 'Open Source' },
              { depth: 1, icon: '🌐', label: 'Network' },
              { depth: 1, icon: '🗑️', label: 'Recycle Bin' },
            ].map(({ depth, icon, label, active }, i) => (
              <div key={i}
                style={{ paddingLeft: `${depth * 12 + 4}px`, padding: `2px 4px 2px ${depth * 12 + 4}px`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', background: active ? '#000080' : 'transparent', color: active ? W.white : '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = W.white; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#000'; } }}
              >
                <span style={{ fontSize: '13px', flexShrink: 0 }}>{icon}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Right pane */}
          <div
            style={{
              flex: 1,
              ...sunken,
              margin: '4px 4px 4px 0',
              background: W.white,
              overflow: 'auto',
              display: viewMode === 'icons' ? 'flex' : 'block',
              flexWrap: viewMode === 'icons' ? 'wrap' : undefined,
              alignContent: viewMode === 'icons' ? 'flex-start' : undefined,
              padding: viewMode === 'icons' ? '8px' : '0',
            }}
            className="w98-scrollbar"
            onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }}
          >
            {viewMode === 'details' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 130px', background: W.silver, position: 'sticky', top: 0, zIndex: 1 }}>
                {['Name', 'Type', 'Stack', 'Modified'].map((col) => (
                  <div key={col} style={{ ...raised, padding: '2px 6px', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', cursor: 'pointer', color: '#000' }}>
                    {col}
                  </div>
                ))}
              </div>
            )}

            {sortedProjects.map((project) => {
              const isSelected = selected === project.title;

              if (viewMode === 'icons') {
                return (
                  <div
                    key={project.title}
                    className="w98-proj-icon-item"
                    onClick={() => setSelected(project.title)}
                    onDoubleClick={() => setOpenProject(project)}
                    onContextMenu={(e) => handleContextMenu(e, project)}
                    style={{ background: isSelected ? '#000080' : 'transparent' }}
                  >
                    <span style={{ fontSize: '36px', lineHeight: 1 }}>📁</span>
                    <span style={{
                      fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                      fontSize: '11px',
                      color: isSelected ? W.white : '#000',
                      padding: '1px 2px',
                      lineHeight: '1.3',
                      maxWidth: '72px',
                      wordBreak: 'break-word',
                      display: 'block',
                      textAlign: 'center',
                    }}>
                      {project.title}
                    </span>
                  </div>
                );
              }

              if (viewMode === 'list') {
                return (
                  <div
                    key={project.title}
                    className={`w98-proj-file-item${isSelected ? ' selected' : ''}`}
                    onClick={() => setSelected(project.title)}
                    onDoubleClick={() => setOpenProject(project)}
                    onContextMenu={(e) => handleContextMenu(e, project)}
                  >
                    <span style={{ fontSize: '16px' }}>📁</span>
                    <span style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: isSelected ? W.white : '#000' }}>
                      {project.title}
                    </span>
                  </div>
                );
              }

              /* Details view */
              return (
                <div
                  key={project.title}
                  onClick={() => setSelected(project.title)}
                  onDoubleClick={() => setOpenProject(project)}
                  onContextMenu={(e) => handleContextMenu(e, project)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 100px 120px 130px',
                    padding: '2px 4px',
                    borderBottom: `1px solid #f0f0f0`,
                    background: isSelected ? '#000080' : 'transparent',
                    cursor: 'default',
                    userSelect: 'none',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: isSelected ? W.white : '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '14px' }}>📁</span>
                    {project.title}
                  </span>
                  <span style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: isSelected ? W.white : '#000' }}>
                    Project Folder
                  </span>
                  <span style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: isSelected ? W.white : W.darkGray, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {project.techStack.slice(0, 2).join(', ')}
                  </span>
                  <span style={{ fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: isSelected ? W.white : '#000' }}>
                    Today
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status bar */}
        <div style={{ borderTop: `1px solid ${W.darkGray}`, padding: '2px 6px', display: 'flex', gap: '4px', background: W.silver }}>
          {[
            selected ? `1 object selected` : `${projects.length} object(s)`,
            `${projects.length} project folders`,
          ].map((t, i) => (
            <div key={i} style={{ ...sunken, padding: '1px 6px', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', flex: i === 0 ? 2 : 1, color: '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t}
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '12px', fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif", fontSize: '11px', color: W.white, textShadow: '1px 1px 2px #000' }}>
        Double-click a folder to view project details · Right-click for options
      </div>
    </section>
  );
}
