import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { InitialModal } from "@/components/modals/initial-modal";

export default async function SetupPage() {
  const profile = await initialProfile();

  if (!profile) {
    
    return redirect('/sign-in');
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (server) {
    console.log(`Redirecting to /servers/${server.id}`);
    return redirect(`/servers/${server.id}`);
  }
  

  return <InitialModal />

}