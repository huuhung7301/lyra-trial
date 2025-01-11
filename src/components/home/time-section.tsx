import { BaseCard } from "./base-card";

interface TimeSectionProps {
  title: string;
  bases: Array<{
    id: number;
    title: string;
    type: string;
    icon: string;
    tables: Array<{ id: string }>; // Assuming `tables` is an array of objects with an `id` field
    firstViewId: number;
  }>;
  isSidebarOpen: boolean; // Add isSidebarOpen as a prop
}
export function TimeSection({ title, bases, isSidebarOpen }: TimeSectionProps) {
  if (bases.length === 0) return null;

  return (
    <div className="py-4">
      <h2 className="mb-6 text-xl font-semibold">{title}</h2>
      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${isSidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
      >
        {bases.map((base) => {
          // Get the first tableId (if available)
          const firstTableId = base.tables[0] ? base.tables[0].id : null;
          if (!firstTableId) return null;

          // Extract the first viewId from the base (if available)
          const firstViewId = base.tables[0] ? base.firstViewId : 0; // Default to 0 if not available

          return (
            <BaseCard
              key={base.id}
              baseId={base.id}
              title={base.title}
              type={base.type}
              icon={base.icon}
              firstTableId={firstTableId} // Pass the first tableId here
              firstViewId={firstViewId}   // Pass the first viewId here
            />
          );
        })}
      </div>
    </div>
  );
}
