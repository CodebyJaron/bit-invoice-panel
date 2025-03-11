"use server";

import prisma from "@/server/db";
import { emailClient } from "@/server/email";

export const sendInvoiceEmail = async (email: string, invoiceId: string) => {
    const invoice = await prisma.invoice.findFirst({
        where: {
            id: invoiceId,
        },
    });

    if (!invoice) {
        throw new Error("Invoice not found");
    }

    const dueDate = new Date(invoice.date);
    dueDate.setDate(dueDate.getDate() + invoice.dueDate);

    const invoiceUrl = `localhost:3000/pdf/${invoiceId}/`;

    const sender = {
        email: "me@codebyjaron.nl",
        name: "Bit-Facturen",
    };

    const htmlContent = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          /* Basis styling geïnspireerd op Tailwind */
          .container { padding: 20px; font-family: Arial, sans-serif; }
          .header { font-size: 24px; font-weight: bold; margin-bottom: 16px; }
          .content { font-size: 16px; margin-bottom: 20px; line-height: 1.5; }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3B82F6;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            margin-top: 20px;
          }
          @media (max-width: 600px) {
            .container { padding: 10px; }
            .header { font-size: 20px; }
            .content { font-size: 14px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Factuur Aangemaakt</div>
          <div class="content">
            Beste klant,<br/><br/>
            Er is een nieuwe factuur aangemaakt die u dient te voldoen voor <strong>${dueDate}</strong>.<br/><br/>
            Klik op de onderstaande knop om uw factuur te downloaden.
          </div>
          <a href="${invoiceUrl}" class="button">Download Factuur</a>
          <div class="content" style="margin-top: 30px;">
            Met vriendelijke groet,<br/>
            Uw Bedrijf
          </div>
        </div>
      </body>
    </html>
    `;

    const textContent = `
  Beste klant,
  
  Er is een nieuwe factuur aangemaakt die u dient te voldoen voor ${dueDate}.
  Download uw factuur via de volgende link: ${invoiceUrl}
  
  Met vriendelijke groet,
  Uw Bedrijf
    `;

    console.log(process.env.MAILTRAP_TOKEN);

    try {
        await emailClient.send({
            from: sender,
            to: [{ email }],
            subject: "Nieuwe Factuur Aangemaakt",
            html: htmlContent,
            text: textContent,
        });
    } catch (error) {
        console.error(error);

        return {
            success: false,
        };
    }

    return {
        success: true,
    };
};
