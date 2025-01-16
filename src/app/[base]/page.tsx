"use client";
import { useParams } from "next/navigation";
import { BaseNavBar } from "./base-navbar/base-navbar";
import React, { useState } from "react";
import BaseSideBar from "./base-navbar/base-sidebar";
import { DataTable } from "./table/table";
import { ViewProvider } from "./view-context";

export default function BasePage() {
  const params = useParams<{ base?: string | string[] }>(); // Account for base being string or string[]

  // Ensure base is a valid string
  const baseParam = typeof params.base === "string" ? params.base : undefined;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // If base is not valid, return null (or you can render an error message)
  if (!baseParam) {
    return <div>Invalid base parameter</div>;
  }

  // Split the baseParam into baseId and tableId
  const [baseId, tableId, viewId] = baseParam.split("-");

  if (!baseId || !tableId || !viewId) {
    return <div>Invalid base or table ID</div>;
  }

  // Conditional rendering of the sidebar based on isSidebarOpen
  const sidebar = isSidebarOpen && (
    <div className="fixed left-0 top-40 z-10 h-[100%] w-1/5 border-r bg-white border">
      <BaseSideBar />
    </div>
  );

  return (
    <main>
      <div className="z-10">
        {/* Wrap both BaseNavBar and DataTable with ViewProvider once */}
        <ViewProvider viewId={parseInt(viewId)} tableId={parseInt(tableId)}>
          <BaseNavBar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <div className={`${isSidebarOpen ? "ml-[20%]" : ""} transition-all`}>
            <DataTable />
          </div>
          {sidebar}
        </ViewProvider>
      </div>
    </main>
  );
}
