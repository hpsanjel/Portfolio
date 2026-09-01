import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SectionHeader from "../../components/SectionHeader";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for SanjelTech's website. Read our terms and conditions for using our services.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | SanjelTech",
    description: "Read the terms and conditions for using SanjelTech's services.",
    url: "/terms",
  },
};

export default function TermsOfService() {
  const t = useTranslations("Terms");
  return (
    <section className="w-full px-6 sm:px-8 md:px-12 lg:px-[15%] py-10">
      <SectionHeader
        as="h1"
        intro={t("intro")}
        title={t("title")}
        description={t("description")}
      />

      <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("acceptance.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("acceptance.body")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("useOfServices.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("useOfServices.body1")}</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("useOfServices.body2")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("intellectualProperty.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("intellectualProperty.body1")}</p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("intellectualProperty.body2")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("userContent.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("userContent.body")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("privacyDataProtection.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t.rich("privacyDataProtection.body", {
                link: (chunks) => (
                  <Link href="/privacy" className="text-accent dark:text-yellow-400 hover:underline">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("limitationOfLiability.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("limitationOfLiability.body")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("termination.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("termination.body")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("changesToTerms.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("changesToTerms.body")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("contactInformation.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t.rich("contactInformation.body", {
                link: (chunks) => (
                  <Link href="/contact" className="text-accent dark:text-yellow-400 hover:underline">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("governingLaw.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("governingLaw.body")}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>{t("lastUpdated")}:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
