const express = require("express");
const cors = require("cors");
const pool = require("../backend-example/db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Helper function to generate slug from title
function generateSlug(title) {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

// ============ BLOGS ENDPOINTS ============
app.get("/blogs", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM blogs ORDER BY date DESC");
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching blogs:", error);
		res.status(500).json({ message: "Error fetching blogs" });
	}
});

app.get("/blogs/:identifier", async (req, res) => {
	try {
		const identifier = req.params.identifier;
		const isNumeric = /^\d+$/.test(identifier);

		let result;
		if (isNumeric) {
			result = await pool.query("SELECT * FROM blogs WHERE id = $1", [parseInt(identifier)]);
		} else {
			result = await pool.query("SELECT * FROM blogs WHERE slug = $1", [identifier]);
		}

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Blog not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error fetching blog:", error);
		res.status(500).json({ message: "Error fetching blog" });
	}
});

app.post("/blogs", async (req, res) => {
	try {
		const { title, excerpt, content, image, link, date, author, tags } = req.body;
		const slug = generateSlug(title);

		const result = await pool.query("INSERT INTO blogs (title, slug, excerpt, content, image, link, date, author, tags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [title, slug, excerpt, content, image, link || "#", date, author, tags]);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error("Error creating blog:", error);
		res.status(500).json({ message: "Error creating blog" });
	}
});

app.put("/blogs/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { title, excerpt, content, image, link, date, author, tags } = req.body;
		const slug = generateSlug(title);

		const result = await pool.query("UPDATE blogs SET title = $1, slug = $2, excerpt = $3, content = $4, image = $5, link = $6, date = $7, author = $8, tags = $9 WHERE id = $10 RETURNING *", [title, slug, excerpt, content, image, link, date, author, tags, id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Blog not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error updating blog:", error);
		res.status(500).json({ message: "Error updating blog" });
	}
});

app.delete("/blogs/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = await pool.query("DELETE FROM blogs WHERE id = $1 RETURNING id", [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Blog not found" });
		}

		res.json({ message: "Blog deleted successfully" });
	} catch (error) {
		console.error("Error deleting blog:", error);
		res.status(500).json({ message: "Error deleting blog" });
	}
});

// ============ PROJECTS ENDPOINTS ============
app.get("/projects", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM projects ORDER BY id");
		const projects = result.rows.map((p) => ({
			id: p.id,
			title: p.title,
			description: p.description,
			image: p.image,
			liveUrl: p.live_url,
			codeUrl: p.code_url,
			technologies: p.technologies,
		}));
		res.json(projects);
	} catch (error) {
		console.error("Error fetching projects:", error);
		res.status(500).json({ message: "Error fetching projects" });
	}
});

app.get("/projects/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = await pool.query("SELECT * FROM projects WHERE id = $1", [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Project not found" });
		}

		const p = result.rows[0];
		const project = {
			id: p.id,
			title: p.title,
			description: p.description,
			image: p.image,
			liveUrl: p.live_url,
			codeUrl: p.code_url,
			technologies: p.technologies,
		};
		res.json(project);
	} catch (error) {
		console.error("Error fetching project:", error);
		res.status(500).json({ message: "Error fetching project" });
	}
});

app.post("/projects", async (req, res) => {
	try {
		const { title, description, image, liveUrl, codeUrl, technologies } = req.body;

		const result = await pool.query("INSERT INTO projects (title, description, image, live_url, code_url, technologies) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [title, description, image, liveUrl, codeUrl, technologies]);

		const p = result.rows[0];
		const project = {
			id: p.id,
			title: p.title,
			description: p.description,
			image: p.image,
			liveUrl: p.live_url,
			codeUrl: p.code_url,
			technologies: p.technologies,
		};
		res.status(201).json(project);
	} catch (error) {
		console.error("Error creating project:", error);
		res.status(500).json({ message: "Error creating project" });
	}
});

app.put("/projects/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { title, description, image, liveUrl, codeUrl, technologies } = req.body;

		const result = await pool.query("UPDATE projects SET title = $1, description = $2, image = $3, live_url = $4, code_url = $5, technologies = $6 WHERE id = $7 RETURNING *", [title, description, image, liveUrl, codeUrl, technologies, id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Project not found" });
		}

		const p = result.rows[0];
		const project = {
			id: p.id,
			title: p.title,
			description: p.description,
			image: p.image,
			liveUrl: p.live_url,
			codeUrl: p.code_url,
			technologies: p.technologies,
		};
		res.json(project);
	} catch (error) {
		console.error("Error updating project:", error);
		res.status(500).json({ message: "Error updating project" });
	}
});

app.delete("/projects/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = await pool.query("DELETE FROM projects WHERE id = $1 RETURNING id", [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Project not found" });
		}

		res.json({ message: "Project deleted successfully" });
	} catch (error) {
		console.error("Error deleting project:", error);
		res.status(500).json({ message: "Error deleting project" });
	}
});

