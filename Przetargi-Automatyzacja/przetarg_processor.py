import requests
from pathlib import Path
from utils import sanitize_filename
from bs4 import BeautifulSoup
import PyPDF2
import docx

def download_file(url, folder_path):
    try:
        response = requests.get(url, stream=True, timeout=15)
        response.raise_for_status()
        filename = url.split('/')[-1] or "attachment.dat"
        file_path = folder_path / sanitize_filename(filename)
        with open(file_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return file_path
    except Exception as e:
        print(f"Błąd pobierania {url}: {e}")
        return None

def extract_text_from_file(file_path):
    if file_path.suffix.lower() == ".pdf":
        try:
            with open(file_path, "rb") as f:
                reader = PyPDF2.PdfReader(f)
                return "\n".join(page.extract_text() or "" for page in reader.pages)
        except Exception as e:
            print(f"Nie udało się odczytać PDF: {e}")
    elif file_path.suffix.lower() in [".docx", ".doc"]:
        try:
            docf = docx.Document(file_path)
            return "\n".join(p.text for p in docf.paragraphs)
        except Exception as e:
            print(f"Nie udało się odczytać DOCX: {e}")
    elif file_path.suffix.lower() == ".txt":
        try:
            return file_path.read_text(encoding="utf-8", errors="ignore")
        except Exception as e:
            print(f"Nie udało się odczytać TXT: {e}")
    return "" 