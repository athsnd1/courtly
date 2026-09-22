import formatDate from "@/lib/formatDate";
import getFileExtension from "@/lib/getFileExtension";
import type { DocType } from "@/types/doc.type";
import type { ColumnDef } from "@tanstack/react-table";
import { LuDownload, LuEye, LuTrash2 } from "react-icons/lu";

export const caseDocumentColumns = (
  caseId: string,
  viewDocument: (caseId: string, docId: string) => void,
  downloadDocument: (caseId: string, docId: string) => void,
  setDocToDelete: (document: DocType) => void
): ColumnDef<DocType>[] => [
  {
    accessorKey: "name",
    header: "Title",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => getFileExtension(row.original.name),
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "dateCreated",
    header: "Date Added",
    cell: ({ row }) => formatDate(String(row.original.dateCreated)),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const document = row.original;

      return (
        <div className="flex items-center gap-1">
          <div
            className="p-1 rounded-md hover:bg-border transition-all cursor-pointer"
            onClick={() => viewDocument(caseId, document.id)}
          >
            <LuEye className="text-lg text-logo" />
          </div>

          <div
            className="p-1 rounded-md hover:bg-border transition-all cursor-pointer"
            onClick={() => downloadDocument(caseId, document.id)}
          >
            <LuDownload className="text-lg text-icon-green" />
          </div>

          <div
            className="p-1 rounded-md hover:bg-border transition-all cursor-pointer"
            onClick={() => setDocToDelete(document)}
          >
            <LuTrash2 className="text-lg text-red-500" />
          </div>
        </div>
      );
    },
  },
];