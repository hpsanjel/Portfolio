import { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
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
  const t = useTranslations("Privacy");
  const contactPageLink = (chunks: React.ReactNode) => (
    <Link href="/contact">{chunks}</Link>
  );
  const boldChunk = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  return (
    <section className="w-full px-6 sm:px-8 md:px-12 lg:px-[15%] py-10">
      <SectionHeader
        as="h1"
        intro={t("intro")}
        title={t("title")}
        description={t("description")}
      />

      <div className="max-w-4xl mx-auto prose prose prose-gray dark:prose-invert">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("whoWeAre.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t.rich("whoWeAre.body", { link: contactPageLink })}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("informationWeCollect.heading")}</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>{t.rich("informationWeCollect.contactForm", { b: boldChunk })}</li>
              <li>{t.rich("informationWeCollect.blogComments", { b: boldChunk })}</li>
              <li>{t.rich("informationWeCollect.usageAnalytics", { b: boldChunk })}</li>
              <li>{t.rich("informationWeCollect.aggregateAnalytics", { b: boldChunk })}</li>
              <li>{t.rich("informationWeCollect.cvBuilder", { b: boldChunk })}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("howWeUse.heading")}</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>{t("howWeUse.item1")}</li>
              <li>{t("howWeUse.item2")}</li>
              <li>{t("howWeUse.item3")}</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("howWeUse.noSelling")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("thirdParty.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("thirdParty.intro")}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>{t.rich("thirdParty.mongodb", { b: boldChunk })}</li>
              <li>{t.rich("thirdParty.cloudinary", { b: boldChunk })}</li>
              <li>{t.rich("thirdParty.google", { b: boldChunk })}</li>
              <li>{t.rich("thirdParty.vercel", { b: boldChunk })}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("cookiesLocalStorage.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("cookiesLocalStorage.body")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("dataRetention.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("dataRetention.body")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("dataSecurity.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("dataSecurity.body")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("yourRights.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("yourRights.intro")}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>{t("yourRights.item1")}</li>
              <li>{t("yourRights.item2")}</li>
              <li>{t("yourRights.item3")}</li>
              <li>{t("yourRights.item4")}</li>
              <li>{t("yourRights.item5")}</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t.rich("yourRights.outro", {
                link: contactPageLink,
                datatilsynet: (chunks) => (
                  <a href="https://www.datatilsynet.no" target="_blank" rel="noopener noreferrer">
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("changesToPolicy.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t("changesToPolicy.body")}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("contactUs.heading")}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {t.rich("contactUs.body", { link: contactPageLink })}
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>{t("lastUpdated")}:</strong> {t("lastUpdatedDate")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
