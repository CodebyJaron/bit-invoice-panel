import { requireUser } from "@/hooks/use-user";
import prisma from "@/server/db";

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
            <h1>Hello</h1>
        </>
    );
}
