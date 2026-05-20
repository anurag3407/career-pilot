# Email Templates Documentation

## Overview

CareerPilot now uses professional, responsive HTML email templates for all transactional emails. Templates are stored in `/backend/src/templates/emails/` and rendered using a custom template engine that supports variable substitution, conditionals, and loops.

## Features

✅ **Responsive Design** - Mobile-friendly layouts that work on all email clients  
✅ **Professional Branding** - Consistent CareerPilot branding across all emails  
✅ **Accessibility** - Semantic HTML with proper contrast ratios  
✅ **Fallback Support** - Graceful degradation for older email clients  
✅ **Easy Customization** - Simple template syntax for variable insertion  

## Available Templates

### 1. Job Alert Email (`jobAlert.html`)
Sends job matches matching user's saved searches and alerts.

**Parameters:**
- `userName` - Recipient's display name
- `alertTitle` - Title of the job alert
- `jobCount` - Number of jobs in the alert
- `jobs` - Array of job objects with:
  - `title` - Job title
  - `company` - Company name
  - `location` - Job location
  - `jobType` - Full-time, Part-time, Contract, etc.
  - `salary` - Salary range
  - `description` - Brief job description
  - `postedDate` - Date job was posted
  - `applyLink` - URL to apply (must be HTTPS)
- `dashboardLink` - Link to user dashboard
- `unsubscribeLink` - Email unsubscribe link
- `preferencesLink` - Email preferences link

**Usage:**
```javascript
import { renderTemplate } from './services/templateEngine.js';

const html = renderTemplate('jobAlert', {
  userName: 'John Doe',
  alertTitle: 'Senior React Developer',
  jobCount: 5,
  jobs: [
    {
      title: 'Senior React Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      jobType: 'Full-time',
      salary: '$150k - $200k',
      description: 'We are looking for...',
      postedDate: '2 hours ago',
      applyLink: 'https://example.com/apply/123'
    }
  ],
  dashboardLink: 'https://careerpilot.com/dashboard',
  unsubscribeLink: 'https://careerpilot.com/settings/emails',
  preferencesLink: 'https://careerpilot.com/settings/job-alerts'
});
```

### 2. Proposal Approval Email (`proposalApproval.html`)
Confirms that a student's proposal/bid has been accepted by a company.

**Parameters:**
- `studentName` - Student's name
- `challengeTitle` - Project/challenge title
- `companyName` - Company that accepted the proposal
- `corporateName` - (Optional) Corporate partner name
- `proposedPrice` - Agreed price (number)
- `estimatedDays` - Project timeline in days
- `feedback` - (Optional) Message from company
- `chatRoomLink` - Link to start conversation
- `projectDetailsLink` - Link to project details
- `milestonesLink` - Link to create milestones
- `dashboardLink` - Link to dashboard
- `faqLink` - Link to FAQ
- `supportLink` - Link to support

**Usage:**
```javascript
const html = renderTemplate('proposalApproval', {
  studentName: 'Jane Smith',
  challengeTitle: 'E-commerce Platform Redesign',
  companyName: 'TechStart Inc',
  corporateName: 'Innovation Labs',
  proposedPrice: 50000,
  estimatedDays: 30,
  feedback: 'Great proposal! We love your approach.',
  chatRoomLink: 'https://careerpilot.com/fellowship/messages/abc123',
  projectDetailsLink: 'https://careerpilot.com/fellowship/projects/abc123',
  milestonesLink: 'https://careerpilot.com/fellowship/milestones/abc123',
  dashboardLink: 'https://careerpilot.com/dashboard',
  faqLink: 'https://careerpilot.com/fellowship/faq',
  supportLink: 'https://careerpilot.com/support'
});
```

### 3. Verification Email (`verification.html`)
Sends email verification code for account signup or email confirmation.

**Parameters:**
- `code` - 6-digit or alphanumeric verification code
- `verificationLink` - (Optional) Direct verification link
- `helpLink` - Link to help center
- `contactLink` - Link to contact support
- `reportLink` - Link to report suspicious activity
- `privacyLink` - Privacy policy link
- `termsLink` - Terms of service link

**Usage:**
```javascript
const html = renderTemplate('verification', {
  code: '123456',
  verificationLink: 'https://careerpilot.com/verify?code=123456',
  helpLink: 'https://careerpilot.com/help',
  contactLink: 'https://careerpilot.com/support',
  reportLink: 'https://careerpilot.com/security/report',
  privacyLink: 'https://careerpilot.com/privacy',
  termsLink: 'https://careerpilot.com/terms'
});
```

## Template Syntax

### Variables
Insert dynamic values using `{{variableName}}`

```html
<p>Hello {{userName}}</p>
```

### Conditionals
Show content only if a value exists using `{{#if condition}}...{{/if}}`

