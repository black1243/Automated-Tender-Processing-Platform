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
- Analizuj TYLKO informacje zawarte w dostarczonych dokumentach
- NIE wymyślaj ani nie szacuj żadnych danych
- Jeśli informacja nie jest podana w dokumentach, wyraźnie to zaznacz
- Zachowuj obiektywność i precyzję
- Używaj konkretnych wartości liczbowych i dat z dokumentów

WYMAGANA STRUKTURA ODPOWIEDZI - Podział na 4 sekcje (każda zaczyna się od nagłówka markdown, np. ## SPECYFIKACJA PRODUKTÓW):

## SPECYFIKACJA PRODUKTÓW
Wszystkie szczegółowe specyfikacje produktów, wymagania techniczne, parametry, itp. (przygotowane pod wyszukanie konkretnego modelu produktu).
Jeśli brak informacji, napisz: `[BRAK INFORMACJI W DOKUMENTACH]`

## WYKLUCZENIA
Wszystkie podstawy wykluczenia z udziału w przetargu (obligatoryjne i fakultatywne, z numerami artykułów jeśli są).
Jeśli brak informacji, napisz: `[BRAK INFORMACJI W DOKUMENTACH]`

## WARUNKI SPECJALNE
Wszystkie nietypowe, dodatkowe lub szczególne warunki udziału, realizacji, płatności, itp., które nie pasują do wykluczeń ani specyfikacji produktów.
Jeśli brak informacji, napisz: `[BRAK INFORMACJI W DOKUMENTACH]`

## PODSUMOWANIE
Pozostałe wymagane elementy analizy:
- Warunki udziału w przetargu (ekonomiczno-finansowe, techniczne, wymagane dokumenty)
- Wartość przetargu i warunki płatności
- Kluczowe terminy
- Krytyczne czynniki sukcesu
- Końcowe uwagi i wątpliwości analityka (zgodnie z instrukcją poniżej)
- Lista przeanalizowanych plików

**W każdej sekcji używaj markdown (listy, pogrubienia, cytaty, tabele jeśli potrzebne).
Jeśli informacja jest niejednoznaczna, napisz: `[WYMAGA WYJAŚNIENIA]` i wskaż źródło niepewności.
Jeśli nie znajdziesz informacji, napisz: `[BRAK INFORMACJI W DOKUMENTACH]`.
Zawsze zachowuj profesjonalny ton i szczerość co do ograniczeń.**

Na końcu sekcji "Podsumowanie" zawsze dodaj:
- "UWAGI I WĄTPLIWOŚCI ANALITYKA" (zgodnie z poprzednią instrukcją)
- Listę nazw przeanalizowanych plików

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