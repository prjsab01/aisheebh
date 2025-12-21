# Portfolio Platform

A premium, professional portfolio platform with a LinkedIn-style public viewer and a comprehensive admin CMS.

## Features

- **Public Viewer**: Clean, dark-themed portfolio display with dynamic sections
- **Admin CMS**: Full content management with Firebase authentication
- **Responsive Design**: Mobile-first with Tailwind CSS
- **SEO Optimized**: Dynamic metadata and sitemap generation
- **Firebase Integration**: Auth, Firestore, and Storage

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter
- **Deployment**: Cloudflare Pages

## Local Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd portfolio-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Enable Firestore
   - Enable Storage
   - Get your config from Project Settings

4. **Environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase configuration

5. **Run development server**
   ```bash
   npm run dev
   ```

## Firebase Setup

1. **Create Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Enable services**:
   - Authentication: Email/Password
   - Firestore Database
   - Storage

3. **Security rules**:
   - Deploy rules: `firebase deploy --only firestore:rules,storage:rules`

4. **Create admin user**:
   - In Firebase Auth, create a user with admin email
   - Use this email for CMS login

## Admin Usage

1. Navigate to `/admin/login`
2. Login with admin credentials
3. Access dashboard for content management
4. Edit profile, sections, and media
5. Publish changes to update the public site

## Cloudflare Pages Deployment

1. **Connect repository**:
   - Go to Cloudflare Pages
   - Connect your GitHub repository

2. **Build settings**:
   - Build command: `npm run build`
   - Build output directory: `.next`

3. **Environment variables**:
   - Add all `NEXT_PUBLIC_*` variables from `.env.local`

4. **Deploy**:
   - Push to `main` branch to trigger auto-deployment

## Sample Data

To populate with sample data:

1. Run the app locally
2. Use Firebase Console to add documents to Firestore collections:
   - `profile`
   - `sections`
   - `entries`
   - `highlights`
   - `socials`

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Project Structure

```
app/
├── admin/          # Admin CMS pages
├── globals.css     # Global styles
├── layout.tsx      # Root layout
└── page.tsx        # Public viewer

components/         # Reusable components
lib/                # Firebase config and utilities
types/              # TypeScript interfaces
public/             # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test
4. Submit a pull request

## License

MIT License