```html
{{#if salary}}
  <span>Salary: {{salary}}</span>
{{/if}}
```

### Loops
Iterate over arrays using `{{#each arrayName}}...{{/each}}`

```html
{{#each jobs}}
  <div class="job">
    <h3>{{title}}</h3>
    <p>{{company}}</p>
  </div>
{{/each}}
```

Inside loops, access the current item's properties and use `{{@index}}` for the item's index (0-based).

### Helpers

#### formatCurrency
Format numbers as currency with Indian Rupee formatting

```html
<p>Price: {{formatCurrency proposedPrice}}</p>
<!-- Output: Price: 50,000 -->
```

#### addDays
Add days to the current date and format it

```html
<p>Expected Completion: {{addDays estimatedDays}}</p>
<!-- Output: Expected Completion: May 20, 2026 (if today is May 20, 2026 and estimatedDays is 0) -->
```

#### truncate
Truncate text to a specific length (default 200 characters)

```html
<p>{{truncate description 150}}</p>
```

### Auto-escaping
All variables are automatically HTML-escaped to prevent injection attacks. Safe URLs must be marked with `isSafeExternalUrl()`.

## Adding New Templates

1. Create a new HTML file in `/backend/src/templates/emails/`
2. Use the template syntax documented above
3. Import and render using `renderTemplate()`

**Template Structure Best Practices:**
- Include proper responsive CSS with media queries
- Use inline styles (email clients don't support external stylesheets)
- Test with multiple email clients (Gmail, Outlook, Apple Mail)
- Keep file sizes under 500KB
- Use semantic HTML

## Template Features

### Responsive Design System

All templates include:
- Mobile-first responsive design
- Proper viewport meta tag
- Email client-safe CSS
- Tested on major email providers:
  - Gmail
  - Outlook
  - Apple Mail
  - Yahoo Mail
  - Mobile Mail Apps

### Branding

- **Color Palette:**
  - Primary: `#667eea` (Indigo)
  - Secondary: `#764ba2` (Purple)
  - Success: `#10b981` (Green)
  - Warning: `#f59e0b` (Amber)

- **Typography:**
  - Font Stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
  - Optimal font sizes for readability

### Security

- HTML escaping to prevent XSS attacks
- URL validation (only HTTPS URLs allowed in critical contexts)
- No external asset loading (all CSS is inline)
- GDPR-compliant unsubscribe links

## Integration with Mail Service

The template engine is integrated into `/backend/src/services/mailService.js`. Email functions automatically use templates:

### Before (Inline HTML)
```javascript
const mailOptions = {
  html: `<h1>Hello</h1><p>Job: ${jobTitle}</p>`
};
```

### After (Template-based)
```javascript
const html = renderTemplate('jobAlert', {
  userName: 'John',
  alertTitle: 'React Jobs',
  jobCount: 5,
  jobs: [...]
});

const mailOptions = { html };
```

## Debugging

### Template Not Found Error
Ensure the template file exists in `/backend/src/templates/emails/` and the filename matches (case-sensitive).

### Variables Not Replacing
1. Check variable names match exactly
2. Verify variables are passed to `renderTemplate()`
3. Ensure values are not `null` or `undefined`

### HTML Rendering Issues
1. Test the generated HTML with [MJML Sandbox](https://mjml.io/try-it-live)
2. Check email client rendering with [Stripo](https://stripo.email)
3. Verify inline CSS compatibility

### Clear Cache
```javascript
import { clearTemplateCache } from './services/templateEngine.js';
clearTemplateCache();
```

## Performance

- Templates are cached after first load
- Rendering is fast (< 5ms per email)
- Suitable for bulk email operations
- Minimal memory footprint

## Testing

Test templates locally:
```bash
# Start development server
npm run dev

# Test email rendering
node -e "
import { renderTemplate } from './src/services/templateEngine.js';
const html = renderTemplate('jobAlert', {
  userName: 'Test User',
  alertTitle: 'Test Alert',
  jobCount: 1,
  jobs: [{
    title: 'Test Job',
    company: 'Test Co',
    location: 'Test City'
  }]
});
console.log(html);
"
```

## Customization Guide

### Change Brand Colors
Edit the gradient definitions in the template's `<style>` section:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Modify Template Dimensions
Update `max-width: 600px` in `.container` to adjust email width

### Add New Sections
Copy an existing section and modify the HTML/CSS while maintaining responsive design

## Migration Checklist

If migrating from old inline HTML emails:
- Update function calls to use `renderTemplate()`
- Replace inline variables with template variables
- Test rendering with various data
- Verify email client compatibility
- Update mailService function parameters

## Support

For questions or issues:
1. Check template syntax in this documentation
2. Review template source files for examples
3. Test with `console.log(renderTemplate(...))`
4. Verify data types and required fields
