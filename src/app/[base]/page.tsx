"use client";
import { useParams } from "next/navigation";
import { BaseNavBar } from "./base-navbar/base-navbar";
import React, { useState, useEffect } from "react";
import BaseSideBar from "./base-navbar/base-sidebar";
import { DataTable } from "./table/table";
import { api } from "~/trpc/react"; // Import your TRPC API client

export default function BasePage() {
  const params = useParams<{ base?: string | string[] }>(); // Account for base being string or string[]

  // Ensure base is a valid string
  const baseParam = typeof params.base === "string" ? params.base : undefined;

  // If base is not valid, return null (or you can render an error message)
  if (!baseParam) {
    return <div>Invalid base parameter</div>;
  }

  // Split the baseParam into baseId and tableId
  const [baseId, tableId] = baseParam.split("-");

  if (!baseId || !tableId) {
    return <div>Invalid base or table ID</div>;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTableId, setSelectedTableId] = useState<string>(tableId);
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
    return <div>Loading...</div>;
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
        <BaseNavBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          tables={tables}
          selectedTableId={tableId} // Pass selectedTableId
          setSelectedTableId={setSelectedTableId} // Pass setSelectedTableId
        />
      </div>
      {sidebar}
      <div className={`${isSidebarOpen ? "ml-[20%]" : ""} transition-all`}>
        {/* Pass tables to DataTable or display them as needed */}
        <DataTable tableId={selectedTableId} />
      </div>
    </main>
  );
}
