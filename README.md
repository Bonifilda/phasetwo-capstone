# Medium Platform

A modern, full-stack blogging platform inspired by Medium, built with Next.js 16, TypeScript, MongoDB, and NextAuth.js.

# Features

- Authentication: Secure user registration and login with NextAuth.js
- Content Management: Rich text editor for creating and editing posts
- Social Features: Follow users, like posts, and comment on articles
- User Profiles: Customizable profiles with bio and follower/following counts
- Responsive Design: Mobile-first design with Tailwind CSS
- SEO Optimized: Server-side rendering and meta tags
- Image Upload: Support for post cover images and user avatars
- Search & Discovery: Browse posts by tags and search functionality

# Tech Stack

- Frontend: Next.js 16, React 19, TypeScript
- Styling: Tailwind CSS
- Database: MongoDB with Mongoose
- Authentication: NextAuth.js with JWT
- State Management: TanStack React Query
- Rich Text Editor: TipTap

# Prerequisites

- Node.js 18+ 
- MongoDB database (local or MongoDB Atlas)
- Git

# Installation & Setup

# 1. Clone the Repository

`bash
git clone <your-repo-url>
cd medium-platform
`

# 2. Install Dependencies

`bash
npm install
`

# 3. Environment Configuration

Create a `.env.local` file in the root directory:

`env
# Database
MONGODB_URI=mongodb://localhost:27017/medium-platform
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://bonifilda:nkundakurya12@cluster0.pahsmam.mongodb.net/auth_app"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here


# Development
NODE_ENV=development
```

# 4. Database Setup

# Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/medium-platform`

# Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and add to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

# 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── posts/             # Post-related pages
│   ├── profile/           # User profile pages
│   └── dashboard/         # User dashboard
├── components/            # Reusable React components
│   ├── auth/              # Authentication components
│   ├── shared/            # Shared UI components
│   └── layout/            # Layout components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── api/               # API client functions
│   ├── auth/              # Authentication configuration
│   ├── db/                # Database connection
│   ├── models/            # Mongoose models
│   └── services/          # Business logic services
├── types/                 # TypeScript type definitions
└── providers/             # React context providers
```

# Key Components

# Authentication System
- NextAuth.js with JWT strategy
- Credential-based login with bcrypt password hashing
- Protected routes with middleware
- Session management across the application

# Database Models
- User: Profile information, authentication data
- Post: Blog posts with content, metadata, and relationships
- Comment: Nested comments on posts
- Like: User likes on posts
- Follow: User following relationships
- Tag: Post categorization

# API Architecture
- RESTful API design with Next.js API routes
- Error handling with custom ApiError class
-  middleware for protected endpoints
- Data validationand sanitization
1. Push to GitHub:
   `bash
   git add .
   git commit -m "Initial commit"
   git push origin main


# Traditional Hosting
`bash
npm run build
npm start
`
#Creating Your First Post
1. Sign up for an account
2. Navigate to Dashboard
3. Click "Write a Story"
4. Use the rich text editor to create content
5. Add tags and publish

### Following Users
1. Browse posts or visit user profiles
2. Click "Follow" button on user profiles
3. View your following list in Profile → Following

# Engaging with Content
- Like posts by clicking the heart icon
- Comment on posts (requires authentication)
- Share posts via social media

# Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

# Code Style
- ESLint for code linting
- Prettierfor code formatting
- TypeScript for type safety

# Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes with tests
3. Update documentation
4. Submit pull request

# Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request


# Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [MongoDB](https://www.mongodb.com/) - Database
-

