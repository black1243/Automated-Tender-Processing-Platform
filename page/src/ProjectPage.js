import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/tenders";

export default function ProjectPage() {
  const { date, name } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch details for the selected tender
    fetch(`${API_URL}/${date}/${encodeURIComponent(name)}`)
      .then((res) => res.json())
      .then((data) => {
        setDetails(data);
        setLoading(false);
      });
  }, [date, name]);

  if (loading) {
    return <div className="text-center text-gray-400 mt-20">Ładowanie szczegółów przetargu…</div>;
  }

  if (!details) {
    return <div className="text-center text-red-400 mt-20">Nie znaleziono przetargu.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-900 text-white rounded-xl shadow-lg mt-8">
      <h1 className="text-2xl font-bold mb-4">Szczegóły przetargu</h1>
      <div className="mb-2"><b>Data:</b> {date}</div>
      <div className="mb-2"><b>Nazwa:</b> {name}</div>
      {/* More details to be added here */}
      <pre className="bg-gray-800 rounded p-4 mt-4 text-xs overflow-x-auto">{JSON.stringify(details, null, 2)}</pre>
    </div>
  );
} 