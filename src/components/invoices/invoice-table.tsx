import { requireUser } from "@/hooks/use-user";
import prisma from "@/server/db";
import { EmptyState } from "../dashboard/empty-state";
import InvoiceDataTable from "./invoice-data-table";

async function getData(userId: string) {
    const data = await prisma.invoice.findMany({
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
        orderBy: {
            createdAt: "desc",
        },
    });
    return data;
}

export async function InvoiceList() {
    const session = await requireUser();
    const data = await getData(session.user?.id as string);

    if (data.length === 0) {
        return (
            <EmptyState
                title="Geen facturen gevonden"
                description="Je hebt nog geen facturen aangemaakt. Maak nu een factuur aan."
                buttontext="Maak een factuur aan"
                href="/dashboard/invoices/create"
            />
        );
    }

    return <InvoiceDataTable data={data} />;
}
