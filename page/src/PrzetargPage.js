import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FileList from './components/FileList';
import AIChat from './components/AIChat';
import Summary from './components/Summary';

const CARD_HEIGHT = 'h-64';

const FloatingChat = ({ open, minimized, onMinimize, onClose }) => {
  if (!open) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 w-96 max-w-[95vw] bg-gray-800 rounded-xl shadow-2xl border border-blue-400 flex flex-col transition-all duration-300 ${minimized ? 'h-12' : 'h-[32rem]'}`}>
      <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-900 rounded-t-xl">
        <span className="font-bold text-blue-300 text-sm">AI Chat</span>
        <div className="flex gap-2">
          <button onClick={onMinimize} className="text-blue-400 hover:text-blue-200 text-lg font-bold px-2">{minimized ? '▢' : '–'}</button>
          <button onClick={onClose} className="text-red-400 hover:text-red-200 text-lg font-bold px-2">×</button>
        </div>
      </div>
      {!minimized && (
        <div className="flex-1 p-4 overflow-y-auto text-white">
          <AIChat />
        </div>
      )}
    </div>
  );
};

const PrzetargPage = () => {
  const { date, title } = useParams();
  const [files, setFiles] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [selectedFileContent, setSelectedFileContent] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [loadingSection, setLoadingSection] = useState(null);
  const [errorSection, setErrorSection] = useState(null);
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState('');
  const navigate = useNavigate();

  const przetargName = decodeURIComponent(title);
  const przetargDeadline = date;
  const przetargId = `${date}_${title}`;
  const encodedPrzetargId = encodeURIComponent(przetargId);

  useEffect(() => {
    setError('');
    fetch(`/api/przetarg/${encodedPrzetargId}/files`)
      .then(res => {
        if (!res.ok) throw new Error('Błąd pobierania listy plików');
        return res.json();
      })
      .then(data => setFiles(data.files || []))
      .catch(err => {
        setFiles([]);
        setError('Błąd pobierania listy plików');
      });
  }, [encodedPrzetargId]);

  useEffect(() => {
    if (!selectedFileId) return;
    setError('');
    fetch(`/api/przetarg/${encodedPrzetargId}/file/${encodeURIComponent(selectedFileId)}`)
      .then(res => {
        if (!res.ok) throw new Error('Błąd pobierania pliku');
        return res.text();
      })
      .then(text => setSelectedFileContent(text))
      .catch(err => {
        setSelectedFileContent('Błąd pobierania pliku');
        setError('Błąd pobierania pliku');
      });
  }, [selectedFileId, encodedPrzetargId]);

  useEffect(() => {
    setError('');
    console.log('Fetching summary for URL:', `/api/przetarg/${encodedPrzetargId}/summary`);
    console.log('Przetarg ID parts - date:', date, 'title:', title);
    
    fetch(`/api/przetarg/${encodedPrzetargId}/summary`)
      .then(res => {
        console.log('Summary API response status:', res.status);
        if (res.status === 404) return '';
        if (!res.ok) throw new Error('Błąd pobierania podsumowania');
        return res.text();
      })
      .then(text => {
        console.log('Summary API response length:', text ? text.length : 'null');
        setSummary(text && text.trim() ? text : 'Brak podsumowania');
      })
      .catch(err => {
        console.error('Summary fetch error:', err);
        setSummary('Brak podsumowania');
        setError('Błąd pobierania podsumowania');
      });
  }, [encodedPrzetargId]);

  // Save section handler
  const handleSaveSection = (section, value) => {
    setLoadingSection(section);
    setErrorSection(null);
    fetch(`/api/przetarg/${encodedPrzetargId}/summary_section`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, value })
    })
      .then(res => {
        if (!res.ok) throw new Error('Błąd zapisu sekcji');
        return res.text();
      })
      .then(() => {
        setLoadingSection(null);
        // Refetch summary to update UI
        return fetch(`/api/przetarg/${encodedPrzetargId}/summary`)
          .then(res => res.text())
          .then(text => setSummary(text && text.trim() ? text : 'Brak podsumowania'));
      })
      .catch(err => {
        setLoadingSection(null);
        setErrorSection({ section, message: err.message || 'Błąd zapisu sekcji' });
      });
  };

  // Delete tender handler
  const handleDeleteTender = () => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten przetarg?')) return;
    fetch(`/api/przetarg/${encodedPrzetargId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Błąd usuwania przetargu');
        navigate('/'); // Redirect to main page or timeline
      })
      .catch((err) => {
        alert('Nie udało się usunąć przetargu.');
        console.error(err);
      });
  };

  // Handler for 'Check' button
  const handleCheckLink = async () => {
    setLinkLoading(true);
    setLinkError('');
    try {
      const res = await fetch(`/api/przetarg/${encodedPrzetargId}/link`);
      if (!res.ok) throw new Error('Nie znaleziono linku');
      const url = (await res.text()).trim();
      if (!/^https?:\/\//.test(url)) throw new Error('Nieprawidłowy link');
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setLinkError(err.message || 'Błąd otwierania linku');
    } finally {
      setLinkLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col py-6 px-4">
      {/* AI Chat button at the very top */}
      <div className="w-full flex justify-end mb-6">
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-lg shadow-xl border border-blue-400 transition-all transform hover:scale-105"
          onClick={() => { setChatOpen(true); setChatMinimized(false); }}
        >
          🤖 Otwórz AI Chat
        </button>
      </div>
      {/* Header with name and deadline */}
      <div className="w-full mb-6">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-xl p-4 flex items-center justify-between border border-gray-600">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="font-bold text-xl text-blue-300 break-words">{przetargName}</div>
            <div className="text-sm text-gray-400">ID: <span className="font-mono text-white text-xs">{przetargId}</span></div>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition ml-4"
              onClick={handleCheckLink}
              disabled={linkLoading}
            >
              {linkLoading ? 'Ładowanie...' : 'Check'}
            </button>
            {linkError && <span className="text-red-400 text-xs ml-2">{linkError}</span>}
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition ml-4"
              onClick={handleDeleteTender}
            >
              Usuń
            </button>
          </div>
        </div>
      </div>
      {/* Podsumowanie full width */}
      <div className="w-full mb-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-2xl p-6 border border-gray-600">
          <div className="font-bold text-2xl mb-6 text-blue-300 border-b-2 border-blue-500 pb-3 drop-shadow-lg">Podsumowanie</div>
          <div className="flex-1 overflow-y-auto text-white" style={{ minHeight: 500 }}>
            <Summary
              content={summary}
              onSaveSection={handleSaveSection}
              loadingSection={loadingSection}
              errorSection={errorSection}
            />
          </div>
        </div>
      </div>
      {/* Bottom section: file preview (80%) and file list (20%) */}
      <div className="w-full flex flex-col lg:flex-row gap-6">
        {/* File Preview 80% */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-xl p-6 flex-1 border border-gray-600 min-h-[300px] flex flex-col">
          <div className="font-bold text-xl mb-6 text-blue-300 border-b-2 border-blue-500 pb-3 drop-shadow-lg">📄 Podgląd pliku</div>
          {selectedFileId ? (
            <>
              <div className="font-semibold mb-4 text-blue-300 text-base">{files.find(f => f.id === selectedFileId)?.name}</div>
              <div className="flex-1 overflow-y-auto max-h-[500px] md:max-h-[60vh]">
                <pre className="text-white whitespace-pre-wrap text-sm w-full">{selectedFileContent}</pre>
              </div>
            </>
          ) : (
            <div className="text-gray-400 italic flex-1 flex items-center">Wybierz plik z listy, aby zobaczyć podgląd.</div>
          )}
        </div>
        {/* File List 20% */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl p-6 w-full lg:w-1/4 border border-gray-600 min-h-[300px] flex flex-col">
          <div className="font-bold text-lg mb-6 text-blue-300 border-b-2 border-blue-500 pb-3 drop-shadow-lg">📁 Lista plików</div>
          <div className="flex-1 overflow-y-auto text-white">
            <FileList files={files} onSelect={setSelectedFileId} selectedFileId={selectedFileId} />
          </div>
        </div>
      </div>
      {/* Floating AI Chat */}
      <FloatingChat open={chatOpen} minimized={chatMinimized} onMinimize={() => setChatMinimized(m => !m)} onClose={() => setChatOpen(false)} />
    </div>
  );
};

export default PrzetargPage; 