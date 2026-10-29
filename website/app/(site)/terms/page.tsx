import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Terms and Conditions", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      intro="The rules for using this website."
      sections={[
        { h: "Using this website", p: ["By using this website you agree to use it lawfully and not to attempt to disrupt, scrape at scale or gain unauthorised access to any part of it."] },
        { h: "Content", p: ["The content on this website, including text, images, videos and designs, belongs to us or our clients and may not be copied or reused without permission."] },
        { h: "Projects and results", p: ["Case studies and results describe past work. Results depend on many factors and are not a guarantee of future performance."] },
        { h: "Third-party links", p: ["This website may link to or embed third-party sites such as YouTube or Vimeo. We are not responsible for their content or policies."] },
        { h: "Changes", p: ["We may update these terms from time to time. Continued use of the website means you accept the updated terms."] },
      ]}
    />
  );
}
