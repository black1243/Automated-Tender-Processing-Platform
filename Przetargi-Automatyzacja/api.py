from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pathlib import Path
import os
import json
import datetime

app = Flask(__name__)
CORS(app)

OUTPUT_DIR = Path('output')
API_LOG_FILE = Path('api_logs.jsonl')

def log_api_call(endpoint, method, params, status=200, error=None):
    log_entry = {
        'timestamp': datetime.datetime.now().isoformat(),
        'endpoint': endpoint,
        'method': method,
        'params': params,
        'status': status,
        'error': error
    }
    with open(API_LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(json.dumps(log_entry, ensure_ascii=False) + '\n')

@app.before_request
def log_request():
    # Log every incoming request
    log_api_call(
        endpoint=request.path,
        method=request.method,
        params=request.args.to_dict() if request.method == 'GET' else request.get_json(silent=True)
    )

@app.after_request
def log_response(response):
    # Optionally, could log response status here
    return response

@app.errorhandler(404)
def handle_404(e):
    log_api_call(endpoint=request.path, method=request.method, params=request.args.to_dict(), status=404, error='Not found')
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def handle_500(e):
    log_api_call(endpoint=request.path, method=request.method, params=request.args.to_dict(), status=500, error=str(e))
    return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/tenders', methods=['GET'])
def get_tenders():
    tenders = []
    for date_dir in OUTPUT_DIR.iterdir():
        if not date_dir.is_dir():
            continue
        for tender_dir in date_dir.iterdir():
            if not tender_dir.is_dir():
                continue
            # Wyciągnij datę z końca nazwy folderu przetargu
            tender_name = tender_dir.name
            tender_date = None
            parts = tender_name.rsplit('_', 1)
            if len(parts) == 2:
                tender_date = parts[1]
            else:
                tender_date = date_dir.name
            tenders.append({
                'name': tender_name,
                'date': tender_date,
                'path': f"{date_dir.name}/{tender_name}",
            })
    return jsonify(tenders)

@app.route('/api/tenders/<date>/<tender>', methods=['GET'])
def get_tender_details(date, tender):
    tender_path = OUTPUT_DIR / date / tender
    if not tender_path.exists():
        return jsonify({'error': 'Not found'}), 404
    # Załączniki (wszystko poza _cleaned_txt)
    attachments = [f.name for f in tender_path.iterdir() if f.is_file() and not f.name.startswith('_')]
    # Pliki txt z _cleaned_txt
    cleaned_txt_dir = tender_path / '_cleaned_txt'
    txt_files = []
    if cleaned_txt_dir.exists():
        txt_files = [f.name for f in cleaned_txt_dir.iterdir() if f.suffix == '.txt']
    return jsonify({
        'attachments': attachments,
        'txt_files': txt_files
    })

@app.route('/api/tenders/<date>/<tender>/attachment/<filename>', methods=['GET'])
def download_attachment(date, tender, filename):
    tender_path = OUTPUT_DIR / date / tender
    if not tender_path.exists():
        return jsonify({'error': 'Not found'}), 404
    return send_from_directory(tender_path, filename, as_attachment=True)

@app.route('/api/tenders/<date>/<tender>/txt/<filename>', methods=['GET'])
def get_txt_file(date, tender, filename):
    cleaned_txt_dir = OUTPUT_DIR / date / tender / '_cleaned_txt'
    file_path = cleaned_txt_dir / filename
    if not file_path.exists():
        return jsonify({'error': 'Not found'}), 404
    with open(file_path, encoding='utf-8') as f:
        content = f.read()
    return jsonify({'filename': filename, 'content': content})

@app.route('/api/process', methods=['POST'])
def process_tender():
    data = request.json
    return jsonify({"status": "processing started", "received": data}), 202

def parse_przetarg_id(przetarg_id):
    # przetarg_id = "2025-06-18_Komenda Wojewódzka Policji w Kielcach_2025-06-26"
    # Rozdziel po pierwszym podkreślniku na datę i nazwę
    parts = przetarg_id.split('_', 1)
    if len(parts) != 2:
        return None, None
    date, title = parts
    return date, title

@app.route('/api/przetarg/<przetarg_id>/files', methods=['GET'])
def get_przetarg_files(przetarg_id):
    date, title = parse_przetarg_id(przetarg_id)
    if not date or not title:
        return jsonify({'error': 'Invalid przetarg_id'}), 400
    tender_path = OUTPUT_DIR / date / title / '_cleaned_txt'
    if not tender_path.exists():
        return jsonify({'files': []})
    files = [{'id': f.name, 'name': f.name} for f in tender_path.iterdir() if f.suffix == '.txt']
    return jsonify({'files': files})

@app.route('/api/przetarg/<przetarg_id>/file/<file_id>', methods=['GET'])
def get_przetarg_file_content(przetarg_id, file_id):
    date, title = parse_przetarg_id(przetarg_id)
    if not date or not title:
        return "Invalid przetarg_id", 400
    file_path = OUTPUT_DIR / date / title / '_cleaned_txt' / file_id
    if not file_path.exists():
        return "Not found", 404
    return file_path.read_text(encoding='utf-8')

@app.route('/api/przetarg/<przetarg_id>/summary', methods=['GET'])
def get_przetarg_summary(przetarg_id):
    date, title = parse_przetarg_id(przetarg_id)
    if not date or not title:
        return "Invalid przetarg_id", 400
    summary_path = OUTPUT_DIR / date / title / '_Podsumowanie.md'
    if not summary_path.exists():
        return "Brak podsumowania", 404
    return summary_path.read_text(encoding='utf-8')

@app.route('/api/tenders/<date>/<tender>', methods=['DELETE'])
def delete_tender(date, tender):
    tender_path = OUTPUT_DIR / date / tender
    if not tender_path.exists():
        log_api_call(endpoint=request.path, method='DELETE', params={'date': date, 'tender': tender}, status=404, error='Not found')
        return jsonify({'error': 'Not found'}), 404
    try:
        import shutil
        shutil.rmtree(tender_path)
        log_api_call(endpoint=request.path, method='DELETE', params={'date': date, 'tender': tender}, status=200)
        return jsonify({'status': 'deleted'}), 200
    except Exception as e:
        log_api_call(endpoint=request.path, method='DELETE', params={'date': date, 'tender': tender}, status=500, error=str(e))
        return jsonify({'error': 'Failed to delete', 'details': str(e)}), 500

@app.route('/api/przetarg/<przetarg_id>', methods=['DELETE'])
def delete_przetarg(przetarg_id):
    date, title = parse_przetarg_id(przetarg_id)
    if not date or not title:
        log_api_call(endpoint=request.path, method='DELETE', params={'przetarg_id': przetarg_id}, status=400, error='Invalid przetarg_id')
        return jsonify({'error': 'Invalid przetarg_id'}), 400
    tender_path = OUTPUT_DIR / date / title
    if not tender_path.exists():
        log_api_call(endpoint=request.path, method='DELETE', params={'przetarg_id': przetarg_id}, status=404, error='Not found')
        return jsonify({'error': 'Not found'}), 404
    try:
        import shutil
        shutil.rmtree(tender_path)
        log_api_call(endpoint=request.path, method='DELETE', params={'przetarg_id': przetarg_id}, status=200)
        return jsonify({'status': 'deleted'}), 200
    except Exception as e:
        log_api_call(endpoint=request.path, method='DELETE', params={'przetarg_id': przetarg_id}, status=500, error=str(e))
        return jsonify({'error': 'Failed to delete', 'details': str(e)}), 500

@app.route('/api/przetarg/<przetarg_id>/summary_section', methods=['POST'])
def update_przetarg_summary_section(przetarg_id):
    data = request.get_json()
    section = data.get('section')
    value = data.get('value')
    if not section or value is None:
        return jsonify({'error': 'Missing section or value'}), 400
    date, title = parse_przetarg_id(przetarg_id)
    if not date or not title:
        return jsonify({'error': 'Invalid przetarg_id'}), 400
    summary_path = OUTPUT_DIR / date / title / '_Podsumowanie.md'
    section_header = f"## {section}"
    new_section = f"{section_header}\n{value.strip()}\n"
    if summary_path.exists():
        with open(summary_path, encoding='utf-8') as f:
            content = f.read()
        import re
        # Replace or add the section
        pattern = re.compile(rf"## {re.escape(section)}\\s*([\s\S]*?)(?=\n## |$)", re.IGNORECASE)
        if pattern.search(content):
            content = pattern.sub(new_section.strip(), content)
        else:
            if content and not content.endswith('\n'):
                content += '\n'
            content += new_section
    else:
        content = new_section
    with open(summary_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    return jsonify({'status': 'success'})

@app.route('/api/przetarg/<przetarg_id>/link', methods=['GET'])
def get_przetarg_link(przetarg_id):
    date, title = parse_przetarg_id(przetarg_id)
    if not date or not title:
        return "Invalid przetarg_id", 400
    link_path = OUTPUT_DIR / date / title / 'link.txt'
    if not link_path.exists():
        return "Not found", 404
    return link_path.read_text(encoding='utf-8')

@app.route('/api/tenders/navigation/<przetarg_id>', methods=['GET'])
def get_tender_navigation(przetarg_id):
    """Get next and previous tender for navigation"""
    date, title = parse_przetarg_id(przetarg_id)
    if not date or not title:
        return jsonify({'error': 'Invalid przetarg_id'}), 400
    
    # Get all tenders
    all_tenders = []
    for date_dir in OUTPUT_DIR.iterdir():
        if not date_dir.is_dir():
            continue
        for tender_dir in date_dir.iterdir():
            if not tender_dir.is_dir():
                continue
            tender_name = tender_dir.name
            tender_date = None
            parts = tender_name.rsplit('_', 1)
            if len(parts) == 2:
                tender_date = parts[1]
            else:
                tender_date = date_dir.name
            all_tenders.append({
                'name': tender_name,
                'date': tender_date,
                'path': f"{date_dir.name}/{tender_name}",
                'folder_date': date_dir.name,
                'title': tender_name
            })
    
    # Sort tenders by deadline date (same as timeline order)
    # Filter out tenders without valid deadline dates and sort by deadline
    valid_tenders = []
    for tender in all_tenders:
        if tender['date']:
            try:
                # Parse the deadline date
                deadline_date = datetime.datetime.strptime(tender['date'], '%Y-%m-%d').date()
                tender['deadline_date'] = deadline_date
                valid_tenders.append(tender)
            except ValueError:
                # Skip tenders with invalid date format
                continue
    
    # Sort by deadline date (ascending - earliest first)
    valid_tenders.sort(key=lambda x: x['deadline_date'])
    
    # Find current tender index
    current_index = -1
    for i, tender in enumerate(valid_tenders):
        if tender['folder_date'] == date and tender['title'] == title:
            current_index = i
            break
    
    if current_index == -1:
        return jsonify({'error': 'Tender not found'}), 404
    
    # Get next and previous
    prev_tender = valid_tenders[current_index - 1] if current_index > 0 else None
    next_tender = valid_tenders[current_index + 1] if current_index < len(valid_tenders) - 1 else None
    
    return jsonify({
        'previous': prev_tender,
        'next': next_tender,
        'current_index': current_index,
        'total_count': len(valid_tenders)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 