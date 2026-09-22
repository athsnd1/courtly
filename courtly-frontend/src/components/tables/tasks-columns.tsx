import formatDate from "@/lib/formatDate";
import type { Task } from "@/types/case.type";
import type { ColumnDef } from "@tanstack/react-table";

const TaskStatusColors = {
    TODO: "bg-pending-bg text-pending shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-pending",
    COMPLETED: "bg-active-bg text-active shrink-0 py-1 px-2 rounded-full font-jet text-xs border-1 border-active"
}

export const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "title",
    header: "Task Title",
  },
  {
    accessorKey: "case.title",
    header: "Related Case"
  },
  {
    accessorKey: "assignee.name",
    header: "Assigned To",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => (formatDate(row.original.dueDate as string))
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
        <span className={`${TaskStatusColors[row.original.status]}`}>
            {row.original.status}
        </span>
    )
  },
];