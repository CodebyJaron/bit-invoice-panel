## Functionaliteiten

-   📧 Authenticatie via Magic Link
-   📊 Dashboard voor factuurbeheer
-   📄 PDF-generatie voor facturen
-   📱 Responsive design
-   🔒 Beveiligde omgeving

## Technologieën

Het project maakt gebruik van moderne technologieën:

-   **Next.js 15** - React framework voor productie
-   **Next-auth** - Wachtwoordloze authenticatie via e-mail
-   **Mailtrap** - E-mail service voor het versturen van magic links
-   **Conform-to** - Moderne form handling en validatie
-   **Puppeteer** - PDF generatie voor facturen
-   **Shadcn/UI** - Moderne UI componenten bibliotheek
-   **Prisma** - Type-safe database ORM
-   **TailwindCSS** - Utility-first CSS framework

## Installatie

1. Clone het project

```bash
git clone https://github.com/CodebyJaron/bit-invoice-panel.git
cd bit-invoice-panel
```

2. Installeer dependencies

```bash
npm install
```

3. Configureer environment variables

```bash
# Maak een kopie van het .env.example bestand
cp .env.example .env
# Vul de benodigde gegevens in
```

4. Set up de database

```bash
npx prisma migrate dev
npx prisma generate
```

5. Start de development server

```bash
npm run dev
```

## Environment Variables

Maak een `.env` bestand aan met de volgende variabelen:

```env
NODE_ENV="development"
DATABASE_URL="..."
AUTH_SECRET="..."
MAILTRAP_TOKEN="..."
EMAIL_SERVER_HOST=".."
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="..."
EMAIL_SERVER_PASSWORD="..."
EMAIL_FROM="..."
```
