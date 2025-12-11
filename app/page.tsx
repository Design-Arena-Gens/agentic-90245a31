"use client";

import { FormEvent, useRef, useState } from "react";

type UploadSummary = {
  videoTitle: string;
  videoDescription: string;
  tags: string[];
  hashtags: string[];
  thumbnailPrompt?: string;
  scheduledAt?: string | null;
  videoId?: string;
  videoUrl?: string;
};

type ApiResponse =
  | { success: true; summary: UploadSummary }
  | { success: false; error: string };

const categories = [
  { key: "tech", label: "Technology" },
  { key: "vlog", label: "Vlog" },
  { key: "shorts", label: "Shorts" },
  { key: "gaming", label: "Gaming" },
  { key: "tutorial", label: "Tutorial" }
];

const monetizationOptions = [
  { key: "monetized", label: "Enable monetization" },
  { key: "non-monetized", label: "Do not monetize" }
];

export default function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<UploadSummary | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSummary(null);

    const formData = new FormData(event.currentTarget);
    const hasVideoFile = (formData.get("videoFile") as File | null)?.size;
    const videoLink = (formData.get("videoLink") as string)?.trim();

    if (!hasVideoFile && !videoLink) {
      setError("Provide either a video file or a video link.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const payload: ApiResponse = await response.json();

      if (!response.ok || !payload.success) {
        setError(payload.success ? "Upload failed." : payload.error);
        return;
      }

      setSummary(payload.summary);
      formRef.current?.reset();
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Unexpected error while uploading."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 24px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          display: "grid",
          gap: "32px"
        }}
      >
        <section
          style={{
            background:
              "linear-gradient(135deg, rgba(34,211,238,0.08), rgba(14,165,233,0.16))",
            borderRadius: 24,
            padding: "32px 36px",
            border: "1px solid rgba(148,163,184,0.24)",
            boxShadow: "0 20px 60px rgba(15,118,110,0.25)"
          }}
        >
          <header style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                marginBottom: 8
              }}
            >
              Agentic YouTube Upload Assistant
            </h1>
            <p
              style={{
                color: "rgba(226,232,240,0.8)",
                maxWidth: 600,
                lineHeight: 1.6
              }}
            >
              Provide your video asset or link, choose category, language,
              monetization, and optional schedule. The agent will generate SEO
              metadata, craft thumbnail prompt, and push the upload to YouTube.
            </p>
          </header>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: 24
            }}
          >
            <fieldset
              style={{
                border: "1px solid rgba(148,163,184,0.24)",
                borderRadius: 16,
                padding: 24,
                display: "grid",
                gap: 16
              }}
            >
              <legend style={{ padding: "0 12px", fontWeight: 600 }}>
                Source
              </legend>
              <label
                style={{
                  display: "grid",
                  gap: 8
                }}
              >
                <span style={{ fontWeight: 500 }}>Video file</span>
                <input
                  type="file"
                  name="videoFile"
                  accept="video/*"
                  style={{
                    backgroundColor: "rgba(15,23,42,0.6)",
                    border: "1px dashed rgba(148,163,184,0.3)",
                    padding: "12px",
                    borderRadius: 12,
                    cursor: "pointer"
                  }}
                />
              </label>
              <span style={{ textAlign: "center", color: "rgba(148,163,184,0.8)" }}>
                or
              </span>
              <label
                style={{
                  display: "grid",
                  gap: 8
                }}
              >
                <span style={{ fontWeight: 500 }}>Video link</span>
                <input
                  type="url"
                  name="videoLink"
                  placeholder="https://..."
                  style={{
                    backgroundColor: "rgba(15,23,42,0.6)",
                    border: "1px solid rgba(148,163,184,0.3)",
                    padding: "12px 16px",
                    borderRadius: 12,
                    color: "#e2e8f0"
                  }}
                />
              </label>
            </fieldset>

            <fieldset
              style={{
                border: "1px solid rgba(148,163,184,0.24)",
                borderRadius: 16,
                padding: 24,
                display: "grid",
                gap: 16
              }}
            >
              <legend style={{ padding: "0 12px", fontWeight: 600 }}>
                Metadata Controls
              </legend>
              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 500 }}>Category</span>
                <select
                  name="category"
                  required
                  defaultValue=""
                  style={{
                    backgroundColor: "rgba(15,23,42,0.6)",
                    border: "1px solid rgba(148,163,184,0.3)",
                    padding: "12px 16px",
                    borderRadius: 12,
                    color: "#e2e8f0"
                  }}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((category) => (
                    <option key={category.key} value={category.key}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 500 }}>Language</span>
                <input
                  name="language"
                  placeholder="English, Spanish..."
                  required
                  style={{
                    backgroundColor: "rgba(15,23,42,0.6)",
                    border: "1px solid rgba(148,163,184,0.3)",
                    padding: "12px 16px",
                    borderRadius: 12,
                    color: "#e2e8f0"
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 500 }}>Monetization preference</span>
                <select
                  name="monetization"
                  required
                  defaultValue="monetized"
                  style={{
                    backgroundColor: "rgba(15,23,42,0.6)",
                    border: "1px solid rgba(148,163,184,0.3)",
                    padding: "12px 16px",
                    borderRadius: 12,
                    color: "#e2e8f0"
                  }}
                >
                  {monetizationOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontWeight: 500 }}>
                  Schedule time (optional, ISO or local)
                </span>
                <input
                  type="datetime-local"
                  name="schedule"
                  style={{
                    backgroundColor: "rgba(15,23,42,0.6)",
                    border: "1px solid rgba(148,163,184,0.3)",
                    padding: "12px 16px",
                    borderRadius: 12,
                    color: "#e2e8f0"
                  }}
                />
              </label>
            </fieldset>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(236,72,153,0.9))",
                border: "none",
                padding: "14px 20px",
                borderRadius: 14,
                fontWeight: 600,
                fontSize: "1rem",
                color: "#f8fafc",
                cursor: isSubmitting ? "wait" : "pointer",
                transition: "transform 0.2s ease",
                opacity: isSubmitting ? 0.6 : 1
              }}
            >
              {isSubmitting ? "Uploading..." : "Generate & Upload"}
            </button>
          </form>
          {error && (
            <p
              style={{
                marginTop: 16,
                color: "#f87171",
                fontWeight: 500
              }}
            >
              {error}
            </p>
          )}
        </section>

        {summary && (
          <section
            style={{
              backgroundColor: "rgba(15,23,42,0.72)",
              border: "1px solid rgba(148,163,184,0.24)",
              borderRadius: 24,
              padding: 32,
              display: "grid",
              gap: 18
            }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
              Upload Summary
            </h2>
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <span style={{ fontWeight: 600 }}>Video Title:</span>
                <p style={{ marginTop: 6 }}>{summary.videoTitle}</p>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Video Description:</span>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    marginTop: 6,
                    padding: 16,
                    backgroundColor: "rgba(30,41,59,0.7)",
                    borderRadius: 12,
                    border: "1px solid rgba(148,163,184,0.16)"
                  }}
                >
                  {summary.videoDescription}
                </pre>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Tags:</span>
                <p style={{ marginTop: 6 }}>{summary.tags.join(", ")}</p>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Hashtags:</span>
                <p style={{ marginTop: 6 }}>
                  {summary.hashtags.map((tag) => `#${tag}`).join(" ")}
                </p>
              </div>
              {summary.thumbnailPrompt && (
                <div>
                  <span style={{ fontWeight: 600 }}>Thumbnail prompt:</span>
                  <p style={{ marginTop: 6 }}>{summary.thumbnailPrompt}</p>
                </div>
              )}
              <div>
                <span style={{ fontWeight: 600 }}>Scheduled time:</span>
                <p style={{ marginTop: 6 }}>
                  {summary.scheduledAt ?? "Immediate"}
                </p>
              </div>
              {summary.videoUrl && (
                <div>
                  <span style={{ fontWeight: 600 }}>YouTube link:</span>
                  <p style={{ marginTop: 6 }}>
                    <a
                      href={summary.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "rgba(56,189,248,0.9)" }}
                    >
                      {summary.videoUrl}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
