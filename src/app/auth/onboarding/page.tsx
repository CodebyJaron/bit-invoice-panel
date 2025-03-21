"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "@/schemas/onboarding";
import { onboardUser } from "@/actions/auth";
import { SubmitButton } from "@/components/custom/submit-button";

export default function Onboarding() {
    const [lastResult, action] = useActionState(onboardUser, undefined);
    const [form, fields] = useForm({
        lastResult,

        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: onboardingSchema,
            });
        },

        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });
    return (
        <div className="min-h-screen w-screen flex items-center justify-center">
            <Card className="max-w-sm mx-auto">
                <CardHeader>
                    <CardTitle className="text-xl">
                        Je bent bijna klaar!
                    </CardTitle>
                    <CardDescription>
                        Vul je gegevens in om een account aan te maken
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        className="grid gap-4"
                        action={action}
                        id={form.id}
                        onSubmit={form.onSubmit}
                        noValidate
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>Voornaam</Label>
                                <Input
                                    name={fields.firstName.name}
                                    key={fields.firstName.key}
                                    defaultValue={fields.firstName.initialValue}
                                    placeholder="Jan"
                                />
                                <p className="text-red-500 text-sm">
                                    {fields.firstName.errors}
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Label>Achternaam</Label>
                                <Input
                                    name={fields.lastName.name}
                                    key={fields.lastName.key}
                                    defaultValue={fields.lastName.initialValue}
                                    placeholder="Jansen"
                                />
                                <p className="text-red-500 text-sm">
                                    {fields.lastName.errors}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Adres</Label>
                            <Input
                                name={fields.address.name}
                                key={fields.address.key}
                                defaultValue={fields.address.initialValue}
                                placeholder="Voorbeeldstraat 123"
                            />
                            <p className="text-red-500 text-sm">
                                {fields.address.errors}
                            </p>
                        </div>

                        <SubmitButton text="Voltooi registratie" />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
