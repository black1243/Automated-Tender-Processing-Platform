# Przetargi-Automatyzacja – Frontend (page)

Frontend application for managing, browsing, and analyzing public tenders. Built with React, it provides a modern, responsive user interface and seamless integration with the backend API.

## Main Features
- **Browse tenders** in a timeline view with filtering and navigation options.
- **Tender details**: view summaries, text files, and metadata.
- **Edit summaries** and notes for tenders (edit summary sections via API).
- **AI Chat** (conversational module, in development) – analytical support for users.
- **Delete tenders** and quickly navigate between entries.

## Project Structure
- `src/` – main React application code
  - `App.js` – routing, layout, navigation
  - `TimelinePage.js` – timeline of tenders, fetching and presenting the list
  - `PrzetargPage.js` – tender details, summary, files, AI Chat
  - `components/` – UI components (file list, summary, sidebar, AIChat, etc.)
  - `App.css` – application styling
- `public/` – static files (index.html, favicon, manifest)

## Backend Integration
The application communicates with the backend (Flask API) via REST API:
- Fetch tenders list: `GET /api/tenders`
- Fetch tender files: `GET /api/przetarg/<przetarg_id>/files`
- File preview: `GET /api/przetarg/<przetarg_id>/file/<file_id>`
- Fetch and edit summary: `GET/POST /api/przetarg/<przetarg_id>/summary(_section)`
- Delete tender: `DELETE /api/przetarg/...`

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
   By default, the app is available at `http://localhost:3000` and uses a proxy to the backend (`http://localhost:5000`).

## Requirements
- Node.js 16+
- Backend API running on port 5000

## Additional Information
- The project uses Create React App (PWA ready).
- Styling is based on CSS and optionally Tailwind (if configured).
- Components are modular and easy to extend.

---
This application is part of the Przetargi-Automatyzacja system. Feedback and development suggestions are welcome! 