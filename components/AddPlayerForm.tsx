"use client";

import { useRef, useTransition } from "react";
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
      className="flex gap-2 rounded-2xl border border-border bg-surface p-3"
    >
      <input
        name="name"
        required
        placeholder="Ime igrača"
        className="min-w-0 flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <select
        name="team"
        defaultValue="UNASSIGNED"
        className="rounded-lg border border-border bg-surface-2 px-2 py-2 text-sm outline-none"
      >
        <option value="SPID">SPID</option>
        <option value="BELO">BELO</option>
        <option value="UNASSIGNED">—</option>
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-3 py-2 text-sm font-bold text-black disabled:opacity-60"
      >
        {pending ? "…" : "Dodaj"}
      </button>
    </form>
  );
}
