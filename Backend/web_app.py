import streamlit as st
from pathlib import Path
import shutil
import zipfile
import os
from file_cleaner import convert_and_clean_output_files
import datetime
from backend_processor import process_emails_and_tenders, get_logs, remove_duplicate_tender_folders
from logger_utils import log_action

# --- SUBPAGE: Tender Details ---
if st.session_state.get("show_tender_details", False):
    st.title(f"Szczegóły przetargu: {st.session_state.get('selected_date', '')} / {st.session_state.get('selected_tender', '')}")
    st.write("Tutaj pojawią się szczegóły przetargu. (Do zaprojektowania)")
    if st.button("Powrót", key="back_to_main"):
        st.session_state["show_tender_details"] = False
        st.rerun()
    st.stop()

OUTPUT_DIR = Path("output")
DATA_DIR = Path("dane")

st.set_page_config(page_title="Przetargi - Podsumowania", layout="wide")
st.title("Przetargi - Przegląd podsumowań AI")

log_action('web_app_start', {})

# --- NEW: Automatyczne przetwarzanie maili i przetargów (nowy backend) ---
st.subheader("Automatyczne przetwarzanie maili i przetargów (nowy backend)")

date_mode = st.radio("Wybierz tryb daty:", ["Pojedyncza data", "Zakres dat", "Wiele dat"])

if date_mode == "Pojedyncza data":
    single_date = st.date_input("Wybierz datę", value=datetime.date.today(), key="single_date")
    date_input = single_date.isoformat()
elif date_mode == "Zakres dat":
    start_date = st.date_input("Data początkowa", value=datetime.date.today(), key="start_date")
    end_date = st.date_input("Data końcowa", value=datetime.date.today(), key="end_date")
    date_input = {"start": start_date.isoformat(), "end": end_date.isoformat()}
else:
    multi_dates = st.multiselect("Wybierz daty", options=[(datetime.date.today() - datetime.timedelta(days=i)).isoformat() for i in range(30)])
    date_input = list(multi_dates)

if st.button("Uruchom automatyczne przetwarzanie"):
    log_action('web_app_button_clicked', {'date_input': date_input})
    with st.spinner("Przetwarzanie..."):
        processed_files = process_emails_and_tenders(date_input)
        st.success(f"Przetworzono {len(processed_files)} plików.")

# Button to clean and convert all files in output to txt
if st.button("Przekonwertuj i wyczyść wszystkie pliki w output do txt"):
    with st.spinner("Konwertowanie i czyszczenie plików w output..."):
        convert_and_clean_output_files()
    st.success("Wszystkie pliki zostały przekonwertowane i wyczyszczone do txt w podfolderach _cleaned_txt.")

# Button to remove duplicate tender folders
if st.button("Usuń zdublowane przetargi z output"):
    remove_duplicate_tender_folders()
    st.success("Zdublowane foldery przetargów zostały usunięte.")

# Zbierz wszystkie dostępne daty (foldery w output)
date_folders = sorted([f for f in OUTPUT_DIR.iterdir() if f.is_dir()], key=lambda x: x.name, reverse=True)

if not date_folders:
    st.info("Brak przetworzonych przetargów. Uruchom najpierw przetwarzanie.")
else:
    selected_date = st.selectbox("Wybierz datę maila:", [f.name for f in date_folders])
    tenders_in_date = []
    for f in date_folders:
        if f.name == selected_date:
            def extract_date_from_folder(folder):
                # Nazwa folderu: Nazwa_Organizacji_YYYY-MM-DD
                parts = folder.name.rsplit('_', 1)
                if len(parts) == 2:
                    try:
                        return datetime.datetime.strptime(parts[1], "%Y-%m-%d")
                    except Exception:
                        return datetime.datetime.min
                return datetime.datetime.min
            tenders_in_date = sorted([d for d in f.iterdir() if d.is_dir()], key=extract_date_from_folder)
            break

    if not tenders_in_date:
        st.info("Brak przetargów dla wybranej daty.")
    else:
        selected_tender = st.selectbox("Wybierz przetarg:", [d.name for d in tenders_in_date])
        tender_folder = [d for d in tenders_in_date if d.name == selected_tender][0]
        # Add button to go to new subpage
        if st.button("Przejdź do szczegółów przetargu", key="goto_tender_details"):
            st.session_state["show_tender_details"] = True
            st.session_state["selected_date"] = selected_date
            st.session_state["selected_tender"] = selected_tender
            st.experimental_rerun()
        summary_file = tender_folder / "_Podsumowanie.md"
        attachments = [f for f in tender_folder.iterdir() if f.is_file() and not f.name.startswith("_")]

        st.header(f"Podsumowanie: {selected_date} / {selected_tender}")
        if summary_file.exists():
            st.markdown(summary_file.read_text(encoding="utf-8"), unsafe_allow_html=True)
        else:
            st.warning("Brak pliku podsumowania.")

        st.subheader("Załączniki do pobrania:")
        if attachments:
            for att in attachments:
                with open(att, "rb") as f:
                    st.download_button(label=f"Pobierz {att.name}", data=f, file_name=att.name)
        else:
            st.info("Brak załączników w tym przetargu.")