export async function uploadToImgBB(file) {
  const apiKey = process.env.IMGBB_API_KEY;

  // Convert file to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Convert to base64
  const base64 = buffer.toString("base64");

  const formData = new FormData();
  formData.append("image", base64);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!data.success) {
    console.log(data); // 👈 VERY IMPORTANT for debugging
    throw new Error("Image upload failed");
  }

  return data.data.url;
}