import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { paginate, paginatedResponse } from '../middleware/paginate.js';
import Resume from '../models/Resume.model.js';
import { scrapeLinkedInProfile, profileToResumeText } from '../services/linkedinImporter.js';

const router = express.Router();

// Get all resumes for a user (paginated)
router.get('/', verifyToken, paginate(), asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  const { page, limit, skip, sort } = req.paginate;

  const total = await Resume.countDocuments({ userId });

  const userResumes = await Resume.find({ userId })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const resumes = userResumes.map(resume => ({
    id: resume._id.toString(),
    ...resume,
    _id: undefined
  }));

  paginatedResponse(res, { data: resumes, total, page, limit });
}));

// Get a specific resume
router.get('/:resumeId', verifyToken, asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.user.uid;

  const resume = await Resume.findOne({ _id: resumeId, userId }).lean();

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  res.json({
    success: true,
    data: {
      id: resume._id.toString(),
      ...resume,
      _id: undefined
    }
  });
}));

// Create a new resume
router.post('/', verifyToken, asyncHandler(async (req, res) => {
  const userId = req.user.uid;
  const { 
    originalText, 
    enhancedText, 
    jobRole, 
    preferences,
    title 
  } = req.body;

  if (!originalText) {
    throw new ApiError(400, 'Original text is required');
  }

  const newResume = await Resume.create({
    userId,
    originalText,
    enhancedText: enhancedText || null,
    jobRole: jobRole || null,
    preferences: preferences || {},
    title: title || `Resume - ${new Date().toLocaleDateString()}`
  });

  res.status(201).json({
    success: true,
    data: {
      id: newResume._id.toString(),
      userId: newResume.userId,
      originalText: newResume.originalText,
      enhancedText: newResume.enhancedText,
      jobRole: newResume.jobRole,
      preferences: newResume.preferences,
      title: newResume.title,
      pdfUrl: newResume.pdfUrl,
      createdAt: newResume.createdAt,
      lastModified: newResume.lastModified
    }
  });
}));

// Update a resume
router.put('/:resumeId', verifyToken, asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.user.uid;
  const updates = req.body;

  const allowedUpdates = ['originalText', 'enhancedText', 'jobRole', 'preferences', 'title', 'pdfUrl'];
  const updateData = {};
  for (const key of allowedUpdates) {
    if (updates[key] !== undefined) updateData[key] = updates[key];
  }

  const updatedResume = await Resume.findOneAndUpdate(
    { _id: resumeId, userId },
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedResume) {
    throw new ApiError(404, 'Resume not found');
  }

  res.json({
    success: true,
    data: {
      id: updatedResume._id.toString(),
      ...updatedResume,
      _id: undefined
    }
  });
}));

// Delete a resume
router.delete('/:resumeId', verifyToken, asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.user.uid;

  const resume = await Resume.findOneAndDelete({ _id: resumeId, userId });

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  res.json({
    success: true,
    message: 'Resume deleted successfully'
  });
}));

// Preview LinkedIn profile before importing
router.post('/import/linkedin/preview', verifyToken, asyncHandler(async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    throw new ApiError(400, 'LinkedIn URL is required');
  }

  const isLinkedIn = /^https?:\/\/(www\.)?linkedin\.com\/in\//.test(url.trim());
  if (!isLinkedIn) {
    throw new ApiError(400, 'Please provide a valid LinkedIn profile URL (linkedin.com/in/...)');
  }

  const profile = await scrapeLinkedInProfile(url.trim());

  res.json({
    success: true,
    preview: {
      name: profile.name,
      headline: profile.headline,
      location: profile.location,
      about: profile.about,
      experienceCount: profile.experience?.length || 0,
      educationCount: profile.education?.length || 0,
      skills: profile.skills || [],
    },
    profile,
  });
}));

