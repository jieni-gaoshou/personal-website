import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { siteConfig } from "../lib/siteConfig";
import GlitchText from "./GlitchText";
import ThemeToggle from "./ThemeToggle";

const ADMIN_KEY = "blog_admin_key";

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowAdmin(!!sessionStorage.getItem(ADMIN_KEY));
    const check = () => setShowAdmin(!!sessionStorage.getItem(ADMIN_KEY));
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--bg-primary)]/80 backdrop-blur-lg border-b border-[var(--border-color)] theme-transition">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2 font-orbitron text-lg font-bold tracking-widest"
        >
          <GlitchText enableGlitch={true}>
            <span className="text-cyberpink group-hover:animate-glow transition-all duration-300">
              &lt;
            </span>
            <span className="text-white group-hover:text-cyberpink transition-colors">ASTRO</span>
            <span className="text-electric">BLOG</span>
            <span className="text-cyberpink group-hover:animate-glow transition-all duration-300">
              /&gt;
            </span>
          </GlitchText>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {siteConfig.navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 font-mono text-sm tracking-wide transition-all duration-300 rounded-lg ${
                  isActive
                    ? "text-cyberpink bg-cyberpink/10"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/30"
                }`}
              >
                <i className={`${link.icon} mr-2 text-xs`}></i>
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-[2px] w-6 bg-cyberpink rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side: Theme toggle + Admin */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {showAdmin && (
            <Link
              to="/admin"
              className="px-2 py-1 font-mono text-xs text-gray-700 hover:text-cyberpink/60 transition-colors"
              title="后台管理"
            >
              <i className="fa-solid fa-gear"></i>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="block md:hidden text-[var(--text-secondary)] hover:text-cyberpink transition-colors p-1"
          aria-label="Toggle menu"
        >
          <i className={`fa-solid text-lg transition-transform duration-300 ${menuOpen ? "fa-xmark rotate-90" : "fa-bars"}`}></i>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden border-t border-[var(--border-color)] bg-[var(--bg-primary)]/98 backdrop-blur-lg transition-all duration-300 ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-2">
          {siteConfig.navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`font-mono text-sm tracking-wide transition-all duration-200 px-3 py-2 rounded-lg ${
                  isActive
                    ? "text-cyberpink bg-cyberpink/10"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/20"
                }`}
              >
                <i className={`${link.icon} mr-2 text-xs`}></i>
                {link.label}
              </Link>
            );
          })}
          {showAdmin && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="font-mono text-sm tracking-wide transition-all duration-200 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:text-cyberpink/60"
            >
              <i className="fa-solid fa-gear mr-2 text-xs"></i>
              后台管理
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
