"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getProvinces, getRegencies, registerKeluargaTunas } from "@/lib/api";
import type { Province, Regency } from "@/lib/types";
import { sanitize } from "@/lib/sanitize";

type FieldErrors = Partial<Record<string, string>>;

const ONLY_LETTERS = /^[\p{L}\s]+$/u;

function validate(form: {
  nama: string;
  jenis_kelamin: string;
  usia: string;
  email: string;
  province_id: string;
  regency_id: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.nama.trim()) {
    errors.nama = "Nama lengkap wajib diisi.";
  } else if (!ONLY_LETTERS.test(form.nama.trim())) {
    errors.nama = "Nama tidak boleh mengandung angka atau simbol.";
  }
  if (!form.jenis_kelamin) errors.jenis_kelamin = "Jenis kelamin wajib dipilih.";
  if (!form.usia) errors.usia = "Usia wajib diisi.";
  if (!form.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Format email tidak valid.";
  }
  if (!form.province_id) errors.province_id = "Provinsi wajib dipilih.";
  if (!form.regency_id) errors.regency_id = "Kabupaten/kota wajib dipilih.";
  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500 animate-[fadeIn_0.2s_ease]">
      <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {message}
    </p>
  );
}

function inputClass(error?: string) {
  return `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors ${
    error
      ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
  }`;
}

