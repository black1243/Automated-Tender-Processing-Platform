import json
from datetime import datetime
from pathlib import Path

LOG_FILE = Path('logs.json')

def log_action(action, details):
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'action': action,
        'details': details
    }
    try:
        if LOG_FILE.exists():
            with open(LOG_FILE, 'r', encoding='utf-8') as f:
                try:
                    logs = json.load(f)
                except Exception:
                    logs = []
        else:
            logs = []
        logs.append(log_entry)
        with open(LOG_FILE, 'w', encoding='utf-8') as f:
            json.dump(logs, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f'Błąd zapisu logów: {e}') 