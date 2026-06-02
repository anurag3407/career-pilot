# Apple HIG Portfolio Theme

An ultra-clean, spacious portfolio theme inspired by Apple's Human Interface Guidelines. 

## Features
- **Typography & Layout**: Generous whitespace, centered text, and the system font stack (`-apple-system`) to replicate the SF Pro aesthetic perfectly without proprietary fonts.
- **Color Palette**: Muted gray scale (`#fbfbfd` to `#f5f5f7`) ensuring an ultra-clean appearance.
- **Dark Mode Support**: Fully responsive to system preferences, switching to a pitch-black and deep gray palette mimicking iOS/macOS true dark mode.
- **Components**: Cards feature 20px border radii with subtle shadows to create depth without visual clutter.
- **Animations (Strictly CSS-only)**: Features an advanced, Siri-inspired animated mesh background gradient using pure CSS `@keyframes`, and scroll-triggered section fade-ups using modern `animation-timeline`.

## Usage
This template relies on safe DOM manipulation via `script.js` to inject portfolio data. It reads from the `PORTFOLIO` object and replaces placeholder tokens in the HTML structure.

## Files
- `index.html`: The structural markup containing placeholders.
- `style.css`: All styling, layout, typography, and pure-CSS animations.
- `script.js`: Data injection and minimal UI interaction (like the mobile nav toggle). 
- `README.md`: This documentation file.
