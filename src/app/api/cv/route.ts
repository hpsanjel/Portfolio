import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongoose";
import {
  CvHeader,
  CvSummary,
  CvCompetency,
  CvExperience,
  CvEducation,
  CvCertification,
  CvLanguage,
  CvReference,
  CvProject
} from "../../../models";

export const runtime = "nodejs";

// GET /api/cv
export async function GET() {
	try {
		await connectDB();
		const [
			header,
			summary,
			competencies,
			experience,
			education,
			certifications,
			languages,
			references,
			projects
		] = await Promise.all([
			CvHeader.findOne({}),
			CvSummary.findOne({}),
			CvCompetency.find({}).sort({ displayOrder: 1 }),
			CvExperience.find({}).sort({ displayOrder: 1 }),
			CvEducation.find({}).sort({ displayOrder: 1 }),
			CvCertification.find({}).sort({ displayOrder: 1 }),
			CvLanguage.find({}).sort({ displayOrder: 1 }),
			CvReference.find({}).sort({ displayOrder: 1 }),
			CvProject.find({}).sort({ displayOrder: 1 })
		]);

		return NextResponse.json({
			header,
			summary: summary?.content || "",
			competencies,
			experience,
			education,
			certifications,
			languages,
			references,
			projects,
		});
	} catch (error) {
		console.error('Error fetching CV:', error);
		return NextResponse.json({ message: "Error fetching CV" }, { status: 500 });
	}
}

// PUT /api/cv (partial updates)
export async function PUT(request: Request) {
	try {
		await connectDB();
		const body = await request.json();
		const { header, summary, competencies, experience, education, certifications, languages, references, projects } = body ?? {};

		// Update header
		if (header) {
			await CvHeader.findOneAndUpdate({}, header, { upsert: true });
		}

		// Update summary
		if (typeof summary === "string") {
			await CvSummary.findOneAndUpdate({}, { content: summary }, { upsert: true });
		}

		// Update competencies
		if (Array.isArray(competencies)) {
			await CvCompetency.deleteMany({});
			if (competencies.length > 0) {
				const competencyData = competencies.map((c, index) => ({
					...c,
					displayOrder: index,
				}));
				await CvCompetency.insertMany(competencyData);
			}
		}

		// Update experience
		if (Array.isArray(experience)) {
			await CvExperience.deleteMany({});
			if (experience.length > 0) {
				const experienceData = experience.map((e, index) => ({
					...e,
					responsibilities: Array.isArray(e.responsibilities) ? e.responsibilities : [],
					displayOrder: index,
				}));
				await CvExperience.insertMany(experienceData);
			}
		}

		// Update education
		if (Array.isArray(education)) {
			await CvEducation.deleteMany({});
			if (education.length > 0) {
				const educationData = education.map((e, index) => ({
					...e,
					displayOrder: index,
				}));
				await CvEducation.insertMany(educationData);
			}
		}

		// Update certifications
		if (Array.isArray(certifications)) {
			await CvCertification.deleteMany({});
			if (certifications.length > 0) {
				const certificationData = certifications.map((c, index) => ({
					...c,
					displayOrder: index,
				}));
				await CvCertification.insertMany(certificationData);
			}
		}

		// Update languages
		if (Array.isArray(languages)) {
			await CvLanguage.deleteMany({});
			if (languages.length > 0) {
				const languageData = languages.map((l, index) => ({
					...l,
					displayOrder: index,
				}));
				await CvLanguage.insertMany(languageData);
			}
		}

		// Update references
		if (Array.isArray(references)) {
			await CvReference.deleteMany({});
			if (references.length > 0) {
				const referenceData = references.map((r, index) => ({
					...r,
					displayOrder: index,
				}));
				await CvReference.insertMany(referenceData);
			}
		}

		// Update projects
		if (Array.isArray(projects)) {
			await CvProject.deleteMany({});
			if (projects.length > 0) {
				const projectData = projects.map((p, index) => ({
					...p,
					displayOrder: index,
				}));
				await CvProject.insertMany(projectData);
			}
		}

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error('Error saving CV:', error);
		return NextResponse.json({ message: "Error saving CV" }, { status: 500 });
	}
}
