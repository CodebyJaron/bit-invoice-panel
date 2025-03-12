"use server";
import { requireUser } from "@/hooks/use-user";
import { formatCurrency } from "@/lib/utils";
import { invoiceSchema } from "@/schemas/invoice";
import prisma from "@/server/db";
import { emailClient } from "@/server/email";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";
import { sendInvoiceEmail } from "./email";

export async function createInvoice(prevState: any, formData: FormData) {
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: invoiceSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const data = await prisma.invoice.create({
        data: {
            clientAddress: submission.value.clientAddress,
            clientEmail: submission.value.clientEmail,
            clientName: submission.value.clientName,
            currency: submission.value.currency,
            date: submission.value.date,
            dueDate: submission.value.dueDate,
            fromAddress: submission.value.fromAddress,
            fromEmail: submission.value.fromEmail,
            fromName: submission.value.fromName,
            invoiceName: submission.value.invoiceName,
            invoiceNumber: submission.value.invoiceNumber,
            status: submission.value.status,
            total: submission.value.total,
            note: submission.value.note,
            userId: session.user?.id,
            automaticReminder: submission.value.automaticReminder,
            invoiceItems: submission.value.invoiceItems,
        },
    });

    await sendInvoiceEmail(data.clientEmail, data.id);

    return redirect("/dashboard/invoices");
}

export async function updateInvoice(prevState: any, formData: FormData) {
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: invoiceSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const data = await prisma.invoice.update({
        where: {
            id: formData.get("id") as string,
            userId: session.user?.id,
        },
        data: {
            clientAddress: submission.value.clientAddress,
            clientEmail: submission.value.clientEmail,
            clientName: submission.value.clientName,
            currency: submission.value.currency,
            date: submission.value.date,
            dueDate: submission.value.dueDate,
            fromAddress: submission.value.fromAddress,
            fromEmail: submission.value.fromEmail,
            fromName: submission.value.fromName,
            invoiceName: submission.value.invoiceName,
            invoiceNumber: submission.value.invoiceNumber,
            status: submission.value.status,
            total: submission.value.total,
            note: submission.value.note,
            automaticReminder: submission.value.automaticReminder,
            invoiceItems: submission.value.invoiceItems,
        },
    });

    await sendInvoiceEmail(data.clientEmail, data.id);

    return redirect("/dashboard/invoices");
}

export async function editInvoice(prevState: any, formData: FormData) {
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: invoiceSchema,
    });

    if (submission.status !== "success") {
        return submission.reply();
    }

    const data = await prisma.invoice.update({
        where: {
            id: formData.get("id") as string,
            userId: session.user?.id,
        },
        data: {
            clientAddress: submission.value.clientAddress,
            clientEmail: submission.value.clientEmail,
            clientName: submission.value.clientName,
            currency: submission.value.currency,
            date: submission.value.date,
            dueDate: submission.value.dueDate,
            fromAddress: submission.value.fromAddress,
            fromEmail: submission.value.fromEmail,
            fromName: submission.value.fromName,
            invoiceName: submission.value.invoiceName,
            invoiceNumber: submission.value.invoiceNumber,
            status: submission.value.status,
            total: submission.value.total,
            note: submission.value.note,
            invoiceItems: submission.value.invoiceItems,
        },
    });

    const sender = {
        email: "hello@demomailtrap.com",
        name: "Jan Marshal",
    };

    emailClient.send({
        from: sender,
        to: [{ email: "jan@alenix.de" }],
        template_uuid: "9d04aa85-6896-48a8-94e9-b54354a48880",
        template_variables: {
            clientName: submission.value.clientName,
            invoiceNumber: submission.value.invoiceNumber,
            invoiceDueDate: new Intl.DateTimeFormat("en-US", {
                dateStyle: "long",
            }).format(new Date(submission.value.date)),
            invoiceAmount: formatCurrency({
                amount: submission.value.total,
                currency: submission.value.currency as any,
            }),
            invoiceLink:
                process.env.NODE_ENV !== "production"
                    ? `http://localhost:3000/api/invoice/${data.id}`
                    : `https://invoice-marshal.vercel.app/api/invoice/${data.id}`,
        },
    });

    return redirect("/dashboard/invoices");
}

export async function DeleteInvoice(invoiceId: string) {
    const session = await requireUser();

    const data = await prisma.invoice.delete({
        where: {
            userId: session.user?.id,
            id: invoiceId,
        },
    });

    return redirect("/dashboard/invoices");
}

export async function MarkAsPaidAction(invoiceId: string) {
    const session = await requireUser();

    const data = await prisma.invoice.update({
        where: {
            userId: session.user?.id,
            id: invoiceId,
        },
        data: {
            status: "PAID",
        },
    });

    return redirect("/dashboard/invoices");
}

export async function MarkAsUnpaidAction(invoiceId: string) {
    const session = await requireUser();

    const data = await prisma.invoice.update({
        where: {
            userId: session.user?.id,
            id: invoiceId,
        },
        data: {
            status: "PENDING",
        },
    });

    return redirect("/dashboard/invoices");
}

export async function SendReminderAction(invoiceId: string) {
    const session = await requireUser();

    const invoice = await prisma.invoice.findUnique({
        where: {
            userId: session.user?.id,
            id: invoiceId,
        },
    });

    if (!invoice) {
        return {
            error: "Factuur niet gevonden",
        };
    }

    await sendInvoiceEmail(invoice?.clientEmail as string, invoiceId, true);

    return {
        success: "Factuur is verzonden",
    };
}
