"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddWaterSourceForm from "./add-water-source-form";

export default function AddWaterSourceButton() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add Source</span>
      </button>
      {showForm && <AddWaterSourceForm onClose={() => setShowForm(false)} />}
    </>
  );
}

