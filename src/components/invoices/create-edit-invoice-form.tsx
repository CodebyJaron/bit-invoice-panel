"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useActionState, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema } from "@/schemas/invoice";
import { createInvoice, updateInvoice } from "@/actions/invoice";
import { SubmitButton } from "../custom/submit-button";

interface InvoiceData {
    id: string;
    invoiceName?: string;
    invoiceNumber?: string;
    currency?: "USD" | "EUR";
    date?: string;
    dueDate?: string;
    automaticReminder?: boolean;
    invoiceItems?: Array<{
        description: string;
        quantity: string;
        rate: string;
    }>;
    note?: string;
    fromName?: string;
    fromEmail?: string;
    fromAddress?: string;
    clientName?: string;
    clientEmail?: string;
    clientAddress?: string;
    total?: number;
}

interface iAppProps {
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    invoiceData?: InvoiceData;
}

export function CreateEditInvoiceForm({
    address,
    email,
    firstName,
    lastName,
    invoiceData,
}: iAppProps) {
    const actionFn = invoiceData ? updateInvoice : createInvoice;
    const [lastResult, action] = useActionState(actionFn, undefined);

    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: invoiceSchema,
            });
        },
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
        defaultValue: {
            invoiceName: invoiceData?.invoiceName || "",
            invoiceNumber: invoiceData?.invoiceNumber || "",
            currency: invoiceData?.currency || "EUR",
            dueDate: invoiceData?.dueDate || "0",
            fromName: invoiceData?.fromName || firstName + " " + lastName,
            fromEmail: invoiceData?.fromEmail || email,
            fromAddress: invoiceData?.fromAddress || address,
            clientName: invoiceData?.clientName || "",
            clientEmail: invoiceData?.clientEmail || "",
            clientAddress: invoiceData?.clientAddress || "",
            note: invoiceData?.note || "",
        },
    });

    const [selectedDate, setSelectedDate] = useState(
        invoiceData && invoiceData.date
            ? new Date(invoiceData.date)
            : new Date()
    );
    const [currency, setCurrency] = useState<"USD" | "EUR">(
        invoiceData?.currency || "EUR"
    );
    const [sendReminder, setSendReminder] = useState(
        invoiceData?.automaticReminder || false
    );
    const [invoiceItems, setInvoiceItems] = useState(
        invoiceData?.invoiceItems && invoiceData.invoiceItems.length > 0
            ? invoiceData.invoiceItems
            : [{ description: "", quantity: "", rate: "" }]
    );

    const calculateTotal = invoiceItems.reduce(
        (acc, item) =>
            acc + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
        0
    );

    const addInvoiceItem = () =>
        setInvoiceItems([
            ...invoiceItems,
            { description: "", quantity: "", rate: "" },
        ]);

    const removeInvoiceItem = (index: number) => {
        if (invoiceItems.length > 1) {
            const newItems = [...invoiceItems];
            newItems.splice(index, 1);
            setInvoiceItems(newItems);
        }
    };

    return (
        <Card className="w-full max-w-7xl mx-auto shadow-lg">
            <CardContent className="p-6">
                <form
                    id={form.id}
                    action={action}
                    onSubmit={form.onSubmit}
                    noValidate
                    className="space-y-8"
                >
                    <input
                        type="hidden"
                        name={fields.date.name}
                        value={selectedDate.toISOString()}
                    />

                    <input
                        type="hidden"
                        name={fields.total.name}
                        value={calculateTotal}
                    />

                    <input
                        type="hidden"
                        name="invoiceItems"
                        value={JSON.stringify(invoiceItems)}
                    />

                    <input
                        type="hidden"
                        name="sendReminder"
                        value={sendReminder.toString()}
                    />

                    {invoiceData && (
                        <input type="hidden" name="id" value={invoiceData.id} />
                    )}

                    <div className="flex flex-col gap-1 w-fit">
                        <div className="flex items-center gap-4">
                            <Badge variant="secondary">Concept</Badge>
                            <Input
                                name={fields.invoiceName.name}
                                key={fields.invoiceName.key}
                                defaultValue={fields.invoiceName.initialValue}
                                placeholder="Factuur naam"
                                className="min-w-[250px]"
                            />
                        </div>
                        <p className="text-sm text-red-500">
                            {fields.invoiceName.errors}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <Label>Factuurnummer</Label>
                            <div className="flex">
                                <span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
                                    #
                                </span>
                                <Input
                                    name={fields.invoiceNumber.name}
                                    key={fields.invoiceNumber.key}
                                    defaultValue={
                                        fields.invoiceNumber.initialValue
                                    }
                                    className="rounded-l-none"
                                    placeholder="5"
                                />
                            </div>
                            <p className="text-red-500 text-sm">
                                {fields.invoiceNumber.errors}
                            </p>
                        </div>

                        <div>
                            <Label>Valuta</Label>
                            <Select
                                defaultValue={currency}
                                name={fields.currency.name}
                                key={fields.currency.key}
                                onValueChange={(value: "USD" | "EUR") =>
                                    setCurrency(value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecteer valuta" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USD">
                                        Amerikaanse Dollar -- USD
                                    </SelectItem>
                                    <SelectItem value="EUR">
                                        Euro -- EUR
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-red-500 text-sm">
                                {fields.currency.errors}
                            </p>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-medium text-lg">Van</h3>
                            <div className="space-y-3">
                                <div>
                                    <Label>Naam</Label>
                                    <Input
                                        name={fields.fromName.name}
                                        key={fields.fromName.key}
                                        placeholder="Uw naam"
                                        defaultValue={
                                            fields.fromName.initialValue
                                        }
                                    />
                                    <p className="text-red-500 text-sm mt-1">
                                        {fields.fromName.errors}
                                    </p>
                                </div>
                                <div>
                                    <Label>E-mail</Label>
                                    <Input
                                        placeholder="Uw e-mail"
                                        name={fields.fromEmail.name}
                                        key={fields.fromEmail.key}
                                        defaultValue={
                                            fields.fromEmail.initialValue
                                        }
                                    />
                                    <p className="text-red-500 text-sm mt-1">
                                        {fields.fromEmail.errors}
                                    </p>
                                </div>
                                <div>
                                    <Label>Adres</Label>
                                    <Input
                                        placeholder="Uw adres"
                                        name={fields.fromAddress.name}
                                        key={fields.fromAddress.key}
                                        defaultValue={
                                            fields.fromAddress.initialValue
                                        }
                                    />
                                    <p className="text-red-500 text-sm mt-1">
                                        {fields.fromAddress.errors}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-medium text-lg">Aan</h3>
                            <div className="space-y-3">
                                <div>
                                    <Label>Naam</Label>
                                    <Input
                                        name={fields.clientName.name}
                                        key={fields.clientName.key}
                                        defaultValue={
                                            fields.clientName.initialValue
                                        }
                                        placeholder="Klantnaam"
                                    />
                                    <p className="text-red-500 text-sm mt-1">
                                        {fields.clientName.errors}
                                    </p>
                                </div>
                                <div>
                                    <Label>E-mail</Label>
                                    <Input
                                        name={fields.clientEmail.name}
                                        key={fields.clientEmail.key}
                                        defaultValue={
                                            fields.clientEmail.initialValue
                                        }
                                        placeholder="Klant e-mail"
                                    />
                                    <p className="text-red-500 text-sm mt-1">
                                        {fields.clientEmail.errors}
                                    </p>
                                </div>
                                <div>
                                    <Label>Adres</Label>
                                    <Input
                                        name={fields.clientAddress.name}
                                        key={fields.clientAddress.key}
                                        defaultValue={
                                            fields.clientAddress.initialValue
                                        }
                                        placeholder="Klant adres"
                                    />
                                    <p className="text-red-500 text-sm mt-1">
                                        {fields.clientAddress.errors}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <Label>Datum</Label>
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full md:w-[200px] text-left justify-start"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {selectedDate ? (
                                            new Intl.DateTimeFormat("nl-NL", {
                                                dateStyle: "long",
                                            }).format(selectedDate)
                                        ) : (
                                            <span>Kies een datum</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Calendar
                                        selected={selectedDate}
                                        onSelect={(date) =>
                                            setSelectedDate(date || new Date())
                                        }
                                        mode="single"
                                        fromDate={new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                            <p className="text-red-500 text-sm">
                                {fields.date.errors}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Label>Betalingstermijn</Label>
                            <Select
                                name={fields.dueDate.name}
                                key={fields.dueDate.key}
                                defaultValue={fields.dueDate.initialValue}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecteer betalingstermijn" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">
                                        Direct bij ontvangst
                                    </SelectItem>
                                    <SelectItem value="15">
                                        Binnen 15 dagen
                                    </SelectItem>
                                    <SelectItem value="30">
                                        Binnen 30 dagen
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-red-500 text-sm">
                                {fields.dueDate.errors}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            name={fields.automaticReminder.name}
                            key={fields.automaticReminder.key}
                            checked={sendReminder}
                            onCheckedChange={(checked) =>
                                setSendReminder(checked as boolean)
                            }
                        />
                        <Label htmlFor="reminder" className="cursor-pointer">
                            Automatische betalingsherinnering versturen
                        </Label>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                        <h3 className="font-medium text-lg">Factuuritems</h3>
                        <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
                            <p className="col-span-6">Omschrijving</p>
                            <p className="col-span-2">Aantal</p>
                            <p className="col-span-2">Tarief</p>
                            <p className="col-span-2">Bedrag</p>
                        </div>

                        {invoiceItems.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-12 gap-4 mb-4 items-start"
                            >
                                <div className="col-span-6">
                                    <Textarea
                                        value={item.description}
                                        onChange={(e) => {
                                            const newItems = [...invoiceItems];
                                            newItems[index].description =
                                                e.target.value;
                                            setInvoiceItems(newItems);
                                        }}
                                        placeholder="Itemnaam & omschrijving"
                                        className="resize-none"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => {
                                            const newItems = [...invoiceItems];
                                            newItems[index].quantity =
                                                e.target.value;
                                            setInvoiceItems(newItems);
                                        }}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        type="number"
                                        value={item.rate}
                                        onChange={(e) => {
                                            const newItems = [...invoiceItems];
                                            newItems[index].rate =
                                                e.target.value;
                                            setInvoiceItems(newItems);
                                        }}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <Input
                                        disabled
                                        value={formatCurrency({
                                            amount:
                                                (Number(item.quantity) || 0) *
                                                (Number(item.rate) || 0),
                                            currency: currency,
                                        })}
                                    />
                                </div>
                                <div className="col-span-1 flex justify-center items-center h-full">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeInvoiceItem(index)}
                                        disabled={invoiceItems.length <= 1}
                                    >
                                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            onClick={addInvoiceItem}
                            variant="outline"
                            className="mt-2"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Item Toevoegen
                        </Button>

                        <div className="flex justify-end mt-6">
                            <div className="w-full md:w-1/3">
                                <div className="flex justify-between py-2">
                                    <span>Subtotaal</span>
                                    <span>
                                        {formatCurrency({
                                            amount: calculateTotal,
                                            currency: currency,
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-t">
                                    <span>Totaal ({currency})</span>
                                    <span className="font-medium underline underline-offset-2">
                                        {formatCurrency({
                                            amount: calculateTotal,
                                            currency: currency,
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                        <Label>Notitie</Label>
                        <Textarea
                            name={fields.note.name}
                            key={fields.note.key}
                            defaultValue={fields.note.initialValue}
                            placeholder="Voeg hier uw notitie(s) toe..."
                            className="min-h-[100px]"
                        />
                        <p className="text-red-500 text-sm">
                            {fields.note.errors}
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                        <SubmitButton
                            text={
                                invoiceData
                                    ? "Factuur bijwerken"
                                    : "Factuur naar klant versturen"
                            }
                        />
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
