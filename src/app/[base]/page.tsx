"use client";
import { useParams } from "next/navigation";
import { BaseNavBar } from "./base-navbar/base-navbar";
import React from "react";
import { SidebarNav } from "~/components/sidebar-nav/sidebar-nav";
import BaseSideBar from "./base-navbar/base-sidebar";
import { DataTable } from "./table/table";

export default function BasePage() {
  const params = useParams(); // Access the dynamic route parameters
  const { base } = params; // Destructure to get the 'base' value
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  return (
    <main>
      <div className="z-50">
        <BaseNavBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      {/* Conditionally render the sidebar based on isSidebarOpen */}
      {isSidebarOpen && (
        <div className="fixed left-0 top-[19.5%] z-10 h-[80%] w-1/5 border-r bg-white">
          <BaseSideBar />
        </div>
      )}
      <div className={`${isSidebarOpen ? "ml-[20%]" : ""} transition-all`}>
        <DataTable />
      </div>
    </main>
  );
}
