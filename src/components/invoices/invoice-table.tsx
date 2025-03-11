import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { requireUser } from "@/hooks/use-user";
import prisma from "@/server/db";
import { EmptyState } from "../dashboard/empty-state";
import { Badge } from "../ui/badge";
import { InvoiceActions } from "./invoice-action";
import { formatCurrency } from "@/lib/utils";
import { InvoiceStatus } from "@prisma/client";

async function getData(userId: string) {
    const data = await prisma.invoice.findMany({
        where: {
            userId: userId,
        },
        select: {
            id: true,
            clientName: true,
            total: true,
            createdAt: true,
            status: true,
            invoiceNumber: true,
            currency: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return data;
}
export async function InvoiceList() {
    const session = await requireUser();
    const data = await getData(session.user?.id as string);
    return (
        <>
            {data.length === 0 ? (
                <EmptyState
                    title="Geen facturen gevonden"
                    description="Je hebt nog geen facturen aangemaakt. Maak nu een factuur aan."
                    buttontext="Maak een factuur aan"
                    href="/dashboard/invoices/create"
                />
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Factuurnummer</TableHead>
                            <TableHead>Klant</TableHead>
                            <TableHead>Bedrag</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Datum</TableHead>
                            <TableHead className="text-right">Acties</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell>#{invoice.invoiceNumber}</TableCell>
                                <TableCell>{invoice.clientName}</TableCell>
                                <TableCell>
                                    {formatCurrency({
                                        amount: invoice.total,
                                        currency: invoice.currency as any,
                                    })}
                                </TableCell>
                                <TableCell>
                                    {invoice.status === InvoiceStatus.PAID ? (
                                        <Badge className="bg-green-500">
                                            Betaald
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-yellow-500">
                                            Openstaand
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {new Intl.DateTimeFormat("nl-NL", {
                                        dateStyle: "medium",
                                    }).format(invoice.createdAt)}
                                </TableCell>
                                <TableCell className="text-right">
                                    <InvoiceActions
                                        status={invoice.status}
                                        id={invoice.id}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </>
    );
}
