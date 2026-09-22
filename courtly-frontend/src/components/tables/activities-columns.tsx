import formatDate from "@/lib/formatDate";
import type { CaseEvent } from "@/types/case.type";
import type { ColumnDef } from "@tanstack/react-table";

const EventColorMappings = {
  CASE_CREATED: "text-blue-500 bg-blue-50 border-blue-500 shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-active",
  LAWYER_ASSIGNED: "text-purple-500 bg-purple-50 border-purple-500 shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-active",
  TASK_ASSIGNED: "text-orange-500 bg-orange-50 border-orange-500 shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-active",
  TASK_DELETED: "text-red-500 bg-red-50 border-red-500 shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-active",
  STATUS_CHANGED: "text-yellow-600 bg-yellow-50 border-yellow-600 shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-active",
  HEARING_SCHEDULED: "text-cyan-500 bg-cyan-50 border-cyan-500 shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-active",
  DOCUMENT_UPLOADED: "text-green-500 bg-green-50 border-green-500 shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-active",
  DOCUMENT_DELETED: "text-red-500 bg-red-50 border-red-500 shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-active",
  NOTE_ADDED: "text-indigo-500 bg-indigo-50 border-indigo-500 shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-active",
  NOTE_DELETED: "text-red-500 bg-red-50 border-red-500 shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-active",
};

export const activitiesColumns: ColumnDef<CaseEvent>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (formatDate(row.original.date as string))
  },
  {
    accessorKey: "eventCreator.name",
    header: "User",
  },
  {
    accessorKey: "case.title",
    header: "Related Case",
  },
  {
    accessorKey: "type",
    header: "Action Type",
    cell: ({ row }) => (
        <span className={`${EventColorMappings[row.original.type]}`}>
            {row.original.type}
        </span>
    )
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
        <span className="shrink whitespace-normal">
            {row.original.action}
        </span>
    )
  },
];