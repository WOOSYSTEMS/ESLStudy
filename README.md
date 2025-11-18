# ESL Platform for Korean Students

A comprehensive online English as a Second Language (ESL) learning platform designed specifically for Korean students. This platform includes practical teaching tools with video/audio capabilities, all running locally without external hosting requirements.

## Features

### 1. **Interactive Lessons**
- Structured lessons for different proficiency levels (Beginner, Intermediate, Advanced)
- Vocabulary learning with Korean translations
- Common phrases and example sentences
- Progress tracking for completed lessons

### 2. **Flashcards Practice**
- Interactive flashcard system for vocabulary memorization
- Flip animation for engaging learning experience
- Mark words as "mastered" to track progress
- Visual progress bar

### 3. **Pronunciation Practice**
- Real-time speech recognition using Web Speech API
- Practice English phrases with instant feedback
- Accuracy scoring system
- Multiple difficulty levels

### 4. **Video Practice Room**
- Local WebRTC-based video/audio chat (no external hosting needed)
- Record practice sessions locally
- Toggle audio/video controls
- Download recordings for review
- Solo practice mode or partner practice

### 5. **Student Dashboard**
- Track learning progress
- View completed lessons
- Monitor average scores
- Personalized student profiles

### 6. **Bilingual Support**
- Full Korean language interface option
- Switch between English and Korean with one click
- Korean translations for all vocabulary and UI elements

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- React Router for navigation
- Socket.io-client for real-time communication
- SimplePeer for WebRTC video/audio
- Web Speech API for speech recognition
- Axios for API calls

**Backend:**
- Node.js with Express
- Socket.io for WebRTC signaling
- In-memory data storage (can be extended to use a database)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser (Chrome, Firefox, Edge recommended)

### Setup Instructions

1. **Clone or navigate to the project directory:**
   ```bash
   cd esl-korean-platform
   ```

2. **Install root dependencies:**
   ```bash
   npm install
   ```

3. **Install all dependencies (client and server):**
   ```bash
   npm run install-all
   ```

## Running the Application

### Option 1: Run Everything Together (Recommended)
```bash
npm start
```
This will start both the backend server (port 5000) and frontend client (port 3000) simultaneously.

### Option 2: Run Separately

**Start the backend server:**
```bash
npm run server
```
Server will run on http://localhost:5000

**Start the frontend client (in a new terminal):**
```bash
npm run client
```
Client will run on http://localhost:3000

## Usage Guide

### Getting Started

1. **Register as a Student:**
   - Open http://localhost:3000 in your browser
   - Enter your name, email, and select your English level
   - Click "Start Learning"

2. **Navigate the Platform:**
   - Use the navigation bar to access different features
   - Switch between English and Korean using the language toggle

3. **Take a Lesson:**
   - Go to "Lessons" page
   - Filter by your level if needed
   - Click "Start Lesson" on any lesson card
   - Study vocabulary and phrases
   - Click "Complete Lesson" to save progress

4. **Practice with Flashcards:**
   - Go to "Flashcards" page
   - Click the card to flip and see the translation
   - Use "Next" and "Previous" buttons to navigate
   - Mark words as "Mastered" to track learning

5. **Practice Pronunciation:**
   - Go to "Pronunciation Practice" page
   - Read the target phrase
   - Click "Start Recording" and speak the phrase
   - Get instant feedback on your pronunciation
   - Try different phrases with "Select a new phrase"

6. **Video Practice Room:**
   - Go to "Video Practice Room" page
   - Enter a room ID (use the same ID with a partner to practice together)
   - Or leave it blank for solo practice
   - Grant camera/microphone permissions when prompted
   - Click "Join Room"
   - Use controls to toggle audio/video or record your practice

## Browser Compatibility

- **Chrome/Edge:** Full support for all features
- **Firefox:** Full support for all features
- **Safari:** Limited speech recognition support

**Note:** For best experience with speech recognition and WebRTC features, use Chrome or Edge.

## Features in Detail

### WebRTC Video/Audio
- **No External Hosting Required:** All video/audio is peer-to-peer using WebRTC
- **Local Recording:** Recordings are saved locally to your device
- **Privacy:** No data is sent to external servers
- **Signaling Server:** Uses local Socket.io server for connection setup

### Speech Recognition
- Uses browser's built-in Web Speech API
- Works completely offline after initial page load
- Real-time transcription
- Accuracy feedback based on phrase matching

### Data Storage
- Currently uses in-memory storage
- To add persistence, replace with:
  - MongoDB for document storage
  - PostgreSQL/MySQL for relational storage
  - Firebase for cloud storage

## Customization

### Adding New Lessons

Edit `/server/server.js` and add to the `lessons` array:

```javascript
{
  id: '4',
  title: 'Your Lesson Title',
  titleKo: '한국어 제목',
  level: 'beginner', // or 'intermediate', 'advanced'
  vocabulary: [
    {
      word: 'Example',
      translation: '예시',
      pronunciation: 'ex-am-ple',
      example: 'This is an example.'
    }
  ],
  phrases: [
    {
      english: 'Example phrase',
      korean: '예시 문구',
      pronunciation: 'ex-am-ple-phrase'
    }
  ]
}
```

### Changing UI Colors

Edit the respective CSS files in `/client/src/components/` or `/client/src/App.css`

## Project Structure

```
esl-korean-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LessonList.tsx
│   │   │   ├── LessonView.tsx
│   │   │   ├── Flashcards.tsx
│   │   │   ├── PronunciationPractice.tsx
│   │   │   ├── VideoRoom.tsx
│   │   │   └── *.css     # Component styles
│   │   ├── App.tsx        # Main app component
│   │   └── App.css        # Global styles
│   └── package.json
├── server/                # Node.js backend
│   ├── server.js          # Express + Socket.io server
│   └── package.json
├── package.json           # Root package.json
└── README.md

```

## Troubleshooting

### Port Already in Use
If port 3000 or 5000 is already in use:
- Change the port in `server/server.js` (line with `const PORT = process.env.PORT || 5000;`)
- Update the API URLs in client components to match the new port

### Camera/Microphone Not Working
- Check browser permissions
- Ensure you're using HTTPS or localhost
- Try a different browser (Chrome recommended)

### Speech Recognition Not Working
- Use Chrome or Edge browser
- Check microphone permissions
- Ensure microphone is not muted

## Future Enhancements

- Database integration for persistent storage
- User authentication and authorization
- More lesson content and exercises
- Grammar exercises
- Writing practice tools
- Listening comprehension tests
- Real-time teacher-student chat
- Scheduling system for live sessions
- Mobile app version

## License

ISC

## Support

For issues or questions, please check the browser console for error messages and ensure all dependencies are properly installed.
