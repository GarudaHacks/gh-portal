# Garuda Hacks Portal 🚀

The official portal for Garuda Hacks 6.0, a premier hackathon event. Built with modern web technologies to provide a seamless experience for participants.

## 🛠️ Tech Stack

- **Frontend**

  - React 18
  - TypeScript
  - Vite
  - TailwindCSS
  - React Router
  - React Hot Toast

- **Backend**

  - Firebase Cloud Functions
  - Firebase Authentication
  - Firebase Firestore

- **Deployment**
  - Vercel
  - Vercel Analytics

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/gh-portal.git
cd gh-portal
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Fill in your Firebase configuration in `.env`

4. Start development server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
gh-portal/
├── src/
│   ├── components/    # Reusable UI components
│   ├── context/       # React context providers
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Helper functions
├── public/            # Static assets
└── vite.config.ts     # Vite configuration
```

## 🔧 Configuration

### Environment Variables

Required environment variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes following our commit conventions:

   ```bash
   # Format
   <type>(<scope>): <description>

   # Examples
   feat(auth): add Google OAuth login
   fix(api): resolve proxy configuration
   docs(readme): update installation steps
   style(ui): improve button hover states
   refactor(forms): simplify validation logic
   test(api): add auth endpoint tests
   chore(deps): update dependencies
   ```

   Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
   Scope: optional, indicates the module affected

4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [TailwindCSS](https://tailwindcss.com/)

---

Made with ❤️ by the Garuda Hacks Team