// ============ SERVICES ENDPOINTS ============
app.get("/services", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM services ORDER BY id");
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching services:", error);
		res.status(500).json({ message: "Error fetching services" });
	}
});

app.get("/services/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = await pool.query("SELECT * FROM services WHERE id = $1", [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Service not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error fetching service:", error);
		res.status(500).json({ message: "Error fetching service" });
	}
});

app.post("/services", async (req, res) => {
	try {
		const { title, description, icon } = req.body;

		const result = await pool.query("INSERT INTO services (title, description, icon) VALUES ($1, $2, $3) RETURNING *", [title, description, icon]);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error("Error creating service:", error);
		res.status(500).json({ message: "Error creating service" });
	}
});

app.put("/services/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { title, description, icon } = req.body;

		const result = await pool.query("UPDATE services SET title = $1, description = $2, icon = $3 WHERE id = $4 RETURNING *", [title, description, icon, id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Service not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error updating service:", error);
		res.status(500).json({ message: "Error updating service" });
	}
});

app.delete("/services/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = await pool.query("DELETE FROM services WHERE id = $1 RETURNING id", [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Service not found" });
		}

		res.json({ message: "Service deleted successfully" });
	} catch (error) {
		console.error("Error deleting service:", error);
		res.status(500).json({ message: "Error deleting service" });
	}
});

// ============ CV ENDPOINTS ============
app.get("/cv", async (req, res) => {
	try {
		const header = await pool.query("SELECT * FROM cv_header WHERE id = 1");
		const summary = await pool.query("SELECT * FROM cv_summary WHERE id = 1");
		const competencies = await pool.query("SELECT * FROM cv_competencies ORDER BY display_order");
		const experience = await pool.query("SELECT * FROM cv_experience ORDER BY display_order");
		const projects = await pool.query("SELECT * FROM projects ORDER BY id");
		const education = await pool.query("SELECT * FROM cv_education ORDER BY display_order");
		const certifications = await pool.query("SELECT * FROM cv_certifications ORDER BY display_order");
		const languages = await pool.query("SELECT * FROM cv_languages ORDER BY display_order");
		const references = await pool.query("SELECT * FROM cv_references ORDER BY display_order");

		const cvProjects = projects.rows.map((p) => ({
			id: p.id,
			title: p.title,
			tech: p.technologies.join(", "),
			github: p.code_url,
			preview: p.live_url,
		}));

		const cvData = {
			header: header.rows[0] || {},
			summary: summary.rows[0]?.summary || "",
			competencies: competencies.rows,
			experience: experience.rows,
			projects: cvProjects,
			education: education.rows,
			certifications: certifications.rows,
			languages: languages.rows,
			references: references.rows,
		};

		res.json(cvData);
	} catch (error) {
		console.error("Error fetching CV:", error);
		res.status(500).json({ message: "Error fetching CV data" });
	}
});

app.put("/cv/header", async (req, res) => {
	try {
		const { name, title, address, phone, email, linkedin, github, portfolio } = req.body;

		const result = await pool.query(
			`INSERT INTO cv_header (id, name, title, address, phone, email, linkedin, github, portfolio) 
			 VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8) 
			 ON CONFLICT (id) DO UPDATE 
			 SET name = $1, title = $2, address = $3, phone = $4, email = $5, linkedin = $6, github = $7, portfolio = $8 
			 RETURNING *`,
			[name, title, address, phone, email, linkedin, github, portfolio],
		);

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error updating CV header:", error);
		res.status(500).json({ message: "Error updating CV header" });
	}
});

app.put("/cv/summary", async (req, res) => {
	try {
		const { summary } = req.body;

		const result = await pool.query(
			`INSERT INTO cv_summary (id, summary) VALUES (1, $1) 
			 ON CONFLICT (id) DO UPDATE SET summary = $1 
			 RETURNING *`,
			[summary],
		);

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error updating CV summary:", error);
		res.status(500).json({ message: "Error updating CV summary" });
	}
});

app.put("/cv/competencies", async (req, res) => {
	try {
		const { competencies } = req.body;

		await pool.query("DELETE FROM cv_competencies");

		const insertedCompetencies = [];
		for (let i = 0; i < competencies.length; i++) {
			const result = await pool.query("INSERT INTO cv_competencies (category, skills, display_order) VALUES ($1, $2, $3) RETURNING *", [competencies[i].category, competencies[i].skills, i + 1]);
			insertedCompetencies.push(result.rows[0]);
		}

		res.json(insertedCompetencies);
	} catch (error) {
		console.error("Error updating competencies:", error);
		res.status(500).json({ message: "Error updating competencies" });
	}
});

app.post("/cv/experience", async (req, res) => {
	try {
		const { title, company, location, date, responsibilities } = req.body;

		const result = await pool.query("INSERT INTO cv_experience (title, company, location, date, responsibilities) VALUES ($1, $2, $3, $4, $5) RETURNING *", [title, company, location, date, responsibilities]);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error("Error creating experience:", error);
		res.status(500).json({ message: "Error creating experience" });
	}
});

