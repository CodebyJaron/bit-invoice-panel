import { CreateEditInvoiceForm } from "@/components/invoices/create-edit-invoice-form";
import { requireUser } from "@/hooks/use-user";
import prisma from "@/server/db";
import { notFound } from "next/navigation";

async function getData(invoiceId: string, userId: string) {
    const data = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
            userId: userId,
        },
    });

    if (!data) {
        return notFound();
    }

    return data;
}

async function getUserData(userId: string) {
    const data = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            firstName: true,
            lastName: true,
            address: true,
            email: true,
        },
    });

    return data;
}

export default async function EditInvoiceRoute({
    params,
}: {
    params: Promise<{ invoiceId: string }>;
}) {
    const { invoiceId } = await params;
    const session = await requireUser();

    const invoiceData = await getData(invoiceId, session.user?.id as string);
    const userData = await getUserData(session.user?.id as string);

    // Needed for the types :sleep:
    const invoiceDataForForm = {
        ...invoiceData,
        id: invoiceId,
        invoiceNumber: invoiceData.invoiceNumber.toString(),
        date: invoiceData.date.toISOString(),
        dueDate: invoiceData.dueDate.toString(),
        currency: (invoiceData.currency as "USD" | "EUR") || "EUR",
        invoiceItems: invoiceData.invoiceItems
            ? (invoiceData.invoiceItems as {
                  description: string;
                  quantity: string;
                  rate: string;
              }[])
            : [{ description: "", quantity: "", rate: "" }],
        note: invoiceData.note ?? undefined,
    };

    return (
        <CreateEditInvoiceForm
            lastName={userData?.lastName as string}
            address={userData?.address as string}
            email={userData?.email as string}
            firstName={userData?.firstName as string}
            invoiceData={invoiceDataForForm}
        />
    );
}
