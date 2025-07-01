import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/tenders";
const REFRESH_INTERVAL = 3600000; // 1 hour in ms
const MIN_VISIBLE = 1;
const DEFAULT_VISIBLE = 4;

export default function TimelinePage() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE);
  const intervalRef = useRef();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const navigate = useNavigate();

  // Fetch tenders from API
  const fetchTenders = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log('API response:', data);
        const today = new Date();
        today.setHours(0,0,0,0); // ignore time part
        const mapped = data
          .filter(t => t.path)
          .map((t, idx) => {
            // t.path: "2025-06-18/Komenda Wojewódzka Policji w Kielcach_2025-06-26"
            const [folderDate, title] = t.path.split("/");
            // Extract end date from title (after last underscore)
            let endDateStr = null;
            if (title && title.includes("_")) {
              endDateStr = title.substring(title.lastIndexOf("_") + 1);
            }
            let endDate = endDateStr ? new Date(endDateStr) : null;
            return {
              ...t,
              folderDate,
              title,
              endDate,
              idx,
            };
          })
          .filter(t => t.endDate && t.endDate >= today)
          .sort((a, b) => a.endDate - b.endDate);
        console.log('Mapped tenders:', mapped);
        setTenders(mapped);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTenders();
    intervalRef.current = setInterval(fetchTenders, REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Zoom handlers
  const handleZoomIn = () => {
    setVisibleCount((c) => Math.max(MIN_VISIBLE, c - 1));
  };
  const handleZoomOut = () => {
    setVisibleCount((c) => Math.min(tenders.length, c + 1));
  };

  if (loading) {
    return <div className="text-center text-gray-400 mt-20">Ładowanie danych…</div>;
  }

  const visibleTenders = tenders.slice(0, visibleCount);
  const selectedTender = visibleTenders[selectedIdx] || visibleTenders[0];

  function handleDeleteTender() {
    if (!selectedTender) return;
    if (!window.confirm('Czy na pewno chcesz usunąć ten przetarg?')) return;
    fetch(`${API_URL}/${selectedTender.folderDate}/${encodeURIComponent(selectedTender.title)}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Błąd usuwania przetargu');
        // Remove from UI
        setTenders((prev) => prev.filter(t => t.path !== selectedTender.path));
        setSelectedIdx(0);
      })
      .catch((err) => {
        alert('Nie udało się usunąć przetargu.');
        console.error(err);
      });
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Timeline Section */}
      <div className="flex-1 bg-gray-800 rounded-xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Timeline Projektów</h2>
          <div className="flex gap-2 items-center">
            <button
              onClick={fetchTenders}
              className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded flex items-center justify-center"
              title="Odśwież timeline"
              disabled={loading}
            >
              <svg
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h5M20 20v-5h-5M5.07 19A9 9 0 1 1 12 21a9 9 0 0 1-6.93-2"
                />
              </svg>
            </button>
            <button
              onClick={handleZoomIn}
              disabled={visibleCount <= MIN_VISIBLE}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded disabled:opacity-50 transition"
            >
              –
            </button>
            <span className="text-sm text-gray-400">{visibleCount}</span>
            <button
              onClick={handleZoomOut}
              disabled={visibleCount >= tenders.length}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded disabled:opacity-50 transition"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex justify-between w-full mb-4 transition-all duration-500">
            {visibleTenders.map((step, idx) => (
              <div
                key={step.path}
                className={`flex flex-col items-center w-1/4 opacity-100 transition-all duration-500 cursor-pointer ${idx === selectedIdx ? "z-10" : "z-0"}`}
                style={{
                  transition: "opacity 0.5s, transform 0.5s",
                  transform: `scale(${1 - (visibleCount - 4) * 0.05})`,
                }}
                onClick={() => setSelectedIdx(idx)}
              >
                <span className="text-gray-300 text-sm font-mono mb-2">{step.date}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 ${idx === selectedIdx ? "bg-blue-500 border-blue-400 shadow-lg" : "bg-gray-700 border-gray-600"}`}>
                  {idx === selectedIdx && (
                    <span className="block w-4 h-4 bg-blue-300 rounded-full animate-pulse"></span>
                  )}
                </div>
                <span className={`text-sm ${idx === selectedIdx ? "text-white font-semibold" : "text-gray-400"}`}>{step.title}</span>
                {step.percent && (
                  <span className="mt-2 text-xs bg-blue-400 text-white px-3 py-1 rounded-full font-bold">{step.percent}%</span>
                )}
              </div>
            ))}
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full mt-8 mb-2">
            <div className="h-3 bg-blue-400 rounded-full transition-all duration-500" style={{ width: `${visibleTenders[0]?.percent || 0}%` }}></div>
          </div>
          <p className="text-gray-500 text-xs mt-2">Użyj przycisków +/– aby zoomować timeline</p>
        </div>
      </div>
      {/* Details Panel */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4">Dane</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Data:</span> <span className="font-semibold">{selectedTender?.date}</span></div>
            <div className="flex justify-between"><span>Tytuł:</span> <span className="font-semibold">{selectedTender?.title}</span></div>
            <div className="flex justify-between"><span>ID:</span> <span className="font-semibold">#{selectedTender?.id || selectedTender?.path}</span></div>
            <div><span>Opis:</span><div className="text-gray-400 text-xs mt-1">Rozpoczęcie współpracy z klientem</div></div>
          </div>
          {selectedTender && (
            <div className="flex gap-2 mt-4">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                onClick={() => navigate(`/przetarg/${selectedTender.folderDate}/${encodeURIComponent(selectedTender.title)}`)}
              >
                Przejdź
              </button>
              <button
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                onClick={handleDeleteTender}
              >
                Usuń
              </button>
            </div>
          )}
        </div>
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-2">% Dopasowania</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-green-400">{selectedTender?.percent || "?"}%</span>
            <span className="bg-yellow-500 text-xs text-white px-3 py-1 rounded-full font-semibold">Dobry</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div className="h-2 bg-green-400 rounded-full transition-all duration-500" style={{ width: `${selectedTender?.percent || 0}%` }}></div>
          </div>
          <div className="text-xs text-gray-400 mt-2">Procent dopasowania do założonych kryteriów</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-2">Produkty</h3>
          <div className="text-xs text-gray-400 mb-2">Powiązane produkty (3)</div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-gray-700 text-white px-4 py-1 rounded-full font-semibold text-xs">Produkt A</span>
            <span className="bg-gray-700 text-white px-4 py-1 rounded-full font-semibold text-xs">Produkt B</span>
            <span className="bg-gray-700 text-white px-4 py-1 rounded-full font-semibold text-xs">Produkt C</span>
          </div>
        </div>
      </div>
    </div>
  );
} 