"use client";
import { useParams } from "next/navigation";
import { BaseNavBar } from "./base-navbar/base-navbar";
import React, { useState } from "react";
import BaseSideBar from "./base-navbar/base-sidebar";
import { DataTable } from "./table/table";
import { api } from "~/trpc/react"; // Import your TRPC API client
import { ViewProvider } from "./view-context";
import Loading from "@/components/ui/loading";

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

  // Fetch tables using TRPC query
  const {
    data: baseData,
    isLoading,
    isError,
  } = api.base.getBaseById.useQuery(
    { id: Number(baseId) }, // Pass the base ID as a query parameter
    {
      enabled: !!baseId, // Ensure the query only runs when `base` is available
    },
  );

  // Handle loading and error states
  if (isLoading) {
    return <Loading/>;
  }

  if (isError) {
    return <div>Error loading base data</div>;
  }

  // Access the tables from the fetched data
  const tables =
    baseData?.tables?.map((table) => ({
      id: table.id.toString(),
      name: table.name,
    })) ?? [];

  // Conditional rendering of the sidebar based on isSidebarOpen
  const sidebar = isSidebarOpen && (
    <div className="fixed left-0 top-[19.5%] z-10 h-[80%] w-1/5 border-r bg-white">
      <BaseSideBar />
    </div>
  );

  return (
    <main>
      <div className="z-50">
        {/* Wrap both BaseNavBar and DataTable with ViewProvider once */}
        <ViewProvider viewId={parseInt(viewId)} tableId={parseInt(tableId)}>
          <BaseNavBar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <div className={`${isSidebarOpen ? "ml-[20%]" : ""} transition-all`}>
            {/* DataTable is also wrapped by ViewProvider */}
            <DataTable tableId={tableId} />
          </div>
        </ViewProvider>
      </div>
      {sidebar}
    </main>
  );
}
