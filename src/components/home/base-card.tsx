import { useRouter } from "next/navigation"; // Import useRouter

interface BaseCardProps {
  baseId: string;
  title: string;
  type: string;
  icon: string;
}

export function BaseCard({ baseId, title, type, icon }: BaseCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${baseId}`);
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
