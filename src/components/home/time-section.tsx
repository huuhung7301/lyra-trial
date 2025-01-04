import { BaseCard } from "./base-card";

interface TimeSectionProps {
  title: string;
  bases: Array<{
    id: string;
    title: string;
    type: string;
    icon: string;
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
        {bases.map((base) => (
          <BaseCard
            key={base.id}
            title={base.title}
            type={base.type}
            icon={base.icon}
          />
        ))}
      </div>
    </div>
  );
}
