import { Link } from "react-router-dom";
import { siteConfig } from "../lib/siteConfig";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-cyberpink/20 overflow-hidden">
      <div className="diagonal-stripe absolute inset-0 opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyberpink/40 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="group font-orbitron text-lg tracking-widest hover:scale-105 transition-transform">
            <span className="text-cyberpink group-hover:animate-glow transition-all">&lt;</span>
            <span className="text-white">ASTRO</span>
            <span className="text-electric">BLOG</span>
            <span className="text-cyberpink group-hover:animate-glow transition-all">/&gt;</span>
          </Link>

          {/* Quick links */}
          <div className="flex items-center gap-6 font-mono text-xs text-gray-600">
            {siteConfig.navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="hover:text-cyberpink transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-5">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-cyberpink transition-all duration-300 hover:scale-110"
              aria-label="GitHub"
            >
              <i className="fa-brands fa-github text-lg"></i>
            </a>
            <a
              href={siteConfig.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-electric transition-all duration-300 hover:scale-110"
              aria-label="Twitter"
            >
              <i className="fa-brands fa-x-twitter text-lg"></i>
            </a>
            <a
              href={siteConfig.social.email}
              className="text-gray-500 hover:text-cyberpink transition-all duration-300 hover:scale-110"
              aria-label="Email"
            >
              <i className="fa-solid fa-envelope text-lg"></i>
            </a>
            <a
              href={`${siteConfig.siteUrl}/sitemap.xml`}
              className="text-gray-500 hover:text-electric transition-all duration-300 hover:scale-110"
              aria-label="RSS"
            >
              <i className="fa-solid fa-rss text-lg"></i>
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-navy/20 pt-6 text-center">
          <p className="font-mono text-[10px] text-gray-600 tracking-wider">
            <i className="fa-solid fa-code mr-2 text-cyberpink/50"></i>
            Designed &amp; Built with{" "}
            <span className="text-cybergreen animate-pulse">♥</span> · Powered by CloudBase · React + TypeScript
          </p>
          <p className="mt-2 font-mono text-[10px] text-gray-700 tracking-widest">
            <span className="text-cyberpink animate-flicker">COPYRIGHT © {currentYear}</span> {siteConfig.title} · ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
