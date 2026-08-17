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

const CATEGORIES = ["Fashion / clothing", "Beauty / skincare", "Bag / accessories", "Shoes", "Home / lifestyle", "Fitness"];

const VIBES = {
  "Auto style director": "Study the product's color, material, price positioning, and intended customer. Select a coherent location, palette, lighting, styling, and camera treatment that make the product feel desirable without competing with it.",
  "Soft feminine": "Airy editorial setting in blush, cream, or warm neutral tones; delicate daylight; subtle floral or fabric texture; romantic but uncluttered; soft highlights and graceful movement.",
  "Clean luxury": "Quiet-luxury interior or refined minimal studio; stone, warm ivory, walnut, or brushed metal accents; controlled directional light; premium editorial composition with generous negative space.",
  "Korean casual": "Bright modern Seoul-inspired café, apartment, or clean street; milky daylight; pale wood and soft neutral palette; candid youthful styling with a polished smartphone-photo finish.",
  "Urban street": "Contemporary city architecture, clean concrete and glass, directional late-afternoon light; confident editorial framing; energetic but the background remains softly separated from the product.",
  "Cozy lifestyle": "Warm lived-in home with natural wood, linen, and soft window light; authentic everyday moment; comfortable and approachable, with carefully controlled clutter.",
  "Active energy": "Bright fitness studio or clean outdoor active setting; crisp daylight, fresh color accents, dynamic composition, and believable movement without motion blur on the product.",
} as const;

const POSES = {
  "Auto match vibe": "Choose a natural, commercially effective pose that fits the product and selected vibe. The pose must reveal the product clearly and avoid covering important details.",
  "Walking candid": "Mid-step candid walk, relaxed shoulders, natural arm swing, subtle gaze away from camera; garment and hair show gentle believable movement.",
  "Confident editorial": "Balanced contrapposto stance, one leg slightly forward, elongated posture, confident direct gaze, one hand relaxed while the other interacts naturally with the product.",
  "Soft graceful": "Gentle three-quarter body angle, relaxed wrists, slight head tilt, calm expression, elegant S-curve without exaggerated anatomy.",
  "Product close-up": "Three-quarter crop with the product closest to camera, held or worn naturally; face remains visible while product construction and texture are the visual priority.",
  "Everyday action": "A believable use moment appropriate to the product—adjusting a strap, smoothing fabric, applying or holding the item—captured between poses rather than staged.",
} as const;

export default function Home() {
  const [product, setProduct] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [hair, setHair] = useState("H02");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [vibe, setVibe] = useState<keyof typeof VIBES>("Auto style director");
  const [pose, setPose] = useState<keyof typeof POSES>("Auto match vibe");
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

Product category: ${category}.

Creative direction — ${vibe}: ${VIBES[vibe]}

Pose direction — ${pose}: ${POSES[pose]}

Make the environment, lighting, hair movement, expression, camera height, lens perspective, and pose feel like one coherent campaign. Match background colors to the product using complementary or tonal contrast; do not place a product against a similar-value background where its silhouette disappears. Keep background detail secondary with realistic depth separation. ${note ? `Additional direction: ${note}.` : "Prioritize an authentic, aspirational lifestyle moment rather than a rigid catalog pose."}

Generate one photorealistic vertical 9:16 TikTok affiliate lifestyle image. Use an eye-level or slightly low camera angle that flatters the product. Natural anatomy and hands. No text, watermark, interface elements, or additional products.`, [category, hair, note, pose, selectedHair, vibe]);

  async function assetFile(path: string, name: string) {
    const blob = await (await fetch(path)).blob();
    return new File([blob], name, { type: blob.type || "image/png" });
  }

  async function copyTextBestEffort(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      return copied;
    }
  }

  function downloadFile(file: File) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 2000);
  }

  async function prepareForChatGPT() {
    if (!product) {
      setMessage("Add a clear product image first.");
      return;
    }
    setStatus("working");
    setMessage("Preparing your Model 01 handoff…");
    try {
      const copied = await copyTextBestEffort(prompt);
      const files = [
        await assetFile("/model-01/turnaround.png", "model-01-turnaround.png"),
        await assetFile("/model-01/hairstyles.png", "model-01-hairstyles.png"),
        new File([product], product.name || "product.png", { type: product.type }),
      ];
      setPrepared(true);
      if (navigator.share && navigator.canShare?.({ files })) {
        try {
          setMessage(`${copied ? "Prompt copied. " : "Prompt is ready below. "}Choose ChatGPT in the share sheet.`);
          await navigator.share({ files, title: "Model 01 generation references" });
        } catch (shareError) {
          if (shareError instanceof DOMException && shareError.name === "AbortError") {
            setStatus("idle");
            setMessage("Sharing cancelled. Use the fallback buttons below when ready.");
            return;
          }
          files.slice(0, 2).forEach(downloadFile);
          setMessage(`${copied ? "Prompt copied" : "Select the prompt below and copy it"}. Sharing is blocked here, so the two references were downloaded. Attach them and your product in ChatGPT.`);
        }
      } else {
        files.slice(0, 2).forEach(downloadFile);
        setMessage(`${copied ? "Prompt copied" : "Select the prompt below and copy it"}. References downloaded. Open ChatGPT and attach them with your product.`);
      }
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not prepare the ChatGPT handoff.");
    }
  }

  async function copyPrompt() {
    const copied = await copyTextBestEffort(prompt);
    setPrepared(true);
    setMessage(copied ? "Prompt copied. Paste it into ChatGPT after attaching the three images." : "Copying is blocked here. Press and hold the prompt text, then choose Select All → Copy.");
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

          <div className="step"><span>3</span><div><b>Direct the vibe</b><small>Background, lighting and pose work together</small></div></div>
          <div className="directionFields">
            <label><span>Product type</span><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Product category">{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Visual vibe</span><select value={vibe} onChange={(event) => setVibe(event.target.value as keyof typeof VIBES)} aria-label="Visual vibe">{Object.keys(VIBES).map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
          <div className="poseLabel">Pose direction</div>
          <div className="poseGrid">{Object.keys(POSES).map((item) => <button type="button" key={item} className={pose === item ? "selected" : ""} onClick={() => setPose(item as keyof typeof POSES)}>{item}</button>)}</div>
          <div className="sceneBrief"><b>{vibe} × {pose}</b><span>{VIBES[vibe]} {POSES[pose]}</span></div>
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
            <div className="promptPreview"><span>Prepared prompt — press and hold to copy manually</span><textarea readOnly value={prompt} aria-label="Prepared ChatGPT prompt" /></div>
          </div>
          <div className="actions"><button onClick={copyPrompt}>Copy prompt</button><a href="https://chatgpt.com/" target="_blank" rel="noreferrer">Open ChatGPT</a></div>
          <div className="downloadRefs"><span>Blocked sharing?</span><a href="/model-01/turnaround.png" download>Download identity</a><a href="/model-01/hairstyles.png" download>Download hair board</a></div>
          <div className="checklist"><b>Before posting</b><span>✓ Face consistency</span><span>✓ Product details</span><span>✓ Background fit</span><span>Remember TikTok’s AI-generated media label.</span></div>
        </div>
      </section>
      <footer>No API key required. Your images are handed directly to the ChatGPT app through your device.</footer>
    </main>
  );
}
