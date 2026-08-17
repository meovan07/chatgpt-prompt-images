export const runtime = "edge";

const MODEL_PROMPT = `Use the reference images as Model 01 identity references. Preserve the same adult woman's facial geometry, apparent age 22–26, warm fair skin tone, eyes, nose, lips, neck, slender build, and body proportions. The product image is the exact product reference. Preserve its color, material, construction, print, proportions, and logo placement. Create one photorealistic vertical 9:16 commercial lifestyle image for a TikTok affiliate post. Keep the product clear and unobstructed. Natural anatomy, realistic hands, no text, no watermark, no interface elements, no additional product.`;

async function publicAsset(request: Request, path: string, name: string) {
  const response = await fetch(new URL(path, request.url));
  if (!response.ok) throw new Error(`Missing ${name} reference`);
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type || "image/png" });
}

export async function POST(request: Request) {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return Response.json({ error: "The image service is not connected yet. Add the OpenAI API key to activate generation." }, { status: 503 });
    const input = await request.formData();
    const product = input.get("product");
    if (!(product instanceof File) || !product.type.startsWith("image/")) return Response.json({ error: "Please provide a valid product image." }, { status: 400 });
    if (product.size > 18 * 1024 * 1024) return Response.json({ error: "Product image must be smaller than 18 MB." }, { status: 400 });
    const hair = String(input.get("hair") || "H02");
    const hairName = String(input.get("hairName") || "Korean waves");
    const background = String(input.get("background") || "Auto match product");
    const note = String(input.get("note") || "").slice(0, 300);
    const turnaround = await publicAsset(request, "/model-01/turnaround.png", "model-01-turnaround.png");
    const hairstyles = await publicAsset(request, "/model-01/hairstyles.png", "model-01-hairstyles.png");
    const body = new FormData();
    body.append("model", "gpt-image-2");
    body.append("image[]", turnaround);
    body.append("image[]", hairstyles);
    body.append("image[]", product, product.name || "product.png");
    body.append("prompt", `${MODEL_PROMPT}\nUse hairstyle ${hair}: ${hairName}. Background: ${background}. ${note ? `Additional direction: ${note}` : "Choose a background whose lighting and colors complement the product."}`);
    body.append("size", "1024x1536");
    body.append("quality", "high");
    body.append("input_fidelity", "high");
    body.append("output_format", "png");
    const response = await fetch("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: `Bearer ${key}` }, body });
    const data = await response.json() as { data?: Array<{ b64_json?: string; url?: string }>; error?: { message?: string } };
    if (!response.ok) return Response.json({ error: data.error?.message || "Image generation failed." }, { status: response.status });
    const output = data.data?.[0];
    const image = output?.b64_json ? `data:image/png;base64,${output.b64_json}` : output?.url;
    if (!image) throw new Error("The image service returned no image.");
    return Response.json({ image });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unexpected generation error." }, { status: 500 });
  }
}
