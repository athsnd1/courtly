"use no memo";

import { flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "./ui/input";
import { FaSearch } from "react-icons/fa";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
};

export default function DataTable<TData, TValue>({ columns, data, onRowClick }: DataTableProps<TData, TValue>) {

const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
        globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (

    <div className=" w-full h-max mt-4">
      
        <div className="relative w-full">
            <FaSearch className="absolute text-gray-200 left-2 top-1.75"/>
            <Input 
            placeholder="Search for items or filter table..." 
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-7 h-[30px] hover:border-navy focus:border-navy"
            />
        </div>

        <div className="border-1 border-border rounded-md mt-6">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} 
                    className="[&>th:first-child]:rounded-tl-md [&>th:last-child]:rounded-tr-md">
                        {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="bg-bgcol font-sora text-gray-500">
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        ))}
                    </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className={`${onRowClick ? "cursor-pointer" : ""}`} onClick={() => onRowClick?.(row.original)}>
                        {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="font-sora text-gray-800 py-4">
                            {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                            )}
                        </TableCell>
                        ))}
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
        </div>
    </div>
  );
}