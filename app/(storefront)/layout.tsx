import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TrustBar } from "@/components/layout/TrustBar";
import { CookieBanner } from "@/components/marketing/CookieBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationJsonLd } from "@/lib/seo/jsonld";
import { getTestimonialStats } from "@/lib/queries/content";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rating = await getTestimonialStats();
  return (
    <>
      <JsonLd data={buildOrganizationJsonLd(rating)} />
      <TrustBar />
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-5 py-10 md:py-14">
        {children}
      </main>
      <SiteFooter />
      <CookieBanner />
    </>
  );
}
