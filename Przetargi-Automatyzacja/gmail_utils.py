import base64
import re
import requests
from pathlib import Path
from googleapiclient.discovery import build
from drive_utils import convert_xls_to_xlsx_via_gdrive
from config import get_google_credentials
import logging
import zipfile
from email.utils import parsedate_to_datetime

def fetch_and_prepare_excel_from_gmail(selected_date=None, return_xlsx_path=False):
    SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/drive']
    creds = get_google_credentials(SCOPES)
    service = build('gmail', 'v1', credentials=creds)
    query = ''
    if selected_date:
        import datetime
        if isinstance(selected_date, str):
            date_obj = datetime.datetime.strptime(selected_date, '%Y-%m-%d').date()
        else:
            date_obj = selected_date
        after = date_obj.strftime('%Y/%m/%d')
        before = (date_obj + datetime.timedelta(days=1)).strftime('%Y/%m/%d')
        query += f' after:{after} before:{before}'
    results = service.users().messages().list(userId='me', q=query, maxResults=10).execute()
    messages = results.get('messages', [])
    link = None
    email_date_str = None
    def find_link_in_parts(parts):
        for part in parts:
            mime_type = part.get('mimeType', '')
            if part.get('parts'):
                found = find_link_in_parts(part['parts'])
                if found:
                    return found
            if mime_type in ['text/plain', 'text/html']:
                data = part['body'].get('data')
                if data:
                    try:
                        text = base64.urlsafe_b64decode(data).decode('utf-8')
                    except Exception:
                        continue
                    match = re.search(r"https://www\.biznes-polska\.pl/raport/[^\"']+", text)
                    if match:
                        logging.info(f"Found link in {mime_type}: {match.group(0)}")
                        return match.group(0)
        return None
    for msg_meta in messages:
        msg = service.users().messages().get(userId='me', id=msg_meta['id'], format='full').execute()
        headers = msg.get('payload', {}).get('headers', [])
        subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), '(no subject)')
        date_header = next((h['value'] for h in headers if h['name'].lower() == 'date'), '(no date)')
        logging.info(f"Checking email: Subject='{subject}', Date='{date_header}'")
        payload = msg.get('payload', {})
        parts = payload.get('parts', [])
        link = find_link_in_parts(parts)
        if link:
            try:
                email_date = parsedate_to_datetime(date_header)
                email_date_str = email_date.strftime('%Y-%m-%d')
            except Exception:
                email_date_str = 'unknown_date'
            break
    if not link:
        logging.error("No matching link found in emails for the selected date.")
        return None
    logging.info(f"Found link: {link}")
    if email_date_str:
        with open('dane/email_date.txt', 'w', encoding='utf-8') as f:
            f.write(email_date_str)
    dane_dir = Path('dane')
    dane_dir.mkdir(exist_ok=True)
    zip_path = dane_dir / 'downloaded.zip'
    r = requests.get(link)
    with open(zip_path, 'wb') as f:
        f.write(r.content)
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(dane_dir)
    zip_path.unlink()
    xlsx_file = None
    for file in dane_dir.iterdir():
        if file.suffix.lower() == '.xls':
            xlsx_path = convert_xls_to_xlsx_via_gdrive(file, dane_dir)
            if xlsx_path:
                logging.info(f"Converted {file} to {xlsx_path} via Google Drive")
                file.unlink()
                file = xlsx_path
        if file.suffix.lower() == '.xlsx':
            # Rename to <email_date_str>.xlsx
            target = dane_dir / f"{email_date_str}.xlsx"
            if target.exists():
                target.unlink()
            file.rename(target)
            xlsx_file = target
    logging.info("Gmail fetch and extraction complete.")
    if return_xlsx_path:
        return xlsx_file
    return True

def has_unread_emails():
    SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
    creds = get_google_credentials(SCOPES)
    service = build('gmail', 'v1', credentials=creds)
    results = service.users().messages().list(userId='me', q='is:unread', maxResults=1).execute()
    messages = results.get('messages', [])
    return len(messages) > 0 