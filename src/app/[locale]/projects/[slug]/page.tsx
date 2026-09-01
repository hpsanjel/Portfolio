import { Metadata } from "next";
import { cache } from "react";
import ProjectDetailClient from "./ProjectDetailClient";
import connectDB from "@/lib/mongoose";
import { Project as ProjectModel } from "@/models";
import { SITE_URL, SITE_NAME, getJpgOpenGraphImageUrl, buildAlternates } from "@/lib/seo";
import { localizeDoc, parseLocale } from "@/lib/localize";

// Deduped between generateMetadata and the page body — one DB round-trip per request.
const getProject = cache(async (slug: string) => {
  await connectDB();
  return ProjectModel.findOne({ slug }).lean();
});

// Generate metadata for the project detail page
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string; locale: string }> }
): Promise<Metadata> {
  const { slug, locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const canonicalUrl = `${SITE_URL}${locale === "nb" ? "/nb" : ""}/projects/${slug}`;

  try {
    const rawProject = await getProject(slug);

    if (rawProject && rawProject.status !== 'draft') {
      const project = localizeDoc(rawProject, locale, ["title", "description", "projectstory"]);
      const description = project.description?.substring(0, 155) || `Case study for the ${project.title} project.`;
      const ogImageUrl = getJpgOpenGraphImageUrl(project.image);

      return {
        title: project.title,
        description,
        keywords: project.technologies,
        alternates: buildAlternates(`/projects/${slug}`),
        openGraph: {
          title: project.title,
          description,
          url: canonicalUrl,
          siteName: SITE_NAME,
          locale: locale === 'nb' ? 'nb_NO' : 'en_US',
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: project.title,
              type: 'image/jpeg',
            },
          ],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: project.title,
          description,
          images: [ogImageUrl],
          creator: '@hpsanjel',
        },
      };
    }

    return {
      title: 'Project Not Found',
      description: 'This project is not available.',
      robots: { index: false, follow: false },
      alternates: buildAlternates(`/projects/${slug}`),
    };
  } catch (error) {
    console.error('Project metadata fetch error:', error);
  }

  return {
    title: 'Project',
    description: 'View this project case study.',
    alternates: buildAlternates(`/projects/${slug}`),
  };
}

// Server component that just renders the client component
export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale: localeParam } = await params;
  const locale = parseLocale(localeParam);
  const canonicalUrl = `${SITE_URL}${locale === "nb" ? "/nb" : ""}/projects/${slug}`;

  let projectJsonLd: Record<string, unknown> | null = null;
  try {
    const rawProject = await getProject(slug);
    if (rawProject && rawProject.status !== 'draft') {
      const project = localizeDoc(rawProject, locale, ["title", "description", "projectstory"]);
      const ogImageUrl = getJpgOpenGraphImageUrl(project.image);
      projectJsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        image: [ogImageUrl],
        url: canonicalUrl,
        dateCreated: project.createdAt,
        dateModified: project.updatedAt,
        keywords: (project.technologies || []).join(", "),
        creator: {
          "@type": "Person",
          name: "Hari Prasad Sanjel",
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
        },
      };
    }
  } catch (error) {
    console.error('Project JSON-LD fetch error:', error);
  }

  return (
    <>
      {projectJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }} />}
      <ProjectDetailClient slug={slug} />
    </>
  );
}
