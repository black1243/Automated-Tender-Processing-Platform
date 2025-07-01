import re

def sanitize_filename(name):
    """Usuwa niedozwolone znaki z nazwy pliku/folderu."""
    return re.sub(r'[\\/*?:"<>|]', "", name) 