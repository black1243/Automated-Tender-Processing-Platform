from pathlib import Path

def find_excel_file(data_dir=Path("dane")):
    for ext in ("*.xlsx", "*.xls"):
        files = list(data_dir.glob(ext))
        if files:
            return files[0]
    return None

OUTPUT_DIR = Path("output")

def get_google_credentials(scopes):
    import os
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', scopes)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', scopes)
            creds = flow.run_local_server(port=0)
        with open('token.json', 'w') as token:
            token.write(creds.to_json())
    return creds 