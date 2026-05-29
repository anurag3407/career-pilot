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
- **Authentication:** Secure Firebase Authentication integration.
- **Smooth Animations:** Powered by Framer Motion to provide delightful micro-interactions.
- **PDF Generation:** Export resumes reliably to PDF with `jsPDF` and `html2canvas`.
- **Drag & Drop:** Intuitive drag and drop interfaces using `@hello-pangea/dnd` and `react-dropzone`.
- **Real-time Collaboration:** Powered by `socket.io-client` for seamless live updates.
- **Markdown Support:** Enhanced text editing and formatting via `react-markdown`.
- **Form Management:** Robust form handling with `react-hook-form` and validation capabilities.

## 🛠️ Quick Start

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18+ recommended)
- npm
- A [Firebase project](https://console.firebase.google.com/) (for Authentication & Database features)

### Installation

```bash
# Clone the repository
git clone https://github.com/anurag3407/career-pilot.git

# Navigate to the project directory
cd career-pilot
```

### Environment Setup

> ⚠️ **This step is required before running the app.** Skipping it will cause Firebase-related console warnings and disable authentication/database features.

**1. Set up the frontend `.env` file:**

```bash
# Navigate to the frontend folder
cd frontend

# Copy the example environment file
cp .env.example .env
```

Open `frontend/.env` and fill in your Firebase project credentials. You can find these in the [Firebase Console](https://console.firebase.google.com/) under **Project Settings → Your Apps → SDK Setup and configuration**:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**2. (Optional) Set up the backend `.env` file:**

```bash
# From the root of the project
cd backend
cp .env.example .env
# Edit .env with your backend credentials
```

### Installing Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install
```

### Running the App

```bash
# From the frontend directory
# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**.

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

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
