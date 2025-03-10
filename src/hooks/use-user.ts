import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export async function requireUser() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/login");
    }

    return session;
}
