import { SubmitButton } from "@/components/custom/submit-button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { auth, signIn } from "@/server/auth";
import { Label } from "@radix-ui/react-label";
import { redirect } from "next/navigation";

export default async function Login() {
    const session = await auth();

    if (session?.user) {
        redirect("/dashboard");
    }
    return (
        <>
            <div className="flex h-screen w-full items-center justify-center px-4">
                <Card className="max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Inloggen</CardTitle>
                        <CardDescription>
                            Vul hieronder uw e-mailadres in om in te loggen op
                            uw account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            action={async (formData) => {
                                "use server";
                                await signIn("nodemailer", formData);
                            }}
                            className="flex flex-col gap-y-4"
                        >
                            <div className="flex flex-col gap-y-2">
                                <Label>E-mail</Label>
                                <Input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="hello@hello.com"
                                />
                            </div>
                            <SubmitButton text="Inloggen" />
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
