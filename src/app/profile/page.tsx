import { MemberPage } from "@/components/layout/MemberPage";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { Badge } from "@/components/ui/badge";
import { getMyProfileEditorData } from "@/app/actions/profile";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
  const { data, error } = await getMyProfileEditorData();

  return (
    <MemberPage>
      <div className="space-y-6 py-2 max-w-3xl mx-auto">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs"
          >
            Mon espace personnel
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Édition de votre profil
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enrichissez votre témoignage et vos photos. Tout est sauvegardé dans votre compte KELIAA.
          </p>
        </div>

        {error || !data ? (
          <div className="space-y-3">
            <p className="text-sm text-destructive">{error || "Profil indisponible."}</p>
            <Link href="/login">
              <Button variant="outline" className="rounded-xl">
                Se connecter
              </Button>
            </Link>
          </div>
        ) : (
          <ProfileEditor initial={data} />
        )}
      </div>
    </MemberPage>
  );
}
