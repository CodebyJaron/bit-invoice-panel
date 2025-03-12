import { z } from "zod";

export const invoiceSchema = z.object({
    invoiceName: z.string().min(1, "Factuurnaam is verplicht"),
    total: z.number().min(1, "Minimaal $1 vereist"),
    status: z.enum(["PAID", "PENDING"]).default("PENDING"),
    date: z.string().min(1, "Datum is verplicht"),
    dueDate: z.number().min(0, "Vervaldatum is verplicht"),
    fromName: z.string().min(1, "Uw naam is verplicht"),
    fromEmail: z.string().email("Ongeldig e-mailadres"),
    fromAddress: z.string().min(1, "Uw adres is verplicht"),
    clientName: z.string().min(1, "Klantnaam is verplicht"),
    clientEmail: z.string().email("Ongeldig e-mailadres"),
    clientAddress: z.string().min(1, "Klantadres is verplicht"),
    currency: z.string().min(1, "Valuta is verplicht"),
    invoiceNumber: z.number().min(1, "Factuurnummer moet minimaal 1 zijn"),
    note: z.string().optional(),
    automaticReminder: z.boolean().default(false),

    invoiceItems: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                try {
                    return JSON.parse(val);
                } catch {
                    return val;
                }
            }
            return val;
        },
        z.array(
            z.object({
                description: z.string().min(1, "Beschrijving is verplicht"),
                quantity: z.number().min(1, "Hoeveelheid moet minimaal 1 zijn"),
                rate: z.number().min(1, "Tarief moet minimaal 1 zijn"),
            })
        )
    ),
});
