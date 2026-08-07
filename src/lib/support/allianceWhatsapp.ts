/** WhatsApp support humain Alliance (indicatif Togo + numéro). */
export const ALLIANCE_WHATSAPP_DEFAULT = "22892432592"

export function getAllianceWhatsappNumber(): string {
  const fromEnv = process.env.NEXT_PUBLIC_ALLIANCE_WHATSAPP?.replace(/\D/g, "") || ""
  return fromEnv || ALLIANCE_WHATSAPP_DEFAULT
}

export function getAllianceWhatsappHref(
  message = "Bonjour, je suis membre Alliance KELIAA et j’ai besoin d’aide prioritaire :"
): string {
  const n = getAllianceWhatsappNumber()
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`
}
