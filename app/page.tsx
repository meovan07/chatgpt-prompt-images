"use client";

import { useMemo, useState } from "react";

const HAIRS = [
  ["H01", "Sleek straight", "Clean & minimal"],
  ["H02", "Korean waves", "Soft & romantic"],
  ["H03", "Low ponytail", "Elegant"],
  ["H04", "High ponytail", "Active & youthful"],
  ["H05", "Half-up", "Versatile"],
  ["H06", "Low bun", "Polished"],
] as const;

const BACKGROUNDS = ["Auto match product", "Minimal studio", "Modern café", "Clean bedroom", "City street", "Warm home"];

export default function Home() {
  const [product, setProduct] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [hair, setHair] = useState("H02");
  const [background, setBackground] = useState(BACKGROUNDS[0]);
  const [note, setNote] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
  const [message, setMessage] = useState("");

  const selectedHair = useMemo(() => HAIRS.find((item) => item[0] === hair), [hair]);

  function chooseProduct(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please choose a JPG, PNG, or WebP product image.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setProduct(file);
    setPreview(URL.createObjectURL(file));
    setResult("");
    setMessage("");
  }

  async function generate() {
    if (!product) {
      setMessage("Add a clear product image first.");
      return;
    }
    setStatus("working");
    setMessage("Locking Model 01 identity and matching the product…");
    try {
      const form = new FormData();
      form.append("product", product);
      form.append("hair", hair);
      form.append("hairName", selectedHair?.[1] ?? hair);
      form.append("background", background);
      form.append("note", note);
      const response = await fetch("/api/generate", { method: "POST", body: form });
      const data = await response.json() as { image?: string; error?: string };
      if (!response.ok || !data.image) throw new Error(data.error || "Generation failed");
      setResult(data.image);
      setMessage("Ready — review product details before publishing.");
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Generation failed. Please try again.");
    }
  }

  async function saveToDrive() {
    if (!result) return;
    const blob = await (await fetch(result)).blob();
    const file = new File([blob], `model-01-${hair}-${Date.now()}.png`, { type: "image/png" });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: "Model 01 affiliate creative" });
      return;
    }
    const anchor = document.createElement("a");
    anchor.href = result;
    anchor.download = file.name;
    anchor.click();
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="brandMark">M1</span><span>Model Studio</span></div>
        <div className="secure"><span /> Private workspace</div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">TIKTOK AFFILIATE CREATOR</p>
          <h1>One model.<br /><em>Every product.</em></h1>
          <p className="subhead">Upload a product, choose a hairstyle, and create a consistent 9:16 image with Model 01.</p>
        </div>
        <div className="modelCard">
          <img src="/model-01/turnaround.png" alt="Model 01 reference views" />
          <div><b>MODEL 01</b><span>Identity locked</span></div>
        </div>
      </section>

      <section className="workspace">
        <div className="panel controls">
          <div className="step"><span>1</span><div><b>Add the product</b><small>Use a clear front-facing image</small></div></div>
          <label className={`dropzone ${preview ? "hasImage" : ""}`}>
            {preview ? <img src={preview} alt="Selected product" /> : <><strong>＋</strong><b>Choose product image</b><small>JPG, PNG or WebP</small></>}
            <input type="file" accept="image/*" capture="environment" onChange={(event) => chooseProduct(event.target.files?.[0])} />
            {preview && <span className="replace">Replace</span>}
          </label>

          <div className="step"><span>2</span><div><b>Choose the hair</b><small>The face and body stay locked</small></div></div>
          <div className="hairGrid">
            {HAIRS.map(([id, name, vibe], index) => (
              <button key={id} className={hair === id ? "selected" : ""} onClick={() => setHair(id)}>
                <span className="hairCrop" style={{ backgroundPosition: `${(index % 3) * 50}% ${index < 3 ? "0%" : "100%"}` }} />
                <b>{id} · {name}</b><small>{vibe}</small>
              </button>
            ))}
          </div>

          <div className="step"><span>3</span><div><b>Set the scene</b><small>Auto match is recommended</small></div></div>
          <select value={background} onChange={(event) => setBackground(event.target.value)} aria-label="Background style">
            {BACKGROUNDS.map((item) => <option key={item}>{item}</option>)}
          </select>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional: pose, mood, or product detail to emphasize" maxLength={300} />

          <button className="generate" onClick={generate} disabled={status === "working"}>
            {status === "working" ? "Generating…" : "Generate TikTok image"}<span>9:16 · high fidelity</span>
          </button>
          {message && <p className={`message ${status === "error" ? "error" : ""}`}>{message}</p>}
        </div>

        <div className="panel resultPanel">
          <div className="resultTitle"><div><b>Your creative</b><small>Model 01 · {hair} · 9:16</small></div><span className="statusDot">{result ? "Ready" : "Preview"}</span></div>
          <div className={`canvas ${result ? "complete" : ""}`}>
            {result ? <img src={result} alt="Generated Model 01 product creative" /> : <div className="empty"><div className="phoneFrame"><span>9:16</span></div><b>Your result appears here</b><small>Add a product and tap Generate</small></div>}
          </div>
          {result && <div className="actions"><button onClick={saveToDrive}>Save / share to Drive</button><a href={result} download={`model-01-${hair}.png`}>Download</a></div>}
          <div className="checklist"><b>Before posting</b><span>✓ Face consistency</span><span>✓ Product details</span><span>✓ Background fit</span><span>Remember TikTok’s AI-generated media label.</span></div>
        </div>
      </section>
      <footer>Model 01 references are applied automatically. Product images are used only for your generation request.</footer>
    </main>
  );
}
