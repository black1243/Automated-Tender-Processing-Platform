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
      <nav className="glass-container-lg mx-4 mt-4 content-spacing flex items-center justify-between">
        <span className="heading-primary">Timeline</span>
        <div className="flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-secondary hover:text-primary transition-all duration-300 font-light"
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
  <div className="glass-container-lg content-spacing-lg text-center mt-20">
    <h1 className="heading-primary text-3xl mb-6">{title}</h1>
    <p className="text-muted font-light">This page is coming soon: {title}</p>
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
