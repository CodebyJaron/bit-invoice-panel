"use server";

import prisma from "@/server/db";
import { emailClient } from "@/server/email";

export const sendInvoiceEmail = async (
    email: string,
    invoiceId: string,
    isReminder: boolean = false
) => {
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
    const formattedDueDate = dueDate.toLocaleDateString("nl-NL");

    const invoiceUrl = `http://localhost:3000/api/pdf?invoiceId=${invoiceId}/`;

    const sender = {
        email: "me@codebyjaron.nl",
        name: "Bit-Facturen",
    };

    const subject = isReminder
        ? "Herinnering: Openstaande factuur"
        : "Nieuwe factuur";

    const htmlContent = isReminder
        ? `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
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
          <div class="header">Herinnering: Openstaande Factuur</div>
          <div class="content">
            Beste ${invoice.clientName},<br/><br/>
            Dit is een vriendelijke herinnering dat uw factuur nog openstaat. Wij verzoeken u de betaling te voldoen voor <strong>${formattedDueDate}</strong>.<br/><br/>
            Klik op de onderstaande knop om uw factuur te downloaden.
          </div>
          <a href="${invoiceUrl}" class="button">Download Factuur</a>
          <div class="content" style="margin-top: 30px;">
            Met vriendelijke groet,<br/>
            ${invoice.fromName}
          </div>
        </div>
      </body>
    </html>
    `
        : `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
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
            Beste ${invoice.clientName},<br/><br/>
            Er is een nieuwe factuur voor u aangemaakt. U dient deze te voldoen voor <strong>${formattedDueDate}</strong>.<br/><br/>
            Klik op de onderstaande knop om uw factuur te downloaden.
          </div>
          <a href="${invoiceUrl}" class="button">Download Factuur</a>
          <div class="content" style="margin-top: 30px;">
            Met vriendelijke groet,<br/>
            ${invoice.fromName}
          </div>
        </div>
      </body>
    </html>
    `;

    const textContent = isReminder
        ? `
Beste ${invoice.clientName},

Dit is een herinnering dat uw factuur nog openstaat. Wij verzoeken u vriendelijk om de betaling te voldoen voor ${formattedDueDate}.
Download uw factuur via de volgende link: ${invoiceUrl}

Met vriendelijke groet,
${invoice.fromName}
    `
        : `
Beste ${invoice.clientName},

Er is een nieuwe factuur voor u aangemaakt die u dient te voldoen voor ${formattedDueDate}.
Download uw factuur via de volgende link: ${invoiceUrl}

Met vriendelijke groet,
${invoice.fromName}
`;

    try {
        await emailClient.send({
            from: sender,
            to: [{ email }],
            subject,
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
