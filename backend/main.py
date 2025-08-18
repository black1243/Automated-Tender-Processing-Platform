import openpyxl
import xlrd
from pathlib import Path
import os
from dotenv import load_dotenv
from config import OUTPUT_DIR, find_excel_file
from przetarg_processor import download_file, extract_text_from_file
from utils import sanitize_filename
import zipfile
import py7zr
import logging
import re
import base64
import requests
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import datetime
from openpyxl import Workbook
from openpyxl.utils import get_column_letter
from openpyxl.styles import Font
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
import io
from gmail_utils import fetch_and_prepare_excel_from_gmail
from processing import process_tenders
from ai_utils import get_summary_from_ai

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s: %(message)s')

def extract_hyperlink_from_formula(cell_value):
    # Obsługuje polskie i angielskie wersje formuły
    match = re.match(r'=HYPERŁĄCZE\("([^"]+)";"[^"]+"\)', cell_value, re.IGNORECASE)
    if not match:
        match = re.match(r'=HYPERLINK\("([^"]+)";"[^"]+"\)', cell_value, re.IGNORECASE)
    if match:
        return match.group(1)
    return None




def main():
    # Step 1: Fetch file from Gmail (if needed)
    # fetch_and_prepare_excel_from_gmail(selected_date)  # Call from UI or CLI

    # Step 2: Read email date for output structure
    email_date_file = Path('dane/email_date.txt')
    email_date_prefix = email_date_file.read_text(encoding='utf-8').strip() if email_date_file.exists() else None

    # Step 3: Find and process the Excel file
    input_excel_file = find_excel_file()
    if not input_excel_file:
        logging.error("Brak pliku Excel w folderze dane!")
        return

    process_tenders(input_excel_file, email_date_prefix)

    # Step 4: Clean up
    if email_date_file.exists():
        email_date_file.unlink()

if __name__ == '__main__':
    from backend_processor import startup_process, schedule_email_checks
    schedule_email_checks()
    startup_process() 