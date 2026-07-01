"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
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
      className="w-full rounded-xl border border-red-500/40 px-4 py-2.5 text-sm font-semibold text-red-400 disabled:opacity-60"
    >
      {pending ? "Brišem…" : "Obriši utakmicu"}
    </button>
  );
}
