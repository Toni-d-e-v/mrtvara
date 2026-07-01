"use client";

import { useRef, useTransition } from "react";
import { Plus } from "lucide-react";
import { addPlayer } from "@/lib/actions";

export default function AddPlayerForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(fd) =>
        startTransition(async () => {
          await addPlayer(fd);
          formRef.current?.reset();
        })
      }
      className="flex gap-2 rounded-lg border border-border bg-surface p-3"
    >
      <input
        name="name"
        required
        placeholder="Ime igrača"
        className="min-w-0 flex-1 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <select
        name="team"
        defaultValue="UNASSIGNED"
        className="rounded-md border border-border bg-surface-2 px-2 py-2 text-sm outline-none focus:border-accent"
      >
        <option value="SPID">SPID</option>
        <option value="BELO">BELO</option>
        <option value="UNASSIGNED">—</option>
      </select>
      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-1 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-[color:var(--on-accent)] transition-opacity active:opacity-80 disabled:opacity-60"
      >
        <Plus size={16} strokeWidth={2.5} />
        {pending ? "…" : "Dodaj"}
      </button>
    </form>
  );
}
