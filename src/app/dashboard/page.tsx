import { DashboardBlocks } from "@/components/dashboard/dashboard-blocks";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { requireUser } from "@/hooks/use-user";
import prisma from "@/server/db";
import { Suspense } from "react";

async function getData(userId: string) {
    const data = await prisma.invoice.findMany({
        where: {
            userId: userId,
        },
        select: {
            id: true,
        },
    });

    return data;
}

export default async function DashboardRoute() {
    const session = await requireUser();
    const data = await getData(session.user?.id as string);

    return (
        <>
            {data.length < 1 ? (
                <EmptyState
                    title="Geen facturen gevonden"
                    description="Je hebt nog geen facturen aangemaakt. Maak nu een factuur aan."
                    buttontext="Maak een factuur aan"
                    href="/dashboard/invoices/create"
                />
            ) : (
                <Suspense
                    fallback={<Skeleton className="w-full h-full flex-1" />}
                >
                    <DashboardBlocks />
                </Suspense>
            )}
        </>
    );
}
