# REALTIME-COLLABORATIVE-WORKSPACE-SAAS

## ⚠️ IMPORTANT: Project Location

**Your full-stack application is in the `workspace-saas` folder!**

```
cd workspace-saas
npm run dev
```

The application runs at: http://localhost:3000

## Ignore These Folders

- `node_modules/` - Leftover from demo (locked files, can't delete while processes running)
- `.vite/` - Temporary build cache

**Everything you need is in `workspace-saas/`**

## Quick Start

1. Make sure your `.env.local` in `workspace-saas/` has:
   - ✅ MONGODB_URI
   - ✅ NEXTAUTH_URL
   - ✅ NEXTAUTH_SECRET (generated)
   - ⏳ LIVEBLOCKS_SECRET_KEY (get from https://liveblocks.io/dashboard)

2. Start the dev server:
   ```bash
   cd workspace-saas
   npm run dev
   ```

3. Open http://localhost:3000

## Project Structure

```
rcte/
└── workspace-saas/          ← YOUR MAIN PROJECT
    ├── app/                 ← Pages & API routes
    ├── components/          ← React components
    ├── lib/                 ← MongoDB & Liveblocks config
    ├── .env.local          ← Your credentials
    └── package.json        ← Dependencies
```

That's it! Focus only on the `workspace-saas` folder.
