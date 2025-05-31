"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#0f2027] via-[#2c5364] to-[#00c6ff] shadow-lg px-4 sm:px-8 py-3 flex items-center justify-between rounded-b-2xl">
      <Link href="/" className="no-underline flex items-center">
        <span className="font-orbitron font-extrabold text-2xl sm:text-2xl md:text-4xl tracking-widest text-cyan-300 drop-shadow-[0_0_12px_#00fff7] hover:text-cyan-400 transition-colors duration-200">
          HostClip
        </span>
      </Link>
      <button
        className="sm:hidden flex flex-col justify-center items-center w-10 h-10 rounded hover:bg-cyan-900/30 transition"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`block w-6 h-0.5 bg-cyan-300 mb-1 transition-all duration-200 ${
            menuOpen ? "rotate-45 translate-y-1.5" : ""
          }`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-cyan-300 mb-1 transition-all duration-200 ${
            menuOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-cyan-300 transition-all duration-200 ${
            menuOpen ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        ></span>
      </button>

      <ul className="hidden sm:flex items-center gap-6 m-0 p-0 list-none">
        <li>
          <Link
            href="/"
            className="text-white font-bold text-base sm:text-lg md:text-xl tracking-wide hover:text-cyan-300 transition-colors duration-200 flex items-center"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="text-white font-bold text-base sm:text-lg md:text-xl tracking-wide hover:text-cyan-300 transition-colors duration-200 flex items-center"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/blogs"
            className="text-white font-bold text-base sm:text-lg md:text-xl tracking-wide hover:text-cyan-300 transition-colors duration-200 flex items-center"
          >
            Blogs
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className="text-white font-bold text-base sm:text-lg md:text-xl tracking-wide hover:text-cyan-300 transition-colors duration-200 flex items-center"
          >
            Contact
          </Link>
        </li>
      </ul>
      {/* Mobile menu */}
      {menuOpen && (
        <ul className="absolute top-full left-0 w-full bg-[#132c41] flex flex-col items-center gap-2 py-4 shadow-xl sm:hidden rounded-b-2xl animate-fade-in-down">
          <li>
            <Link
              href="/"
              className="block w-full text-center text-cyan-100 font-bold text-lg py-2 hover:text-cyan-300 transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className="block w-full text-center text-cyan-100 font-bold text-lg py-2 hover:text-cyan-300 transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="/blogs"
              className="block w-full text-center text-cyan-100 font-bold text-lg py-2 hover:text-cyan-300 transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Blogs
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="block w-full text-center text-cyan-100 font-bold text-lg py-2 hover:text-cyan-300 transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
