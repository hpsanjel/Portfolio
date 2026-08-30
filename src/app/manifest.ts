import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "SanjelTech — Web and Software Development Lab",
		short_name: "SanjelTech",
		description: "A one-person web and software development studio based in Oslo, Norway.",
		start_url: "/",
		display: "standalone",
		background_color: "#090a12",
		theme_color: "#090a12",
		icons: [
			{
				src: "/images/icon-512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
