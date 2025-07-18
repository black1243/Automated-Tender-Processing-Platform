import React, { useState, useEffect } from 'react';

function extractSection(content, header) {
  // Extracts section content between ## HEADER and next ##
  if (!content || typeof content !== 'string') return '';
  const regex = new RegExp(`## ${header}\\s*([\\s\\S]*?)(?=\\n## |$)`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
}

const SectionDisplay = ({
  title,
  content,
  className = ''
}) => (
  <div className={`flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl border border-gray-600 p-5 transition-all hover:shadow-2xl ${className}`}>
    <div className="font-bold text-base mb-4 text-blue-300 tracking-wide uppercase border-b border-blue-500 pb-2">{title}</div>
    <div className="flex-1 text-white text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-96">
      {content || <span className="text-gray-400 italic">Brak treści w tej sekcji</span>}
    </div>
  </div>
);

const NotesEditor = ({
  notes,
  onChange,
  onSave,
  loading,
  error
}) => (
  <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg shadow-2xl border border-blue-400 p-5">
    <div className="font-bold text-lg mb-4 text-blue-300 tracking-wide border-b border-blue-500 pb-2">📝 Notatki i uwagi</div>
    <textarea
      className="w-full p-4 rounded-lg border border-gray-600 text-white bg-gray-700 mb-4 resize-none min-h-[150px] text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-gray-400"
      value={notes}
      onChange={e => onChange(e.target.value)}
      disabled={loading}
      placeholder="Dodaj swoje notatki, uwagi i komentarze dotyczące tego przetargu..."
    />
    <div className="flex gap-2 items-center">
      <button
        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-sm py-2 px-4 rounded-lg shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        onClick={onSave}
        disabled={loading}
      >
        💾 Zapisz notatki
      </button>
      {loading && <span className="text-blue-300 text-sm animate-pulse">⏳ Zapisywanie...</span>}
      {error && <span className="text-red-400 text-sm font-medium">❌ {error}</span>}
    </div>
  </div>
);

const Summary = ({
  content,
  onSaveSection,
  loadingSection,
  errorSection
}) => {
  const [notes, setNotes] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [sections, setSections] = useState({
    spec: '',
    wykl: '',
    warunki: '',
    podsumowanie: ''
  });

  // Initialize sections and load existing notes
  useEffect(() => {
    console.log('Summary content changed, length:', content ? content.length : 'null');
    console.log('Content preview:', content ? content.substring(0, 200) + '...' : 'null');
    console.log('Content contains headers:', {
      spec: content ? content.includes('## SPECYFIKACJA PRODUKTÓW') : false,
      wykl: content ? content.includes('## WYKLUCZENIA') : false,
      warunki: content ? content.includes('## WARUNKI SPECJALNE') : false,
      podsumowanie: content ? content.includes('## PODSUMOWANIE') : false
    });
    
    if (content && content !== 'Brak podsumowania') {
      const spec = extractSection(content, 'SPECYFIKACJA PRODUKTÓW');
      const wykl = extractSection(content, 'WYKLUCZENIA');
      const warunki = extractSection(content, 'WARUNKI SPECJALNE');
      const podsumowanie = extractSection(content, 'PODSUMOWANIE');
      
      console.log('✅ Content successfully parsed! Sections extracted:', {
        spec: spec.length,
        wykl: wykl.length,
        warunki: warunki.length,
        podsumowanie: podsumowanie.length
      });
      
      setSections({
        spec,
        wykl,
        warunki,
        podsumowanie
      });
      
      // Load existing notes from content if they exist
      const existingNotes = extractSection(content, 'NOTATKI');
      setNotes(existingNotes);
      
      setInitialized(true);
    }
  }, [content]);

  // Show loading until content is initialized
  if (!initialized) {
    return (
      <div className="text-center text-gray-400 py-8">
        <div className="animate-pulse">Ładowanie sekcji podsumowania...</div>
      </div>
    );
  }

  // Save notes handler
  const handleSaveNotes = () => {
    if (onSaveSection) {
      onSaveSection('NOTATKI', notes);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="font-bold text-2xl mb-6 text-blue-300 tracking-wide drop-shadow-lg">📋 Podsumowanie przetargu</div>
      
      
      {/* Read-only content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionDisplay
          title="Specyfikacja Produktów"
          content={sections.spec}
        />
        <SectionDisplay
          title="Wykluczenia"
          content={sections.wykl}
        />
        <SectionDisplay
          title="Warunki Specjalne"
          content={sections.warunki}
        />
        <SectionDisplay
          title="Podsumowanie"
          content={sections.podsumowanie}
        />
      </div>
      
      {/* Editable notes section */}
      <div className="w-full">
        <NotesEditor
          notes={notes}
          onChange={setNotes}
          onSave={handleSaveNotes}
          loading={loadingSection === 'NOTATKI'}
          error={errorSection && errorSection.section === 'NOTATKI' ? errorSection.message : ''}
        />
      </div>
    </div>
  );
};

export default Summary;

export { SectionDisplay }; 