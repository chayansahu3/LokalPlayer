# LokalPlayer - Premium Music Experience

A high-performance music streaming application built with React and TypeScript, featuring deep integration with the JioSaavn API. Designed with a focus on polished UI/UX, robust state management, and seamless playback synchronization.

## 🚀 Features

- **Dynamic Home Screen**: Discovery-focused layout with featured and trending sections.
- **Advanced Explore**: Intelligent search with genre-based discovery and trending tags.
- **Universal Player State**: Perfect synchronization between the persistent Mini Player and Full Player.
- **Queue Management**: Add, reorder, and clear tracks from your active playback queue.
- **Favorites System**: Locally persisted "Liked Songs" library.
- **Audio Control**: Full playback controls including seek, volume, shuffle, repeat, and "Replay" logic.
- **Adaptive UI**: Responsive design with smooth animations and a premium glassmorphism aesthetic.

## 🛠 Tech Stack

- **Framework**: React 19 (Web-based environment)
- **State Management**: Zustand (with Persistence middleware)
- **Styling**: Tailwind CSS
- **Icons**: Custom SVG implementation for performance
- **API**: JioSaavn API (saavn.sumit.co)
- **Typography**: Plus Jakarta Sans

## 🏗 Architecture

The app follows a modular architecture designed for performance and maintainability:

1.  **State Management (Zustand)**: Uses a centralized store (`useMusicStore.ts`) to manage playback state, queue, and user preferences. High-performance selectors are used to minimize re-renders during playback updates.
2.  **Audio Engine**: A dedicated singleton component (`AudioEngine.tsx`) handles the HTML5 Audio lifecycle, event listeners (progress, buffering, ending), and error handling (AbortError management).
3.  **UI Components**: Functional, atomic components styled with Tailwind CSS for rapid prototyping and consistent design language.
4.  **API Service Layer**: Abstracted fetch calls in `saavnApi.ts` for clean data fetching and resilient URL extraction.

## ⚖️ Trade-offs & Decisions

- **Zustand vs Redux**: Chosen Zustand for its minimal boilerplate and superior performance with complex state like music playback.
- **HTML5 Audio in React**: Implemented via `useRef` and `useEffect` in a singleton component to ensure audio context isn't lost during navigation and re-renders.
- **Debounced Search**: Implemented a 600ms debounce in the `SearchBar` to prevent API rate limiting while maintaining a responsive "search-as-you-type" feel.
- **Selectors for Performance**: Subscriptions to the store are scoped (e.g., `state => state.currentSong?.id`) to ensure the entire app doesn't re-render 60 times a second during playback clock updates.

## 🔧 Setup & Installation

1.  **Clone the environment**: This project is designed to run in a modern ES6 module environment.
2.  **Dependencies**: The project uses `esm.sh` for zero-install dependency management.
3.  **Running**:
    - Open `index.html` in a local server environment.
    - Ensure your browser allows auto-playback (or click "Play" to start the context).

## 🎹 Replay Functionality
The Repeat button features a dual-mode logic:
1.  **Repeat One**: Replays the current track continuously.
2.  **Replay Trigger**: When clicking the "Previous" button while a song has played for more than 3 seconds, the song automatically restarts from the beginning (Standard Music Player UX).
