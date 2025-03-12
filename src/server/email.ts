import { MailtrapClient } from "mailtrap";

export const emailClient = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN!,
    testInboxId: 3486944,

    sandbox: !!process.env.NODE_ENV,
});
