import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationJsonLd } from "@/lib/seo/jsonld";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={buildOrganizationJsonLd()} />
      <SiteHeader />
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-5 py-10 md:py-14">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