export default function DaftarKeluargaTunasPage() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  // Timestamp saat form pertama kali dimuat (untuk bot detection)
  const formOpenedAt = useRef(Math.floor(Date.now() / 1000));

  const [form, setForm] = useState({
    nama: "",
    jenis_kelamin: "" as "L" | "P" | "",
    usia: "",
    email: "",
    province_id: "",
    regency_id: "",
  });

  useEffect(() => {
    getProvinces().then((res) => setProvinces(res.data));
  }, []);

  function handleNamaChange(value: string) {
    // Blokir angka dan strip tag HTML secara langsung
    if (/\d/.test(value)) return;
    const clean = sanitize(value);
    setForm((f) => ({ ...f, nama: clean }));
    if (touched.nama) {
      const errs = validate({ ...form, nama: clean });
      setFieldErrors((prev) => ({ ...prev, nama: errs.nama }));
    }
  }

  function handleBlur(field: string) {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = validate(form);
    setFieldErrors((prev) => ({ ...prev, [field]: errs[field] }));
  }

  async function handleProvinceChange(provinceId: string) {
    setForm((f) => ({ ...f, province_id: provinceId, regency_id: "" }));
    setRegencies([]);
    setFieldErrors((prev) => ({ ...prev, province_id: undefined, regency_id: undefined }));
    if (!provinceId) return;
    setLoadingRegencies(true);
    try {
      const res = await getRegencies(parseInt(provinceId));
      setRegencies(res.data);
    } finally {
      setLoadingRegencies(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mark all as touched
    setTouched({ nama: true, jenis_kelamin: true, usia: true, email: true, province_id: true, regency_id: true });

    const errs = validate(form);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      await registerKeluargaTunas({
        nama: sanitize(form.nama),
        jenis_kelamin: form.jenis_kelamin as "L" | "P",
        usia: parseInt(form.usia),
        email: sanitize(form.email),
        province_id: parseInt(form.province_id),
        regency_id: parseInt(form.regency_id),
        website: "",          // honeypot — harus selalu kosong
        _ft: formOpenedAt.current, // form opened timestamp
      } as Parameters<typeof registerKeluargaTunas>[0]);
      setSuccess(true);
    } catch (err: unknown) {
      // Parse Laravel validation errors (422)
      const apiErr = err as { status?: number; errors?: Record<string, string[]> };
      if (apiErr.status === 422 && apiErr.errors) {
        const mapped: FieldErrors = {};
        for (const [key, messages] of Object.entries(apiErr.errors)) {
          mapped[key] = messages[0];
        }
        setFieldErrors(mapped);
        setTouched({ nama: true, jenis_kelamin: true, usia: true, email: true, province_id: true, regency_id: true });
      } else {
        setFieldErrors({ _global: "Terjadi kesalahan. Silakan coba lagi." });
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-gray-500 text-sm mb-7">
            Terima kasih! Kamu telah bergabung dengan Keluarga Tunas. Kami senang memiliki kamu di sini.
          </p>
          <Link
            href="/keluarga-tunas"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3 rounded-full transition-colors text-sm"
          >
            Kembali ke Keluarga Tunas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef9c3] py-14 px-4">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="max-w-xl mx-auto">
        <Link
          href="/keluarga-tunas"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Daftar Keluarga Tunas</h1>
          <p className="text-gray-400 text-sm mb-8">Isi formulir berikut untuk bergabung bersama kami.</p>

          {/* Global error */}
          {fieldErrors._global && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl bg-red-50 border border-red-200 px-4 py-4">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-red-600">{fieldErrors._global}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Honeypot — disembunyikan dari user, bot biasanya mengisi ini */}
            <div aria-hidden="true" className="absolute opacity-0 pointer-events-none -z-10 h-0 overflow-hidden">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => handleNamaChange(e.target.value)}
                  onBlur={() => handleBlur("nama")}
                  placeholder="Masukkan nama lengkap"
                  className={inputClass(touched.nama ? fieldErrors.nama : undefined)}
                />
                {touched.nama && !fieldErrors.nama && form.nama && (
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <FieldError message={touched.nama ? fieldErrors.nama : undefined} />
              {!fieldErrors.nama && (
                <p className="mt-1 text-[11px] text-gray-400">Hanya huruf dan spasi, tanpa angka.</p>
              )}
            </div>

            {/* Jenis Kelamin & Usia */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.jenis_kelamin}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, jenis_kelamin: e.target.value as "L" | "P" | "" }));
                    if (touched.jenis_kelamin) setFieldErrors((p) => ({ ...p, jenis_kelamin: undefined }));
                  }}
                  onBlur={() => handleBlur("jenis_kelamin")}
                  className={inputClass(touched.jenis_kelamin ? fieldErrors.jenis_kelamin : undefined) + " bg-white"}
                >
                  <option value="">Pilih</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
                <FieldError message={touched.jenis_kelamin ? fieldErrors.jenis_kelamin : undefined} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Usia <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={form.usia}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, usia: e.target.value }));
                    if (touched.usia) setFieldErrors((p) => ({ ...p, usia: undefined }));
                  }}
                  onBlur={() => handleBlur("usia")}
                  placeholder="Tahun"
                  min={1}
                  max={120}
                  className={inputClass(touched.usia ? fieldErrors.usia : undefined)}
                />
                <FieldError message={touched.usia ? fieldErrors.usia : undefined} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm((f) => ({ ...f, email: sanitize(e.target.value) }));
                  if (touched.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                }}
                onBlur={() => handleBlur("email")}
                placeholder="nama@email.com"
                className={inputClass(touched.email ? fieldErrors.email : undefined)}
              />
              <FieldError message={touched.email ? fieldErrors.email : undefined} />
            </div>

            {/* Provinsi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Provinsi <span className="text-red-500">*</span>
              </label>
              <select
                value={form.province_id}
                onChange={(e) => handleProvinceChange(e.target.value)}
                onBlur={() => handleBlur("province_id")}
                className={inputClass(touched.province_id ? fieldErrors.province_id : undefined) + " bg-white"}
              >
                <option value="">Pilih provinsi</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <FieldError message={touched.province_id ? fieldErrors.province_id : undefined} />
            </div>

            {/* Kabupaten/Kota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Kabupaten / Kota <span className="text-red-500">*</span>
              </label>
              <select
                value={form.regency_id}
                onChange={(e) => {
                  setForm((f) => ({ ...f, regency_id: e.target.value }));
                  if (touched.regency_id) setFieldErrors((p) => ({ ...p, regency_id: undefined }));
                }}
                onBlur={() => handleBlur("regency_id")}
                className={inputClass(touched.regency_id ? fieldErrors.regency_id : undefined) + " bg-white disabled:opacity-50"}
                disabled={!form.province_id || loadingRegencies}
              >
                <option value="">
                  {loadingRegencies ? "Memuat..." : !form.province_id ? "Pilih provinsi dahulu" : "Pilih kabupaten/kota"}
                </option>
                {regencies.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <FieldError message={touched.regency_id ? fieldErrors.regency_id : undefined} />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors text-sm mt-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Mendaftarkan...
                </>
              ) : "Daftar Sekarang"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
