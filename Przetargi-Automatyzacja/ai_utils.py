import os
import requests
from dotenv import load_dotenv
from logger_utils import log_action

load_dotenv()

def get_gemini_summary(prompt_text):
    """
    Sends a prompt to the Gemini API and returns the generated text.
    """
    log_action('ai_summary_generation_start', {})
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not set in environment variables.")
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [
            {
                "parts": [
                    {"text": prompt_text}
                ]
            }
        ],
        # Optional: Add safety settings if needed
        # "safetySettings": [
        #     {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
        #     ...
        # ]
    }
    
    try:
        log_action('ai_summary_prompt_sent', {})
        response = requests.post(url, headers=headers, json=data, timeout=120) # 120-second timeout
        response.raise_for_status()
        result = response.json()
        
        if "candidates" in result and result["candidates"]:
            log_action('ai_summary_response_received', {})
            log_action('ai_gemini_response', {'prompt_snippet': prompt_text[:500], 'response_snippet': result["candidates"][0]["content"]["parts"][0]["text"][:500]})
            return result["candidates"][0]["content"]["parts"][0]["text"]
        else:
            log_action('ai_summary_no_candidates', {})
            log_action('ai_gemini_no_candidates', {'prompt_snippet': prompt_text[:500], 'result': str(result)})
            return f"Nie udało się wygenerować podsumowania. Odpowiedź API: {result}"
            
    except requests.exceptions.RequestException as e:
        log_action('ai_summary_connection_error', {'error': str(e)})
        log_action('ai_gemini_request_error', {'error': str(e), 'prompt_snippet': prompt_text[:500]})
        return f"Błąd połączenia z API Gemini: {e}"
    except Exception as e:
        log_action('ai_summary_unexpected_error', {'error': str(e)})
        log_action('ai_gemini_unexpected_error', {'error': str(e), 'prompt_snippet': prompt_text[:500]})
        return f"Nieoczekiwany błąd podczas komunikacji z AI: {e}"


