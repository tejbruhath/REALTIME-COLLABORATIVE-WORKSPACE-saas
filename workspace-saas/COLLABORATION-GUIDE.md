# Real-Time Collaboration Guide

## ✅ Features Implemented

### 1. **Workspace Member Management**
- Add users to workspaces by email
- Assign roles: Owner, Admin, Editor, Viewer
- Remove members from workspaces
- View all workspace members

### 2. **Real-Time Collaboration**
- Multiple users can edit the same document simultaneously
- Live cursors showing who's editing where
- Instant synchronization of changes
- User presence indicators

### 3. **Permission System**
- **Owner**: Full access, can add/remove members
- **Admin**: Can manage members and edit documents
- **Editor**: Can edit documents
- **Viewer**: Read-only access

## 🚀 How to Test Real-Time Collaboration

### Step 1: Create Two User Accounts

**User 1 (Owner):**
1. Open http://localhost:3002
2. Click "Get Started"
3. Register with:
   - Name: Alice
   - Email: alice@example.com
   - Password: password123

**User 2 (Collaborator):**
1. Open a new **Incognito/Private window**
2. Go to http://localhost:3002
3. Register with:
   - Name: Bob
   - Email: bob@example.com
   - Password: password123

### Step 2: Share Workspace (As Alice)

1. Login as Alice
2. Create a new document
3. Click the **"Share"** button in the top-right
4. In the Share modal:
   - Enter: `bob@example.com`
   - Select role: **Editor**
   - Click **"Add"**
5. You should see Bob added to the members list

### Step 3: Access Document (As Bob)

**Option A - Direct URL:**
1. Copy the document URL from Alice's browser
   - Example: `http://localhost:3002/workspace/[workspaceId]/[documentId]`
2. Paste it in Bob's incognito window
3. Bob should now see the same document

**Option B - Via Dashboard:**
1. Bob logs in to his account
2. The shared workspace appears in his sidebar
3. Click on the workspace to see shared documents
4. Open the document

### Step 4: Test Real-Time Editing

1. **Alice's window**: Start typing in the document
2. **Bob's window**: See Alice's changes appear instantly
3. **Bob's window**: Start typing in a different part
4. **Alice's window**: See Bob's changes appear instantly

You should see:
- ✅ Live cursors with user names
- ✅ Instant text synchronization
- ✅ User presence indicators
- ✅ Auto-save status

### Step 5: Test Comments/Threads

1. Select some text in the document
2. Click the comment icon in the toolbar
3. Add a comment
4. The other user should see the comment thread immediately

## 🎯 Testing Checklist

- [ ] Register two different users
- [ ] User 1 creates a workspace and document
- [ ] User 1 shares workspace with User 2 via email
- [ ] User 2 can access the shared workspace
- [ ] Both users can edit the same document simultaneously
- [ ] Changes sync in real-time
- [ ] Live cursors show each user's position
- [ ] Comments/threads work
- [ ] Auto-save works for both users
- [ ] User 1 can remove User 2 from workspace
- [ ] After removal, User 2 loses access

## 🔧 Troubleshooting

### "User not found" Error
- Make sure the email you're adding is registered
- The user must have an account before being added

### Can't See Real-Time Changes
- Check browser console for errors
- Verify Liveblocks secret key is correct in `.env.local`
- Make sure both users are in the same document
- Refresh both browsers

### Permission Denied
- Verify the user was added to the workspace
- Check the user's role (Viewer can't edit)
- Make sure you're logged in

### Liveblocks Connection Issues
- Verify `LIVEBLOCKS_SECRET_KEY` in `.env.local`
- Check network tab for failed requests to Liveblocks
- Restart the dev server

## 📝 API Endpoints

### Add Member to Workspace
```
POST /api/workspaces/[id]/members
Body: { email: string, role: string }
```

### Get Workspace Members
```
GET /api/workspaces/[id]/members
```

### Remove Member
```
DELETE /api/workspaces/[id]/members?userId=[userId]
```

## 🎨 UI Components

### ShareModal
- Located in `components/ShareModal.tsx`
- Add/remove workspace members
- View all members with their roles
- Accessible via "Share" button in document header

### Live Cursors
- Automatically shown when multiple users are editing
- Color-coded by user
- Shows user name on hover

### Presence Indicators
- Shows who's currently viewing the document
- Updates in real-time

## 🚀 Next Steps

Want to enhance collaboration? Consider adding:

1. **User Search**: Search for users instead of typing email
2. **Invite Links**: Generate shareable invite links
3. **Role Permissions**: Fine-tune what each role can do
4. **Activity Feed**: Show recent edits and comments
5. **Version History**: Track document changes over time
6. **Notifications**: Alert users when mentioned or invited
7. **Presence Awareness**: Show active users in sidebar
8. **Conflict Resolution**: Handle simultaneous edits better

## 🎉 Success!

If you can see real-time changes between two browser windows, congratulations! Your collaborative workspace is working perfectly. 

Now you can:
- Share documents with your team
- Edit together in real-time
- Leave comments and feedback
- Manage workspace access

Happy collaborating! 🚀
