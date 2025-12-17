import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
        <div className="col-span-1 md:col-span-2">
          <span className="text-white font-bold text-2xl mb-6 block">
            Ogaal
          </span>
          <p className="max-w-xs leading-relaxed">
            Building digital infrastructure for water security in the Horn of
            Africa. Open source and community driven.
          </p>
        </div>
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
                API Access
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition">
                Community
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
            Legal
          </h4>
          <ul className="space-y-3">
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
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
        <p>&copy; 2025 Ogaal Somaliland.</p>
        <p className="mt-2 md:mt-0 opacity-50">
          Built with Next.js 16 & Tailwind
        </p>
      </div>
    </footer>
  );
}