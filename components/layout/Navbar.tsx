"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import type { SiteSettings } from "@/lib/types";

const BERANDA_DROPDOWN = [
  { label: "Tentang PP Tunas", href: "/tentang-pp-tunas" },
  { label: "Perkembangan Anak", href: "/#tahapan-usia" },
  { label: "Orang Tua", href: "/#orang-tua" },
  { label: "Sekolah", href: "/#peran-sekolah" },
  { label: "Tunas Kolektif", href: "/#komunitas" },
  { label: "Cerita Tunas", href: "/#cerita-tunas" },
  { label: "Publikasi", href: "/#pustaka-tunas" },
  { label: "Mitra Tunas", href: "/#mitra-tunas" },
  { label: "Kontak Aduan", href: "/#kontak-aduan" },
];

const NAV_LINKS = [
  { label: "Orang Tua", href: "/orang-tua" },
  { label: "Anak", href: "/anak" },
  { label: "Sekolah", href: "/sekolah" },
  { label: "Tunas Kolektif", href: "/tunas-kolektif" },
  { label: "Cerita Tunas", href: "/cerita-tunas" },
  { label: "Pustaka", href: "/pustaka" },
];

export default function Navbar({ settings }: { settings: SiteSettings }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileBerandaOpen, setMobileBerandaOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            {settings.logo_url ? (
              <Image
                src={settings.logo_url}
                alt={settings.site_name}
                width={120}
                height={40}
                className="h-9 w-auto object-contain"
              />
            ) : (
              <span className="text-xl font-bold text-orange-500">
                {settings.site_name}
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">

            {/* Beranda with dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-orange-500 hover:bg-orange-50 ${
                  pathname === "/" ? "text-orange-500" : "text-gray-700"
                }`}
              >
                Beranda
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 rounded-2xl bg-white shadow-lg border border-gray-100 py-2 z-50">
                  <Link
                    href="/"
                    onClick={() => setDropdownOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-orange-50 hover:text-orange-500 ${
                      pathname === "/" ? "text-orange-500 font-medium" : "text-gray-700"
                    }`}
                  >
                    Beranda
                  </Link>
                  <div className="my-1 border-t border-gray-100" />
                  {BERANDA_DROPDOWN.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-orange-50 hover:text-orange-500 ${
                        isActive(item.href) ? "text-orange-500 font-medium" : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Main nav links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-orange-500 hover:bg-orange-50 ${
                  isActive(link.href) ? "text-orange-500" : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/keluarga-tunas"
              className="hidden md:inline-flex items-center px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              Gabung Keluarga Tunas
            </Link>

            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">

          {/* Beranda accordion */}
          <div>
            <button
              onClick={() => setMobileBerandaOpen((v) => !v)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/" ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Beranda
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${mobileBerandaOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {mobileBerandaOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-orange-100 pl-3">
                <Link
                  href="/"
                  onClick={() => { setMobileOpen(false); setMobileBerandaOpen(false); }}
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === "/" ? "text-orange-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Beranda
                </Link>
                {BERANDA_DROPDOWN.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => { setMobileOpen(false); setMobileBerandaOpen(false); }}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(item.href) ? "text-orange-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Main links */}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href) ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2">
            <Link
              href="/keluarga-tunas"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-4 py-2.5 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              Gabung Keluarga Tunas
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
