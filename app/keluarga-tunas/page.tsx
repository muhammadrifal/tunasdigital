import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getKeluargaTunasStats } from "@/lib/api";
import type { IslandStat } from "@/lib/types";
import CountUp from "@/components/ui/CountUp";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Keluarga Tunas",
  description:
    "Bergabunglah dengan Keluarga Tunas dan jadilah bagian dari gerakan keluarga digital Indonesia.",
};

export default async function KeluargaTunasPage() {
  const { data: stats } = await getKeluargaTunasStats();

  const topIslands = stats.islands.slice(0, 3);
  const bottomIslands = stats.islands.slice(3, 6);

  return (
    <div>
      {/* ── Hero (yellow bg) ─────────────────────────────────────────────────── */}
      {/* overflow-visible agar card bisa "keluar" ke bawah section */}
      <section className="relative bg-[#fcd34d] overflow-visible">
        <Image
          src="/images/keluarga-tunas-bg.png"
          alt=""
          fill
          className="object-cover object-center pointer-events-none select-none"
          priority
          aria-hidden
        />

        {/* Konten: spacer atas + card yang menjorok ke bawah lewat mb negatif */}
        <div className="relative z-10 flex flex-col items-center px-4 pt-16 pb-0">
          {/* Ruang agar bg image terlihat di atas card */}
          <div className="h-28 w-full" />

          {/* Card — -mb-24 membuat card "turun" 6rem ke dalam section orange */}
          <div className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-2xl w-full text-center -mb-24">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Keluarga Tunas</h1>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              Jadilah bagian dari{" "}
              <span className="font-bold text-gray-900">Keluarga Tunas</span> untuk
              mengakses konten eksklusif, mengikuti perkembangan PP Tunas, dan
              berkontribusi langsung dalam gerakan perlindungan anak di ruang digital
              bersama ekosistem Tunas Digital.
            </p>
            <p className="text-gray-900 font-bold text-sm mb-7">
              Yuk Bergabung Sekarang!
            </p>
            <Link
              href="/keluarga-tunas/daftar"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold px-7 py-3 rounded-full transition-colors text-sm"
            >
              Daftar Sekarang
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Map / Distribution (orange bg) ───────────────────────────────────── */}
      {/* pt-32 memberi ruang untuk bagian bawah card yang overlap */}
      <section className="bg-[#f97316] pt-32 pb-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-white mb-10">
            Peta Persebaran Keluarga Tunas
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {topIslands.map((island: IslandStat) => (
              <IslandCard key={island.id} island={island} />
            ))}
          </div>

          <div className="relative w-full my-4" style={{ aspectRatio: "1513/638" }}>
            <Image
              src="/images/peta-indonesia.png"
              alt="Peta Indonesia"
              fill
              className="object-contain"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {bottomIslands.map((island: IslandStat) => (
              <IslandCard key={island.id} island={island} />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
            <StatCard label="Keluarga Tunas Terdaftar" value={stats.total_agents} />
            <StatCard label="Provinsi" value={stats.total_provinces} />
            <StatCard label="Kabupaten & Kota" value={stats.total_regencies} />
          </div>
        </div>
      </section>
    </div>
  );
}

function IslandCard({ island }: { island: IslandStat }) {
  return (
    <div className="bg-[#7c3aed] rounded-xl px-4 py-5 text-center text-white">
      <p className="text-2xl sm:text-3xl font-bold">
        <CountUp value={island.count} />
      </p>
      <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80 mt-1">
        {island.name}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl px-6 py-6">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-500 mb-2">
        {label}
      </p>
      <p className="text-5xl font-black text-gray-900">
        <CountUp value={value} duration={2000} />
      </p>
    </div>
  );
}
