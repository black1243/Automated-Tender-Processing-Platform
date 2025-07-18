# Przetargi-Automatyzacja

> **Automated Tender Processing Platform**

## What is this project?
Przetargi-Automatyzacja is a full-stack system for automated collection, extraction, and management of public tender documents. It solves the problem of time-consuming manual review and organization of tenders by providing:
- Automated document fetching and extraction (PDF, DOCX, ZIP, etc.)
- AI-powered summary and text analysis (with structured sections)
- Google Drive/Gmail integration
- Modern web interface for browsing, reviewing, and editing tenders

## What problem does it solve?
Manual tender management is slow, error-prone, and hard to scale. This project automates the process, making it faster, more reliable, and accessible from anywhere.

---

## 🚀 Live Demo
> **Note:** PostgreSQL database, cloud deployment (Render, Vercel), and public demo will be introduced in the future. For now, the prototype works locally using file/folder storage and local servers only.
>
> - **Frontend (Vercel):** _coming soon_
> - **Backend (Render):** _coming soon_

---

## 🗺️ System Structure & Functionality

```mermaid
graph TD
  subgraph User Interface
    A["User (Browser)"]
    B["Frontend (React)"]
  end
  subgraph Backend & Processing
    C["Flask API"]
    D["Tender Processing Pipeline"]
    E["AI Summarization & Section Extraction"]
    F["Google Drive/Gmail Integration"]
    G["File/Text Extraction & Cleaning"]
    H["File Storage (output/)"]
  end
  subgraph Data & Storage
    I["output/ directory"]
    J["Google Drive"]
    K["(Planned) PostgreSQL DB"]
  end

  A -- "Web UI" --> B
  B -- "REST API" --> C
  C -- "Trigger processing, serve data" --> D
  D -- "Extract, clean, organize files" --> G
  D -- "Fetch from Gmail/Drive" --> F
  D -- "Invoke AI for summary/sections" --> E
  E -- "Write structured summary (sections)" --> H
  G -- "Save cleaned files" --> H
  F -- "Store/retrieve docs" --> J
  H -- "Serve files/summaries" --> C
  C -- "Serve summaries, files, navigation" --> B
  D -- "(Planned) DB sync" --> K
```

### Main Functional Sections
- **Document Fetching**: Automated download from Gmail/Google Drive, manual upload (future)
- **Extraction & Cleaning**: Convert PDFs/DOCX/ZIP to text, clean and organize into per-tender folders
- **AI Processing**: Generate structured summaries with clear sections:
  - SPECYFIKACJA PRODUKTÓW
  - WYKLUCZENIA
  - WARUNKI SPECJALNE
  - PODSUMOWANIE
  - (Editable) NOTATKI
- **Web Interface**: Browse tenders, preview files, view/edit summaries by section, AI chat (planned)
- **Navigation**: Timeline, next/previous tender, search (future)
- **API**: Serve files, summaries, navigation, and accept edits
- **(Planned) DB/Cloud**: PostgreSQL, Render/Vercel deployment

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000?style=for-the-badge&logo=flask&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-in%20progress-lightgrey?style=for-the-badge&logo=postgresql&logoColor=white)
![Render](https://img.shields.io/badge/Render-in%20progress-lightgrey?style=for-the-badge&logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-in%20progress-lightgrey?style=for-the-badge&logo=vercel&logoColor=white)

> **Note:** PostgreSQL, Render, and Vercel are planned for future releases. The current version works locally with file-based storage.

---

## 🏁 Local Setup

### 1. Backend (Python/Flask)
```bash
cd Przetargi-Automatyzacja
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt  # Install backend dependencies
# Add your .env file and Google API credentials as described in the backend README
python api.py
```

### 2. Frontend (React)
```bash
cd page  # Move to the frontend directory
npm install  # Install frontend dependencies
npm start
```
The frontend will be available at [http://localhost:3000](http://localhost:3000) and will proxy API requests to the backend at [http://localhost:5000](http://localhost:5000).

---

## 📚 Documentation
- [Backend details](Przetargi-Automatyzacja/README.md)
- [Frontend details](page/README.md)

Next features:

- postgreSQL integration
- render deploy
- email for tenders preparing for automated sending
- creating company profile
- automated profile matching
- past cyclical tenders for future work with them, for example every 3 years there is new przetarg for same tender
- calendar with future tenders

Bugs to be fixed:
- optimize row searching
- skip empty rows
-

## License
This project is licensed under the MIT License. 