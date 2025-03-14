import Link from "next/link";
import {
    ArrowRight,
    BarChart3,
    CreditCard,
    FileText,
    PieChart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="w-full py-12 md:py-24 lg:py-32 bg-background flex items-center justify-center">
                <div className="w-full max-w-5xl px-4 md:px-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">
                            Beheer uw facturen eenvoudig en efficiënt
                        </h1>
                        <p className="text-muted-foreground md:text-xl mb-8 max-w-3xl mx-auto">
                            Ons dashboard biedt u alle tools die u nodig heeft
                            om uw facturatie te stroomlijnen, betalingen bij te
                            houden en uw financiën te beheren.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg">
                                <Link href="/dashboard">
                                    Aan de slag
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button variant="outline" disabled size="lg">
                                <Link href={"/"}>Demo bekijken</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full py-12 md:py-24 bg-muted/50 flex items-center justify-center">
                <div className="w-full max-w-5xl px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
                            Alles wat u nodig heeft voor uw facturatie
                        </h2>
                        <p className="text-muted-foreground md:text-xl max-w-3xl mx-auto">
                            Ontdek de krachtige functies die ons dashboard biedt
                            om uw facturatieproces te optimaliseren.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">
                                    Facturen maken
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Maak professionele facturen in enkele
                                    seconden met onze intuïtieve interface.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <CreditCard className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">
                                    Betalingen
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Volg betalingen en stuur automatisch
                                    herinneringen voor openstaande facturen.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <BarChart3 className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">E-mails</h3>
                                <p className="text-sm text-muted-foreground">
                                    Krijg automatisch e-mails met de facturen
                                    die u aanmaakt!
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <PieChart className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold">
                                    Dashboards
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Bekijk al uw belangrijke gegevens in één
                                    oogopslag met aanpasbare dashboards.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-center mt-12">
                        <Button size="lg" asChild>
                            <Link href="/auth/login">
                                Nu beginnen
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground flex items-center justify-center">
                <div className="w-full max-w-5xl px-4 md:px-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
                            Klaar om te beginnen?
                        </h2>
                        <p className="md:text-xl mb-8 max-w-3xl mx-auto">
                            Meld u vandaag nog aan en begin met het stroomlijnen
                            van uw facturatieproces.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/auth/login">
                                    Gratis proberen
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                disabled
                                variant="outline"
                                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                            >
                                <Link href="/">Prijzen bekijken</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
