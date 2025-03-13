import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/hooks/use-user";
import { formatCurrency } from "@/lib/utils";
import prisma from "@/server/db";
import { InvoiceStatus } from "@prisma/client";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { Badge } from "../ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { InvoiceChart } from "./invoice-chart";

async function getData(userId: string) {
    const invoices = await prisma.invoice.findMany({
        where: { userId },
        select: {
            id: true,
            clientName: true,
            total: true,
            createdAt: true,
            status: true,
            invoiceNumber: true,
            currency: true,
        },
        orderBy: { createdAt: "asc" },
    });

    interface MonthData {
        month: string;
        paid: number;
        pending: number;
    }

    const chartData = Object.values(
        invoices.reduce<{ [month: string]: MonthData }>((acc, invoice) => {
            const createdAt = new Date(invoice.createdAt);
            const month =
                createdAt
                    .toLocaleString("nl-NL", { month: "long" })
                    .charAt(0)
                    .toUpperCase() +
                createdAt.toLocaleString("nl-NL", { month: "long" }).slice(1);

            if (!acc[month]) {
                acc[month] = { month, paid: 0, pending: 0 };
            }

            if (invoice.status === InvoiceStatus.PAID) {
                acc[month].paid++;
            }
            if (invoice.status === InvoiceStatus.PENDING) {
                acc[month].pending++;
            }

            return acc;
        }, {})
    );

    const openInvoices = invoices.filter(
        (inv) => inv.status === InvoiceStatus.PENDING
    );
    const paidInvoices = invoices.filter(
        (inv) => inv.status === InvoiceStatus.PAID
    );
    const recentInvoices = invoices.slice(-5).reverse();

    return {
        invoices,
        chartData,
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
    const { invoices, chartData, openInvoices, paidInvoices, recentInvoices } =
        await getData(session.user?.id as string);

    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Totale omzet
                        </CardTitle>
                        <DollarSign className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-2xl font-bold">
                            {formatCurrency({
                                amount: invoices.reduce(
                                    (acc, invoice) => acc + invoice.total,
                                    0
                                ),
                                currency: "USD",
                            })}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Gebaseerd op totaal volume
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Totaal uitgegeven facturen
                        </CardTitle>
                        <Users className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-2xl font-bold">
                            +{invoices.length}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Totaal uitgegeven facturen!
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Betaalde facturen
                        </CardTitle>
                        <CreditCard className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-2xl font-bold">
                            +{paidInvoices.length}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Facturen die betaald zijn!
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Openstaande facturen
                        </CardTitle>
                        <Activity className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-2xl font-bold">
                            +{openInvoices.length}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            Facturen die momenteel openstaan!
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

                <InvoiceChart data={chartData} />
            </div>
        </div>
    );
}
