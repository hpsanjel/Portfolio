const express = require("express");
const cors = require("cors");
const prisma = require("./prismaClient");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

function generateSlug(title) {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

// ============ BLOGS ENDPOINTS ============
app.get("/blogs", async (req, res) => {
	try {
		const blogs = await prisma.blog.findMany({ orderBy: { date: "desc" } });
		res.json(blogs);
	} catch (error) {
		res.status(500).json({ message: "Error fetching blogs" });
	}
});

app.get("/blogs/:identifier", async (req, res) => {
	try {
		const identifier = req.params.identifier;
		let blog;
		if (/^\d+$/.test(identifier)) {
			blog = await prisma.blog.findUnique({ where: { id: parseInt(identifier) } });
		} else {
			blog = await prisma.blog.findUnique({ where: { slug: identifier } });
		}
		if (!blog) return res.status(404).json({ message: "Blog not found" });
		res.json(blog);
	} catch (error) {
		res.status(500).json({ message: "Error fetching blog" });
	}
});

app.post("/blogs", async (req, res) => {
	try {
		const { title, excerpt, content, image, link, date, author, tags } = req.body;
		const slug = generateSlug(title);
		const blog = await prisma.blog.create({
			data: { title, slug, excerpt, content, image, link: link || "#", date, author, tags },
		});
		res.status(201).json(blog);
	} catch (error) {
		res.status(500).json({ message: "Error creating blog" });
	}
});

app.put("/blogs/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { title, excerpt, content, image, link, date, author, tags } = req.body;
		const slug = generateSlug(title);
		const blog = await prisma.blog.update({
			where: { id },
			data: { title, slug, excerpt, content, image, link, date, author, tags },
		});
		res.json(blog);
	} catch (error) {
		res.status(500).json({ message: "Error updating blog" });
	}
});

app.delete("/blogs/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		await prisma.blog.delete({ where: { id } });
		res.json({ message: "Blog deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting blog" });
	}
});

// ============ PROJECTS ENDPOINTS ============
app.get("/projects", async (req, res) => {
	try {
		const projects = await prisma.project.findMany({ orderBy: { id: "asc" } });
		res.json(projects);
	} catch (error) {
		res.status(500).json({ message: "Error fetching projects" });
	}
});

app.get("/projects/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const project = await prisma.project.findUnique({ where: { id } });
		if (!project) return res.status(404).json({ message: "Project not found" });
		res.json(project);
	} catch (error) {
		res.status(500).json({ message: "Error fetching project" });
	}
});

app.post("/projects", async (req, res) => {
	try {
		const { title, description, image, liveUrl, codeUrl, technologies } = req.body;
		const project = await prisma.project.create({ data: { title, description, image, liveUrl, codeUrl, technologies } });
		res.status(201).json(project);
	} catch (error) {
		res.status(500).json({ message: "Error creating project" });
	}
});

app.put("/projects/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { title, description, image, liveUrl, codeUrl, technologies } = req.body;
		const project = await prisma.project.update({ where: { id }, data: { title, description, image, liveUrl, codeUrl, technologies } });
		res.json(project);
	} catch (error) {
		res.status(500).json({ message: "Error updating project" });
	}
});

app.delete("/projects/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		await prisma.project.delete({ where: { id } });
		res.json({ message: "Project deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting project" });
	}
});

// ============ SERVICES ENDPOINTS ============
app.get("/services", async (req, res) => {
	try {
		const services = await prisma.service.findMany({ orderBy: { id: "asc" } });
		res.json(services);
	} catch (error) {
		res.status(500).json({ message: "Error fetching services" });
	}
});

app.get("/services/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const service = await prisma.service.findUnique({ where: { id } });
		if (!service) return res.status(404).json({ message: "Service not found" });
		res.json(service);
	} catch (error) {
		res.status(500).json({ message: "Error fetching service" });
	}
});

app.post("/services", async (req, res) => {
	try {
		const { title, description, icon } = req.body;
		const service = await prisma.service.create({ data: { title, description, icon } });
		res.status(201).json(service);
	} catch (error) {
		res.status(500).json({ message: "Error creating service" });
	}
});

app.put("/services/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { title, description, icon } = req.body;
		const service = await prisma.service.update({ where: { id }, data: { title, description, icon } });
		res.json(service);
	} catch (error) {
		res.status(500).json({ message: "Error updating service" });
	}
});

app.delete("/services/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		await prisma.service.delete({ where: { id } });
		res.json({ message: "Service deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting service" });
	}
});

// ============ CV ENDPOINTS ============
app.get("/cv", async (req, res) => {
	try {
		const header = await prisma.cvHeader.findUnique({ where: { id: 1 } });
		const summary = await prisma.cvSummary.findUnique({ where: { id: 1 } });
		const competencies = await prisma.cvCompetency.findMany({ orderBy: { display_order: "asc" } });
		const experience = await prisma.cvExperience.findMany({ orderBy: { display_order: "asc" } });
		const projects = await prisma.project.findMany({ orderBy: { id: "asc" } });
		const education = await prisma.cvEducation.findMany({ orderBy: { display_order: "asc" } });
		const certifications = await prisma.cvCertification.findMany({ orderBy: { display_order: "asc" } });
		const languages = await prisma.cvLanguage.findMany({ orderBy: { display_order: "asc" } });
		const references = await prisma.cvReference.findMany({ orderBy: { display_order: "asc" } });

		const cvProjects = projects.map((p) => ({
			id: p.id,
			title: p.title,
			tech: Array.isArray(p.technologies) ? p.technologies.join(", ") : "",
			github: p.codeUrl,
			preview: p.liveUrl,
		}));

		const cvData = {
			header: header || {},
			summary: summary?.summary || "",
			competencies,
			experience,
			projects: cvProjects,
			education,
			certifications,
			languages,
			references,
		};

		res.json(cvData);
	} catch (error) {
		res.status(500).json({ message: "Error fetching CV data" });
	}
});

