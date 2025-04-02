type MetadataProps = {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
}

export function constructMetadata({
  title = "ComplexCare.dev - Healthcare Management Solution for Complex Care Providers",
  description = "ComplexCare.dev is a comprehensive healthcare management solution designed for complex care providers in the UK. Streamline patient care, improve outcomes, and ensure compliance.",
  keywords = ["complex care", "healthcare CRM", "patient management", "care coordination", "UK healthcare software"],
  ogImage = "/images/og-image.jpg",
}: MetadataProps = {}) {
  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      images: [{ url: ogImage }],
      type: "website",
      locale: "en_GB",
      siteName: "ComplexCare.dev",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    metadataBase: new URL("https://complexcare.dev"),
    alternates: {
      canonical: "/",
    },
  }
}

