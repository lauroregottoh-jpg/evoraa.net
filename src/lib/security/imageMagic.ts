/**
 * Detect image type from magic bytes (not client-declared MIME).
 */

export type DetectedImageType = "image/jpeg" | "image/png" | "image/webp"

export function detectImageMime(
  bytes: ArrayBuffer | Uint8Array
): DetectedImageType | null {
  const buf = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  if (buf.length < 12) return null

  // JPEG FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg"
  }

  // PNG 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return "image/png"
  }

  // RIFF....WEBP
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return "image/webp"
  }

  return null
}

export function extensionForMime(mime: DetectedImageType): "jpg" | "png" | "webp" {
  if (mime === "image/png") return "png"
  if (mime === "image/webp") return "webp"
  return "jpg"
}
