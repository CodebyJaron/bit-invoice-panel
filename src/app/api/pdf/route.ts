import prisma from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const invoiceId = searchParams.get("invoiceId");

    if (!invoiceId) {
        return NextResponse.json({ error: "Invalid params" }, { status: 404 });
    }

    const invoice = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
        },
    });

    if (!invoice) {
        return NextResponse.json(
            { error: "Invoice not found" },
            { status: 404 }
        );
    }

    const origin = request.nextUrl.origin;
    const url = `${origin}/pdf/${invoiceId}/`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "20mm",
            right: "20mm",
        },
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=factuur-${invoiceId}.pdf`,
        },
    });
}
