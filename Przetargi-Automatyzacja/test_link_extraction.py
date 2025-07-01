#!/usr/bin/env python3
"""
Test script to verify that link.txt files are created in individual tender folders
instead of the main date folder.
"""

import sys
from pathlib import Path
from processing import process_tenders

def test_link_extraction():
    """Test the new link extraction functionality"""
    
    # Find the Excel file
    dane_dir = Path('dane')
    excel_files = list(dane_dir.glob('*.xlsx'))
    
    if not excel_files:
        print("No Excel files found in dane/ directory")
        return
    
    excel_file = excel_files[0]
    print(f"Testing with Excel file: {excel_file}")
    
    # Create a test output directory
    test_output = Path('test_output')
    test_output.mkdir(exist_ok=True)
    
    # Process the tenders
    try:
        process_tenders(excel_file, email_date_prefix='test', output_dir=test_output)
        print("Processing completed successfully!")
        
        # Check if link.txt files were created in individual tender folders
        tender_folders = [f for f in test_output.iterdir() if f.is_dir()]
        print(f"\nFound {len(tender_folders)} tender folders:")
        
        for folder in tender_folders:
            link_file = folder / 'link.txt'
            if link_file.exists():
                with open(link_file, 'r', encoding='utf-8') as f:
                    link_content = f.read().strip()
                print(f"  ✓ {folder.name}: link.txt exists with content: {link_content}")
            else:
                print(f"  ✗ {folder.name}: no link.txt file")
        
        # Check that no link.txt exists in the main test_output directory
        main_link_file = test_output / 'link.txt'
        if main_link_file.exists():
            print(f"\n⚠️  WARNING: link.txt still exists in main directory: {main_link_file}")
        else:
            print(f"\n✓ SUCCESS: No link.txt in main directory - links are now in individual folders")
            
    except Exception as e:
        print(f"Error during processing: {e}")
        import traceback
        traceback.print_exc()
    
    # Clean up test directory
    import shutil
    if test_output.exists():
        shutil.rmtree(test_output)
        print(f"\nCleaned up test directory: {test_output}")

if __name__ == '__main__':
    test_link_extraction() 