app.put("/cv/experience/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { title, company, location, date, responsibilities } = req.body;

		const result = await pool.query("UPDATE cv_experience SET title = $1, company = $2, location = $3, date = $4, responsibilities = $5 WHERE id = $6 RETURNING *", [title, company, location, date, responsibilities, id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Experience not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error updating experience:", error);
		res.status(500).json({ message: "Error updating experience" });
	}
});

app.delete("/cv/experience/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = await pool.query("DELETE FROM cv_experience WHERE id = $1 RETURNING id", [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Experience not found" });
		}

		res.json({ message: "Experience deleted successfully" });
	} catch (error) {
		console.error("Error deleting experience:", error);
		res.status(500).json({ message: "Error deleting experience" });
	}
});

app.post("/cv/education", async (req, res) => {
	try {
		const { degree, institution, date, details } = req.body;

		const result = await pool.query("INSERT INTO cv_education (degree, institution, date, details) VALUES ($1, $2, $3, $4) RETURNING *", [degree, institution, date, details]);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error("Error creating education:", error);
		res.status(500).json({ message: "Error creating education" });
	}
});

app.put("/cv/education/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { degree, institution, date, details } = req.body;

		const result = await pool.query("UPDATE cv_education SET degree = $1, institution = $2, date = $3, details = $4 WHERE id = $5 RETURNING *", [degree, institution, date, details, id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Education not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error updating education:", error);
		res.status(500).json({ message: "Error updating education" });
	}
});

app.delete("/cv/education/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = await pool.query("DELETE FROM cv_education WHERE id = $1 RETURNING id", [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Education not found" });
		}

		res.json({ message: "Education deleted successfully" });
	} catch (error) {
		console.error("Error deleting education:", error);
		res.status(500).json({ message: "Error deleting education" });
	}
});

app.post("/cv/certifications", async (req, res) => {
	try {
		const { title, issuer, date } = req.body;

		const result = await pool.query("INSERT INTO cv_certifications (title, issuer, date) VALUES ($1, $2, $3) RETURNING *", [title, issuer, date]);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error("Error creating certification:", error);
		res.status(500).json({ message: "Error creating certification" });
	}
});

app.put("/cv/certifications/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { title, issuer, date } = req.body;

		const result = await pool.query("UPDATE cv_certifications SET title = $1, issuer = $2, date = $3 WHERE id = $4 RETURNING *", [title, issuer, date, id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Certification not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error updating certification:", error);
		res.status(500).json({ message: "Error updating certification" });
	}
});

app.delete("/cv/certifications/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = await pool.query("DELETE FROM cv_certifications WHERE id = $1 RETURNING id", [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Certification not found" });
		}

		res.json({ message: "Certification deleted successfully" });
	} catch (error) {
		console.error("Error deleting certification:", error);
		res.status(500).json({ message: "Error deleting certification" });
	}
});

app.post("/cv/languages", async (req, res) => {
	try {
		const { language, level } = req.body;

		const result = await pool.query("INSERT INTO cv_languages (language, level) VALUES ($1, $2) RETURNING *", [language, level]);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error("Error creating language:", error);
		res.status(500).json({ message: "Error creating language" });
	}
});

app.put("/cv/languages/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { language, level } = req.body;

		const result = await pool.query("UPDATE cv_languages SET language = $1, level = $2 WHERE id = $3 RETURNING *", [language, level, id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Language not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error updating language:", error);
		res.status(500).json({ message: "Error updating language" });
	}
});

app.delete("/cv/languages/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = await pool.query("DELETE FROM cv_languages WHERE id = $1 RETURNING id", [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Language not found" });
		}

		res.json({ message: "Language deleted successfully" });
	} catch (error) {
		console.error("Error deleting language:", error);
		res.status(500).json({ message: "Error deleting language" });
	}
});

app.post("/cv/references", async (req, res) => {
	try {
		const { name, position, company, location, phone, email } = req.body;

		const result = await pool.query("INSERT INTO cv_references (name, position, company, location, phone, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [name, position, company, location, phone, email]);

		res.status(201).json(result.rows[0]);
	} catch (error) {
		console.error("Error creating reference:", error);
		res.status(500).json({ message: "Error creating reference" });
	}
});

app.put("/cv/references/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const { name, position, company, location, phone, email } = req.body;

		const result = await pool.query("UPDATE cv_references SET name = $1, position = $2, company = $3, location = $4, phone = $5, email = $6 WHERE id = $7 RETURNING *", [name, position, company, location, phone, email, id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Reference not found" });
		}

		res.json(result.rows[0]);
	} catch (error) {
		console.error("Error updating reference:", error);
		res.status(500).json({ message: "Error updating reference" });
	}
});

app.delete("/cv/references/:id", async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		const result = await pool.query("DELETE FROM cv_references WHERE id = $1 RETURNING id", [id]);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Reference not found" });
		}

		res.json({ message: "Reference deleted successfully" });
	} catch (error) {
		console.error("Error deleting reference:", error);
		res.status(500).json({ message: "Error deleting reference" });
	}
});

module.exports = app;
