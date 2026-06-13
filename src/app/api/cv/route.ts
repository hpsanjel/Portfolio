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

		// --- Validate all array-section data BEFORE any deletion ---

		if (Array.isArray(competencies)) {
			for (const c of competencies) {
				if (!c.category || !c.skills) {
					return NextResponse.json({ message: "Each competency must have a category and skills" }, { status: 400 });
				}
			}
		}

		if (Array.isArray(experience)) {
			for (const e of experience) {
				if (!e.title || !e.company || !e.location || !e.date) {
					return NextResponse.json({ message: "Each experience entry must have title, company, location, and date" }, { status: 400 });
				}
			}
		}

		if (Array.isArray(education)) {
			for (const e of education) {
				if (!e.degree || !e.institution || !e.date) {
					return NextResponse.json({ message: "Each education entry must have degree, institution, and date" }, { status: 400 });
				}
			}
		}

		if (Array.isArray(certifications)) {
			for (const c of certifications) {
				if (!c.title || !c.issuer || !c.date) {
					return NextResponse.json({ message: "Each certification must have title, issuer, and date" }, { status: 400 });
				}
			}
		}

		if (Array.isArray(languages)) {
			for (const l of languages) {
				if (!l.language || !l.level) {
					return NextResponse.json({ message: "Each language entry must have language and level" }, { status: 400 });
				}
			}
		}

		if (Array.isArray(references)) {
			for (const r of references) {
				if (!r.name || !r.position || !r.company) {
					return NextResponse.json({ message: "Each reference must have name, position, and company" }, { status: 400 });
				}
			}
		}

		if (Array.isArray(projects)) {
			for (const p of projects) {
				if (!p.title || !p.description || !p.tech) {
					return NextResponse.json({ message: "Each CV project must have title, description, and tech" }, { status: 400 });
				}
			}
		}

		// --- All validations passed — safe to replace data ---

		// Update competencies
		if (Array.isArray(competencies)) {
			await CvCompetency.deleteMany({});
			if (competencies.length > 0) {
				const competencyData = competencies.map((c, index) => ({
					category: c.category,
					skills: c.skills,
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
					title: e.title,
					company: e.company,
					location: e.location,
					date: e.date,
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
					degree: e.degree,
					institution: e.institution,
					date: e.date,
					details: e.details || '',
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
					title: c.title,
					issuer: c.issuer,
					date: c.date,
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
					language: l.language,
					level: l.level,
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
					name: r.name,
					position: r.position,
					company: r.company,
					location: r.location || '',
					phone: r.phone || '',
					email: r.email || '',
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
					title: p.title,
					description: p.description,
					tech: p.tech,
					github: p.github || '',
					preview: p.preview || '',
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
