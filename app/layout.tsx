import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { community } from "@/data/community";
import "./globals.css";

const archivo = Archivo({
	variable: "--font-archivo",
	subsets: ["latin"],
	axes: ["wdth"],
});

const baseUrl = community.url;
const title = "Tanzania Developers Community (TDC)";
const description =
	"Meet the developers of Tanzania. Browse members by skill, find people open to work, and join the TDC WhatsApp group.";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
	title,
	description,
	applicationName: community.shortName,
	authors: [{ name: community.name, url: baseUrl }],
	generator: "Next.js",
	keywords: [
		"Tanzania",
		"Developers",
		"Community",
		"TDC",
		"Tech",
		"Coding",
		"Africa",
		"Software Engineering",
		"Web Development",
		"Programming",
		"East Africa",
		"Hire developers",
	],
	referrer: "origin-when-cross-origin",
	creator: community.name,
	publisher: community.name,
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: "/favicon.ico",
	},
	openGraph: {
		title,
		description,
		url: baseUrl,
		siteName: community.name,
		images: [
			{
				url: `${baseUrl}/tdc.png`,
				width: 1200,
				height: 630,
				alt: community.name,
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title,
		description,
		creator: "@tdc",
		images: [`${baseUrl}/tdc.png`],
	},
	alternates: {
		canonical: baseUrl,
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#e8ebe4" },
		{ media: "(prefers-color-scheme: dark)", color: "#0e1310" },
	],
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: community.name,
	alternateName: community.shortName,
	url: baseUrl,
	logo: `${baseUrl}/tdclogo.png`,
	description,
	sameAs: [community.repository],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${archivo.variable} font-sans antialiased`}>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
