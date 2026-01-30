const sideMenu = document.querySelector("#sideMenu");
const navBar = document.querySelector("nav");
const navLinks = document.querySelector("nav ul");
const body = document.querySelector("body");

function openSideMenu() {
	sideMenu.style.transform = "translateX(-16rem)";
}
function closeSideMenu() {
	sideMenu.style.transform = "translateX(16rem)";
}

let lastScrollY = window.scrollY;
window.addEventListener("scroll", () => {
	if (scrollY > 50) {
		navBar.classList.add("bg-white", "bg-opacity-50", "backdrop-blur-lg", "shadow-sm", "dark:bg-darkTheme", "dark:shadow-white/20");
		navLinks.classList.remove("bg-white", "shadow-sm", "bg-opacity-50", "dark:border", "dark:border-white/50", "dark:bg-transparent");
	} else {
		navBar.classList.remove("bg-white", "bg-opacity-50", "backdrop-blur-lg", "shadow-sm", "dark:bg-darkTheme", "dark:shadow-white/20");
		navLinks.classList.add("bg-white", "shadow-sm", "bg-opacity-50", "dark:border", "dark:border-white/50", "dark:bg-transparent");
	}
});

if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
	document.documentElement.classList.add("dark");
} else {
	document.documentElement.classList.remove("dark");
}

function toggleTheme() {
	document.documentElement.classList.toggle("dark");
	if (document.documentElement.classList.contains("dark")) {
		localStorage.theme = "dark";
	} else {
		localStorage.theme = "light";
	}
}

// ========== Dynamic Blog Posts Functionality ==========

// Configuration: Automatically detect environment
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
const API_BASE = isLocal ? 'http://localhost:3000' : '';
const BLOG_API_URL = `${API_BASE}/api/blogs`;

// Function to fetch blog posts from backend
async function fetchBlogPosts() {
	try {
		const response = await fetch(BLOG_API_URL);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const blogs = await response.json();
		return blogs;
	} catch (error) {
		console.error("Error fetching blog posts:", error);
		return null;
	}
}

