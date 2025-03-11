import { InvoiceList } from "@/components/invoices/invoice-table";
import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function InvoicesRoute() {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            Facturen
                        </CardTitle>
                        <CardDescription>
                            Beheer uw facturen hier
                        </CardDescription>
                    </div>
                    <Link
                        href="/dashboard/invoices/create"
                        className={buttonVariants()}
                    >
                        <PlusIcon /> Maak nieuwe factuur
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
                    <InvoiceList />
                </Suspense>
            </CardContent>
        </Card>
    );
}
