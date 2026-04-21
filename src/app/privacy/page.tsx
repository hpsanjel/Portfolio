import { Metadata } from "next";
import SectionHeader from "../components/SectionHeader";

export const metadata: Metadata = {
  title: "Privacy Policy - Hari Prasad Sanjel",
  description: "Privacy Policy for Hari Prasad Sanjel's portfolio website. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicy() {
  return (
    <section className="w-full px-6 sm:px-8 md:px-12 lg:px-[15%] py-10">
      <SectionHeader 
        intro="Legal Information"
        title="Privacy Policy"
        description="Your privacy is important to us"
      />
      
      <div className="max-w-4xl mx-auto prose prose prose-gray dark:prose-invert">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Information We Collect</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may collect information you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Visit our website</li>
              <li>Fill out our contact form</li>
              <li>Subscribe to our newsletter</li>
              <li>Use our services</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This information may include your name, email address, and any other information you choose to provide.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Provide and maintain our portfolio website</li>
              <li>Respond to your inquiries and requests</li>
              <li>Improve our services and user experience</li>
              <li>Send you periodic communications (only with your consent)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Protection</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our website uses industry-standard security protocols and encryption where applicable.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Third-Party Services</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our website may contain links to third-party services. We are not responsible for the privacy practices of these external websites.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Rights</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Access and update your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of the data we hold about you</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cookies and Tracking</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our website may use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie settings through your browser preferences.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Email: As provided in contact page</li>
              <li>Website: Through our portfolio contact page</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
