import { Routes, Route, Link, NavLink, useLocation } from "react-router-dom";
import Home         from "./pages/Home.jsx";
import Analytics    from "./pages/Analytics.jsx";
import Repositories from "./pages/Repositories.jsx";
import NotFound     from "./pages/NotFound.jsx";

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  function handleNavClick(e, id) {
    e.preventDefault();
    if (!isHome) {
      window.location.hash = "/";
      setTimeout(() => scrollTo(id), 300);
    } else {
      scrollTo(id);
    }
  }

  return (
    <header className="navbar">
      <div className="container nav-content">
        <div className="nav-left">
          <Link to="/" className="logo">
            <span className="logo-icon">
              <img src="/logo.svg" alt="" />
            </span>
            GitHub Analytics
          </Link>

          <span className="nav-divider" />

          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-active" : ""}>
              Home
            </NavLink>
            <a href="#features"     onClick={e => handleNavClick(e, "features")}>Features</a>
            <a href="#how-it-works" onClick={e => handleNavClick(e, "how-it-works")}>How it works</a>
          </nav>
        </div>

        <div className="nav-right">
          <a
            href="https://github.com/isaad-ui/github-developer-analytics"
            target="_blank" rel="noopener noreferrer"
            className="nav-icon" aria-label="Source on GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
          <a href="#search" className="btn btn-primary nav-cta" onClick={e => handleNavClick(e, "search")}>
            Analyze a profile
          </a>
        </div>
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
            <span className="logo-icon">
              <img src="/logo.svg" alt="" />
            </span>
            GitHub Analytics
          </Link>
          <p className="footer-tagline">Built on the public GitHub REST API.</p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <a href="https://github.com/isaad-ui/github-developer-analytics" target="_blank" rel="noopener noreferrer">
            Source
          </a>
          <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer">
            API docs
          </a>
        </div>

        <div className="footer-right">© {new Date().getFullYear()} GitHub Developer Analytics</div>
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
          <Route path="/"                    element={<Home />}         />
          <Route path="/analytics/:username" element={<Analytics />}   />
          <Route path="/repos/:username"     element={<Repositories />} />
          <Route path="*"                    element={<NotFound />}     />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
