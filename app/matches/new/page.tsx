import { redirect } from "next/navigation";
import { getPlayers } from "@/lib/queries";
import { isAdmin } from "@/lib/auth";
import NewMatchForm from "@/components/NewMatchForm";

export const dynamic = "force-dynamic";

export default async function NewMatchPage() {
  if (!(await isAdmin())) redirect("/login");
  const players = await getPlayers();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Nova utakmica</h1>
      {players.length === 0 ? (
        <p className="text-sm text-muted">
          Prvo dodaj igrače na stranici „Igrači”.
        </p>
      ) : (
        <NewMatchForm players={players} />
      )}
    </div>
  );
}
