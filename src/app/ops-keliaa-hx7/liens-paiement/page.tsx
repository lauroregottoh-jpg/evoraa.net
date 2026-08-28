import { redirect } from "next/navigation"
import { OPS_CONSOLE_PATH } from "@/lib/admin/consolePath"

export default function LegacyPaymentLinksRedirect() {
  redirect(`${OPS_CONSOLE_PATH}/encaissements-independants`)
}
