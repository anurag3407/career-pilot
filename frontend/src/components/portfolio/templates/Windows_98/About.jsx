import React, { useState } from 'react';
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
  titleInactive: 'linear-gradient(90deg, #7b7b7b, #a0a0a0)',
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

/* ─── Injected styles ─── */
const STYLES = `
  @keyframes w98ProgressFill {
    from { width: 0; }
    to { width: var(--target-width); }
  }

  .w98-about-tab { cursor: pointer; user-select: none; }
  .w98-about-tab:hover { background: #000080; color: #fff; }
  .w98-about-tab-active {
    background: #C0C0C0;
    border-top: 2px solid #FFFFFF;
    border-left: 2px solid #FFFFFF;
    border-bottom: 2px solid #C0C0C0;
    border-right: 2px solid #808080;
    margin-bottom: -1px;
    z-index: 2;
    position: relative;
  }

  .w98-list-item:hover { background: #000080; color: #fff; }
  .w98-list-item:hover * { color: #fff !important; }

  .w98-btn-about {
    border-top: 2px solid #FFFFFF;
    border-left: 2px solid #FFFFFF;
    border-bottom: 2px solid #000000;
    border-right: 2px solid #000000;
    background: #C0C0C0;
    cursor: pointer;
    font-family: 'MS Sans Serif', Tahoma, Arial, sans-serif;
    font-size: 11px;
    padding: 4px 16px;
    min-width: 75px;
    color: #000;
  }

  .w98-btn-about:active {
    border-top: 2px solid #000000 !important;
    border-left: 2px solid #000000 !important;
    border-bottom: 2px solid #FFFFFF !important;
    border-right: 2px solid #FFFFFF !important;
    padding-top: 5px !important;
    padding-left: 17px !important;
  }

  .w98-scrollbar::-webkit-scrollbar { width: 16px; }
  .w98-scrollbar::-webkit-scrollbar-track {
    background: #C0C0C0;
    border: 1px solid #808080;
  }
  .w98-scrollbar::-webkit-scrollbar-thumb {
    background: #C0C0C0;
    border-top: 2px solid #FFFFFF;
    border-left: 2px solid #FFFFFF;
    border-bottom: 2px solid #000000;
    border-right: 2px solid #000000;
  }
`;

