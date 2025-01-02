export interface SearchItemProps {
  id: string;
  title: string;
  type: string;
  workspace: string;
  lastOpened: string;
  icon: string;
}

export function SearchItem({
  title,
  type,
  workspace,
  lastOpened,
  icon,
}: SearchItemProps) {
  return (
    <div className="flex cursor-pointer items-center gap-4 rounded-lg p-3 hover:bg-gray-100">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-700 text-xl text-white">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{title}</span>
          <span className="flex-shrink-0 text-gray-400">•</span>
          <span className="flex-shrink-0 text-gray-400">{type}</span>
        </div>
        <div className="truncate text-sm text-gray-500">{workspace}</div>
      </div>
      <div className="flex-shrink-0 text-sm text-gray-400">
        Last opened {lastOpened}
      </div>
    </div>
  );
}
