import { useState } from "react";
import { IconSidebar } from "./icon-sidebar";
import { ExtendedSidebar } from "./extended-sidebar";

interface SidebarNavProps {
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
}

export function SidebarNav({ isExpanded, onToggle }: SidebarNavProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Icon Sidebar */}
      <IconSidebar isVisible={!isExpanded && !isHovered} />

      {/* Extended Sidebar */}
      {isExpanded || isHovered ? (
        <ExtendedSidebar isExpanded={isExpanded || isHovered} />
      ) : null}
    </div>
  );
}
