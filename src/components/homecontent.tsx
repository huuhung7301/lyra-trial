"use client";
import { useState } from "react";
import { NavBar } from "~/components/navbar-main";
import { ActionCard } from "@/components/home/action-card";
import { FilterSection } from "@/components/home/filter-section";
import { TimeSection } from "@/components/home/time-section";
import { SidebarNav } from "~/components/sidebar-nav/sidebar-nav";
import { Sparkles, Grid, ArrowUpCircle, Table } from "lucide-react";

// Dummy data (no changes to this data)
interface RecentItem {
  id: string;
  title: string;
  type: string;
  workspace: string;
  lastOpened: Date;
  icon: string;
}

const actionCards = [
  {
    title: "Start with AI",
    description:
      "Turn your process into an app with data and interfaces using AI.",
    icon: Sparkles,
    iconColor: "text-purple-500",
  },
  {
    title: "Start with templates",
    description: "Select a template to get started and customize as you go.",
    icon: Grid,
    iconColor: "text-blue-500",
  },
  {
    title: "Quickly upload",
    description: "Easily migrate your existing projects in just a few minutes.",
    icon: ArrowUpCircle,
    iconColor: "text-green-500",
  },
  {
    title: "Start from scratch",
    description:
      "Create a new blank base with custom tables, fields, and views.",
    icon: Table,
    iconColor: "text-gray-600",
  },
];

const recentItems: RecentItem[] = [
  {
    id: "1",
    title: "Lyra Base",
    type: "Base",
    workspace: "My First Workspace",
    lastOpened: new Date("2024-12-30"),
    icon: "Ly",
  },
  {
    id: "2",
    title: "Lyra base",
    type: "Base",
    workspace: "My First Workspace",
    lastOpened: new Date("2024-12-31"),
    icon: "Ly",
  },
  {
    id: "3",
    title: "Marketing Campaign",
    type: "Base",
    workspace: "Work Projects",
    lastOpened: new Date("2024-12-20"),
    icon: "Mc",
  },
  {
    id: "4",
    title: "Product Roadmap2",
    type: "Base",
    workspace: "Product Team",
    lastOpened: new Date("2024-12-12"),
    icon: "Pr",
  },
  {
    id: "5",
    title: "Product Roadmap3",
    type: "Base",
    workspace: "Product Team",
    lastOpened: new Date("2024-12-19"),
    icon: "Pr",
  },
  {
    id: "6",
    title: "Product Roadmap4",
    type: "Base",
    workspace: "Product Team",
    lastOpened: new Date("2024-12-15"),
    icon: "Pr",
  },
  {
    id: "7",
    title: "Product Roadmap4",
    type: "Base",
    workspace: "Product Team",
    lastOpened: new Date("2025-01-03"),
    icon: "Pr",
  },
];

function filterItemsByDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // set to the start of the day

  const pastWeekStart = new Date(today);
  pastWeekStart.setDate(today.getDate() - 7); // set to 7 days ago

  const pastMonthStart = new Date(today);
  pastMonthStart.setMonth(today.getMonth() - 1); // set to 1 month ago

  const todayBases: RecentItem[] = [];
  const pastWeekBases: RecentItem[] = [];
  const pastMonthBases: RecentItem[] = [];

  // Map through recentItems and categorize them based on their lastOpened date
  recentItems.forEach((item) => {
    if (item.lastOpened >= today) {
      todayBases.push(item);
    } else if (item.lastOpened >= pastWeekStart) {
      pastWeekBases.push(item);
    } else if (item.lastOpened >= pastMonthStart) {
      pastMonthBases.push(item);
    }
  });

  return { todayBases, pastWeekBases, pastMonthBases };
}

export function HomeContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Filter items by date
  const { todayBases, pastWeekBases, pastMonthBases } = filterItemsByDate();

  return (
    <div>
      <div className="fixed left-0 top-0 z-20 w-full border-b bg-white">
        <NavBar
          recentItems={recentItems}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      <div className="fixed left-0 top-[48px] z-10 h-[calc(100vh-48px)] border-r bg-white">
        <SidebarNav isExpanded={isSidebarOpen} onToggle={setIsSidebarOpen} />
      </div>

      <div className="min-h-screen bg-gray-50 pt-24">
        <main
          className={`mx-auto max-w-[1200px] p-0 pl-[calc(4rem+24px)] transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "pl-[15%]" : ""
          }`}
        >
          <h1 className="mb-6 text-3xl font-semibold">Home</h1>

          {/* Action Cards */}
          <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${isSidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}
          >
            {actionCards.map((card) => (
              <ActionCard
                key={card.title}
                title={card.title}
                description={card.description}
                icon={card.icon}
                iconColor={card.iconColor}
              />
            ))}
          </div>

          {/* Filters */}
          <FilterSection />

          {/* Time-based sections */}
          <TimeSection
            title="Today"
            bases={todayBases}
            isSidebarOpen={isSidebarOpen}
          />
          <TimeSection
            title="Past 7 days"
            bases={pastWeekBases}
            isSidebarOpen={isSidebarOpen}
          />
          <TimeSection
            title="Past month"
            bases={pastMonthBases}
            isSidebarOpen={isSidebarOpen}
          />
        </main>
      </div>
    </div>
  );
}
