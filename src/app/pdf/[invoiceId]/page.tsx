import { formatCurrency } from "@/lib/utils";
import prisma from "@/server/db";
import { format } from "date-fns";

async function getInvoice(id: string) {
    const invoice = await prisma.invoice.findFirst({
        where: {
            id,
        },
    });

    if (!invoice) {
        throw new Error("Invoice not found");
    }

    return invoice;
}

export default async function InvoicePDF({
    params,
}: {
    params: { id: string };
}) {
    const invoice = await getInvoice(params.id);
    const dueDate = new Date(invoice.date);
    dueDate.setDate(dueDate.getDate() + invoice.dueDate);

    const items = invoice.invoiceItems as {
        quantity: number;
        rate: number;
        description: string;
    }[];
    const totalAmount = Array.isArray(items)
        ? items.reduce((acc, item) => acc + item.quantity * item.rate, 0)
        : 0;

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white print:max-w-full print:mx-0 print:p-0 print:bg-white">
            {/* Invoice Header */}
            <div className="flex justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {invoice.fromName}
                    </h1>
                    <p className="text-gray-600">{invoice.fromAddress}</p>
                    <p className="text-gray-600">{invoice.fromEmail}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-bold text-gray-800">
                        FACTUUR
                    </h2>
                    <p className="text-gray-600">
                        Factuurnummer: {invoice.invoiceNumber}
                    </p>
                    <p className="text-gray-600">
                        Datum: {format(invoice.date, "dd-MM-yyyy")}
                    </p>
                    <p className="text-gray-600">
                        Vervaldatum: {format(dueDate, "dd-MM-yyyy")}
                    </p>
                </div>
            </div>

            {/* Client Information */}
            <div className="mb-8 p-4 bg-gray-50 rounded print:bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">Factuur aan:</h3>
                <p className="font-medium">{invoice.clientName}</p>
                <p>{invoice.clientAddress}</p>
                <p>{invoice.clientEmail}</p>
            </div>

            {/* Invoice Description */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Factuur voor:</h3>
                <p>{invoice.invoiceName}</p>
            </div>

            {/* Invoice Items */}
            <table className="w-full mb-8 border-collapse">
                <thead>
                    <tr className="bg-gray-100 print:bg-gray-100">
                        <th className="py-2 px-4 text-left border-b">
                            Omschrijving
                        </th>
                        <th className="py-2 px-4 text-right border-b">
                            Aantal
                        </th>
                        <th className="py-2 px-4 text-right border-b">Prijs</th>
                        <th className="py-2 px-4 text-right border-b">
                            Bedrag
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(items) &&
                        items.map((item, index: number) => (
                            <tr key={index} className="border-b">
                                <td className="py-2 px-4 text-left">
                                    {item.description}
                                </td>
                                <td className="py-2 px-4 text-right">
                                    {item.quantity}
                                </td>
                                <td className="py-2 px-4 text-right">
                                    {formatCurrency({
                                        amount: item.rate,
                                        currency: invoice.currency as any,
                                    })}
                                </td>
                                <td className="py-2 px-4 text-right">
                                    {formatCurrency({
                                        amount: item.quantity * item.rate,
                                        currency: invoice.currency as any,
                                    })}
                                </td>
                            </tr>
                        ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td
                            colSpan={3}
                            className="py-2 px-4 text-right font-semibold"
                        >
                            Totaal:
                        </td>
                        <td className="py-2 px-4 text-right font-bold">
                            {formatCurrency({
                                amount: totalAmount,
                                currency: invoice.currency as any,
                            })}
                        </td>
                    </tr>
                </tfoot>
            </table>

            {/* Payment Information */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">
                    Betalingsinformatie:
                </h3>
                <p>Betaaltermijn: {invoice.dueDate} dagen</p>
                <p>
                    Status:{" "}
                    <span
                        className={`font-semibold ${
                            invoice.status === "PAID"
                                ? "text-green-600"
                                : "text-orange-600"
                        }`}
                    >
                        {invoice.status === "PAID" ? "Betaald" : "Openstaand"}
                    </span>
                </p>
            </div>

            {/* Notes */}
            {invoice.note && (
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">Opmerkingen:</h3>
                    <p>{invoice.note}</p>
                </div>
            )}

            {/* Footer */}
            <div className="mt-16 pt-4 border-t text-sm text-gray-600">
                <p className="mb-1">{invoice.fromName}</p>
                <p className="mb-1">{invoice.fromAddress}</p>
                <p className="mb-1">{invoice.fromEmail}</p>
            </div>
        </div>
    );
}
