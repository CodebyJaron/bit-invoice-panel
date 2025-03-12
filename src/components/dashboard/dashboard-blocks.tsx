import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/hooks/use-user";
import prisma from "@/server/db";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { InvoiceStatus } from "@prisma/client";
import { formatCurrency } from "@/lib/utils";

async function getData(userId: string) {
    const [data, openInvoices, paidInvoices, recentInvoices] =
        await Promise.all([
            prisma.invoice.findMany({
                where: {
                    userId: userId,
                },
                select: {
                    total: true,
                },
            }),
            prisma.invoice.findMany({
                where: {
                    userId: userId,
                    status: "PENDING",
                },
                select: {
                    id: true,
                },
            }),
            prisma.invoice.findMany({
                where: {
                    userId: userId,
                    status: "PAID",
                },
                select: {
                    id: true,
                },
            }),
            prisma.invoice.findMany({
                where: {
                    userId: userId,
                },
                select: {
                    id: true,
                    createdAt: true,
                    total: true,
                    status: true,
                    invoiceNumber: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
            }),
        ]);

    return {
        data,
        openInvoices,
        paidInvoices,
        recentInvoices,
    };
}

interface iAppProps {
    amount: number;
    currency: "USD" | "EUR";
}

export async function DashboardBlocks() {
    const session = await requireUser();
    const { data, openInvoices, paidInvoices, recentInvoices } = await getData(
        session.user?.id as string
    );

    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-2xl font-bold">
                            {formatCurrency({
                                amount: data.reduce(
                                    (acc, invoice) => acc + invoice.total,
                                    0
                                ),
                                currency: "USD",
                            })}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Based on total volume
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Invoices Issued
                        </CardTitle>
                        <Users className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-2xl font-bold">+{data.length}</h2>
                        <p className="text-xs text-muted-foreground">
                            Total Invoices Isued!
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Paid Invoices
                        </CardTitle>
                        <CreditCard className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-2xl font-bold">
                            +{paidInvoices.length}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Total Invoices which have been paid!
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pending Invoices
                        </CardTitle>
                        <Activity className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-2xl font-bold">
                            +{openInvoices.length}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Invoices which are currently pending!
                        </p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-8 md:grid-cols-2 mt-8">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>Recente facturen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nummer</TableHead>
                                    <TableHead>Datum</TableHead>
                                    <TableHead>Bedrag</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentInvoices.slice(0, 5).map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">
                                            #
                                            {invoice.invoiceNumber ||
                                                invoice.id.substring(0, 8)}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                invoice.createdAt
                                            ).toLocaleDateString("nl-NL")}
                                        </TableCell>
                                        <TableCell>
                                            {formatCurrency({
                                                amount: invoice.total,
                                                currency: "USD",
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {invoice.status ===
                                            InvoiceStatus.PAID ? (
                                                <Badge className="bg-green-500">
                                                    Betaald
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-yellow-500">
                                                    Openstaand
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
