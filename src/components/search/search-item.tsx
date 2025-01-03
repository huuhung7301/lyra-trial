import { Base } from "~/types/types";

export function SearchItem(data: Partial<Base>) {
  return (
    <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2 px-4 hover:bg-gray-100">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-700 text-xl text-white">
        {data.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{data.title}</span>
          <span className="flex-shrink-0 text-gray-400">•</span>
          <span className="flex-shrink-0 text-gray-400">{data.type}</span>
        </div>
        <div className="truncate text-sm text-gray-500">{data.workspace}</div>
      </div>
      <div className="flex-shrink-0 text-sm text-gray-400">
        Last opened{" "}
        {data.lastOpened ? getTimeAgo(new Date(data.lastOpened)) : "N/A"}
      </div>
    </div>
  );
}

function getTimeAgo(date: Date) {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime(); // Difference in milliseconds

  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)); // Convert ms to hours
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Convert ms to days
  const diffInMonths = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30)); // Convert ms to months

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`; // Less than a day
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`; // Less than a month
  } else {
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`; // More than a month
  }
}
