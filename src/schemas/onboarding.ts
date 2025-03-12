import { z } from "zod";

export const onboardingSchema = z.object({
    firstName: z.string().min(2, "Voornaam is verplicht"),
    lastName: z.string().min(2, "Achternaam is verplicht"),
    address: z.string().min(2, "Adres is verplicht"),
});
