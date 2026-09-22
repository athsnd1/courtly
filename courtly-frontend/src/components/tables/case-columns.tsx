import type { Case } from "@/types/case.type";
import type { ColumnDef } from "@tanstack/react-table";

const CaseStatusColorMappings = {
    PENDING: "bg-pending-bg text-pending shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-pending",
    CLOSED: "bg-closed-bg text-closed shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-closed",
    ACTIVE: "bg-active-bg text-active shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-active"
}

export const caseColumns: ColumnDef<Case>[] = [
  {
    accessorKey: "caseNumber",
    header: "CaseNumber",
  },
  {
    accessorKey: "title",
    header: "Case Title",
    
  },
  {
    accessorKey: "type",
    header: "Case Type",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
        <span className={`${CaseStatusColorMappings[row.original.status]}`}>
            {row.original.status}
        </span>
    )
  },
  {
    accessorKey: "creator.name",
    header: "Created By",
  },
  {
    accessorKey: "organization.name",
    header: "Organization",
  },
];