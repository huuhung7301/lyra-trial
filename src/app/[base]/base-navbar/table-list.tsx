"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dropdown } from "~/components/ui/dropdown";
import { useRouter, useParams } from "next/navigation";
import { api } from "~/trpc/react";
import Loading from "~/components/ui/loading";

export function TableList() {
  const params = useParams<{ base?: string | string[] }>();
  const base = typeof params.base === "string" ? params.base : undefined;
  const router = useRouter();
  const createTableMutation = api.table.createTable.useMutation();
  const createViewMutation = api.view.createView.useMutation();

  if (!base) return <div>Invalid base parameter</div>;

  const [baseId, tableId, viewId] = base.split("-");
  if (!baseId || !tableId || !viewId) return <div>Invalid base, table, or view ID</div>;

  // Fetch table data from API
  const { data: baseData, isLoading, isError, refetch } = api.base.getBaseById.useQuery(
    { id: Number(baseId) },
    { enabled: !!baseId }
  );

  // Handle create table and view
  const handleCreate = async () => {
    try {
      const tableData = [{ id: 1, name: "", notes: "", assignee: "", status: "" }];
      const newTable = await createTableMutation.mutateAsync({
        name: "Table 1",
        baseid: parseInt(baseId),
        tabledata: tableData,
      });
      const newView = await createViewMutation.mutateAsync({
        name: "Grid View",
        tableid: newTable.id,
        hiddenFields: ["id", "name", "notes", "assignee", "status"]
      });
      router.replace(`/${baseId}-${newTable.id}-${newView.id}`);
      await refetch();
    } catch (error) {
      console.error("Error creating table and view:", error);
    }
  };

  // Show loading or error state
  if (isLoading) return <Loading/>;
  if (isError) return <div>Error loading tables.</div>;

  return (
    <div className="flex items-center justify-between bg-[#944e37]">
      <div className="flex w-[88%] items-center rounded-t-lg bg-[#854631] pl-4 font-normal">
        {/* Render fetched table list */}
        {baseData?.tables.map((table) => {
          const firstViewId = table.firstViewId ?? table.views?.[0]?.id ?? null;

          return (
            <div key={table.id} className="relative inline-block">
              {tableId !== table.id.toString() ? (
                <div
                  onClick={() => router.replace(`/${baseId}-${table.id}-${firstViewId}`)}
                  className="cursor-pointer bg-transparent py-2 text-[#ebded9] hover:bg-[#6f3b29]"
                >
                  <a className="border-r border-[#95604f] px-4 py-0">{table.name}</a>
                </div>
              ) : (
                <div className="rounded-t bg-white px-3 py-2">
                  <Dropdown
                    id={table.id.toString()}
                    type="table"
                    onOptionSelect={(option, id) => console.log(`Selected ${option} for table ID ${id}`)}
                    className="ml-2 text-gray-600"
                  >
                    <a className="py-0 font-medium">{table.name}</a>
                  </Dropdown>
                </div>
              )}
            </div>
          );
        })}
        <Dropdown id="123" type="table" onOptionSelect={(option, id) => console.log(`Selected ${option}`)} className="ml-3 mr-3 text-white"></Dropdown>
        <a className="flex items-center gap-2 font-normal text-[#ebded9] hover:text-white" onClick={handleCreate}>
          <span className="border-l border-[#95604f] pl-4">
            <Plus className="h-5 w-5" />
          </span>
          Add or import
        </a>
      </div>

      <div className="ml-3 flex w-[12%] items-center gap-2 rounded-t-lg bg-[#854631]">
        <Button variant="ghost" className="text-[#ebded9] hover:bg-white/10">
          Extensions
        </Button>
        <Button variant="ghost" className="text-[#ebded9] hover:bg-white/10">
          Tools
        </Button>
      </div>
    </div>
  );
}
