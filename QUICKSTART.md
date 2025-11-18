# Quick Start Guide

## Step 1: Install Dependencies

Run this command once after downloading the project:

```bash
cd /Users/nnavindu/esl-korean-platform
npm run install-all
```

This will install all dependencies for both the client and server.

## Step 2: Start the Platform

```bash
npm start
```

OR use the startup script:

```bash
./start.sh
```

## Step 3: Open in Browser

The platform will automatically open at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## First Time Use

1. **Create Your Profile:**
   - Enter your name and email
   - Select your English level (Beginner/Intermediate/Advanced)
   - Click "Start Learning"

2. **Explore Features:**
   - **Lessons:** Browse and complete interactive lessons
   - **Flashcards:** Practice vocabulary with flip cards
   - **Pronunciation:** Use speech recognition to practice speaking
   - **Video Room:** Record yourself or practice with a partner

3. **Language Toggle:**
   - Click the language button in the navigation to switch between English and Korean

## Troubleshooting

**If port 3000 is already in use:**
```bash
# The app will prompt you to use port 3001 instead
# Type 'y' to continue
```

**If you get permission errors:**
```bash
# Allow camera and microphone access in your browser
# Click "Allow" when prompted
```

**To stop the servers:**
```
Press Ctrl+C in the terminal
```

## Browser Recommendations

- **Best:** Chrome or Edge (full support for all features)
- **Good:** Firefox
- **Limited:** Safari (speech recognition may not work)

## What's Included

- ✅ 3 Pre-loaded lessons with vocabulary and phrases
- ✅ Interactive flashcards system
- ✅ Speech recognition for pronunciation practice
- ✅ WebRTC video/audio recording (local, no hosting needed)
- ✅ Progress tracking
- ✅ Korean language support
- ✅ Student dashboard

Enjoy learning English!
