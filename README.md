# FocusLoop 🎯

A productivity application combining Pomodoro timers with synchronized note-taking, designed to help you maintain focus and track your thoughts across all your devices.

## Features

### ⏱️ Customizable Pomodoro Timers
- Create custom timer combinations with multiple segments (focus, short break, long break)
- Configure duration for each segment
- Set repeat counts for timer sequences
- Run multiple timers concurrently
- Timer progress visualization with circular progress bars
- Persistent timer state (survives page refreshes)
- Edit and delete existing timer templates

### 📝 Real-Time Synchronized Notes
- Create, edit, and delete notes with rich content
- **Real-time cross-device synchronization** - changes appear instantly on all your devices
- Mark notes as completed/incomplete
- Offline support with localStorage persistence
- Automatic sync when coming back online
- Conflict resolution with timestamp-based merging

### 🔐 User Authentication
- Google Sign-In integration
- Secure Firebase Authentication
- User-specific data isolation
- Automatic session management

### 💾 Data Persistence
- **Cloud Storage**: All data backed up to Firebase Firestore
- **Local Storage**: Offline-first architecture with localStorage caching
- **Automatic Sync**: Real-time synchronization across all logged-in devices
- **Conflict Resolution**: Smart merging based on timestamps

### 🎨 Modern UI/UX
- Material-UI components for consistent design
- Dark/Light theme support
- Responsive design for desktop and mobile
- Smooth animations and transitions
- Intuitive navigation

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI) v5
- **Backend**: Firebase
  - Firestore (Database)
  - Authentication (Google Sign-In)
- **State Management**: React Context API
- **Routing**: React Router v7
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier
- **PWA**: Vite PWA Plugin with Workbox

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd focusloop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   
Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## Available Scripts

### Development
- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production (TypeScript compilation + Vite build)
- **`npm run preview`** - Preview production build locally

### Code Quality
- **`npm run lint`** - Run ESLint (max warnings: 0)
- **`npm run format`** - Format code with Prettier
- **`npm run format:check`** - Check code formatting
- **`npm run precommit`** - Run all checks before commit (format + lint + test + build)

### Testing
- **`npm test`** - Run all tests once
- **`npm run test:watch`** - Run tests in watch mode
- **`npm run test:ui`** - Open Vitest UI for interactive testing
- **`npm run test:coverage`** - Run tests with coverage report

## Project Structure

```
src/
├── core/                    # Core application logic
│   ├── components/         # Shared components (ProfileMenu, etc.)
│   ├── context/            # React Context providers
│   │   ├── AuthContext.tsx       # Authentication state
│   │   ├── NoteProvider.tsx      # Notes with real-time sync
│   │   └── TimerProvider.tsx     # Timer state management
│   ├── models/             # TypeScript interfaces
│   │   ├── Note.ts
│   │   └── TimerCombination.ts
│   └── services/           # Business logic
│       ├── NoteService.ts        # Note CRUD + localStorage
│       └── TimerService.ts       # Timer CRUD + state
├── features/               # Feature modules
│   ├── auth/              # Authentication pages
│   ├── notes/             # Notes UI components
│   ├── settings/          # Settings pages
│   └── timers/            # Timer UI components
├── services/              # External service integrations
│   └── FirestoreService.ts     # Firebase Firestore operations
├── shared/                # Shared utilities
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Helper functions
└── App.tsx                # Main app component with routing
```

## Architecture Highlights

### Real-Time Synchronization
The application uses Firestore's `onSnapshot` listener for real-time data synchronization:
- Changes made on one device are instantly reflected on all other devices
- Works for both notes and timers
- Automatic conflict resolution based on timestamps
- Graceful fallback to offline mode when network is unavailable

### Offline-First Design
- All data is stored locally in localStorage for instant access
- Changes are queued and synced when connection is restored
- Users can work completely offline and sync later

### State Management
- Context API for global state (auth, notes, timers)
- Local state for UI components
- Custom hooks for reusable logic
- Observer pattern for service-level subscriptions

## Testing

The project uses Vitest with React Testing Library for comprehensive testing:

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test NoteService.test.ts

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- **NoteService**: CRUD operations, localStorage persistence, subscription system
- **TimerService**: Timer lifecycle, state transitions, multi-timer management
- **Components**: User interactions, rendering, edge cases

## Deployment

### Firebase Hosting
```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

### Environment Variables
Ensure all required environment variables are set in your deployment platform:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run precommit`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is private and proprietary.

## Acknowledgments

- Material-UI for the component library
- Firebase for backend infrastructure
- Vite for blazing-fast development experience
