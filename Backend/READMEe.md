# Przetargi-Automatyzacja

Automated Tender Processing System

## Overview
This project automates the collection, extraction, and processing of public tender documents from various sources. It provides a backend API (Flask), document processing utilities, and a web interface for managing and reviewing tenders.

## Features
- Automated fetching and extraction of tender documents (PDF, DOCX, ZIP, etc.)
- Text extraction and cleaning
- AI-powered summary generation
- Google Drive integration for document management
- Web interface for navigation and review
- REST API for integration with other systems

## Directory Structure
- `api.py` – Flask API backend
- `main.py` – Main entry point for backend processing
- `processing.py` – Document extraction and processing logic
- `ai_utils.py` – AI summary and related utilities
- `gmail_utils.py`, `drive_utils.py` – Google API integrations
- `file_cleaner.py`, `przetarg_processor.py` – File and text processing
- `web_app.py` – Streamlit web interface
- `output/` – Processed tenders and results

## Setup Instructions

### 1. Clone the Repository
```bash
# Clone the repository (replace URL with your repo if needed)
git clone <repo-url>
cd Przetargi-Automatyzacja
```

### 2. Create and Activate a Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Variables
Create a `.env` file in the project root with your API keys and configuration. Example:
```
OPENAI_API_KEY=your_openai_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
...
```

### 5. Google API Credentials
- Place your `credentials.json` for Google APIs in the project root or as specified in your config.

## Running the Project

### Start the Flask API Backend
```bash
python api.py
```

### Start the Streamlit Web App
```bash
streamlit run web_app.py
```

### Run Main Processing Script
```bash
python main.py
```

## Usage
- Access the API at `http://localhost:5000/api/...`
- Use the Streamlit app for a user-friendly interface to browse and manage tenders.
- Process new tenders by running the main script or using the API endpoints.

## Notes
- Ensure you have valid Google API credentials for Drive and Gmail integration.
- The `output/` directory will contain all processed tenders, summaries, and extracted files.
- For large document sets, processing may take several minutes.

## License
This project is licensed under the MIT License. 