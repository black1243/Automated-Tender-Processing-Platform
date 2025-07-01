import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import TimelinePage from "./TimelinePage";
import PrzetargPage from "./PrzetargPage";

const navItems = [
  { name: "Timeline", path: "/timeline" },
  { name: "Główna", path: "/glowna" },
  { name: "Projekty", path: "/projekty" },
  { name: "Analityka", path: "/analityka" },
  { name: "Kontakt", path: "/kontakt" },
];

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="flex items-center px-8 py-4 bg-gray-800 shadow">
        <span className="text-2xl font-bold mr-8">Timeline</span>
        <div className="flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="hover:text-blue-400 transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
      <main className="p-8">{children}</main>
    </div>
  );
}

const Placeholder = ({ title }) => (
  <div className="text-center mt-20">
    <h1 className="text-4xl font-semibold mb-4">{title}</h1>
    <p className="text-gray-400">To będzie strona: {title}</p>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/glowna" element={<Placeholder title="Główna" />} />
          <Route path="/projekty" element={<Placeholder title="Projekty" />} />
          <Route path="/analityka" element={<Placeholder title="Analityka" />} />
          <Route path="/kontakt" element={<Placeholder title="Kontakt" />} />
          <Route path="/przetarg/:date/:title" element={<PrzetargPage />} />
          <Route path="*" element={<Navigate to="/timeline" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
