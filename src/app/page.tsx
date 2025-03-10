import { RainbowButton } from "@/components/custom/rainbow-button";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <div className="relative flex flex-col items-center justify-center py-12 lg:py-20">
                <div className="mt-7 mb-12">
                    <Link href="/auth/login">
                        <RainbowButton>Get Unlimted Access</RainbowButton>
                    </Link>
                </div>
            </div>
        </>
    );
}
