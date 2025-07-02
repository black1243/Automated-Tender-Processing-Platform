#!/bin/bash
source venv/bin/activate
python api.py &
streamlit run web_app.py 