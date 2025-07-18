from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
from config import get_google_credentials
import io
import logging
from pathlib import Path

def convert_xls_to_xlsx_via_gdrive(xls_path, output_dir):
    SCOPES = ['https://www.googleapis.com/auth/drive']
    creds = get_google_credentials(SCOPES)
    drive_service = build('drive', 'v3', credentials=creds)
    file_metadata = {'name': xls_path.name, 'mimeType': 'application/vnd.google-apps.spreadsheet'}
    media = MediaFileUpload(str(xls_path), mimetype='application/vnd.ms-excel')
    uploaded = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    file_id = uploaded.get('id')
    if not file_id:
        logging.error("Nie udało się przesłać pliku na Google Drive.")
        return None
    request = drive_service.files().export_media(fileId=file_id, mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    xlsx_path = Path(output_dir) / (xls_path.stem + '.xlsx')
    fh = io.FileIO(xlsx_path, 'wb')
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while not done:
        status, done = downloader.next_chunk()
    fh.close()
    drive_service.files().delete(fileId=file_id).execute()
    logging.info(f"Pobrano przekonwertowany plik: {xlsx_path}")
    return xlsx_path 