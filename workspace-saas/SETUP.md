# Setup Guide - Workspace SaaS

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Liveblocks account

## Step 1: Environment Variables

You've already created `.env.local`. Make sure it contains:

```env
MONGODB_URI=mongodb+srv://root:itsmeroot@cluster0.jkfx3h8.mongodb.net/workspace-saas?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-this>
LIVEBLOCKS_SECRET_KEY=<your-secret-key>
```

### Generate NEXTAUTH_SECRET

Run this command in your terminal:
```bash
openssl rand -base64 32
```

Or use Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Get Liveblocks Secret Key

1. Go to https://liveblocks.io/dashboard
2. Select your project
3. Go to "API keys" section
4. Copy your **Secret Key** (starts with `sk_`)
5. Add it to `.env.local`

## Step 2: Install Dependencies

```bash
cd workspace-saas
npm install
```

## Step 3: Run Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Step 4: Create Your First Account

1. Open http://localhost:3000
2. Click "Get Started"
3. Fill in your details to register
4. Login with your credentials
5. A default workspace will be created automatically

## Step 5: Test Collaboration

1. Open the app in two browser windows/tabs
2. Login with the same account in both
3. Create a document
4. Start typing in one window
5. See real-time updates in the other window

## Project Structure

```
workspace-saas/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (workspace)/         # Workspace pages
│   │   ├── dashboard/
│   │   └── workspace/
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth & registration
│   │   ├── documents/       # Document CRUD
│   │   ├── workspaces/      # Workspace management
│   │   └── liveblocks/      # Liveblocks auth
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── Editor.tsx           # Tiptap editor
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── Toolbar.tsx          # Editor toolbar
│   ├── Threads.tsx          # Comments/threads
│   └── SessionProvider.tsx  # Auth wrapper
├── lib/
│   ├── mongodb.ts           # MongoDB connection
│   ├── liveblocks.ts        # Liveblocks server config
│   └── models/              # Mongoose models
│       ├── User.ts
│       ├── Workspace.ts
│       ├── Document.ts
│       └── Folder.ts
├── types/
│   └── next-auth.d.ts       # NextAuth type extensions
└── liveblocks.config.ts     # Liveblocks client config
```

## Features

### ✅ Implemented

- User authentication (register/login)
- MongoDB Atlas integration
- Real-time collaborative editing
- Document management (create, edit, delete)
- Workspace management
- Rich text editing (headings, lists, code, tables)
- Comments and threads
- Live cursors and presence
- Minimalistic black UI with blue accents
- Sharp edges (no rounded corners)
- Auto-save functionality

### 🚧 Future Enhancements

- Image upload
- Export to PDF/DOCX
- Version history
- User invitations
- Role-based permissions
- Search functionality
- Keyboard shortcuts
- Slash commands
- AI writing assistance
- Templates

## Troubleshooting

### MongoDB Connection Issues

If you get connection errors:
1. Check your MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for development)
2. Verify your credentials in `.env.local`
3. Ensure the database user has read/write permissions

### Liveblocks Authentication Errors

If collaboration doesn't work:
1. Verify your secret key is correct
2. Check browser console for errors
3. Ensure you're using the secret key (not public key)

### Module Not Found Errors

Run:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

Change the port:
```bash
npm run dev -- -p 3001
```

## Design Philosophy

This project follows a minimalistic, professional design:
- **Pure black background** (#000000)
- **Sharp edges** (border-radius: 0)
- **Blue accents** (#3B82F6)
- **Clean typography** (Inter font)
- **Subtle borders** (#1F1F1F)
- **No gradients or shadows** (except for depth)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: NextAuth.js
- **Real-time**: Liveblocks
- **Editor**: Tiptap
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## License

MIT
