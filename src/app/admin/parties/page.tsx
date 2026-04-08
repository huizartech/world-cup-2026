import { auth } from "@/auth";
import { isAdmin } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { AccessManager } from "@/components/access-manager";

export default async function WatchPartiesPage() {
  const session = await auth();
  if (!isAdmin(session?.user)) redirect("/");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Watch Party Access
      </h1>
      <p className="text-gray-500 mb-8">
        Manage who can see private watch party locations.
      </p>
      <AccessManager />
    </div>
  );
}
