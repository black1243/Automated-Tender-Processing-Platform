import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SectionDisplay } from './components/Summary';

const API_URL = "http://localhost:5000/api/tenders";
const REFRESH_INTERVAL = 3600000; // 1 hour in ms
const MIN_VISIBLE = 1;
const DEFAULT_VISIBLE = 4;
const MAX_COMFORTABLE_VISIBLE = 8;
const ANIMATION_DURATION = 600;
const ITEM_WIDTH = 180; // px, adjust as needed

export default function TimelinePage() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE);
  const intervalRef = useRef();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  const [dragStartIndex, setDragStartIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const navigate = useNavigate();
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  // Move these up before any useEffect that uses selectedTender
  const visibleTenders = tenders.slice(startIndex, startIndex + visibleCount);
  const selectedTender = visibleTenders[selectedIdx] || visibleTenders[0];

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

  // Modern zoom handlers with smooth animations
  const handleZoomIn = () => {
    setIsZooming(true);
    setVisibleCount((c) => {
      const newCount = Math.max(MIN_VISIBLE, c - 1);
      // Adjust start index if needed to keep selected item in view
      if (selectedIdx >= newCount) {
        setStartIndex(Math.max(0, selectedIdx - newCount + 1));
      }
      return newCount;
    });
    setTimeout(() => setIsZooming(false), ANIMATION_DURATION);
  };

  const handleZoomOut = () => {
    setIsZooming(true);
    setVisibleCount((c) => {
      const newCount = Math.min(tenders.length, c + 1);
      // Reset start index if we're showing more items
      if (newCount > MAX_COMFORTABLE_VISIBLE && startIndex > 0) {
        setStartIndex(Math.max(0, startIndex - 1));
      }
      return newCount;
    });
    setTimeout(() => setIsZooming(false), ANIMATION_DURATION);
  };

  // Navigate timeline for large datasets
  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(Math.max(0, startIndex - 1));
      setSelectedIdx(0);
    }
  };

  const handleNext = () => {
    if (startIndex + visibleCount < tenders.length) {
      setStartIndex(startIndex + 1);
      setSelectedIdx(0);
    }
  };

  // Auto-adjust zoom for optimal viewing
  const handleAutoZoom = () => {
    setIsZooming(true);
    const optimalCount = tenders.length <= 4 ? tenders.length : 
                       tenders.length <= 8 ? Math.min(6, tenders.length) :
                       Math.min(MAX_COMFORTABLE_VISIBLE, tenders.length);
    setVisibleCount(optimalCount);
    setStartIndex(0);
    setSelectedIdx(0);
    setTimeout(() => setIsZooming(false), ANIMATION_DURATION);
  };

  // Mouse drag-to-pan handlers
  function handleMouseDown(e) {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartIndex(startIndex);
    setDragOffset(0);
  }
  function handleMouseMove(e) {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    setDragOffset(deltaX);
  }
  function handleMouseUp() {
    if (!isDragging) return;
    const threshold = 60; // pixels to move one item
    let moved = Math.round(-dragOffset / threshold);
    let newStart = Math.min(
      Math.max(0, dragStartIndex + moved),
      Math.max(0, tenders.length - visibleCount)
    );
    setStartIndex(newStart);
    setIsDragging(false);
    setDragOffset(0);
  }

  useEffect(() => {
    if (!selectedTender) return;
    setSummaryLoading(true);
    setSummaryError('');
    const przetargId = `${selectedTender.folderDate}_${selectedTender.title}`;
    const encodedPrzetargId = encodeURIComponent(przetargId);
    fetch(`/api/przetarg/${encodedPrzetargId}/summary`)
      .then(res => {
        if (res.status === 404) return '';
        if (!res.ok) throw new Error('Błąd pobierania podsumowania');
        return res.text();
      })
      .then(text => {
        setSummary(text && text.trim() ? text : 'Brak podsumowania');
        setSummaryLoading(false);
      })
      .catch(err => {
        setSummary('Brak podsumowania');
        setSummaryError('Błąd pobierania podsumowania');
        setSummaryLoading(false);
      });
  }, [selectedTender]);

  if (loading) {
    return <div className="text-center text-gray-400 mt-20">Ładowanie danych…</div>;
  }

  const totalPages = Math.ceil(tenders.length / visibleCount);
  const currentPage = Math.floor(startIndex / visibleCount) + 1;
  const showNavigation = tenders.length > MAX_COMFORTABLE_VISIBLE;

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
      <div className="flex-1 bg-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/5">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-light text-white/90">Timeline</h2>
            {showNavigation && (
              <div className="text-xs text-white/30 font-mono">
                {startIndex + 1}–{Math.min(startIndex + visibleCount, tenders.length)} of {tenders.length}
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={fetchTenders}
              className="text-white/40 hover:text-white/70 p-2 rounded-lg timeline-button"
              disabled={loading}
            >
              <div className={`w-3 h-3 border border-current rounded-full ${loading ? "animate-spin border-t-transparent" : ""}`}></div>
            </button>
            {showNavigation && (
              <>
                <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
                  <button
                    onClick={handlePrevious}
                    disabled={startIndex === 0}
                    className="text-white/70 hover:text-white px-2 py-1 rounded disabled:opacity-30 timeline-button text-sm"
                  >
                    ‹
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={startIndex + visibleCount >= tenders.length}
                    className="text-white/70 hover:text-white px-2 py-1 rounded disabled:opacity-30 timeline-button text-sm"
                  >
                    ›
                  </button>
                </div>
              </>
            )}
            <button
              onClick={handleAutoZoom}
              className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-3 py-1.5 rounded-lg timeline-button text-xs font-medium border border-white/10"
            >
              Auto
            </button>
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
              <button
                onClick={handleZoomIn}
                disabled={visibleCount <= MIN_VISIBLE || isZooming}
                className="text-white/70 hover:text-white px-2 py-1 rounded disabled:opacity-30 timeline-button text-sm"
              >
                −
              </button>
              <span className="text-xs text-white/50 min-w-[1.5ch] text-center font-mono">{visibleCount}</span>
              <button
                onClick={handleZoomOut}
                disabled={visibleCount >= tenders.length || isZooming}
                className="text-white/70 hover:text-white px-2 py-1 rounded disabled:opacity-30 timeline-button text-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center overflow-hidden">
          <div
            className="w-full mb-8"
            style={{
              width: `${visibleCount * ITEM_WIDTH}px`,
              overflow: 'hidden',
              margin: '0 auto',
              position: 'relative',
            }}
          >
            <div
              className={`flex timeline-zoom-transition ${isZooming ? 'scale-zoom-in' : ''}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: isDragging ? 'none' : 'auto',
                width: `${tenders.length * ITEM_WIDTH}px`,
                transform: `translateX(${-startIndex * ITEM_WIDTH + dragOffset}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              {tenders.map((step, idx) => {
                const scale = visibleCount <= 4 ? 1 : 
                             visibleCount <= 6 ? 0.95 :
                             visibleCount <= 8 ? 0.85 :
                             0.75;
                // Only highlight if in visible range
                const isVisible = idx >= startIndex && idx < startIndex + visibleCount;
                const isSelected = isVisible && (idx - startIndex === selectedIdx);
                return (
                  <div
                    key={step.path}
                    className={`flex flex-col items-center justify-center ${isSelected ? 'selected z-10' : 'z-0'} timeline-item`}
                    style={{
                      width: `${ITEM_WIDTH}px`,
                      opacity: isVisible ? 1 : 0.3,
                      pointerEvents: isVisible ? 'auto' : 'none',
                      transform: `scale(${scale}) ${isSelected ? 'translateY(-4px)' : ''}`,
                      transition: `all ${ANIMATION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                    }}
                    onClick={() => isVisible && setSelectedIdx(idx - startIndex)}
                  >
                    <span className={`text-white/40 font-light mb-3 transition-all duration-500 text-xs`}>
                      {step.date}
                    </span>
                    <div className={`rounded-full flex items-center justify-center mb-3 transition-all duration-500 w-3 h-3 ${isSelected ? "bg-white shadow-lg shadow-white/20" : "bg-white/20 hover:bg-white/40"}`}></div>
                    <span className={`transition-all duration-500 text-center line-clamp-2 font-light text-xs ${isSelected ? "text-white" : "text-white/50 hover:text-white/70"}`}>
                      {step.title.length > 30 && visibleCount > 6 
                        ? step.title.substring(0, 30) + '...' 
                        : step.title}
                    </span>
                    {step.percent && (
                      <span className={`mt-3 bg-white/10 text-white/70 rounded-full font-light transition-all duration-500 text-xs px-2 py-0.5`}>
                        {step.percent}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Minimalist progress line */}
          <div className="w-full relative mt-12">
            <div className="w-full h-px bg-white/10">
              <div 
                className="h-px bg-white/60 transition-all duration-1000 ease-out" 
                style={{ width: `${selectedTender?.percent || 0}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-white/20 text-xs mt-6 text-center font-light">
            {showNavigation 
              ? `Navigate with ‹ › controls` 
              : `Adjust view with zoom controls`
            }
          </p>
        </div>
        {/* Podsumowanie section below timeline */}
        <div className="mt-12">
          <div className="font-bold text-xl mb-4 text-blue-300 border-b-2 border-blue-500 pb-2">Podsumowanie</div>
          {summaryLoading ? (
            <div className="text-gray-400 animate-pulse py-8">Ładowanie podsumowania…</div>
          ) : summaryError ? (
            <div className="text-red-400 py-8">{summaryError}</div>
          ) : (
            <SectionDisplay
              title="Podsumowanie"
              content={(() => {
                // Extract only the Podsumowanie section from the summary markdown
                if (!summary || summary === 'Brak podsumowania') return summary;
                const regex = /## PODSUMOWANIE\s*([\s\S]*?)(?=\n## |$)/i;
                const match = summary.match(regex);
                return match ? match[1].trim() : summary;
              })()}
            />
          )}
        </div>
      </div>
      {/* Details Panel */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-light text-white/90 mb-6">Details</h3>
          <div className="text-sm space-y-3">
            <div className="flex justify-between"><span className="text-white/50">Date:</span> <span className="font-light text-white/80">{selectedTender?.date}</span></div>
            <div className="flex justify-between"><span className="text-white/50">Title:</span> <span className="font-light text-white/80">{selectedTender?.title}</span></div>
            <div className="flex justify-between"><span className="text-white/50">ID:</span> <span className="font-light text-white/80">#{selectedTender?.id || selectedTender?.path}</span></div>
            <div><span className="text-white/50">Status:</span><div className="text-white/40 text-xs mt-1 font-light">Active tender process</div></div>
          </div>
          {selectedTender && (
            <div className="flex gap-2 mt-4">
              <button
                className="w-full bg-white/10 hover:bg-white/20 text-white font-light py-2.5 px-4 rounded-xl transition-all duration-300 border border-white/10"
                onClick={() => navigate(`/przetarg/${selectedTender.folderDate}/${encodeURIComponent(selectedTender.title)}`)}
              >
                View Details
              </button>
              <button
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-300/80 hover:text-red-300 font-light py-2.5 px-4 rounded-xl transition-all duration-300 border border-red-500/20"
                onClick={handleDeleteTender}
              >
                Remove
              </button>
            </div>
          )}
        </div>
        <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-light text-white/90 mb-4">Match Score</h3>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-extralight text-white">{selectedTender?.percent || "?"}%</span>
            <span className="bg-white/10 text-white/60 text-xs px-2 py-1 rounded-full font-light">Good</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full">
            <div className="h-1 bg-white/60 rounded-full transition-all duration-1000 progress-glow" style={{ width: `${selectedTender?.percent || 0}%` }}></div>
          </div>
          <div className="text-xs text-white/30 mt-3 font-light">Compatibility with target criteria</div>
        </div>
        <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-light text-white/90 mb-4">Related</h3>
          <div className="text-xs text-white/30 mb-3 font-light">Associated products (3)</div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-white/5 text-white/60 px-3 py-1.5 rounded-full font-light text-xs border border-white/10">Product A</span>
            <span className="bg-white/5 text-white/60 px-3 py-1.5 rounded-full font-light text-xs border border-white/10">Product B</span>
            <span className="bg-white/5 text-white/60 px-3 py-1.5 rounded-full font-light text-xs border border-white/10">Product C</span>
          </div>
        </div>
      </div>
    </div>
  );
} 