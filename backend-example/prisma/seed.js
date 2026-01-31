const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
	// Clean up existing unique records before seeding
	await prisma.blog.deleteMany({ where: { slug: "welcome-to-my-portfolio-blog" } });
	await prisma.cvHeader.deleteMany({ where: { id: 1 } });
	await prisma.cvSummary.deleteMany({ where: { id: 1 } });
	await prisma.cvCompetency.deleteMany();
	await prisma.cvExperience.deleteMany();
	await prisma.cvEducation.deleteMany();
	await prisma.cvCertification.deleteMany();
	await prisma.cvLanguage.deleteMany();
	await prisma.cvReference.deleteMany();
	// Seed Blogs
	await prisma.blog.create({
		data: {
			title: "Welcome to My Portfolio Blog",
			slug: "welcome-to-my-portfolio-blog",
			excerpt: "This is the first post on my portfolio blog!",
			content: "Hello world! This is my first blog post.",
			image: "./images/blog-image.jpg",
			link: "#",
			date: "2026-01-31",
			author: "Hari Prasad Sanjel",
			tags: ["portfolio", "welcome"],
		},
	});

	// Seed Projects
	await prisma.project.create({
		data: {
			title: "Portfolio Website",
			description: "A personal portfolio website built with Node.js, Express, and PostgreSQL.",
			image: "./images/portfolio.png",
			liveUrl: "https://harisanjel.com.np/",
			codeUrl: "https://github.com/hariprasadsanjel/portfolio",
			technologies: ["Node.js", "Express", "PostgreSQL"],
		},
	});

	// Seed Services
	await prisma.service.create({
		data: {
			title: "Web Development",
			description: "Professional web development services for modern websites.",
			icon: "./images/icon-design.png",
		},
	});

	// ...existing blog, project, service seeds...

	// CV Header
	await prisma.cvHeader.create({
		data: {
			id: 1,
			name: "Hari Prasad Sanjel",
			title: "Frontend Developer",
			address: "Storgata 79, 0182 Oslo, Norway",
			phone: "+47 46344530",
			email: "harisanjel@gmail.com",
			linkedin: "https://www.linkedin.com/in/harisanjel",
			github: "https://github.com/harisanjel",
			portfolio: "#",
		},
	});

	// CV Summary
	await prisma.cvSummary.create({
		data: {
			id: 1,
			summary: "Motivated and detail-oriented front-end developer with over 2 years of experience at ProActive Developers Pvt. Ltd. specializing in creating responsive and user-friendly web applications. Committed to continuous learning and eager to solve complex problems and eventually contribute to team.",
		},
	});

	// CV Competencies
	await prisma.cvCompetency.createMany({
		data: [
			{ category: "Programming Languages", skills: "Python, JavaScript, SQL", displayOrder: 1 },
			{ category: "Web Development", skills: "HTML, CSS (Bootstrap, Tailwind, Material UI), JavaScript (ReactJS)", displayOrder: 2 },
			{ category: "Tools", skills: "Postman, Git, Figma", displayOrder: 3 },
		],
	});

	// CV Experience
	await prisma.cvExperience.createMany({
		data: [
			{
				title: "Junior Frontend Web Developer",
				company: "ProActive Web Developers",
				location: "Kathmandu, Nepal",
				date: "June 2020 – July 2022",
				responsibilities: ["Converting design mock-ups into functional web pages using HTML, CSS, and JavaScript in collaboration with design team", "Implementing responsive design by using CSS frameworks like Bootstrap or Tailwind CSS", "Ensuring cross-browser compatibility", "Identifying and fixing bugs in front-end code", "Learning and applying React.js, Material-UI, Git, RESTful APIs", "Participating in team meetings and brainstorming sessions to share progress, challenges, and exchange knowledge and ideas", "Support senior developers by handling routine tasks and minor projects", "Taking on additional responsibilities as needed"],
				displayOrder: 1,
			},
			{
				title: "Teacher Assistant (Bachelor, Technology and Society)",
				company: "Oslo Metropolitan University",
				location: "Oslo",
				date: "August 2023 – December 2023",
				responsibilities: ["Developed and maintained course website, ensuring a user-friendly experience for students", "Created interactive web-based tutorials and learning modules using HTML, CSS, and JavaScript", "Provided technical support and troubleshooting for online course materials and resources", "Collaborated with faculty to integrate new web technologies and manage content with Git"],
				displayOrder: 2,
			},
		],
	});

	// CV Education
	await prisma.cvEducation.createMany({
		data: [
			{
				degree: "Master of Applied Computer and Information Technology",
				institution: "Oslo Metropolitan University, Oslo, Norway",
				date: "August 2022 – June 2024",
				details: "Major Subject: Universal Design of Information and Communication Tech.",
				displayOrder: 1,
			},
			{
				degree: "Master of Science in Information Technology",
				institution: "Sikkim Manipal University Distance Education, India",
				date: "August 2011 – January 2014",
				details: "Subjects: OOP, Operating System, Database Management System",
				displayOrder: 2,
			},
		],
	});

	// CV Certifications
	await prisma.cvCertification.createMany({
		data: [
			{ title: "Responsive Web Design", issuer: "freeCodeCamp", date: "August 5, 2024", displayOrder: 1 },
			{ title: "Front End Development Libraries", issuer: "freeCodeCamp", date: "August 4, 2024", displayOrder: 2 },
			{ title: "Data Analysis with Python", issuer: "freeCodeCamp", date: "September 9, 2023", displayOrder: 3 },
			{ title: "JavaScript Algorithms and Data Structures", issuer: "freeCodeCamp", date: "August 23, 2023", displayOrder: 4 },
			{ title: "Complete Python Mastery", issuer: "Code with Mosh", date: "cert_mzgy28xz", displayOrder: 5 },
			{ title: "Diploma in Computer Software", issuer: "Milestone Institute Pvt. Ltd., Kathmandu Nepal", date: "September 15, 2009 – March 14, 2010", displayOrder: 6 },
		],
	});

	// CV Languages
	await prisma.cvLanguage.createMany({
		data: [
			{ language: "English", level: "Fluent", displayOrder: 1 },
			{ language: "Norwegian", level: "Intermediate (B1)", displayOrder: 2 },
			{ language: "Hindi", level: "Fluent", displayOrder: 3 },
		],
	});

	// CV References
	await prisma.cvReference.createMany({
		data: [
			{
				name: "Barun Gautam",
				position: "Managing Director",
				company: "ProActive Developers and Business Solution Pvt. Ltd.",
				location: "Naxal, Kathmandu",
				phone: "+977-01-4526893",
				email: "info@proactivedevelopers.com",
				displayOrder: 1,
			},
			{
				name: "Ole Sneltvedt",
				position: "University Lecturer",
				company: "Oslomet University",
				location: "",
				phone: "+47 672 38 469",
				email: "ole.sneltvedt@oslomet.no",
				displayOrder: 2,
			},
		],
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