/* ─── Windows 98 Window wrapper ─── */
function Win98Window({ title, icon, children, style }) {
  return (
    <div style={{
      background: W.silver,
      ...outerRaised,
      display: 'flex',
      flexDirection: 'column',
      ...style,
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
        {icon && <span style={{ fontSize: '14px', lineHeight: 1 }}>{icon}</span>}
        <span style={{
          color: W.white,
          fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
          fontSize: '12px',
          fontWeight: 'bold',
          flex: 1,
        }}>
          {title}
        </span>
        {/* Decorative close/min/max */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {['_', '□', '✕'].map((ch, i) => (
            <div key={i} style={{
              ...raised,
              width: '16px', height: '14px',
              background: W.silver,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '9px', fontWeight: 'bold', cursor: 'default',
              color: '#000',
            }}>
              {ch}
            </div>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─── Tab component ─── */
function TabBar({ tabs, active, onSelect }) {
  return (
    <div style={{
      display: 'flex',
      gap: '0',
      paddingLeft: '6px',
      borderBottom: `1px solid ${W.darkGray}`,
      marginBottom: '0',
    }}>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`w98-about-tab ${active === tab.id ? 'w98-about-tab-active' : ''}`}
          onClick={() => onSelect(tab.id)}
          style={{
            padding: '4px 12px',
            fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
            fontSize: '11px',
            color: '#000',
            background: active === tab.id ? W.silver : W.lightGray,
            borderTop: active === tab.id ? '2px solid #FFFFFF' : '1px solid #808080',
            borderLeft: active === tab.id ? '2px solid #FFFFFF' : '1px solid #808080',
            borderRight: active === tab.id ? '1px solid #808080' : '1px solid #808080',
            borderBottom: active === tab.id ? `2px solid ${W.silver}` : 'none',
            marginBottom: active === tab.id ? '-1px' : '0',
            zIndex: active === tab.id ? 2 : 1,
            position: 'relative',
          }}
        >
          {tab.icon} {tab.label}
        </div>
      ))}
    </div>
  );
}

/* ─── Progress bar W98 style ─── */
function W98ProgressBar({ value, max = 100, color = '#000080', label }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const blocks = Math.floor(pct / 5);

  return (
    <div style={{ marginBottom: '8px' }}>
      {label && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
          fontSize: '10px',
          marginBottom: '3px',
          color: '#000',
        }}>
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div style={{
        ...sunken,
        height: '16px',
        background: W.white,
        display: 'flex',
        alignItems: 'center',
        padding: '1px 2px',
        gap: '1px',
        overflow: 'hidden',
      }}>
        {Array.from({ length: blocks }).map((_, i) => (
          <div key={i} style={{
            width: '10px', height: '12px',
            background: color,
            flexShrink: 0,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Skill category badge ─── */
const CATEGORY_COLORS = {
  Frontend: '#000080',
  Backend: '#008000',
  DevOps: '#800000',
  Design: '#800080',
};

/* ─── About section main component ─── */
export default function About() {
  const { personal, skills, stats } = data;
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedSkill, setSelectedSkill] = useState(null);

  const tabs = [
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'skills', icon: '⚙️', label: 'Skills' },
    { id: 'experience', icon: '🏆', label: 'Experience' },
    { id: 'system', icon: '🖥️', label: 'System Info' },
  ];

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const selectedSkillData = selectedSkill
    ? skills.find((s) => s.name === selectedSkill)
    : null;

  return (
    <section
      id="about"
      style={{
        background: W.desktop,
        padding: '40px 16px 60px',
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
      }}
    >
      <style>{STYLES}</style>

      {/* Section label — desktop folder */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span style={{ fontSize: '24px' }}>📁</span>
        <span style={{
          color: W.white,
          fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
          fontSize: '12px',
          fontWeight: 'bold',
          textShadow: '1px 1px 2px #000',
        }}>
          About Me
        </span>
      </div>

      {/* Main window */}
      <Win98Window
        title="About — Properties"
        icon="👤"
        style={{ width: 'min(680px, calc(100vw - 32px))', marginTop: '48px' }}
      >
        {/* Menu bar */}
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${W.darkGray}`,
          padding: '2px 4px',
        }}>
          {['File', 'Edit', 'View', 'Help'].map((m) => (
            <button
              key={m}
              style={{
                background: 'none', border: 'none',
                padding: '2px 8px', cursor: 'pointer',
                fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                fontSize: '11px', color: '#000',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#000080'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#000'; }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ padding: '8px 8px 0' }}>
          <TabBar tabs={tabs} active={activeTab} onSelect={setActiveTab} />
        </div>

        {/* Tab content area */}
        <div style={{
          ...sunken,
          margin: '0 8px 8px 8px',
          background: W.white,
          minHeight: '340px',
          padding: '12px',
        }}>

          {/* ── Profile tab ── */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {/* Avatar + badge column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', flexShrink: 0, width: '100px' }}>
                <div style={{ ...raised, padding: '3px', background: W.silver }}>
                  <div style={{ ...sunken, width: '80px', height: '80px', overflow: 'hidden' }}>
                    <img
                      src={personal.avatar}
                      alt={personal.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                </div>
                {/* Status light */}
                <div style={{
                  ...outerRaised,
                  padding: '3px 8px',
                  background: W.silver,
                  textAlign: 'center',
                  fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                  fontSize: '10px',
                }}>
                  <div style={{
                    width: '10px', height: '10px',
                    background: '#00cc00',
                    borderRadius: '50%',
                    display: 'inline-block',
                    marginRight: '4px',
                    boxShadow: '0 0 4px #00cc00',
                  }} />
                  Online
                </div>
              </div>

              {/* Info rows */}
              <div style={{ flex: 1, minWidth: '180px' }}>
                {/* Name header */}
                <div style={{
                  ...raised,
                  background: W.navy,
                  color: W.white,
                  padding: '3px 8px',
                  fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                  fontSize: '14px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}>
                  {personal.name}
                </div>

                {/* Property rows */}
                {[
                  { label: 'Title', value: personal.title },
                  { label: 'Location', value: `📍 ${personal.location}` },
                  { label: 'GitHub', value: `🐙 github.com` },
                  { label: 'Email', value: `📧 ${data.socials.email}` },
                  { label: 'Status', value: '🟢 Available for hire' },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: 'flex',
                    borderBottom: `1px dotted ${W.darkGray}`,
                    padding: '3px 0',
                    fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                    fontSize: '11px',
                    flexWrap: 'wrap',
                    gap: '4px',
                  }}>
                    <span style={{ color: W.navy, fontWeight: 'bold', width: '70px', flexShrink: 0 }}>{label}:</span>
                    <span style={{ color: '#000', flex: 1, wordBreak: 'break-word' }}>{value}</span>
                  </div>
                ))}

                {/* Bio */}
                <div style={{ marginTop: '10px' }}>
                  <div style={{
                    ...raised,
                    background: W.silver,
                    padding: '2px 6px',
                    fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                    color: '#000',
                  }}>
                    📝 Biography
                  </div>
                  <div style={{
                    ...sunken,
                    background: W.white,
                    padding: '6px',
                    fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                    fontSize: '11px',
                    lineHeight: '1.6',
                    color: '#000',
                    maxHeight: '90px',
                    overflowY: 'auto',
                  }} className="w98-scrollbar">
                    {personal.bio}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Skills tab ── */}
          {activeTab === 'skills' && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* Skills list (left panel) */}
              <div style={{
                width: 'min(220px, 100%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                  <div key={category}>
                    <div style={{
                      background: CATEGORY_COLORS[category] || W.navy,
                      color: W.white,
                      padding: '2px 6px',
                      fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                      fontSize: '11px',
                      fontWeight: 'bold',
                      ...raised,
                    }}>
                      {category}
                    </div>
                    <div style={{
                      ...sunken,
                      background: W.white,
                      overflow: 'hidden',
                    }}>
                      {catSkills.map((skill) => (
                        <div
                          key={skill.name}
                          className="w98-list-item"
                          onClick={() => setSelectedSkill(skill.name === selectedSkill ? null : skill.name)}
                          style={{
                            padding: '3px 8px',
                            fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                            fontSize: '11px',
                            cursor: 'pointer',
                            background: selectedSkill === skill.name ? '#000080' : 'transparent',
                            color: selectedSkill === skill.name ? W.white : '#000',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>{skill.name}</span>
                          <span style={{ opacity: 0.7 }}>{skill.level}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Skill detail panel (right) */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                {selectedSkillData ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{
                      ...raised,
                      background: W.navy,
                      color: W.white,
                      padding: '4px 8px',
                      fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                      fontSize: '13px',
                      fontWeight: 'bold',
                    }}>
                      ⚙️ {selectedSkillData.name}
                    </div>
                    <div style={{
                      ...sunken,
                      padding: '8px',
                      background: W.white,
                    }}>
                      <div style={{
                        fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                        fontSize: '11px',
                        marginBottom: '8px',
                        color: '#000',
                      }}>
                        <span style={{ fontWeight: 'bold' }}>Category:</span> {selectedSkillData.category}
                      </div>
                      <div style={{
                        fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                        fontSize: '11px',
                        marginBottom: '4px',
                        color: '#000',
                      }}>
                        <span style={{ fontWeight: 'bold' }}>Proficiency:</span> {selectedSkillData.level}%
                      </div>
                      <W98ProgressBar value={selectedSkillData.level} color={CATEGORY_COLORS[selectedSkillData.category] || W.navy} />
                      <div style={{
                        ...outerRaised,
                        padding: '6px',
                        background: W.silver,
                        fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                        fontSize: '11px',
                        color: '#000',
                        marginTop: '8px',
                      }}>
                        {selectedSkillData.level >= 90 && '🥇 Expert level — production ready'}
                        {selectedSkillData.level >= 75 && selectedSkillData.level < 90 && '🥈 Proficient — daily use'}
                        {selectedSkillData.level >= 60 && selectedSkillData.level < 75 && '🥉 Intermediate — growing fast'}
                        {selectedSkillData.level < 60 && '📚 Learning — actively practising'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    ...sunken,
                    background: W.white,
                    padding: '16px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                    fontSize: '11px',
                    color: W.darkGray,
                    textAlign: 'center',
                    minHeight: '200px',
                  }}>
                    ← Click a skill to see details
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Experience tab ── */}
          {activeTab === 'experience' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Stats row */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {[
                  { icon: '📅', label: 'Experience', value: `${stats.yearsExperience}+ Years` },
                  { icon: '🚀', label: 'Projects', value: `${stats.projectsCompleted} Done` },
                  { icon: '😊', label: 'Clients', value: `${stats.happyClients} Happy` },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{
                    ...outerRaised,
                    padding: '8px 12px',
                    background: W.silver,
                    textAlign: 'center',
                    flex: 1,
                    minWidth: '90px',
                  }}>
                    <div style={{ fontSize: '20px', marginBottom: '2px' }}>{icon}</div>
                    <div style={{
                      fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                      fontSize: '13px',
                      fontWeight: 'bold',
                      color: W.navy,
                    }}>
                      {value}
                    </div>
                    <div style={{
                      fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                      fontSize: '10px',
                      color: '#000',
                    }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline list */}
              <div style={{
                ...raised,
                background: W.navy,
                color: W.white,
                padding: '2px 6px',
                fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                fontSize: '11px',
                fontWeight: 'bold',
              }}>
                📋 Career Timeline
              </div>
              <div style={{
                ...sunken,
                background: W.white,
                padding: '0',
                overflow: 'auto',
                maxHeight: '200px',
              }} className="w98-scrollbar">
                {[
                  { period: '2022–Present', role: 'Senior Full Stack Developer', company: 'Tech Corp Inc.', type: '💼' },
                  { period: '2020–2022', role: 'Full Stack Developer', company: 'StartupXYZ', type: '🚀' },
                  { period: '2019–2020', role: 'Frontend Developer', company: 'Web Agency', type: '🎨' },
                  { period: '2018–2019', role: 'Junior Developer', company: 'Freelance', type: '💻' },
                ].map(({ period, role, company, type }, i) => (
                  <div
                    key={i}
                    className="w98-list-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px 8px',
                      borderBottom: `1px solid ${W.lightGray}`,
                      cursor: 'default',
                    }}
                  >
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>{type}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: '#000',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {role}
                      </div>
                      <div style={{
                        fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                        fontSize: '10px',
                        color: W.darkGray,
                      }}>
                        {company} · {period}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* All skills summary progress */}
              <div style={{
                ...raised,
                background: W.navy,
                color: W.white,
                padding: '2px 6px',
                fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                fontSize: '11px',
                fontWeight: 'bold',
                marginTop: '4px',
              }}>
                📊 Top Skills Overview
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
                {skills.slice(0, 8).map((skill) => (
                  <W98ProgressBar
                    key={skill.name}
                    label={skill.name}
                    value={skill.level}
                    color={CATEGORY_COLORS[skill.category] || W.navy}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── System Info tab ── */}
          {activeTab === 'system' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Windows logo */}
                <div style={{
                  ...raised,
                  padding: '12px',
                  background: W.silver,
                  textAlign: 'center',
                  flexShrink: 0,
                }}>
                  <div style={{ fontSize: '48px', lineHeight: 1 }}>🪟</div>
                  <div style={{
                    fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                    fontSize: '13px',
                    fontWeight: 'bold',
                    marginTop: '4px',
                    color: '#000',
                  }}>
                    Windows 98
                  </div>
                  <div style={{
                    fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                    fontSize: '10px',
                    color: W.darkGray,
                  }}>
                    Second Edition
                  </div>
                </div>

                {/* System specs */}
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <div style={{
                    ...raised,
                    background: W.navy,
                    color: W.white,
                    padding: '2px 6px',
                    fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginBottom: '6px',
                  }}>
                    💻 Developer Specs
                  </div>
                  {[
                    { key: 'Registered to', val: personal.name },
                    { key: 'Organization', val: 'Freelance / Open to Work' },
                    { key: 'Processor', val: 'Caffeine-powered @ 3AM' },
                    { key: 'RAM', val: `${stats.yearsExperience * 512} MB Stack Overflow` },
                    { key: 'Storage', val: `${stats.projectsCompleted} Projects Shipped` },
                    { key: 'OS', val: 'Portfolio OS 98 SE' },
                    { key: 'Browser', val: 'Netscape Navigator 4.0 😅' },
                  ].map(({ key, val }) => (
                    <div key={key} style={{
                      display: 'flex',
                      fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                      fontSize: '11px',
                      borderBottom: `1px dotted ${W.lightGray}`,
                      padding: '2px 0',
                      flexWrap: 'wrap',
                      gap: '4px',
                    }}>
                      <span style={{ color: W.navy, fontWeight: 'bold', minWidth: '110px', flexShrink: 0 }}>{key}:</span>
                      <span style={{ color: '#000' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource meters */}
              <div style={{
                ...raised,
                background: W.navy,
                color: W.white,
                padding: '2px 6px',
                fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
                fontSize: '11px',
                fontWeight: 'bold',
                marginTop: '8px',
              }}>
                📈 Resource Monitor
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
                {[
                  { label: 'Creativity', value: 95, color: '#000080' },
                  { label: 'Coffee Level', value: 72, color: '#8B4513' },
                  { label: 'Code Quality', value: 88, color: '#006400' },
                  { label: 'Bug Count', value: 8, color: '#8B0000' },
                ].map(({ label, value, color }) => (
                  <W98ProgressBar key={label} label={label} value={value} color={color} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Button row */}
        <div style={{
          padding: '4px 8px 8px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '6px',
          borderTop: `1px solid ${W.darkGray}`,
        }}>
          <button className="w98-btn-about" onClick={() => setActiveTab('profile')}>OK</button>
          <button className="w98-btn-about" onClick={() => setActiveTab('skills')}>Apply</button>
          <button className="w98-btn-about" onClick={() => window.open(`mailto:${data.socials.email}`)}>Contact</button>
        </div>

        {/* Status bar */}
        <div style={{
          borderTop: `1px solid ${W.darkGray}`,
          padding: '2px 6px',
          display: 'flex',
          gap: '4px',
          background: W.silver,
        }}>
          {[personal.location, `${skills.length} skills listed`, `${stats.projectsCompleted} projects`].map((t, i) => (
            <div key={i} style={{
              ...sunken,
              padding: '1px 6px',
              fontFamily: "'MS Sans Serif', Tahoma, Arial, sans-serif",
              fontSize: '11px',
              flex: i === 0 ? 2 : 1,
              color: '#000',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {t}
            </div>
          ))}
        </div>
      </Win98Window>
    </section>
  );
}
