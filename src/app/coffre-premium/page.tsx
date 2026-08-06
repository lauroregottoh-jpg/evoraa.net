import { MemberPage } from "@/components/layout/MemberPage"
import { CoffreLibrary } from "@/components/coffre/CoffreLibrary"
import { getCoffreState } from "@/app/actions/coffre"
import { getCoffreResourcesSorted } from "@/lib/coffre/resources"

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
      <div className="max-w-5xl mx-auto pb-12">
        <CoffreLibrary resources={resources} initialAccess={access} />
      </div>
    </MemberPage>
  )
}
