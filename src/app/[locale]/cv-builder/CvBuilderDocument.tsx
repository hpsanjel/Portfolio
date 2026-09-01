import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { CvBuilderData } from "@/types/cvBuilder";

// This document is rendered by @react-pdf's own reconciler outside the Next.js
// React tree (via `pdf(<CvBuilderDocument .../>).toBlob()`), so it has no access
// to next-intl's React context — labels are resolved from this local dictionary
// keyed by the `locale` prop instead of via useTranslations().
const LABELS = {
	en: {
		yourName: "Your Name",
		summary: "Summary",
		keyCompetencies: "Key Competencies",
		professionalExperience: "Professional Experience",
		selectedProjects: "Selected Projects",
		education: "Education",
		certifications: "Certifications",
		languages: "Languages",
		references: "References",
	},
	nb: {
		yourName: "Ditt navn",
		summary: "Sammendrag",
		keyCompetencies: "Nøkkelkompetanse",
		professionalExperience: "Yrkeserfaring",
		selectedProjects: "Utvalgte prosjekter",
		education: "Utdanning",
		certifications: "Sertifiseringer",
		languages: "Språk",
		references: "Referanser",
	},
} as const;

const ACCENT = "#334155";
const MUTED = "#64748b";
const RULE = "#cbd5e1";

const styles = StyleSheet.create({
	page: { paddingTop: 48, paddingBottom: 48, paddingHorizontal: 50, fontSize: 10, fontFamily: "Helvetica", color: "#1e293b" },

	name: { fontSize: 23, fontWeight: 700, letterSpacing: 0.3 },
	title: { fontSize: 11.5, color: ACCENT, marginTop: 3 },

	contactBlock: { marginTop: 10 },
	contactLine: { fontSize: 9, color: MUTED, marginBottom: 2, lineHeight: 1.3 },

	sectionHeading: {
		fontSize: 9,
		fontWeight: 700,
		letterSpacing: 1.5,
		textTransform: "uppercase",
		color: ACCENT,
		marginTop: 13,
		marginBottom: 7,
		borderBottom: `0.75pt solid ${RULE}`,
		paddingBottom: 3,
	},

	summaryText: { fontSize: 10, lineHeight: 1.3 },

	row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
	itemTitle: { fontSize: 10.5, fontWeight: 700 },
	itemSubtitle: { fontSize: 9.5, color: MUTED, marginTop: 1 },
	itemDate: { fontSize: 8.5, color: MUTED },
	bodyText: { fontSize: 9.5, color: "#334155", marginTop: 2, lineHeight: 1.3 },

	experienceBlock: { marginBottom: 7 },
	bulletList: { marginTop: 2 },
	bullet: { flexDirection: "row", marginLeft: 6, marginBottom: 1 },
	bulletDot: { width: 8, fontSize: 9.5 },
	bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.25 },

	entryBlock: { marginBottom: 6 },

	gridTwoCol: { flexDirection: "row", flexWrap: "wrap" },
	gridItem: { width: "48%", marginRight: "2%", marginBottom: 7 },

	competencyRow: { flexDirection: "row", marginBottom: 3 },
	competencyCategory: { width: 130, fontSize: 9.5, fontWeight: 700 },
	competencySkills: { flex: 1, fontSize: 9.5, color: "#334155" },

	languagesText: { fontSize: 9.5, lineHeight: 1.4 },
});

function joinNonEmpty(parts: (string | undefined)[], sep = "  ·  ") {
	return parts.filter(Boolean).join(sep);
}

