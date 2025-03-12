"use client";

import { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { InvoiceActions } from "./invoice-action";
import { formatCurrency } from "@/lib/utils";
import { InvoiceStatus } from "@prisma/client";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface Invoice {
    id: string;
    invoiceNumber: number;
    clientName: string;
    total: number;
    createdAt: string | Date;
    status: InvoiceStatus;
    currency: string;
}

interface DataTableProps {
    data: Invoice[];
}

export default function InvoiceDataTable({ data }: DataTableProps) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const columns = useMemo(
        () => [
            {
                accessorKey: "invoiceNumber",
                header: "Factuurnummer",
                cell: (info: any) => `#${info.getValue()}`,
            },
            {
                accessorKey: "clientName",
                header: "Klant",
            },
            {
                accessorKey: "total",
                header: "Bedrag",
                cell: (info: any) =>
                    formatCurrency({
                        amount: info.getValue(),
                        currency: info.row.original.currency,
                    }),
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: (info: any) =>
                    info.getValue() === InvoiceStatus.PAID ? (
                        <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                        >
                            Betaald
                        </Badge>
                    ) : (
                        <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200"
                        >
                            Openstaand
                        </Badge>
                    ),
            },
            {
                accessorKey: "createdAt",
                header: "Datum",
                cell: (info: any) =>
                    new Intl.DateTimeFormat("nl-NL", {
                        dateStyle: "medium",
                    }).format(new Date(info.getValue())),
            },
            {
                accessorKey: "id",
                header: "Acties",
                cell: (info: any) => (
                    <InvoiceActions
                        status={info.row.original.status}
                        id={info.getValue()}
                    />
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    const filteredRows = table
        .getRowModel()
        .rows.filter((row) =>
            statusFilter && statusFilter !== "all"
                ? row.original.status === statusFilter
                : true
        );

    const generatePagination = () => {
        const currentPage = table.getState().pagination.pageIndex;
        const totalPages = table.getPageCount();

        const pages = [];

        pages.push(0);

        if (currentPage > 2) {
            pages.push(-1);
        }

        for (
            let i = Math.max(1, currentPage - 1);
            i <= Math.min(totalPages - 2, currentPage + 1);
            i++
        ) {
            if (i > 0 && i < totalPages - 1) {
                pages.push(i);
            }
        }

        if (currentPage < totalPages - 3) {
            pages.push(-2);
        }

        if (totalPages > 1) {
            pages.push(totalPages - 1);
        }

        return pages;
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-row items-center justify-between gap-4">
                {/* Zoekfunctie */}
                <div className="flex flex-1 sm:flex-none gap-2">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Zoeken..."
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="w-full sm:w-[250px] pl-8"
                        />
                    </div>

                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[160px]">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4" />
                                <SelectValue placeholder="Filter" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Alle facturen</SelectItem>
                            <SelectItem value={InvoiceStatus.PAID}>
                                Betaald
                            </SelectItem>
                            <SelectItem value={InvoiceStatus.PENDING}>
                                Openstaand
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            {table
                                .getHeaderGroups()[0]
                                .headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="font-semibold text-foreground"
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRows.length ? (
                            filteredRows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    className={`hover:bg-muted/50 ${
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-muted/20"
                                    }`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Geen resultaten gevonden.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground w-[30%]">
                    Toon{" "}
                    {filteredRows.length
                        ? table.getState().pagination.pageIndex *
                              table.getState().pagination.pageSize +
                          1
                        : 0}{" "}
                    van {filteredRows.length} resultaten
                </div>

                <Pagination className="w-[60%] justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.previousPage();
                                }}
                                aria-disabled={!table.getCanPreviousPage()}
                                className={
                                    !table.getCanPreviousPage()
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>

                        {generatePagination().map((page, i) => {
                            if (page < 0) {
                                return (
                                    <PaginationItem key={`ellipsis-${i}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }

                            return (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            table.setPageIndex(page);
                                        }}
                                        isActive={
                                            table.getState().pagination
                                                .pageIndex === page
                                        }
                                    >
                                        {page + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.nextPage();
                                }}
                                aria-disabled={!table.getCanNextPage()}
                                className={
                                    !table.getCanNextPage()
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