// Function to create a blog card HTML
function createBlogCard(blog) {
	const blogLink = blog.slug ? `blog-detail.html?slug=${blog.slug}` : blog.link || "#";
	return `
		<div class="blog-container max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 animate-fadeIn">
			<a href="${blogLink}">
				<img class="rounded-t-lg w-full h-56 object-cover" src="${blog.image}" alt="${blog.title}" onerror="this.src='./images/placeholder.jpg'" />
			</a>
			<div class="p-5">
				<a href="${blogLink}">
					<h5 class="mb-2 text-2xl font-semi-bold tracking-tight text-gray-900 dark:text-white blog-title">${blog.title}</h5>
				</a>
				${blog.date ? `<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">${formatDate(blog.date)}</p>` : ""}
				${blog.author ? `<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">By ${blog.author}</p>` : ""}
				<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${blog.excerpt}</p>
				${
					blog.tags
						? `
					<div class="flex flex-wrap gap-2 mb-3">
						${blog.tags.map((tag) => `<span class="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">${tag}</span>`).join("")}
					</div>
				`
						: ""
				}
				<a href="${blogLink}" class="read-more-link inline-flex items-center px-3 py-2 text-sm font-medium text-center text-black/80 hover:text-black rounded-lg focus:ring-4 focus:outline-none dark:text-white/80 dark:hover:text-white">
					Read more
					<svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2 transition-transform duration-300 hover:translate-x-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
						<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
					</svg>
				</a>
			</div>
		</div>
	`;
}

// Function to format date
function formatDate(dateString) {
	const options = { year: "numeric", month: "long", day: "numeric" };
	return new Date(dateString).toLocaleDateString("en-US", options);
}

// Function to render blog posts
function renderBlogPosts(blogs) {
	const blogContainer = document.querySelector("#blog .grid");

	if (!blogContainer) {
		console.error("Blog container not found");
		return;
	}

	if (!blogs || blogs.length === 0) {
		blogContainer.innerHTML = `
			<div class="col-span-full text-center py-10">
				<p class="text-gray-600 dark:text-gray-400 text-lg">No blog posts available at the moment.</p>
			</div>
		`;
		return;
	}

	// Clear existing content and render new blog posts
	blogContainer.innerHTML = blogs.map((blog) => createBlogCard(blog)).join("");
}

// Function to show loading state
function showLoadingState() {
	const blogContainer = document.querySelector("#blog .grid");
	if (blogContainer) {
		blogContainer.innerHTML = `
			<div class="col-span-full flex justify-center items-center py-20">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
			</div>
		`;
	}
}

// Function to initialize blog posts
async function initializeBlogPosts() {
	showLoadingState();

	// Try to fetch from backend
	let blogs = await fetchBlogPosts();

	// If backend fails, use fallback static data
	if (!blogs) {
		console.log("Using fallback static blog data");
		blogs = getFallbackBlogs();
	}

	renderBlogPosts(blogs);
}

// Fallback static blog data (used when backend is unavailable)
function getFallbackBlogs() {
	return [
		{
			title: "Web Design Trends 2024",
			excerpt: "Web design is shifting towards minimalism and accessibility. AI and dark mode designs will be key trends to watch in 2024.",
			image: "./images/webtrends.jpeg",
			link: "#",
			date: "2024-01-15",
			author: "Hari Prasad Sanjel",
			tags: ["Web Design", "Trends", "2024"],
		},
		{
			title: "Why Mobile Apps Matter",
			excerpt: "Mobile apps are essential for staying competitive in today's market. They boost customer engagement and drive business.",
			image: "./images/mobileapp.jpeg",
			link: "#",
			date: "2024-01-10",
			author: "Hari Prasad Sanjel",
			tags: ["Mobile", "Apps", "Business"],
		},
		{
			title: "Power of Animation in UX",
			excerpt: "Animation enhances user experience by making interactions more intuitive. It adds visual feedback that keeps users engaged.",
			image: "./images/animation.gif",
			link: "#",
			date: "2024-01-05",
			author: "Hari Prasad Sanjel",
			tags: ["Animation", "UX", "Design"],
		},
	];
}

// Initialize blog posts when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeBlogPosts);

// ========== Dynamic Projects Functionality ==========

// PROJECT_API_URL uses the same API_BASE from above
const PROJECT_API_URL = `${API_BASE}/api/projects`;

// Function to fetch projects from backend
async function fetchProjects() {
	try {
		const response = await fetch(PROJECT_API_URL);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const projects = await response.json();
		return projects;
	} catch (error) {
		console.error("Error fetching projects:", error);
		return null;
	}
}

// Function to create a project card HTML
function createProjectCard(project) {
	const techTags = project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("");
	const codeLink =
		project.codeUrl && project.codeUrl !== "#"
			? `
		<a href="${project.codeUrl}" target="_blank" class="project-link secondary-link">
			<span>Code</span>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
			</svg>
		</a>
	`
			: "";

	return `
		<div class="project-card group animate-fadeIn">
			<div class="project-image-container">
				<img src="${project.image}" alt="${project.title}" class="project-image" onerror="this.src='https://via.placeholder.com/400x300'" />
				<div class="project-overlay">
					<div class="project-tech-stack">
						${techTags}
					</div>
				</div>
			</div>
			<div class="project-details">
				<h3 class="project-title">${project.title}</h3>
				<p class="project-description">${project.description}</p>
				<div class="project-links">
					<a href="${project.liveUrl}" target="_blank" class="project-link primary-link">
						<span>View Live</span>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
						</svg>
					</a>
					${codeLink}
				</div>
			</div>
		</div>
	`;
}

// Function to render projects
function renderProjects(projects) {
	const projectContainer = document.querySelector("#work .grid");

	if (!projectContainer) {
		console.error("Project container not found");
		return;
	}

	if (!projects || projects.length === 0) {
		projectContainer.innerHTML = `
			<div class="col-span-full text-center py-10">
				<p class="text-gray-600 dark:text-gray-400 text-lg">No projects available at the moment.</p>
			</div>
		`;
		return;
	}

	// Clear existing content and render new projects
	projectContainer.innerHTML = projects.map((project) => createProjectCard(project)).join("");
}

// Function to show loading state for projects
function showProjectsLoadingState() {
	const projectContainer = document.querySelector("#work .grid");
	if (projectContainer) {
		projectContainer.innerHTML = `
			<div class="col-span-full flex justify-center items-center py-20">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
			</div>
		`;
	}
}

// Function to initialize projects
async function initializeProjects() {
	showProjectsLoadingState();

	// Try to fetch from backend
	let projects = await fetchProjects();

	// If backend fails, use fallback static data
	if (!projects) {
		console.log("Using fallback static project data");
		projects = getFallbackProjects();
	}

	renderProjects(projects);
}

// Fallback static project data (used when backend is unavailable)
function getFallbackProjects() {
	return [
		{
			title: "Consultancy Website",
			description: "A modern website for an educational consultancy firm with responsive design and interactive elements.",
			image: "./images/fate.png",
			liveUrl: "https://fate-edu.vercel.app/",
			codeUrl: "#",
			technologies: ["React", "Tailwind", "Firebase"],
		},
		{
			title: "Home Pickles",
			description: "An e-commerce platform for homemade pickles with shopping cart functionality and order management.",
			image: "./images/achar.png",
			liveUrl: "https://ourghareluachar.vercel.app/",
			codeUrl: "#",
			technologies: ["React", "Node.js", "Express"],
		},
		{
			title: "Event Management Company",
			description: "A professional website for an event management company with event booking and gallery features.",
			image: "./images/kns.png",
			liveUrl: "https://knsentertainment.eu/",
			codeUrl: "#",
			technologies: ["WordPress", "CSS", "JavaScript"],
		},
	];
}

// Initialize projects when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeProjects);

// ========== Dynamic Services Functionality ==========

// SERVICE_API_URL uses the same API_BASE from above
const SERVICE_API_URL = `${API_BASE}/api/services`;

// Function to fetch services from backend
async function fetchServices() {
	try {
		const response = await fetch(SERVICE_API_URL);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const services = await response.json();
		return services;
	} catch (error) {
		console.error("Error fetching services:", error);
		return null;
	}
}

// Function to create a service card HTML
function createServiceCard(service) {
	return `
		<div class="service-card border border-gray-400 rounded-xl px-8 py-12 hover:shadow-xl hover:-translate-y-1 duration-500 dark:border-white dark:hover:shadow-white dark:hover:bg-darkHover cursor-pointer">
			<img src="${service.icon}" alt="${service.title}" class="w-16 mb-4" onerror="this.src='./images/icon-code.png'" />
			<h3 class="text-lg my-4 text-gray-700 dark:text-white">${service.title}</h3>
			<p class="text-sm text-gray-600 leading-5 dark:text-white/80">${service.description}</p>
		</div>
	`;
}

// Function to render services on the page
function renderServices(services) {
	const servicesGrid = document.getElementById("services-grid");

	if (!servicesGrid) {
		console.error("Services grid container not found!");
		return;
	}

	if (!services || services.length === 0) {
		servicesGrid.innerHTML = `
			<div class="col-span-full text-center py-12">
				<p class="text-gray-500 dark:text-gray-400">No services available at the moment.</p>
			</div>
		`;
		return;
	}

	servicesGrid.innerHTML = services.map((service) => createServiceCard(service)).join("");
}

// Function to show loading state
function showServicesLoadingState() {
	const servicesGrid = document.getElementById("services-grid");
	if (servicesGrid) {
		servicesGrid.innerHTML = `
			<div class="col-span-full flex justify-center items-center py-12">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
			</div>
		`;
	}
}

// Main function to initialize services
async function initializeServices() {
	showServicesLoadingState();

	const services = await fetchServices();

	if (services) {
		renderServices(services);
	} else {
		console.log("Failed to fetch services from backend, using fallback data");
		renderServices(getFallbackServices());
	}
}

// Fallback services data (used if backend is unavailable)
function getFallbackServices() {
	return [
		{
			id: 1,
			title: "Web Design",
			description: "Web design is the process of planning, conceptualizing, and implementing the plan for designing a website in a way that is functional and offers a good user experience.",
			icon: "./images/icon-design.png",
		},
		{
			id: 2,
			title: "Mobile App Development",
			description: "Mobile app development involves creating software applications that run on mobile devices, focusing on user-friendly interfaces and optimal performance.",
			icon: "./images/icon-mobile.png",
		},
		{
			id: 3,
			title: "Animation",
			description: "Animation brings designs to life with motion graphics, creating engaging and interactive experiences for users across web and mobile platforms.",
			icon: "./images/icon-animation.png",
		},
		{
			id: 4,
			title: "UX-UI Design",
			description: "UX-UI design focuses on creating intuitive, accessible, and aesthetically pleasing user interfaces that enhance the overall user experience.",
			icon: "./images/icon-graphics.png",
		},
	];
}

// Initialize services when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeServices);