app.put("/cv/header", async (req, res) => {
	try {
		const { name, title, address, phone, email, linkedin, github, portfolio } = req.body;
		const header = await prisma.cvHeader.upsert({
			where: { id: 1 },
			update: { name, title, address, phone, email, linkedin, github, portfolio },
			create: { id: 1, name, title, address, phone, email, linkedin, github, portfolio },
		});
		res.json(header);
	} catch (error) {
		res.status(500).json({ message: "Error updating CV header" });
	}
});

app.put("/cv/summary", async (req, res) => {
	try {
		const { summary } = req.body;
		const cvSummary = await prisma.cvSummary.upsert({
			where: { id: 1 },
			update: { summary },
			create: { id: 1, summary },
		});
		res.json(cvSummary);
	} catch (error) {
		res.status(500).json({ message: "Error updating CV summary" });
	}
});

app.put("/cv/competencies", async (req, res) => {
	try {
		const { competencies } = req.body;
		await prisma.cvCompetency.deleteMany();
		const insertedCompetencies = await Promise.all(
			competencies.map((comp, i) =>
				prisma.cvCompetency.create({
					data: { category: comp.category, skills: comp.skills, display_order: i + 1 },
				}),
			),
		);
		res.json(insertedCompetencies);
	} catch (error) {
		res.status(500).json({ message: "Error updating competencies" });
	}
});

app.post("/cv/experience", async (req, res) => {
	try {
		const { title, company, location, date, responsibilities, display_order } = req.body;
		const experience = await prisma.cvExperience.create({ data: { title, company, location, date, responsibilities, display_order } });
		res.status(201).json(experience);
	} catch (error) {
		res.status(500).json({ message: "Error creating experience" });
	}
});

app.put("/cv/experience/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { title, company, location, date, responsibilities, display_order } = req.body;
		const experience = await prisma.cvExperience.update({ where: { id }, data: { title, company, location, date, responsibilities, display_order } });
		res.json(experience);
	} catch (error) {
		res.status(500).json({ message: "Error updating experience" });
	}
});

app.delete("/cv/experience/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		await prisma.cvExperience.delete({ where: { id } });
		res.json({ message: "Experience deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting experience" });
	}
});

app.post("/cv/education", async (req, res) => {
	try {
		const { degree, institution, date, details, display_order } = req.body;
		const education = await prisma.cvEducation.create({ data: { degree, institution, date, details, display_order } });
		res.status(201).json(education);
	} catch (error) {
		res.status(500).json({ message: "Error creating education" });
	}
});

app.put("/cv/education/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { degree, institution, date, details, display_order } = req.body;
		const education = await prisma.cvEducation.update({ where: { id }, data: { degree, institution, date, details, display_order } });
		res.json(education);
	} catch (error) {
		res.status(500).json({ message: "Error updating education" });
	}
});

app.delete("/cv/education/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		await prisma.cvEducation.delete({ where: { id } });
		res.json({ message: "Education deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting education" });
	}
});

app.post("/cv/certifications", async (req, res) => {
	try {
		const { title, issuer, date, display_order } = req.body;
		const certification = await prisma.cvCertification.create({ data: { title, issuer, date, display_order } });
		res.status(201).json(certification);
	} catch (error) {
		res.status(500).json({ message: "Error creating certification" });
	}
});

app.put("/cv/certifications/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { title, issuer, date, display_order } = req.body;
		const certification = await prisma.cvCertification.update({ where: { id }, data: { title, issuer, date, display_order } });
		res.json(certification);
	} catch (error) {
		res.status(500).json({ message: "Error updating certification" });
	}
});

app.delete("/cv/certifications/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		await prisma.cvCertification.delete({ where: { id } });
		res.json({ message: "Certification deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting certification" });
	}
});

app.post("/cv/languages", async (req, res) => {
	try {
		const { language, level, display_order } = req.body;
		const lang = await prisma.cvLanguage.create({ data: { language, level, display_order } });
		res.status(201).json(lang);
	} catch (error) {
		res.status(500).json({ message: "Error creating language" });
	}
});

app.put("/cv/languages/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { language, level, display_order } = req.body;
		const lang = await prisma.cvLanguage.update({ where: { id }, data: { language, level, display_order } });
		res.json(lang);
	} catch (error) {
		res.status(500).json({ message: "Error updating language" });
	}
});

app.delete("/cv/languages/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		await prisma.cvLanguage.delete({ where: { id } });
		res.json({ message: "Language deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting language" });
	}
});

app.post("/cv/references", async (req, res) => {
	try {
		const { name, position, company, location, phone, email, display_order } = req.body;
		const ref = await prisma.cvReference.create({ data: { name, position, company, location, phone, email, display_order } });
		res.status(201).json(ref);
	} catch (error) {
		res.status(500).json({ message: "Error creating reference" });
	}
});

app.put("/cv/references/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { name, position, company, location, phone, email, display_order } = req.body;
		const ref = await prisma.cvReference.update({ where: { id }, data: { name, position, company, location, phone, email, display_order } });
		res.json(ref);
	} catch (error) {
		res.status(500).json({ message: "Error updating reference" });
	}
});

app.delete("/cv/references/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		await prisma.cvReference.delete({ where: { id } });
		res.json({ message: "Reference deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error deleting reference" });
	}
});

module.exports = app;
