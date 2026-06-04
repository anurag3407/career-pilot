<div align="center">
  <h1>🚀 Career Pilot</h1>
  <p>An advanced AI-powered Resume Builder application, aimed to help users build their resumes with ease, backed by Modern Web Technologies and Artificial Intelligence.</p>
</div>

## 👨‍💻 Maintainers

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/anurag3407">
          <img src="https://github.com/anurag3407.png" width="100" style="border-radius: 50%;" alt="anurag3407"/><br />
          <sub><b>anurag3407</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Mohnish27-dev">
          <img src="https://github.com/Mohnish27-dev.png" width="100" style="border-radius: 50%;" alt="Mohnish27-dev"/><br />
          <sub><b>Mohnish27-dev</b></sub>
        </a>
      </td>
    </tr>
  </table>
</div>

## 💻 Tech Stack

- **Frontend:** React 19, Vite
- **Styling & Animations:** TailwindCSS 4, Framer Motion
- **Authentication & Backend:** Firebase
- **Core Libraries:** jsPDF, html2canvas, socket.io-client, react-hook-form, @hello-pangea/dnd

## ✨ Features

- **Modern Tech Stack:** Built with React 19 and Vite for blazing fast development and optimized production builds.
- **Stunning UI/UX:** Styled using TailwindCSS 4, offering responsive and aesthetically pleasing design.
- **Accessibility:** Built-in support for Light, Dark, and High Contrast theme modes.
- **Authentication:** Secure Firebase Authentication integration.
- **Smooth Animations:** Powered by Framer Motion to provide delightful micro-interactions.
- **PDF Generation:** Export resumes reliably to PDF with `jsPDF` and `html2canvas`.
- **Drag & Drop:** Intuitive drag and drop interfaces using `@hello-pangea/dnd` and `react-dropzone`.
- **Real-time Collaboration:** Powered by `socket.io-client` for seamless live updates.
- **Markdown Support:** Enhanced text editing and formatting via `react-markdown`.
- **Form Management:** Robust form handling with `react-hook-form` and validation capabilities.

## 🛠️ Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/anurag3407/career-pilot.git

# Navigate to the project directory
cd career-pilot

# Install frontend dependencies
npm install
```

### Environment Setup

Copy the example environment file and add your configuration details.

```bash
cp .env.example .env
```

Ensure you configure the `.env` file with your **Backend API** and **Firebase** credentials as per `.env.example`.

### Running the App

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📱 Progressive Web App (PWA)

careerpilot ships as an installable PWA backed by a hand-written service worker
(no `vite-plugin-pwa`).

**Files**

| File | Purpose |
|------|---------|
| `frontend/public/sw.js` | Service worker — caching + offline fallback |
| `frontend/public/manifest.json` | Web app manifest (name, icons, theme) |
| `frontend/src/utils/registerSW.js` | Registration helper (production-only) |
| `frontend/index.html` | Links the manifest + apple-touch-icon |

**Caching strategy (`sw.js`)**

- Navigations (HTML) → **network-first**, falling back to cache then an inline
  offline page.
- Same-origin static assets (`js/css/img/fonts`) → **cache-first** with
  background fill.
- `/api/*` requests and all cross-origin traffic (Firebase, Razorpay, Google
  Fonts) → **network-only**, never cached.
- Cache name is versioned (`careerpilot-v1`); bump `CACHE_VERSION` in `sw.js`
  whenever the app shell changes to evict stale caches.

**Registration**

The worker is registered **only in production builds** (`import.meta.env.PROD`)
on the window `load` event, so local `npm run dev` is never affected by SW
caching. To test it locally, build then preview:

```bash
cd frontend
npm run build
npm run preview
```

Then open DevTools → **Application → Service Workers** to confirm it is active,
and toggle **Offline** to verify the fallback.

> **Note:** Icons currently reuse `public/speed.png` as a temporary placeholder.
> Replace it with dedicated `192×192` and `512×512` PNGs and update
> `manifest.json` for a production-ready install experience.

## 🌟 Contributing

We welcome and appreciate contributions from the community! Whether it's reporting bugs, improving documentation, or proposing new features, your help is valuable.

To make a contribution:
1. **Fork** the repository.
2. **Create a new branch** (`git checkout -b feature/your-feature-name`).
3. **Commit your changes** (`git commit -m 'Add some feature'`).
4. **Push to the branch** (`git push origin feature/your-feature-name`).
5. **Open a Pull Request** against the `main` branch.

Please make sure to read our [Contribution Guidelines](CONTRIBUTION.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before getting started.

## 🤝 Contributors

Thank you to everyone who has contributed to making **Career Pilot** better! 

<a href="https://github.com/anurag3407/career-pilot/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=anurag3407/career-pilot" alt="Contributors" />
</a>

## 📄 License

This project is open-source. Please check the `LICENSE` file for more details.
