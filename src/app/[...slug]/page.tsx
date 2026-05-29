import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  PageRenderer,
  getMetadataPayload,
  getStaticParams,
} from "@/components/site-templates";
import { isIndexableDeployment, resolvePage } from "@/lib/site-data";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = resolvePage(slug);

  if (!page) {
    return {};
  }

  const metadata = getMetadataPayload(page);

  return {
    title: metadata.title,
    description: metadata.description,
    robots: {
      index: isIndexableDeployment && page.kind !== "thank-you",
      follow: isIndexableDeployment && page.kind !== "thank-you",
    },
    alternates: {
      canonical: metadata.canonical,
    },
    openGraph: {
      title: metadata.openGraphTitle ?? metadata.title,
      description: metadata.openGraphDescription ?? metadata.description,
      url: metadata.canonical,
      images: metadata.image
        ? [
            {
              url: metadata.image,
              width: 1200,
              height: 1200,
              alt: page.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: metadata.image ? [metadata.image] : undefined,
    },
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = resolvePage(slug);

  if (!page) {
    notFound();
  }

  return <PageRenderer page={page} />;
}
