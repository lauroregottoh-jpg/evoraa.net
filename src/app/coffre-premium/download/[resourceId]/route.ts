import { createClient } from "@/utils/supabase/server"
import { userCanDownloadCoffreResource } from "@/lib/coffre/access"
import { getCoffreResource } from "@/lib/coffre/resources"
import { resolveCoffrePdfPath } from "@/lib/coffre/paths"
import fs from "fs"
import path from "path"
import { Readable } from "stream"

export const runtime = "nodejs"

type Params = { params: Promise<{ resourceId: string }> }

export async function GET(_request: Request, { params }: Params) {
  const { resourceId } = await params
  const resource = getCoffreResource(resourceId)
  if (!resource) {
    return new Response("Ressource introuvable", { status: 404 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Connexion requise", { status: 401 })
  }

  const allowed = await userCanDownloadCoffreResource(resourceId, user.id)
  if (!allowed) {
    return new Response("Ressource verrouillée", { status: 403 })
  }

  const filePath = resolveCoffrePdfPath(resource)
  if (!filePath || !fs.existsSync(filePath)) {
    return new Response("Fichier indisponible", { status: 404 })
  }

  const stat = fs.statSync(filePath)
  const nodeStream = fs.createReadStream(filePath)
  const webStream = Readable.toWeb(nodeStream) as ReadableStream
  const downloadName = path.basename(filePath).replace(/\.pdf\.pdf$/i, ".pdf")

  return new Response(webStream, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(stat.size),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
      "Cache-Control": "private, no-store",
    },
  })
}