// Import LinkedIn profile as a resume
router.post('/import/linkedin', verifyToken, asyncHandler(async (req, res) => {
  const { url, profile: cachedProfile } = req.body;
  const userId = req.user.uid;

  if (!url && !cachedProfile) {
    throw new ApiError(400, 'LinkedIn URL or profile data is required');
  }

  const profile = cachedProfile || await scrapeLinkedInProfile(url.trim());
  const resumeText = profileToResumeText(profile);
  const title = `${profile.name || 'LinkedIn'} — Imported ${new Date().toLocaleDateString()}`;

  const resume = await Resume.create({
    userId,
    originalText: resumeText,
    jobRole: profile.headline || null,
    preferences: {
      skills: profile.skills || [],
    },
    title,
  });

  res.status(201).json({
    success: true,
    data: {
      id: resume._id.toString(),
      userId: resume.userId,
      originalText: resume.originalText,
      enhancedText: resume.enhancedText,
      jobRole: resume.jobRole,
      preferences: resume.preferences,
      title: resume.title,
      pdfUrl: resume.pdfUrl,
      createdAt: resume.createdAt,
      lastModified: resume.lastModified,
    },
  });
}));

// Download resume as PDF
router.get('/:resumeId/download', verifyToken, asyncHandler(async (req, res) => {
  const { resumeId } = req.params;
  const userId = req.user.uid;
  const { version = 'enhanced' } = req.query;

  const resume = await Resume.findById(resumeId).lean();

  if (!resume) {
    throw new ApiError(404, 'Resume not found');
  }

  if (resume.userId !== userId) {
    throw new ApiError(403, 'Access denied');
  }

  const PDFDocument = (await import('pdfkit')).default;
  
  const textContent = version === 'enhanced' && resume.enhancedText 
    ? resume.enhancedText 
    : resume.originalText;

  if (!textContent) {
    throw new ApiError(400, 'No content available for download');
  }

  // A4 size with standard resume margins
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  const filename = `${resume.title || 'resume'}_${version}.pdf`.replace(/[^a-zA-Z0-9_.-]/g, '_');
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  doc.pipe(res);

  const pageWidth = doc.page.width;
  const margin = 50;
  const contentWidth = pageWidth - 2 * margin;
  
  // Colors
  const BLUE = '#0000EE';
  const BLACK = '#000000';
  const GRAY = '#333333';

  // Standard resume font sizes
  const FONT_NAME = 24;        // Name
  const FONT_SECTION = 12;     // Section headers
  const FONT_TITLE = 11;       // Job titles, degrees
  const FONT_BODY = 11;        // Body text, bullets
  const FONT_CONTACT = 10;     // Contact info

  // Parse markdown links [text](url)
  const parseLinks = (text) => {
    const parts = [];
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIdx = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push({ type: 'text', content: text.slice(lastIdx, match.index) });
      }
      parts.push({ type: 'link', text: match[1], url: match[2] });
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIdx) });
    }
    return parts.length ? parts : [{ type: 'text', content: text }];
  };

  // Render contact line centered with clickable links
  const renderContactLine = (text) => {
    const parts = parseLinks(text.replace(/\s*\|\s*/g, ' | '));
    doc.fontSize(FONT_CONTACT).font('Helvetica');
    
    let totalW = 0;
    parts.forEach(p => {
      totalW += doc.widthOfString(p.type === 'link' ? p.text : p.content);
    });
    
    let x = margin + (contentWidth - totalW) / 2;
    const y = doc.y;
    
    parts.forEach(p => {
      if (p.type === 'link') {
        doc.fillColor(BLUE).text(p.text, x, y, { link: p.url, continued: false });
        x += doc.widthOfString(p.text);
      } else {
        doc.fillColor(GRAY).text(p.content, x, y, { continued: false });
        x += doc.widthOfString(p.content);
      }
    });
    
    doc.y = y + 14;
  };

  const lines = textContent.split('\n');
  let isAfterName = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      doc.moveDown(0.3);
      continue;
    }
    
    // Skip horizontal rules
    if (line === '---' || line === '***') continue;

    // # NAME (main heading)
    if (line.startsWith('# ') && !line.startsWith('## ')) {
      const name = line.slice(2).trim();
      
      doc.fontSize(FONT_NAME)
         .font('Helvetica-Bold')
         .fillColor(BLACK);
      
      const nameW = doc.widthOfString(name);
      doc.text(name, margin + (contentWidth - nameW) / 2, doc.y);
      
      doc.moveDown(0.4);
      isAfterName = true;
      continue;
    }

    // Contact line (after name, contains | or @ or links)
    if (isAfterName && (line.includes('@') || line.includes('|') || line.includes(']('))) {
      renderContactLine(line);
      
      // Add separator line
      doc.moveDown(0.3);
      doc.moveTo(margin, doc.y)
         .lineTo(pageWidth - margin, doc.y)
         .lineWidth(0.5)
         .stroke(BLACK);
      
      doc.moveDown(0.6);
      isAfterName = false;
      continue;
    }
    isAfterName = false;

    // ## SECTION HEADER
    if (line.startsWith('## ')) {
      const section = line.slice(3).trim().toUpperCase();
      
      doc.moveDown(0.5);
      doc.fontSize(FONT_SECTION)
         .font('Helvetica-Bold')
         .fillColor(BLACK)
         .text(section, margin);
      
      // Underline for section
      const sectionW = doc.widthOfString(section);
      doc.moveTo(margin, doc.y + 2)
         .lineTo(margin + sectionW, doc.y + 2)
         .lineWidth(0.5)
         .stroke(BLACK);
      
      doc.moveDown(0.4);
      continue;
    }

    // ### Subsection or **Bold Title**
    if (line.startsWith('### ') || (line.startsWith('**') && line.endsWith('**'))) {
      let titleText = line.startsWith('### ') ? line.slice(4) : line;
      titleText = titleText.replace(/\*\*/g, '');
      
      const [mainTitle, ...dateParts] = titleText.split('|').map(s => s.trim());
      const dateStr = dateParts.join(' | ');
      
      doc.moveDown(0.2);
      const y = doc.y;
      
      doc.fontSize(FONT_TITLE)
         .font('Helvetica-Bold')
         .fillColor(BLACK)
         .text(mainTitle, margin, y, { continued: false });
      
      if (dateStr) {
        doc.fontSize(FONT_TITLE).font('Helvetica').fillColor(GRAY);
        const dateW = doc.widthOfString(dateStr);
        doc.text(dateStr, pageWidth - margin - dateW, y);
      }
      
      continue;
    }

    // Bold text line (starts with **)
    if (line.startsWith('**') && line.includes('**')) {
      const cleanText = line.replace(/\*\*/g, '');
      
      doc.fontSize(FONT_TITLE)
         .font('Helvetica-Bold')
         .fillColor(BLACK)
         .text(cleanText, margin, doc.y, { width: contentWidth });
      
      continue;
    }

    // Bullet points
    if (line.startsWith('- ') || line.startsWith('* ')) {
      let bulletText = line.slice(2).replace(/\*\*/g, '');
      
      doc.fontSize(FONT_BODY).fillColor(GRAY).font('Helvetica');
      
      // Check for links
      if (bulletText.includes('](')) {
        const parts = parseLinks(bulletText);
        
        doc.text('• ', margin, doc.y, { continued: true });
        
        parts.forEach((p, idx) => {
          const isLast = idx === parts.length - 1;
          if (p.type === 'link') {
            doc.fillColor(BLUE).text(p.text, { link: p.url, continued: !isLast });
          } else {
            doc.fillColor(GRAY).text(p.content, { continued: !isLast });
          }
        });
      } else {
        doc.text('• ' + bulletText, margin, doc.y, { width: contentWidth });
      }
      
      continue;
    }

    // Regular text with possible links
    if (line.includes('](')) {
      const parts = parseLinks(line);
      doc.fontSize(FONT_BODY).font('Helvetica');
      
      parts.forEach((p, idx) => {
        const isLast = idx === parts.length - 1;
        if (p.type === 'link') {
          doc.fillColor(BLUE).text(p.text, { link: p.url, continued: !isLast });
        } else {
          doc.fillColor(GRAY).text(p.content, { continued: !isLast });
        }
      });
    } else {
      doc.fontSize(FONT_BODY)
         .font('Helvetica')
         .fillColor(GRAY)
         .text(line.replace(/\*\*/g, ''), margin, doc.y, { width: contentWidth });
    }
  }

  doc.end();
}));

export default router;
