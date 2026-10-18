# Garuda Hacks Portal 🚀

The official portal for Garuda Hacks 6.0-7.0. The app serves various functions, before and during the hackathon.


## Functionality
1. Hackathon registration: collecting profile, data, consent, rejection, RSVP, up until ready to attend with a boarding pass generated uniquely for a hacker.
2. Account management: connect Discord account, delete account data for privacy compliance.
3. Table lookup: a convenient place to check a dynamic assignment of hacker's table in the event day.
4. Mentoring platform: integrated mentoring for both Mentor and Hacker. The app will show a different interface for the designated role. The mentoring system is by slot-booking system which initiated by the Hacker.


## High-level Architecture

- This app is designated as part of the frontend built with React Vite which deployed to Vercel.
- The backend is a separate app within `GarudaHacks/web-be` repository. The backend is deployed to Firebase Functions.
- As of 7.0, it is a good practice to have 3 different environment:
  - Local: where every changes is done only locally, indicated with any feature branch `feat/...`
  - Dev: where changes is tested before going live, indicated by `dev` branch.
  - Production: where all tested changes in Dev can finally go live, indicated by `main` branch.
  
  These means there are 2 deployments for backend and also frontend, as well as the database connected to the backend. Please refer to the backend repository.
- Start exploring the project by taking a look at `pages` which contains all interface for logged in user as a Hacker or  Mentor.
- Upon succesful login, the backend will send a cookie that will be persisted for the entire session. All auth states is defined in `src/context/AuthContext.tsx`.


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

---

Made with ❤️ by the Garuda Hacks Team
