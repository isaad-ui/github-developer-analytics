import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home         from "./pages/Home.jsx";
import Analytics    from "./pages/Analytics.jsx";
import Repositories from "./pages/Repositories.jsx";
import NotFound     from "./pages/NotFound.jsx";

function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <span className="logo-icon">GH</span>
          GitHub Analytics
        </Link>

        <nav className="nav-links">
          <Link to="/" className={isHome ? "nav-active" : ""}>Home</Link>
          <a href="/#features">Features</a>
          <a href="/#how-it-works">How it works</a>
        </nav>

        <Link to="/" className="nav-cta">Try it free</Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container footer-content">
        <div>
          <Link to="/" className="logo">
            <span className="logo-icon">GH</span>
            GitHub Analytics
          </Link>
          <p className="footer-tagline">
            Developer intelligence built from GitHub activity.
          </p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <a href="https://github.com/isaad-ui/github-developer-analytics" target="_blank" rel="noopener noreferrer">
            Source
          </a>
        </div>
        <div className="footer-right">
          © {new Date().getFullYear()} GitHub Developer Analytics
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/analytics/:username" element={<Analytics />} />
          <Route path="/repos/:username"   element={<Repositories />} />
          <Route path="*"                  element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
