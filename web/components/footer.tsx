import Link from "next/link";
import { Github, Twitter, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 text-sm">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <span className="text-white font-bold text-2xl mb-6 block">
              Ogaal
            </span>
            <p className="max-w-sm leading-relaxed mb-6">
              Building digital infrastructure for water security in the Horn of
              Africa. Open source and community driven.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:contact@ogaal.org"
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Platform Section */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/water-sources" className="hover:text-white transition">
                  Water Sources Map
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-white transition">
                  Report Issues
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link href="/ussd" className="hover:text-white transition">
                  USSD Simulator
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact Section */}
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
              Legal
            </h4>
            <ul className="space-y-3 mb-6">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
            </ul>

            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:contact@ogaal.org" className="hover:text-white transition">
                  contact@ogaal.org
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Somaliland</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-white font-bold mb-2">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest updates on water security and platform improvements.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2025 Ogaal Somaliland. All rights reserved.</p>
          <div className="mt-2 md:mt-0 flex items-center space-x-6 text-sm opacity-75">
            <span>Built with Next.js 16 & Tailwind</span>
            <span className="hidden md:block">•</span>
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  );
}