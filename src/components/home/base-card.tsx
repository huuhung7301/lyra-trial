import { useRouter } from "next/navigation"; // Import useRouter
import { useState } from "react"; // Import useState
import { api } from "~/trpc/react";

interface BaseCardProps {
  baseId: number;
  title: string;
  type: string;
  icon: string;
  firstTableId: string;
  firstViewId: number;
}

export function BaseCard({
  baseId,
  title,
  type,
  icon,
  firstTableId,
  firstViewId,
}: BaseCardProps) {
  const router = useRouter();

  // Local state to store firstView data

  // Fetch the viewId dynamically only on click
  const handleClick = async () => {
    const extractedBaseId = firstTableId.split("-")[0];
    router.push(`/${extractedBaseId}-${firstTableId}-${firstViewId}`);
    return;
  };

  return (
    <div
      className="flex items-center gap-4 rounded-lg border bg-white p-6 transition-shadow hover:shadow-md"
      onClick={handleClick}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-700 text-2xl text-white">
        {icon}
      </div>
      <div>
        <h3 className="text-lg">{title}</h3>
        <p className="text-sm text-gray-500">{type}</p>
      </div>
    </div>
  );
}
