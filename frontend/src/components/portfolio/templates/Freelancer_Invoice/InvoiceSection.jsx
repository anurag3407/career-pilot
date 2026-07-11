import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle2, Clock } from 'lucide-react';

const INVOICE_ITEMS = [
  { service: 'Full Stack Development', description: 'React + Node.js Application', hours: 80, rate: 95 },
  { service: 'UI/UX Design', description: 'Wireframes & Prototyping', hours: 20, rate: 75 },
  { service: 'API Integration', description: 'Third-party API & Auth Setup', hours: 12, rate: 95 },
  { service: 'Testing & QA', description: 'Unit & Integration Tests', hours: 10, rate: 70 },
  { service: 'Deployment & DevOps', description: 'AWS Setup & CI/CD Pipeline', hours: 8, rate: 90 },
];

export default function InvoiceSection({ data }) {
  const { personal, projects } = data;
  const [activeProject, setActiveProject] = useState(0);
  const project = projects?.[activeProject] || {};

  const subtotal = INVOICE_ITEMS.reduce((acc, item) => acc + item.hours * item.rate, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const invoiceDate = '2024-03-15';
  const dueDate = '2024-04-15';

  return (
    <section id="invoice" style={{ padding: '96px 0', background: 'linear-gradient(135deg, #F0F4FF 0%, #F8FAFC 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div className="fi-section-tag">
            <FileText size={12} />
            INVOICE BREAKDOWN
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#0F172A', letterSpacing: '-1px', marginBottom: 12 }}>
            Transparent <span className="fi-gradient-text">Pricing</span>
          </h2>
          <p style={{ fontSize: 16, color: '#64748B', maxWidth: 480, margin: '0 auto' }}>
            No hidden fees. Full itemized breakdown for every project.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start' }} className="fi-two-col">
          {/* Main Invoice Document */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="fi-invoice-paper"
            style={{ maxWidth: 700 }}
          >
            {/* Invoice Header */}
            <div style={{ padding: '28px 32px 24px', borderBottom: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #1E40AF, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={16} color="#fff" />
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', color: '#94A3B8', textTransform: 'uppercase' }}>INVOICE</div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#0F172A' }}>#INV-2024-001</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>
                    Issued: {invoiceDate} &nbsp;|&nbsp; Due: {dueDate}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <div className="fi-status-available">
                    <span className="fi-dot-green" />
                    AVAILABLE FOR HIRE
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic' }}>Valid for 30 days</div>
                </div>
              </div>

              {/* From / To */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>FROM</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{personal?.name}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{personal?.title}</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>{personal?.location}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6 }}>BILLED TO</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Client Name</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>client@company.com</div>
                  <div style={{ fontSize: 12, color: '#64748B' }}>New York, USA</div>
                </div>
              </div>
            </div>

            {/* Invoice Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="fi-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', width: '40%' }}>Service</th>
                    <th style={{ textAlign: 'left' }}>Description</th>
                    <th style={{ textAlign: 'center' }}>Hours</th>
                    <th style={{ textAlign: 'right' }}>Rate</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {INVOICE_ITEMS.map((item, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <td style={{ fontWeight: 600, color: '#111827' }}>{item.service}</td>
                      <td style={{ color: '#64748B', fontSize: 12 }}>{item.description}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={11} color="#94A3B8" />{item.hours}h
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>${item.rate}/hr</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#1E40AF' }}>${(item.hours * item.rate).toLocaleString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div style={{ padding: '20px 32px 28px', background: '#F8FAFC', borderTop: '1px solid #E5E7EB' }}>
              <div style={{ maxWidth: 240, marginLeft: 'auto' }}>
                {[
                  { label: 'Subtotal', value: `$${subtotal.toLocaleString()}` },
                  { label: 'Tax (10%)', value: `$${tax.toLocaleString()}` },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #E5E7EB' }}>
                    <span style={{ fontSize: 13, color: '#64748B' }}>{row.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{row.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', borderTop: '2px solid #1E40AF', marginTop: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>Total Due</span>
                  <span style={{ fontSize: 28, fontWeight: 900, color: '#2563EB', lineHeight: 1 }}>${total.toLocaleString()}</span>
                </div>
              </div>

              {/* Download Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                <button type="button" className="fi-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
                  <Download size={16} />
                  Download Invoice
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right: Project Selector Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ minWidth: 260 }}
          >
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #0F172A, #1E293B)', borderBottom: '1px solid #334155' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>Past Projects</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Select to Preview</div>
              </div>

              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {(projects || []).slice(0, 5).map((proj, i) => (
                  <button type="button"
                    key={i}
                    onClick={() => setActiveProject(i)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '12px 16px',
                      borderBottom: '1px solid #F1F5F9', border: 'none',
                      cursor: 'pointer',
                      background: activeProject === i ? '#EFF6FF' : 'transparent',
                      borderLeft: activeProject === i ? '3px solid #2563EB' : '3px solid transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: activeProject === i ? '#1E40AF' : '#374151', marginBottom: 2 }}>{proj.title}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {(proj.techStack || []).slice(0, 2).map((t, ti) => (
                        <span key={ti} style={{ background: '#F1F5F9', padding: '1px 6px', borderRadius: 4 }}>{t}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Project Summary */}
              <div style={{ padding: '16px 20px', borderTop: '1px solid #E5E7EB', background: '#F8FAFC' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Quick Summary</div>
                {[
                  { label: 'Hours', value: '80–120h' },
                  { label: 'Rate', value: '$95/hr' },
                  { label: 'Est. Cost', value: '$7,600–$11,400' },
                ].map((s, si) => (
                  <div key={si} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dashed #E5E7EB' }}>
                    <span style={{ fontSize: 12, color: '#64748B' }}>{s.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1E40AF' }}>{s.value}</span>
                  </div>
                ))}
                <button type="button" className="fi-btn-outline" style={{ width: '100%', marginTop: 12, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <CheckCircle2 size={13} />
                  Request Quote
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
