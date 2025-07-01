import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    fetch(`/api/przetarg/${encodedPrzetargId}/summary`)
      .then(res => {
        if (res.status === 404) return '';
        if (!res.ok) throw new Error('Błąd pobierania podsumowania');
        return res.text();
      })
      .then(text => setSummary(text && text.trim() ? text : 'Brak podsumowania'))
      .catch(err => {
        setSummary('Brak podsumowania');
        setError('Błąd pobierania podsumowania');
      });
  }, [encodedPrzetargId]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-8 px-2">
      {/* Header with name and deadline */}
      <div className="w-full max-w-6xl mb-6">
        <div className="bg-gray-800 rounded-xl shadow-lg p-3 flex items-center justify-between border border-gray-700">
          <div className="font-bold text-base text-blue-300 truncate max-w-[70vw]">{przetargName}</div>
          <div className="text-gray-400 text-sm">Deadline: <span className="font-semibold text-white">{przetargDeadline}</span></div>
        </div>
      </div>
      {/* Podsumowanie full width */}
      <div className="w-full max-w-6xl mb-6">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <div className="font-bold text-lg mb-6 text-blue-300 border-b border-gray-700 pb-3 drop-shadow">Podsumowanie</div>
          <div className="flex-1 overflow-y-auto text-white scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 h-[700px] max-h-[700px]">
            <Summary content={summary} />
          </div>
        </div>
      </div>
      {/* AI Chat floating button */}
      <div className="w-full max-w-6xl mb-6 flex justify-end">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow-lg border border-blue-400 transition"
          onClick={() => { setChatOpen(true); setChatMinimized(false); }}
        >
          Otwórz AI Chat
        </button>
      </div>
      {/* Bottom section: file preview (80%) and file list (20%) */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* File Preview 80% */}
        <div className="bg-gray-700 rounded-xl shadow-lg p-6 flex-1 border border-gray-700 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 min-h-[220px] flex flex-col">
          <div className="font-bold text-lg mb-6 text-blue-300 border-b border-gray-700 pb-3 drop-shadow">Podgląd pliku</div>
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
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full md:w-1/5 border border-gray-700 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 min-h-[220px] flex flex-col">
          <div className="font-bold text-lg mb-6 text-blue-300 border-b border-gray-700 pb-3 drop-shadow">Lista plików (_cleaned_txt)</div>
          <div className="flex-1 overflow-y-auto text-white scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
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