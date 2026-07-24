"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteMatch } from "@/lib/actions";

export default function DeleteMatchButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("Obrisati cijelu utakmicu?"))
          startTransition(async () => {
            await deleteMatch(id);
            router.push("/");
          });
      }}
      disabled={pending}
      className="btn-quiet px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-loss hover:text-loss disabled:opacity-60"
    >
      <Trash2 size={15} />
      {pending ? "Brišem…" : "Obriši utakmicu"}
    </button>
  );
}
