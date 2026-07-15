const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

// Uploads directly from the browser to Cloudinary using an unsigned upload
// preset — no server/API key needed, which keeps this within the "no Cloud
// Functions" architecture. Cloudinary's free tier (25GB storage/bandwidth)
// doesn't require a credit card, unlike Firebase Storage.
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!isCloudinaryConfigured) {
    throw new Error(
      "Image upload isn't configured yet — set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET as string);
  formData.append("folder", folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("Cloudinary upload failed:", body);
    throw new Error("Upload failed. Please try again.");
  }

  const data = await response.json();
  return data.secure_url as string;
}
