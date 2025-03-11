"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    CheckCircle,
    DownloadCloudIcon,
    Mail,
    MoreHorizontal,
    Pencil,
    Trash,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import ConfirmDialog from "../custom/confirm-dialog";
import { useState } from "react";
import {
    DeleteInvoice,
    MarkAsPaidAction,
    SendReminderAction,
} from "@/actions/invoice";

interface iAppProps {
    id: string;
    status: string;
}

export function InvoiceActions({ id, status }: iAppProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [markAsPaidDialogOpen, setMarkAsPaidDialogOpen] = useState(false);
    const [reminderDialogOpen, setReminderDialogOpen] = useState(false);

    const handleSendReminder = () => {
        toast.promise(SendReminderAction(id), {
            success: "Herinnering succesvol verzonden!",
        });

        setReminderDialogOpen(false);
    };

    const handleDelete = async () => {
        toast.promise(DeleteInvoice(id), {
            success: "Factuur succesvol verwijderd!",
        });

        setDeleteDialogOpen(false);
    };

    const handleMarkAsPaid = async () => {
        toast.promise(MarkAsPaidAction(id), {
            success: "Factuur succesvol gemarkeerd als betaald!",
        });

        setMarkAsPaidDialogOpen(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="secondary">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/invoices/${id}`}>
                            <Pencil className="size-4 mr-2" /> Verander factuur
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/api/pdf?invoiceId=${id}`} target="_blank">
                            <DownloadCloudIcon className="size-4 mr-2" />{" "}
                            Download factuur
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSendReminder}>
                        <Mail className="size-4 mr-2" /> Reminder e-mail
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
                        <Trash className="size-4 mr-2" /> Verwijder factuur
                    </DropdownMenuItem>
                    {status !== "PAID" && (
                        <DropdownMenuItem
                            onClick={() => setMarkAsPaidDialogOpen(true)}
                        >
                            <CheckCircle className="size-4 mr-2" /> Markeer als
                            betaald
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Verwijder factuur"
                description={`Weet je zeker dat je dit factuur wilt verwijderen?`}
                confirmText="Verwijder factuur"
                cancelText="Annuleer"
            />

            <ConfirmDialog
                open={markAsPaidDialogOpen}
                onClose={() => setMarkAsPaidDialogOpen(false)}
                onConfirm={handleMarkAsPaid}
                title="Markeer als betaald"
                description="Weet je zeker dat je deze factuur wilt markeren als betaald?"
                confirmText="Markeer als betaald"
                cancelText="Annuleer"
                variant="default"
            />

            <ConfirmDialog
                open={reminderDialogOpen}
                onClose={() => setReminderDialogOpen(false)}
                onConfirm={handleSendReminder}
                title="Verstuur reminder"
                description="Weet je zeker dat je een reminder wilt versturen naar de klant?"
                confirmText="Verstuur reminder"
                cancelText="Annuleer"
                variant="default"
            />
        </>
    );
}
