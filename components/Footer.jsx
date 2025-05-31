import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-[#0f2027] via-[#2c5364] to-[#00c6ff] py-4 px-4 rounded-t-2xl shadow-[0_-2px_24px_0_rgba(0,255,255,0.10)]">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">
        {/* Brand and socials */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-orbitron font-extrabold text-lg text-cyan-300 tracking-widest drop-shadow-[0_0_8px_#00fff7]">
            HostClip
          </span>
          <div className="flex gap-4 mt-1">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-200 hover:text-cyan-400 transition-colors duration-200 text-lg"
              aria-label="GitHub"
            >
              <svg width="22" height="22" fill="currentColor" className="inline-block align-middle">
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.49 2.87 8.3 6.84 9.64.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.04A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.32 2.75-1.04 2.75-1.04.55 1.4.2 2.44.1 2.7.64.71 1.03 1.62 1.03 2.74 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
              </svg>
            </a>
            <a
              href="mailto:contact@hostclip.com"
              className="text-cyan-200 hover:text-cyan-400 transition-colors duration-200 text-lg"
              aria-label="Email"
            >
              <svg width="22" height="22" fill="currentColor" className="inline-block align-middle">
                <path d="M2 6.75A2.75 2.75 0 0 1 4.75 4h14.5A2.75 2.75 0 0 1 22 6.75v10.5A2.75 2.75 0 0 1 19.25 20H4.75A2.75 2.75 0 0 1 2 17.25V6.75zm2.75-.25a.75.75 0 0 0-.75.75v.217l8 5.2 8-5.2V7.25a.75.75 0 0 0-.75-.75H4.75zm15.25 2.383-7.47 4.857a1 1 0 0 1-1.06 0L4 8.883V17.25c0 .414.336.75.75.75h14.5a.75.75 0 0 0 .75-.75V8.883z" />
              </svg>
            </a>
          </div>
        </div>
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 text-xs mt-2">
          <Link href="/" className="text-cyan-100 hover:text-cyan-300 transition-colors duration-150">Home</Link>
          <Link href="/about" className="text-cyan-100 hover:text-cyan-300 transition-colors duration-150">About</Link>
          <Link href="/blogs" className="text-cyan-100 hover:text-cyan-300 transition-colors duration-150">Blogs</Link>
          <Link href="/features" className="text-cyan-100 hover:text-cyan-300 transition-colors duration-150">Features</Link>
          <Link href="/faq" className="text-cyan-100 hover:text-cyan-300 transition-colors duration-150">FAQ</Link>
          <Link href="/pricing" className="text-cyan-100 hover:text-cyan-300 transition-colors duration-150">Pricing</Link>
          <Link href="/clipboard/new" className="text-cyan-100 hover:text-cyan-300 transition-colors duration-150">New Clipboard</Link>
          <Link href="/settings" className="text-cyan-100 hover:text-cyan-300 transition-colors duration-150">Settings</Link>
          <Link href="/support" className="text-cyan-100 hover:text-cyan-300 transition-colors duration-150">Support</Link>
          <Link href="/contact" className="text-cyan-100 hover:text-cyan-300 transition-colors duration-150">Contact</Link>
        </div>
        {/* Copyright */}
        <span className="text-cyan-100 text-xs mt-2 mb-1 text-center">
          &copy; {new Date().getFullYear()} HostClip. All rights reserved.
        </span>
      </div>
    </footer>
  );
}