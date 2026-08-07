import { MemberPage } from "@/components/layout/MemberPage"
import { CoffreLibrary } from "@/components/coffre/CoffreLibrary"
import { getCoffreState } from "@/app/actions/coffre"
import { getCoffreResourcesSorted } from "@/lib/coffre/resources"
import { AmbientSnowOrbs } from "@/components/home/AmbientSnowOrbs"

export const metadata = {
  title: "Le Coffre Premium | KELIAA",
  description:
    "Bibliothèque exclusive de ressources pour accompagner votre préparation au mariage.",
}

export default async function CoffrePremiumPage() {
  const { access } = await getCoffreState()
  const resources = getCoffreResourcesSorted()

  return (
    <MemberPage>
      <div className="relative max-w-5xl mx-auto pb-12">
        <AmbientSnowOrbs density="soft" className="opacity-55" />
        <div className="relative z-10">
          <CoffreLibrary resources={resources} initialAccess={access} />
        </div>
      </div>
    </MemberPage>
  )
}
