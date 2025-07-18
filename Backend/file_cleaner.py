import os
from pathlib import Path
from przetarg_processor import extract_text_from_file
import hashlib
import logging

def clean_text(text):
    # Remove common logo/image markers, excessive whitespace, and non-textual content
    import re
    # Remove lines that look like image references or are very short (potential logo lines)
    lines = text.splitlines()
    cleaned = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        # Remove lines that are just image refs or very short (e.g. logo, page numbers)
        if re.match(r'^(logo|image|strona|page|[0-9]{1,3})[:\s\-]*$', line, re.IGNORECASE):
            continue
        # Remove lines with only non-word chars
        if re.match(r'^[\W_]+$', line):
            continue
        cleaned.append(line)
    return '\n'.join(cleaned)

def file_hash(path):
    # Simple hash for caching
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        while True:
            chunk = f.read(8192)
            if not chunk:
                break
            h.update(chunk)
    return h.hexdigest()

def convert_and_clean_output_files(output_dir=Path('output')):
    logging.info(f"Scanning output directory: {output_dir}")
    for tender_dir in output_dir.rglob('*'):
        if not tender_dir.is_dir():
            continue
        if tender_dir.name == '_cleaned_txt':
            continue  # Never process inside _cleaned_txt
        # Check for infinite _cleaned_txt creation
        if '_cleaned_txt' in [p.name for p in tender_dir.parents]:
            continue
        files = [f for f in tender_dir.iterdir() if f.is_file() and not f.name.startswith('_')]
        if not files:
            continue
        # If only _Podsumowanie.md is present, skip
        if all(f.name == '_Podsumowanie.md' for f in files):
            logging.info(f"Skipping folder with only _Podsumowanie.md: {tender_dir}")
            continue
        clean_dir = tender_dir / '_cleaned_txt'
        if not clean_dir.exists():
            clean_dir.mkdir(exist_ok=True)
            logging.info(f"Created cleaned txt folder: {clean_dir}")
        failed_files = []
        for file in files:
            if file.suffix.lower() in ['.pdf', '.docx', '.doc', '.txt']:
                txt_name = file.stem + '.txt'
                clean_txt_path = clean_dir / txt_name
                hash_path = clean_dir / (file.stem + '.hash')
                # Caching: skip if hash matches
                filehash = file_hash(file)
                if hash_path.exists() and hash_path.read_text() == filehash and clean_txt_path.exists():
                    logging.info(f"Skipping unchanged file: {file}")
                    continue
                # Extract and clean
                try:
                    raw_text = extract_text_from_file(file)
                    cleaned = clean_text(raw_text)
                    if cleaned.strip():
                        clean_txt_path.write_text(cleaned, encoding='utf-8')
                        hash_path.write_text(filehash)
                        logging.info(f"Converted and cleaned: {file} -> {clean_txt_path}")
                    else:
                        raise ValueError("Pusty tekst po ekstrakcji")
                except Exception as e:
                    logging.error(f"Nie udało się przekonwertować pliku {file}: {e}")
                    failed_files.append(file.name)
        # Zapisz listę nieprzekonwertowanych plików, jeśli są
        if failed_files:
            failed_path = clean_dir / 'nieprzekonwertowane.txt'
            failed_path.write_text('\n'.join(failed_files), encoding='utf-8')
            logging.warning(f"Nie udało się przekonwertować plików: {failed_files} (lista w {failed_path})") 