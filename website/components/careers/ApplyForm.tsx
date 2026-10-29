"use client";

import { useState, type FormEvent } from "react";

const MAX = 5 * 1024 * 1024;
const input = "mt-1.5 w-full rounded-xl border border-[#D9DDF3] bg-white px-4 py-3 text-[15px] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20";
const label = "block text-sm font-medium text-[#0F1330]";

export default function ApplyForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const file = data.get("resume");
    if (!(file instanceof File) || file.size === 0) return setError("Please attach your resume.");
    if (file.size > MAX) return setError("Your resume must be smaller than 5 MB.");
    data.set("job_id", jobId);

    setState("sending");
    try {
      const res = await fetch("/api/careers/apply", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.details?.[0] ?? json.error ?? "Something went wrong. Please try again.");
        setState("idle");
        return;
      }
      form.reset();
      setState("done");
    } catch {
      setError("Network error. Please try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-emerald-900">
        <p className="font-[family-name:var(--font-display)] text-xl font-bold">Application received</p>
        <p className="mt-2">Thank you for applying for {jobTitle}. We will review your details and get back to you.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-[#E4E7F5] bg-white p-7 shadow-[0_20px_60px_-40px_rgba(60,70,200,0.4)]" noValidate={false}>
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#0F1330]">Apply for this role</h2>

      <div className="mt-5 grid gap-x-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="a-name">Full name</label>
          <input id="a-name" name="name" required minLength={2} maxLength={100} autoComplete="name" className={input} />
        </div>
        <div>
          <label className={label} htmlFor="a-email">Email</label>
          <input id="a-email" name="email" type="email" required maxLength={200} autoComplete="email" className={input} />
        </div>
        <div className="mt-4 sm:col-span-2">
          <label className={label} htmlFor="a-phone">Phone (optional)</label>
          <input id="a-phone" name="phone" type="tel" maxLength={30} autoComplete="tel" className={input} />
        </div>
        <div className="mt-4 sm:col-span-2">
          <label className={label} htmlFor="a-cover">Cover letter (optional)</label>
          <textarea id="a-cover" name="cover_letter" rows={5} maxLength={3000} className={input} />
        </div>
        <div className="mt-4 sm:col-span-2">
          <label className={label} htmlFor="a-resume">Resume (PDF, DOC or DOCX, up to 5 MB)</label>
          <input id="a-resume" name="resume" type="file" required accept=".pdf,.doc,.docx,application/pdf" className="mt-1.5 block w-full text-sm" />
        </div>
      </div>

      {/* Honeypot: hidden from people, bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-6 rounded-full bg-gradient-to-r from-[#3B5BFF] to-[#7C3AED] px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(91,70,255,0.65)] transition-opacity disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Submit application"}
      </button>
    </form>
  );
}
