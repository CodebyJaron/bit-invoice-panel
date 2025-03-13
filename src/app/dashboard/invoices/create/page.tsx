import { CreateEditInvoiceForm } from "@/components/invoices/create-edit-invoice-form";
import { requireUser } from "@/hooks/use-user";
import prisma from "@/server/db";

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

export default async function InvoiceCreationRoute() {
    const session = await requireUser();
    const data = await getUserData(session.user?.id as string);
    return (
        <CreateEditInvoiceForm
            lastName={data?.lastName as string}
            address={data?.address as string}
            email={data?.email as string}
            firstName={data?.firstName as string}
        />
    );
}
