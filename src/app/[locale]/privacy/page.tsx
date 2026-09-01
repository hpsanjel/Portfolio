import { Metadata } from "next";
import SectionHeader from "../../components/SectionHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for SanjelTech's website. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "/privacy",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy | SanjelTech",
    description: "Learn how SanjelTech collects, uses, and protects your personal information.",
    url: "/privacy",
  },
};

export default function PrivacyPolicy() {
  return (
    <section className="w-full px-6 sm:px-8 md:px-12 lg:px-[15%] py-10">
      <SectionHeader
        as="h1"
        intro="Legal Information"
        title="Privacy Policy"
        description="Your privacy is important to us"
      />
      
      <div className="max-w-4xl mx-auto prose prose prose-gray dark:prose-invert">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Who We Are</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This website is operated by Hari Prasad Sanjel, trading as SanjelTech, based in Oslo, Norway. Hari Prasad Sanjel is the data controller responsible for the personal data described in this policy. You can reach us through the <a href="/contact">contact page</a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Contact form:</strong> the name, email address, and message you submit are emailed directly to us so we can respond.</li>
              <li><strong>Blog comments:</strong> the name, email address, and comment text you submit, held for moderation before a comment is published.</li>
              <li><strong>Basic usage analytics:</strong> the page path you visit and a randomly generated identifier stored in your browser&apos;s local storage (not a cookie), so we can see which pages are popular. We do not record your IP address or location as part of this.</li>
              <li><strong>Aggregate, cookie-free analytics</strong> provided by Vercel Web Analytics, which does not use cookies or persistent identifiers to track individual visitors.</li>
              <li><strong>CV Builder:</strong> if you use the CV builder tool, the details you enter are used only in your browser to generate your document and are not sent to or stored on our servers.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How We Use This Information, and Why We&apos;re Allowed To</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>To respond to messages sent through the contact form (legitimate interest in running the business, and to take steps you request before entering into an agreement).</li>
              <li>To moderate and display blog comments you choose to submit (your consent, given by submitting the comment).</li>
              <li>To understand which pages are useful and improve the site (legitimate interest in operating and improving the website), using data that is not tied to your identity.</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We do not sell personal data, and we do not use it for advertising or profiling.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Third-Party Services We Use</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We rely on the following processors to run this website. Some are located outside Norway/the EEA (for example, in the United States); where that is the case, we rely on the safeguards those providers offer, such as Standard Contractual Clauses.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>MongoDB Atlas</strong> — stores blog, project, comment, and basic analytics data.</li>
              <li><strong>Cloudinary</strong> — hosts images used on the site.</li>
              <li><strong>Google (Gmail/Nodemailer)</strong> — delivers contact-form messages to our inbox.</li>
              <li><strong>Vercel</strong> — hosts our cookie-free web analytics.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cookies and Local Storage</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This site does not use advertising or tracking cookies. It stores a randomly generated identifier in your browser&apos;s local storage solely to avoid double-counting page views in our own analytics; this identifier is not linked to your name, email, or any other personal detail, and is not shared with advertisers. You can clear it at any time by clearing your browser&apos;s site data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Retention</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We keep contact-form messages and blog comments for as long as needed to respond to you or display the comment, and delete them when no longer needed or on request. Basic analytics data is kept in aggregate form and is not used to identify individuals.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Security</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We use industry-standard measures, including encrypted connections (HTTPS) and access controls on our administrative tools, to protect the data described above against unauthorized access, alteration, or disclosure.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Under the GDPR, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict certain processing</li>
              <li>Request a copy of your data in a portable format</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              To exercise any of these rights, contact us through the <a href="/contact">contact page</a>. You also have the right to lodge a complaint with the Norwegian Data Protection Authority (Datatilsynet) at{" "}
              <a href="https://www.datatilsynet.no" target="_blank" rel="noopener noreferrer">datatilsynet.no</a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this privacy policy from time to time. Changes will be posted on this page along with an updated &ldquo;Last updated&rdquo; date.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy or want to exercise your rights, please reach out through our <a href="/contact">contact page</a>.
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Last updated:</strong> August 30, 2026
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
