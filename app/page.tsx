"use client";

import { useMemo, useRef, useState } from "react";

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
  const [prepared, setPrepared] = useState(false);
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");
  const [message, setMessage] = useState("");
  const libraryInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

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
    setPrepared(false);
    setMessage("");
  }

  const prompt = useMemo(() => `Use the attached Model 01 turnaround and hairstyle board as identity references. Use the third attached image as the exact product reference.

Create the same adult woman wearing or using the product. Preserve her facial geometry, apparent age 22–26, warm fair skin tone, eyes, nose, lips, neck, slender build, and body proportions. Use hairstyle ${hair}: ${selectedHair?.[1] ?? hair}. Do not change her identity, ethnicity, age, or body shape.

Preserve the product's exact color, material, construction, proportions, print, and logo placement. Keep it unobstructed and visually prominent.

Background: ${background}. ${note ? `Additional direction: ${note}.` : "Choose lighting and colors that complement the product."}

Generate one photorealistic vertical 9:16 TikTok affiliate lifestyle image. Natural anatomy and hands. No text, watermark, interface elements, or additional products.`, [background, hair, note, selectedHair]);

  async function assetFile(path: string, name: string) {
    const blob = await (await fetch(path)).blob();
    return new File([blob], name, { type: blob.type || "image/png" });
  }

  async function prepareForChatGPT() {
    if (!product) {
      setMessage("Add a clear product image first.");
      return;
    }
    setStatus("working");
    setMessage("Preparing your Model 01 handoff…");
    try {
      await navigator.clipboard.writeText(prompt);
      const files = [
        await assetFile("/model-01/turnaround.png", "model-01-turnaround.png"),
        await assetFile("/model-01/hairstyles.png", "model-01-hairstyles.png"),
        new File([product], product.name || "product.png", { type: product.type }),
      ];
      setPrepared(true);
      if (navigator.share && navigator.canShare?.({ files })) {
        setMessage("Prompt copied. Choose ChatGPT in the share sheet, then paste the prompt.");
        await navigator.share({ files, title: "Model 01 generation references" });
      } else {
        files.slice(0, 2).forEach((file) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(file);
          link.download = file.name;
          link.click();
          setTimeout(() => URL.revokeObjectURL(link.href), 2000);
        });
        setMessage("Prompt copied and references downloaded. Open ChatGPT, attach all three images, then paste.");
        window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer");
      }
      setStatus("idle");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("idle");
        setMessage("Sharing cancelled. Tap again when ready.");
        return;
      }
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not prepare the ChatGPT handoff.");
    }
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setPrepared(true);
    setMessage("Prompt copied. Paste it into ChatGPT after attaching the three images.");
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
          <div className={`dropzone ${preview ? "hasImage" : ""}`}>
            {preview ? <img src={preview} alt="Selected product" /> : <><strong>＋</strong><b>Choose product image</b><small>JPG, PNG or WebP</small></>}
            {preview && <span className="replace">Ready to use</span>}
          </div>
          <div className="sourceButtons">
            <button type="button" onClick={() => libraryInput.current?.click()}><b>Photo library / Files</b><span>Choose an image on this device</span></button>
            <button type="button" onClick={() => cameraInput.current?.click()}><b>Take a photo</b><span>Use the rear camera</span></button>
          </div>
          <input ref={libraryInput} className="hiddenFile" type="file" accept="image/png,image/jpeg,image/webp,image/heic,image/heif" onChange={(event) => chooseProduct(event.target.files?.[0])} />
          <input ref={cameraInput} className="hiddenFile" type="file" accept="image/*" capture="environment" onChange={(event) => chooseProduct(event.target.files?.[0])} />

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

          <button className="generate" onClick={prepareForChatGPT} disabled={status === "working"}>
            {status === "working" ? "Preparing…" : "Share to ChatGPT"}<span>No API key</span>
          </button>
          {message && <p className={`message ${status === "error" ? "error" : ""}`}>{message}</p>}
        </div>

        <div className="panel resultPanel">
          <div className="resultTitle"><div><b>ChatGPT handoff</b><small>Model 01 · {hair} · 9:16</small></div><span className="statusDot">{prepared ? "Prepared" : "No API key"}</span></div>
          <div className="handoff">
            <div className="handoffFiles">
              <span><img src="/model-01/turnaround.png" alt="Model turnaround attachment" /><b>Identity</b></span>
              <span><img src="/model-01/hairstyles.png" alt="Hairstyle board attachment" /><b>Hair board</b></span>
              <span className={preview ? "readyFile" : ""}>{preview ? <img src={preview} alt="Product attachment" /> : <i>＋</i>}<b>Product</b></span>
            </div>
            <div className="handoffSteps"><b>On your phone</b><span><i>1</i> Tap “Share to ChatGPT”</span><span><i>2</i> Choose ChatGPT in the share sheet</span><span><i>3</i> Paste the copied prompt and send</span></div>
            <div className="promptPreview"><span>Prepared prompt</span><p>{prompt}</p></div>
          </div>
          <div className="actions"><button onClick={copyPrompt}>Copy prompt only</button><a href="https://chatgpt.com/" target="_blank" rel="noreferrer">Open ChatGPT</a></div>
          <div className="checklist"><b>Before posting</b><span>✓ Face consistency</span><span>✓ Product details</span><span>✓ Background fit</span><span>Remember TikTok’s AI-generated media label.</span></div>
        </div>
      </section>
      <footer>No API key required. Your images are handed directly to the ChatGPT app through your device.</footer>
    </main>
  );
}
