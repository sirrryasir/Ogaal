"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";

interface DeleteButtonProps {
  action: () => Promise<{ success: boolean }>;
}

export default function DeleteButton({ action }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this item?")) return;

    setIsDeleting(true);
    await action();
    setIsDeleting(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
