import formatDate from "@/lib/formatDate";
import getFileExtension from "@/lib/getFileExtension";
import type { DocType } from "@/types/doc.type";
import type { ColumnDef } from "@tanstack/react-table";

export const documentColumns: ColumnDef<DocType>[] = [
  {
    accessorKey: "name",
    header: "Title",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => getFileExtension(row.original.type),
    
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "case.title",
    header: "Related Case",
  },
  {
    accessorKey: "uploader.name",
    header: "Uploader",
  },
  {
    accessorKey: "dateCreated",
    header: "Date Added",
    cell: ({ row }) => formatDate(row.original.dateCreated),
  },
];