export default function CvBuilderDocument({ data, locale = "en" }: { data: CvBuilderData; locale?: "en" | "nb" }) {
	const L = LABELS[locale];
	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<Text style={styles.name}>{data.header.name || L.yourName}</Text>
				{data.header.title ? <Text style={styles.title}>{data.header.title}</Text> : null}

				<View style={styles.contactBlock}>
					{data.header.address ? <Text style={styles.contactLine}>{data.header.address}</Text> : null}
					{data.header.phone ? <Text style={styles.contactLine}>{data.header.phone}</Text> : null}
					{data.header.email ? <Text style={styles.contactLine}>{data.header.email}</Text> : null}
					{data.header.linkedin ? <Text style={styles.contactLine}>{data.header.linkedin}</Text> : null}
					{data.header.github ? <Text style={styles.contactLine}>{data.header.github}</Text> : null}
					{data.header.portfolio ? <Text style={styles.contactLine}>{data.header.portfolio}</Text> : null}
				</View>

				{/* Summary */}
				{data.summary ? (
					<View>
						<Text style={styles.sectionHeading}>{L.summary}</Text>
						<Text style={styles.summaryText}>{data.summary}</Text>
					</View>
				) : null}

				{/* Competencies */}
				{data.competencies.length > 0 && (
					<View>
						<Text style={styles.sectionHeading}>{L.keyCompetencies}</Text>
						{data.competencies.map((c, i) => (
							<View key={i} style={styles.competencyRow}>
								<Text style={styles.competencyCategory}>{c.category}</Text>
								<Text style={styles.competencySkills}>{c.skills}</Text>
							</View>
						))}
					</View>
				)}

				{/* Experience */}
				{data.experience.length > 0 && (
					<View>
						<Text style={styles.sectionHeading}>{L.professionalExperience}</Text>
						{data.experience.map((exp, i) => (
							<View key={i} style={styles.experienceBlock}>
								<View style={styles.row}>
									<View>
										<Text style={styles.itemTitle}>{exp.title}</Text>
										<Text style={styles.itemSubtitle}>{joinNonEmpty([exp.company, exp.location], ", ")}</Text>
									</View>
									<Text style={styles.itemDate}>{exp.date}</Text>
								</View>
								{exp.responsibilities.length > 0 && (
									<View style={styles.bulletList}>
										{exp.responsibilities.filter(Boolean).map((r, idx) => (
											<View key={idx} style={styles.bullet}>
												<Text style={styles.bulletDot}>{"–"}</Text>
												<Text style={styles.bulletText}>{r}</Text>
											</View>
										))}
									</View>
								)}
							</View>
						))}
					</View>
				)}

				{/* Projects */}
				{data.projects.length > 0 && (
					<View>
						<Text style={styles.sectionHeading}>{L.selectedProjects}</Text>
						{data.projects.map((proj, i) => (
							<View key={i} style={styles.entryBlock}>
								<View style={styles.row}>
									<Text style={styles.itemTitle}>{proj.title}</Text>
									{proj.tech ? <Text style={styles.itemDate}>{proj.tech}</Text> : null}
								</View>
								{proj.description ? <Text style={styles.bodyText}>{proj.description}</Text> : null}
								{(proj.github || proj.preview) ? <Text style={styles.bodyText}>{joinNonEmpty([proj.github, proj.preview])}</Text> : null}
							</View>
						))}
					</View>
				)}

				{/* Education */}
				{data.education.length > 0 && (
					<View>
						<Text style={styles.sectionHeading}>{L.education}</Text>
						<View style={styles.gridTwoCol}>
							{data.education.map((edu, i) => (
								<View key={i} style={styles.gridItem}>
									<View style={styles.row}>
										<Text style={styles.itemTitle}>{edu.degree}</Text>
										<Text style={styles.itemDate}>{edu.date}</Text>
									</View>
									<Text style={styles.itemSubtitle}>{edu.institution}</Text>
									{edu.details ? <Text style={styles.bodyText}>{edu.details}</Text> : null}
								</View>
							))}
						</View>
					</View>
				)}

				{/* Certifications */}
				{data.certifications.length > 0 && (
					<View>
						<Text style={styles.sectionHeading}>{L.certifications}</Text>
						<View style={styles.gridTwoCol}>
							{data.certifications.map((cert, i) => (
								<View key={i} style={styles.gridItem}>
									<View style={styles.row}>
										<Text style={styles.itemTitle}>{cert.title}</Text>
										<Text style={styles.itemDate}>{cert.date}</Text>
									</View>
									<Text style={styles.itemSubtitle}>{cert.issuer}</Text>
								</View>
							))}
						</View>
					</View>
				)}

				{/* Languages */}
				{data.languages.length > 0 && (
					<View>
						<Text style={styles.sectionHeading}>{L.languages}</Text>
						<Text style={styles.languagesText}>{data.languages.map((l) => `${l.language} — ${l.level}`).join("   ·   ")}</Text>
					</View>
				)}

				{/* References */}
				{data.references.length > 0 && (
					<View>
						<Text style={styles.sectionHeading}>{L.references}</Text>
						<View style={styles.gridTwoCol}>
							{data.references.map((ref, i) => (
								<View key={i} style={styles.gridItem}>
									<Text style={styles.itemTitle}>{ref.name}</Text>
									<Text style={styles.itemSubtitle}>{joinNonEmpty([ref.position, ref.company], ", ")}</Text>
									{(ref.location || ref.phone || ref.email) ? <Text style={styles.bodyText}>{joinNonEmpty([ref.location, ref.phone, ref.email])}</Text> : null}
								</View>
							))}
						</View>
					</View>
				)}
			</Page>
		</Document>
	);
}
