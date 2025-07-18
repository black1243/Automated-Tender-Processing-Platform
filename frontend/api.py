def parse_przetarg_id(przetarg_id):
    # Use first 10 chars as date, rest as title
    if len(przetarg_id) < 11:
        return None, None
    date = przetarg_id[:10]
    title = przetarg_id[11:]
    return date, title

@app.route('/api/przetarg/<path:przetarg_id>/files', methods=['GET'])
def get_przetarg_files(przetarg_id):
    date, title = parse_przetarg_id(przetarg_id)
    print('przetarg_id:', przetarg_id)
    print('date:', date)
    print('title:', title)
    tender_path = OUTPUT_DIR / date / title / '_cleaned_txt'
    print('tender_path:', tender_path)
    print('exists:', tender_path.exists())
    if not date or not title:
        return jsonify({'error': 'Invalid przetarg_id'}), 400
    if not tender_path.exists():
        return jsonify({'files': []})
    files = [{'id': f.name, 'name': f.name} for f in tender_path.iterdir() if f.suffix == '.txt']
    return jsonify({'files': files})

@app.route('/api/przetarg/<path:przetarg_id>/file/<file_id>', methods=['GET'])
def get_przetarg_file_content(przetarg_id, file_id):
    date, title = parse_przetarg_id(przetarg_id)
    print('przetarg_id:', przetarg_id)
    print('date:', date)
    print('title:', title)
    file_path = OUTPUT_DIR / date / title / '_cleaned_txt' / file_id
    print('file_path:', file_path)
    print('exists:', file_path.exists())
    if not date or not title:
        return "Invalid przetarg_id", 400
    if not file_path.exists():
        return "Not found", 404
    return file_path.read_text(encoding='utf-8')

@app.route('/api/przetarg/<path:przetarg_id>/summary', methods=['GET'])
def get_przetarg_summary(przetarg_id):
    date, title = parse_przetarg_id(przetarg_id)
    print('przetarg_id:', przetarg_id)
    print('date:', date)
    print('title:', title)
    summary_path = OUTPUT_DIR / date / title / '_Podsumowanie.md'
    print('summary_path:', summary_path)
    print('exists:', summary_path.exists())
    if not date or not title:
        return "Invalid przetarg_id", 400
    if not summary_path.exists():
        return "Brak podsumowania", 404
    return summary_path.read_text(encoding='utf-8')

@app.route('/api/przetarg/<path:przetarg_id>/summary_section', methods=['POST'])
def update_przetarg_summary_section(przetarg_id):
    data = request.get_json()
    section = data.get('section')
    value = data.get('value')
    if not section or value is None:
        return 'Missing section or value', 400
    date, title = parse_przetarg_id(przetarg_id)
    if not date or not title:
        return 'Invalid przetarg_id', 400
    summary_path = OUTPUT_DIR / date / title / '_Podsumowanie.md'
    if not summary_path.exists():
        return 'Brak podsumowania', 404
    content = summary_path.read_text(encoding='utf-8')
    # Replace section content
    import re
    header = f'## {section}'
    pattern = re.compile(rf'(## {re.escape(section)}\s*)([\s\S]*?)(?=\n## |$)', re.IGNORECASE)
    if pattern.search(content):
        new_content = pattern.sub(rf'\1\n{value}\n', content)
    else:
        # If section not found, append it at the end
        new_content = content.strip() + f'\n\n## {section}\n{value}\n'
    summary_path.write_text(new_content, encoding='utf-8')
    return 'OK' 