def get_summary_from_ai(row_data, files_content, analyzed_filenames):
    """
    Prepares the prompt and calls the Gemini summary function.
    THIS IS WHERE YOU CAN EDIT THE PROMPT.
    """
    log_action('ai_summary_get_summary_from_ai_start', {})
    prompt = f"""Jesteś ekspertem w analizie dokumentów przetargowych. Twoim zadaniem jest przeanalizowanie dostarczonych plików i utworzenie strukturalnego podsumowania zgodnie z poniższym szablonem.
WAŻNE ZASADY:
⦁	Analizuj TYLKO informacje zawarte w dostarczonych dokumentach
⦁	NIE wymyślaj ani nie szacuj żadnych danych
⦁	Jeśli informacja nie jest podana w dokumentach, wyraźnie to zaznacz
⦁	Zachowuj obiektywność i precyzję
⦁	Używaj konkretnych wartości liczbowych i dat z dokumentów
WYMAGANA STRUKTURA ODPOWIEDZI - Podzial na 4 sekcje:

1. Specyfikacja produktu:
tutaj musi byc SZCZEGÓŁOWE SPECYFIKACJE PRODUKTÓW
wszystko co dotyczy produktu ktory wymagaja, wymagania, specyfikacje, parametry, itp.
to ma byc przygotowanie pod wyszukanie konkretnego modelu np. drukarki, dlatego wymagane jest dokladne przeszukanie wszystkich podanych danych.

3. WARUNKI UDZIAŁU W PRZETARGU
3.1 Warunki Ekonomiczno-Finansowe
⦁	[Lista wszystkich wymagań finansowych z konkretnymi kwotami]
3.2 Warunki Zdolności Technicznej i Zawodowej
⦁	[Lista wymagań dotyczących doświadczenia z konkretnymi kwotami i okresami]
3.3 Wymagane Dokumenty
⦁	[Kompletna lista dokumentów do złożenia z ofertą]
4. WYKLUCZENIA Z UDZIAŁU W PRZETARGU
4.1 Podstawy Wykluczenia Obligatoryjnego
⦁	[Lista przyczyn wykluczenia z numerami artykułów]
4.2 Podstawy Wykluczenia Fakultatywnego
⦁	[Lista fakultatywnych przyczyn wykluczenia]
5. WARTOŚĆ PRZETARGU I WARUNKI PŁATNOŚCI
⦁	Szacunkowa wartość: [Kwota lub informacja o braku danych]
6. KLUCZOWE TERMINY
⦁	Termin składania ofert: [Data i godzina]
⦁	Otwarcie ofert: [Data i godzina]
⦁	Termin związania ofertą: [Data]
⦁	Rozpoczęcie realizacji: [Data]
Czy podane sa jeszcze jakies daty?? jak tak to na co wkazuja/czego dotycza?
7. KRYTYCZNE CZYNNIKI SUKCESU
[Lista 5-8 najważniejszych elementów decydujących o powodzeniu w przetargu, uporządkowanych według ważności]
KOŃCOWE UWAGI I REFLEKSJE
Na końcu swojej analizy ZAWSZE dodaj sekcję "UWAGI I WĄTPLIWOŚCI ANALITYKA", w której:
⦁	Zwróć uwagę na kluczowe ryzyka, np.:
⦁	Nietypowe lub bardzo restrykcyjne wymagania
⦁	Krótkie terminy realizacji
⦁	Skomplikowane procedury
⦁	Wysokie bariery wejścia
⦁	Wskaż niejasności, np.:
⦁	Informacje, które mogą budzić wątpliwości
⦁	Brakujące dane, które mogą być kluczowe
⦁	Sprzeczności w dokumentach
⦁	Zaproponuj pytania do wyjaśnienia, np.:
⦁	Co należałoby doprecyzować z zamawiającym
⦁	Jakie dodatkowe informacje mogą być potrzebne
PRZYKŁAD KOŃCOWYCH UWAG:
## UWAGI I WĄTPLIWOŚCI ANALITYKA

**Kluczowe ryzyka:**
- Wymaganie lokalizacji serwisu w określonym mieście może znacznie ograniczyć grono uczestników
- Krótki termin na złożenie oferty (tylko 12 dni) wymaga szybkiej mobilizacji zasobów

**Niejasności wymagające wyjaśnienia:**
- Brak podania szacunkowej wartości zamówienia utrudnia ocenę opłacalności udziału
- Specyficzne wymagania dotyczące kompatybilności z Novell mogą wykluczać część rozwiązań

**Pytania do rozważenia:**
- Czy zamawiający jest otwarty na rozwiązania alternatywne dla wymaganego oprogramowania?
- Jaki jest faktyczny budżet zamawiającego na to zamówienie?

**Ocena trudności przetargu: 4/5** - Wysokie wymagania techniczne i organizacyjne

Na koncu wymien nazwy plikow ktore przeanalizowales.

DODATKOWE INSTRUKCJE
1.	Jeśli nie znajdziesz informacji potrzebnej do wypełnienia sekcji, napisz: "[INFORMACJA NIEDOSTĘPNA W DOKUMENTACH]"
2.	Jeśli informacja jest niejednoznaczna, napisz: "[WYMAGA WYJAŚNIENIA]" i wskaż źródło niepewności
3.	Używaj konkretnych cytatów z dokumentów dla kluczowych informacji (w nawiasach kwadratowych)
4.	Sprawdzaj spójność - jeśli znajdziesz sprzeczne informacje, wskaż to wyraźnie
5.	Zachowuj profesjonalny ton, ale bądź szczery co do ograniczeń i wątpliwości
Pamiętaj: Lepiej przyznać się do braku informacji niż podawać niepewne lub wymyślone dane.
    """
    log_action('ai_gemini_prompt', {
        'prompt_snippet': prompt[:500], 
        'tender_data': str(row_data),
        'analyzed_files': analyzed_filenames,
        'files_content_length': len(files_content),
        'files_content_snippet': files_content[:1000] if files_content else "No files"
    })
    try:
        full_prompt = f"{prompt}\n\nDANE PRZETARGU:\n{row_data}\n\nPLIKI DO ANALIZY:\n{analyzed_filenames}\n\nTREŚĆ DOKUMENTÓW:\n{files_content}"
        log_action('ai_gemini_full_prompt_length', {'full_prompt_length': len(full_prompt)})
        return get_gemini_summary(full_prompt)
    except Exception as e:
        log_action('ai_summary_get_summary_from_ai_error', {'error': str(e)})
        log_action('ai_gemini_summary_error', {'error': str(e), 'prompt_snippet': prompt[:500]})
        return "Nie udało się wygenerować podsumowania z powodu błędu." 