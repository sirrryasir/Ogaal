"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  AlertTriangle,
  Droplet,
  Calculator,
  Activity,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    title: "USSD Simulator",
    desc: "Test SMS/Phone interactions for offline users.",
    icon: Phone,
    href: "/ussd",
    color: "bg-purple-100 text-purple-600",
    delay: 0.1,
  },
  {
    title: "Drought AI",
    desc: "Early warning system powered by satellite weather data.",
    icon: AlertTriangle,
    href: "/drought-alerts",
    color: "bg-orange-100 text-orange-600",
    delay: 0.2,
  },
  {
    title: "Water Calculator",
    desc: "Smart usage planner for households and farms.",
    icon: Calculator,
    href: "/calculator",
    color: "bg-cyan-100 text-cyan-600",
    delay: 0.3,
  },
  {
    title: "Admin Portal",
    desc: "Manage sources, approve reports, and view logs.",
    icon: Droplet,
    href: "/admin",
    color: "bg-gray-100 text-gray-600",
    delay: 0.4,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-blue-700 text-white min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516937941348-c09645f8b927?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/90"></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-100 text-sm font-semibold mb-6 backdrop-blur-md">
              Somaliland Water Intelligence Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
              AquaGuard <br />
              <span className="text-blue-300">Resilience.</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-12 leading-relaxed">
              Monitoring water resources in real-time. Empowering communities
              with data-driven drought early warnings.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link
                href="/water-sources"
                className="px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Explore Live Map
              </Link>
              <Link
                href="/report"
                className="px-8 py-4 bg-blue-600/50 backdrop-blur-md text-white rounded-2xl font-bold hover:bg-blue-600/70 transition-all border border-blue-400/30 flex items-center justify-center gap-2"
              >
                <Activity className="w-5 h-5" />
                Report Issue
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats / Impact Banner (Placeholder for realism) */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 text-gray-500 font-medium text-sm md:text-base">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> 1,240
            Sources Monitored
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> 15 Regions
            Active
          </span>
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div> 3 Alerts
            Today
          </span>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="flex-1 max-w-7xl mx-auto py-20 px-6 sm:px-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Platform Modules
            </h2>
            <p className="text-gray-500 text-lg">
              Tools designed for community resilience
            </p>
          </div>
          <button className="text-blue-600 font-bold flex items-center hover:underline">
            View Documentation <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay }}
            >
              <Link
                href={feature.href}
                className="group block p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden h-full flex flex-col"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 mb-8 flex-1 leading-relaxed">
                  {feature.desc}
                </p>

                <div className="flex justify-end">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-400 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="col-span-1 md:col-span-2">
            <span className="text-white font-bold text-2xl mb-6 block">
              AquaGuard
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
                <Link href="#" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2025 AquaGuard Somaliland.</p>
          <p className="mt-2 md:mt-0 opacity-50">
            Built with Next.js 16 & Tailwind
          </p>
        </div>
      </footer>
    </div>
  );
}
