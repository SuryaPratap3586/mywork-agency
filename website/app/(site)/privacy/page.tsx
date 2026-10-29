import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How we collect, use and protect your information."
      sections={[
        { h: "Information we collect", p: ["When you apply for a job we collect the details you submit: your name, email address, phone number, cover letter and resume.", "Our servers may also keep standard technical logs such as IP address and browser type, used for security and to keep the site running."] },
        { h: "How we use it", p: ["We use job application details only to review your application and contact you about it. We use technical logs to protect the website and prevent abuse."] },
        { h: "How we protect it", p: ["Resumes are stored in a private location and can be opened only by authorised team members. Access to our admin area requires a secure login."] },
        { h: "Sharing and retention", p: ["We do not sell your personal information. We keep application details only as long as needed for hiring and then delete them."] },
        { h: "Your choices", p: ["You can ask us to access, correct or delete the information you gave us by contacting us."] },
      ]}
    />
  );
}
