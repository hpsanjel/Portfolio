import { Metadata } from "next";
import SectionHeader from "../components/SectionHeader";

export const metadata: Metadata = {
  title: "Terms of Service - Hari Prasad Sanjel",
  description: "Terms of Service for Hari Prasad Sanjel's portfolio website. Read our terms and conditions for using our services.",
};

export default function TermsOfService() {
  return (
    <section className="w-full px-6 sm:px-8 md:px-12 lg:px-[15%] py-10">
      <SectionHeader 
        intro="Legal Information"
        title="Terms of Service"
        description="Please read these terms carefully"
      />
      
      <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By accessing and using our portfolio website, you accept and agree to be bound by these Terms of Service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Use of Services</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our portfolio website is provided for informational purposes to showcase our work and services. You may use our services for legitimate purposes only.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You agree not to use our services for any illegal, harmful, or unauthorized purposes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Intellectual Property</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All content, including but not limited to text, graphics, logos, and images, on this website is the property of Hari Prasad Sanjel or to some extent of respective content owners.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You may not reproduce, distribute, or create derivative works without explicit written permission.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Content</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you submit any content through our contact forms or other means, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Privacy and Data Protection</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Your privacy is important to us. Please review our <a href="/privacy" className="text-yellow-600 dark:text-yellow-400 hover:underline">Privacy Policy</a>, which also governs your use of our website.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Our website and services are provided "as is" without any warranties, express or implied. We shall not be liable for any indirect, incidental, or consequential damages.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Termination</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may terminate or suspend your access to our services immediately, without prior notice or liability, for any reason.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us through our <a href="/contact" className="text-yellow-600 dark:text-yellow-400 hover:underline">contact form</a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Governing Law</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction where our website operates.
            </p>
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
