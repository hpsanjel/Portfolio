"use client";
import { useState, useEffect } from "react";

interface Project {
	_id: string;
	title: string;
	description: string;
	image: string;
	liveUrl: string;
	codeUrl: string;
	technologies: string[];
}

const TABS = [
	{ key: "blogs", label: "📝 Blogs" },
	{ key: "projects", label: "💼 Projects" },
	{ key: "services", label: "⚙️ Services" },
	{ key: "cv", label: "📄 CV" },
];

export default function AdminPage() {
	const [activeTab, setActiveTab] = useState("blogs");

	return (
		<div className="bg-gray-100 min-h-screen">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-4xl font-bold text-center mb-8">Portfolio Admin Panel</h1>
				{/* Tab Navigation */}
				<div className="flex justify-center mb-8">
					<div className="inline-flex rounded-lg border border-gray-300 bg-white p-1" role="tablist">
						{TABS.map((tab) => (
							<button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`tab-button px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.key ? "active bg-blue-600 text-white" : "text-gray-500"}`} role="tab">
								{tab.label}
							</button>
						))}
					</div>
				</div>
				{/* Tab Content */}
				<div>
					{activeTab === "blogs" && <BlogsSection />}
					{activeTab === "projects" && <ProjectsSection />}
					{activeTab === "services" && <ServicesSection />}
					{activeTab === "cv" && <CVSection />}
				</div>
			</div>
		</div>
	);
}

interface Blog {
	_id: string;
	title: string;
	content: string;
	image: string;
	date: string;
}

function BlogsSection() {
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [loading, setLoading] = useState(true);
	const [imageUploading, setImageUploading] = useState(false);
	const [imageUploadError, setImageUploadError] = useState("");
	const [form, setForm] = useState({
		_id: "",
		title: "",
		content: "",
		image: "",
		date: "",
	});
	const [editMode, setEditMode] = useState(false);

	useEffect(() => {
		fetchBlogs();
	}, []);

	async function fetchBlogs() {
		setLoading(true);
		try {
			const res = await fetch("/api/blogs");
			const data = await res.json();
			// Ensure data is an array, fallback to empty array if not
			setBlogs(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error('Error fetching blogs:', error);
			setBlogs([]);
		}
		setLoading(false);
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	async function handleImageUpload(file: File | null) {
		if (!file) return;
		if (file.size > 1024 * 1024) {
			setImageUploadError("Image must be less than 1 MB.");
			return;
		}
		setImageUploadError("");
		setImageUploading(true);
		try {
			const data = new FormData();
			data.append("file", file);
			const res = await fetch("/api/upload", { method: "POST", body: data });
			const payload = await res.json();
			if (res.ok) {
				setForm((prev) => ({ ...prev, image: payload.url }));
			}
		} finally {
			setImageUploading(false);
		}
	}

	function handleEdit(blog: Blog) {
		setForm({
			_id: blog._id,
			title: blog.title,
			content: blog.content,
			image: blog.image,
			date: blog.date,
		});
		setEditMode(true);
	}

	function handleCancel() {
		setForm({ _id: "", title: "", content: "", image: "", date: "" });
		setEditMode(false);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const payload = {
			title: form.title,
			content: form.content,
			image: form.image,
			date: form.date,
		};
		const url = editMode ? `/api/blogs/${form._id}` : "/api/blogs";
		const method = editMode ? "PUT" : "POST";
		const res = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (res.ok) {
			fetchBlogs();
			handleCancel();
		}
	}

	async function handleDelete(id: string) {
		if (!confirm("Are you sure you want to delete this blog post?")) return;
		const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
		if (res.ok) fetchBlogs();
	}

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-8">
			<h2 className="text-2xl font-bold mb-4">{editMode ? "Edit Blog Post" : "Add New Blog Post"}</h2>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<input type="hidden" name="editingBlogId" value={form._id} />
				<div>
					<label className="block text-gray-700 font-semibold mb-2">Blog Title</label>
					<input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</div>
				<div>
					<label className="block text-gray-700 font-semibold mb-2">Content</label>
					<textarea name="content" value={form.content} onChange={handleChange} required rows={5} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
				</div>
				<div>
					<label className="block text-gray-700 font-semibold mb-2">Image URL</label>
					<div className="flex items-center gap-4 mb-2">
						<input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)} className="block w-full text-sm text-gray-600" />
						{imageUploading && <span className="text-sm text-gray-500">Uploading...</span>}
					</div>
					{imageUploadError && <div className="text-sm text-red-600 mb-2">{imageUploadError}</div>}
					{form.image && <img src={form.image} alt="Blog preview" className="mb-2 h-28 w-auto rounded border border-gray-200 object-contain" />}
					<input type="text" name="image" value={form.image} onChange={handleChange} required placeholder="./images/blog-image.png" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</div>
				<div>
					<label className="block text-gray-700 font-semibold mb-2">Date</label>
					<input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</div>
				<div className="flex gap-3">
					<button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold">
						{editMode ? "Update Blog Post" : "Add Blog Post"}
					</button>
					{editMode && (
						<button type="button" onClick={handleCancel} className="px-6 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300 font-semibold">
							Cancel
						</button>
					)}
				</div>
			</form>
			<div className="bg-white rounded-lg shadow-md p-6 mt-8">
				<h2 className="text-2xl font-bold mb-4">Existing Blog Posts</h2>
				<div className="space-y-4">
					{loading ? (
						<div className="text-center py-8 text-gray-500">Loading blog posts...</div>
					) : blogs.length === 0 ? (
						<div className="text-center py-8 text-gray-500">No blog posts found</div>
					) : (
						blogs.map((blog) => (
							<div key={blog._id} className="border rounded-lg p-4 hover:shadow-md transition duration-300 flex items-start gap-4">
								<img src={blog.image} alt={blog.title} className="w-24 h-24 object-cover rounded-lg" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/96")} />
								<div className="flex-1">
									<h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
									<p className="text-gray-600 text-sm mb-2 line-clamp-3">{blog.content}</p>
									<div className="text-xs text-gray-400 mb-2">{blog.date}</div>
								</div>
								<div className="flex flex-col gap-2">
									<button onClick={() => handleEdit(blog)} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm">
										Edit
									</button>
									<button onClick={() => handleDelete(blog._id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm">
										Delete
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
function ProjectsSection() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [imageUploading, setImageUploading] = useState(false);
	const [imageUploadError, setImageUploadError] = useState("");
	const [form, setForm] = useState({
		_id: "",
		title: "",
		description: "",
		image: "",
		liveUrl: "",
		codeUrl: "",
		technologies: "",
	});
	const [editMode, setEditMode] = useState(false);

	useEffect(() => {
		fetchProjects();
	}, []);

	async function fetchProjects() {
		setLoading(true);
		try {
			const res = await fetch("/api/projects");
			const data = await res.json();
			setProjects(data);
		} catch {
			setProjects([]);
		}
		setLoading(false);
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	async function handleImageUpload(file: File | null) {
		if (!file) return;
		if (file.size > 1024 * 1024) {
			setImageUploadError("Image must be less than 1 MB.");
			return;
		}
		setImageUploadError("");
		setImageUploading(true);
		try {
			const data = new FormData();
			data.append("file", file);
			const res = await fetch("/api/upload", { method: "POST", body: data });
			const payload = await res.json();
			if (res.ok) {
				setForm((prev) => ({ ...prev, image: payload.url }));
			}
		} finally {
			setImageUploading(false);
		}
	}

	function handleEdit(project: Project) {
		setForm({
			_id: project._id,
			title: project.title,
			description: project.description,
			image: project.image,
			liveUrl: project.liveUrl,
			codeUrl: project.codeUrl,
			technologies: project.technologies.join(", "),
		});
		setEditMode(true);
	}

	function handleCancel() {
		setForm({ _id: "", title: "", description: "", image: "", liveUrl: "", codeUrl: "", technologies: "" });
		setEditMode(false);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const payload = {
			title: form.title,
			description: form.description,
			image: form.image,
			liveUrl: form.liveUrl,
			codeUrl: form.codeUrl,
			technologies: form.technologies
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean),
		};
		const url = editMode ? `/api/projects/${form._id}` : "/api/projects";
		const method = editMode ? "PUT" : "POST";
		const res = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (res.ok) {
			fetchProjects();
			handleCancel();
		}
	}

	async function handleDelete(id: string) {
		if (!confirm("Are you sure you want to delete this project?")) return;
		const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
		if (res.ok) fetchProjects();
	}

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-8">
			<h2 className="text-2xl font-bold mb-4">{editMode ? "Edit Project" : "Add New Project"}</h2>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<input type="hidden" name="editingProjectId" value={form._id} />
				<div>
					<label className="block text-gray-700 font-semibold mb-2">Project Title</label>
					<input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</div>
				<div>
					<label className="block text-gray-700 font-semibold mb-2">Description</label>
					<textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
				</div>
				<div>
					<label className="block text-gray-700 font-semibold mb-2">Image URL</label>
					<div className="flex items-center gap-4 mb-2">
						<input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)} className="block w-full text-sm text-gray-600" />
						{imageUploading && <span className="text-sm text-gray-500">Uploading...</span>}
					</div>
					{imageUploadError && <div className="text-sm text-red-600 mb-2">{imageUploadError}</div>}
					{form.image && <img src={form.image} alt="Project preview" className="mb-2 h-28 w-full rounded border border-gray-200 object-cover" />}
					<input type="text" name="image" value={form.image} onChange={handleChange} required placeholder="./images/project-image.png" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</div>
				<div>
					<label className="block text-gray-700 font-semibold mb-2">Live URL</label>
					<input type="url" name="liveUrl" value={form.liveUrl} onChange={handleChange} required placeholder="https://example.com" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</div>
				<div>
					<label className="block text-gray-700 font-semibold mb-2">Code URL (optional)</label>
					<input type="url" name="codeUrl" value={form.codeUrl} onChange={handleChange} placeholder="https://github.com/username/repo" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</div>
				<div>
					<label className="block text-gray-700 font-semibold mb-2">Technologies (comma separated)</label>
					<input type="text" name="technologies" value={form.technologies} onChange={handleChange} required placeholder="React, Node.js, MongoDB" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</div>
				<div className="flex gap-3">
					<button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold">
						{editMode ? "Update Project" : "Add Project"}
					</button>
					{editMode && (
						<button type="button" onClick={handleCancel} className="px-6 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300 font-semibold">
							Cancel
						</button>
					)}
				</div>
			</form>
			<div className="bg-white rounded-lg shadow-md p-6 mt-8">
				<h2 className="text-2xl font-bold mb-4">Existing Projects</h2>
				<div className="space-y-4">
					{loading ? (
						<div className="text-center py-8 text-gray-500">Loading projects...</div>
					) : projects.length === 0 ? (
						<div className="text-center py-8 text-gray-500">No projects found</div>
					) : (
						projects.map((project) => (
							<div key={project._id} className="border rounded-lg p-4 hover:shadow-md transition duration-300 flex items-start gap-4">
								<img src={project.image} alt={project.title} className="w-32 h-24 object-cover rounded-lg" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/128x96")} />
								<div className="flex-1">
									<h3 className="text-xl font-semibold mb-2">{project.title}</h3>
									<p className="text-gray-600 text-sm mb-2">{project.description}</p>
									<div className="flex flex-wrap gap-2 mb-2">
										{project.technologies.map((tech, i) => (
											<span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
												{tech}
											</span>
										))}
									</div>
									<div className="flex gap-3 text-xs">
										<a href={project.liveUrl} target="_blank" className="text-blue-600 hover:underline">
											🔗 Live
										</a>
										{project.codeUrl && project.codeUrl !== "#" && (
											<a href={project.codeUrl} target="_blank" className="text-blue-600 hover:underline">
												💻 Code
											</a>
										)}
									</div>
								</div>
								<div className="flex flex-col gap-2">
									<button onClick={() => handleEdit(project)} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm">
										Edit
									</button>
									<button onClick={() => handleDelete(project._id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm">
										Delete
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
interface Service {
	_id: string;
	title: string;
	description: string;
	icon: string;
}

function ServicesSection() {
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);
	const [iconUploading, setIconUploading] = useState(false);
	const [iconUploadError, setIconUploadError] = useState("");
	const [form, setForm] = useState({
		_id: "",
		title: "",
		description: "",
		icon: "",
	});
	const [editMode, setEditMode] = useState(false);

	useEffect(() => {
		fetchServices();
	}, []);

	async function fetchServices() {
		setLoading(true);
		try {
			const res = await fetch("/api/services");
			const data = await res.json();
			setServices(data);
		} catch {
			setServices([]);
		}
		setLoading(false);
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	async function handleIconUpload(file: File | null) {
		if (!file) return;
		if (file.size > 1024 * 1024) {
			setIconUploadError("Image must be less than 1 MB.");
			return;
		}
		setIconUploadError("");
		setIconUploading(true);
		try {
			const data = new FormData();
			data.append("file", file);
			const res = await fetch("/api/upload", { method: "POST", body: data });
			const payload = await res.json();
			if (res.ok) {
				setForm((prev) => ({ ...prev, icon: payload.url }));
			}
		} finally {
			setIconUploading(false);
		}
	}

	function handleEdit(service: Service) {
		setForm({
			_id: service._id,
			title: service.title,
			description: service.description,
			icon: service.icon,
		});
		setEditMode(true);
	}

	function handleCancel() {
		setForm({ _id: "", title: "", description: "", icon: "" });
		setEditMode(false);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const payload = {
			title: form.title,
			description: form.description,
			icon: form.icon,
		};
		const url = editMode ? `/api/services/${form._id}` : "/api/services";
		const method = editMode ? "PUT" : "POST";
		const res = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (res.ok) {
			fetchServices();
			handleCancel();
		}
	}

	async function handleDelete(id: string) {
		if (!confirm("Are you sure you want to delete this service?")) return;
		const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
		if (res.ok) fetchServices();
	}

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-8">
			<h2 className="text-2xl font-bold mb-4">{editMode ? "Edit Service" : "Add New Service"}</h2>
			<form className="space-y-4" onSubmit={handleSubmit}>
				<input type="hidden" name="editingServiceId" value={form._id} />
				<div>
					<label className="block text-gray-700 font-semibold mb-2">Service Title</label>
					<input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</div>
				<div>
					<label className="block text-gray-700 font-semibold mb-2">Description</label>
					<textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
				</div>
				<div>
					<label className="block text-gray-700 font-semibold mb-2">Icon URL</label>
					<div className="flex items-center gap-4 mb-2">
						<input type="file" accept="image/*" onChange={(e) => handleIconUpload(e.target.files?.[0] ?? null)} className="block w-full text-sm text-gray-600" />
						{iconUploading && <span className="text-sm text-gray-500">Uploading...</span>}
					</div>
					{iconUploadError && <div className="text-sm text-red-600 mb-2">{iconUploadError}</div>}
					{form.icon && <img src={form.icon} alt="Service icon preview" className="mb-2 h-16 w-16 rounded border border-gray-200 object-contain" />}
					<input type="text" name="icon" value={form.icon} onChange={handleChange} required placeholder="./images/service-icon.png" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
				</div>
				<div className="flex gap-3">
					<button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold">
						{editMode ? "Update Service" : "Add Service"}
					</button>
					{editMode && (
						<button type="button" onClick={handleCancel} className="px-6 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300 font-semibold">
							Cancel
						</button>
					)}
				</div>
			</form>
			<div className="bg-white rounded-lg shadow-md p-6 mt-8">
				<h2 className="text-2xl font-bold mb-4">Existing Services</h2>
				<div className="space-y-4">
					{loading ? (
						<div className="text-center py-8 text-gray-500">Loading services...</div>
					) : services.length === 0 ? (
						<div className="text-center py-8 text-gray-500">No services found</div>
					) : (
						services.map((service) => (
							<div key={service._id} className="border rounded-lg p-4 hover:shadow-md transition duration-300 flex items-start gap-4">
								<img src={service.icon} alt={service.title} className="w-16 h-16 object-contain rounded-lg" onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/64")} />
								<div className="flex-1">
									<h3 className="text-xl font-semibold mb-2">{service.title}</h3>
									<p className="text-gray-600 text-sm">{service.description}</p>
								</div>
								<div className="flex flex-col gap-2">
									<button onClick={() => handleEdit(service)} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm">
										Edit
									</button>
									<button onClick={() => handleDelete(service._id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm">
										Delete
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
interface CV {
	id: string;
	title: string;
	description: string;
	fileUrl: string;
	date: string;
}

// CV Section - Full Form and Sections
function CVSection() {
	// Header
	const [header, setHeader] = useState({
		name: "",
		title: "",
		address: "",
		phone: "",
		email: "",
		linkedin: "",
		github: "",
		portfolio: "",
	});
	// Summary
	const [summary, setSummary] = useState("");
	// Competencies
	const [competencies, setCompetencies] = useState<{ category: string; skills: string }[]>([]);
	const [competencyForm, setCompetencyForm] = useState({ category: "", skills: "", editIndex: -2 });
	// Experience
	const [experience, setExperience] = useState<any[]>([]);
	const [experienceForm, setExperienceForm] = useState({ title: "", company: "", location: "", date: "", responsibilities: "", editIndex: -2 });
	// Education
	const [education, setEducation] = useState<any[]>([]);
	const [educationForm, setEducationForm] = useState({ degree: "", institution: "", date: "", details: "", editIndex: -2 });
	// Certifications
	const [certifications, setCertifications] = useState<any[]>([]);
	const [certificationForm, setCertificationForm] = useState({ title: "", issuer: "", date: "", editIndex: -2 });
	// Languages
	const [languages, setLanguages] = useState<any[]>([]);
	const [languageForm, setLanguageForm] = useState({ language: "", level: "", editIndex: -2 });
	// References
	const [references, setReferences] = useState<any[]>([]);
	const [referenceForm, setReferenceForm] = useState({ name: "", position: "", company: "", location: "", phone: "", email: "", editIndex: -2 });
	// Projects
	const [projects, setProjects] = useState<any[]>([]);
	const [projectForm, setProjectForm] = useState({ title: "", description: "", tech: "", github: "", preview: "", editIndex: -2 });

	// Fetch CV data
	useEffect(() => {
		fetchCV();
	}, []);

	async function fetchCV() {
		try {
			const res = await fetch("/api/cv");
			if (!res.ok) return;
			const data = await res.json();
			setHeader(data.header || header);
			setSummary(data.summary || "");
			setCompetencies(data.competencies || []);
			setExperience(data.experience || []);
			setEducation(data.education || []);
			setCertifications(data.certifications || []);
			setLanguages(data.languages || []);
			setReferences(data.references || []);
			setProjects(data.projects || []);
		} catch {}
	}

	// Header & Summary
	async function saveHeader() {
		await saveCV({ header });
	}
	async function saveSummary() {
		await saveCV({ summary });
	}

	// Competencies
	function handleCompetencyEdit(index: number) {
		setCompetencyForm({ ...competencies[index], editIndex: index });
	}
	function handleCompetencyDelete(index: number) {
		const updated = competencies.filter((_, i) => i !== index);
		setCompetencies(updated);
		saveCV({ competencies: updated });
	}
	function handleCompetencySave() {
		const { category, skills, editIndex } = competencyForm;
		let updated = [...competencies];
		if (editIndex >= 0) updated[editIndex] = { category, skills };
		else updated.push({ category, skills });
		setCompetencies(updated);
		setCompetencyForm({ category: "", skills: "", editIndex: -2 });
		saveCV({ competencies: updated });
	}
	function handleCompetencyCancel() {
		setCompetencyForm({ category: "", skills: "", editIndex: -2 });
	}

	// Experience
	function handleExperienceEdit(index: number) {
		setExperienceForm({ ...experience[index], responsibilities: experience[index].responsibilities.join("\n"), editIndex: index });
	}
	function handleExperienceDelete(index: number) {
		const updated = experience.filter((_, i) => i !== index);
		setExperience(updated);
		saveCV({ experience: updated });
	}
	function handleExperienceSave() {
		const { title, company, location, date, responsibilities, editIndex } = experienceForm;
		let updated = [...experience];
		const entry = { title, company, location, date, responsibilities: responsibilities.split("\n").filter(Boolean) };
		if (editIndex >= 0) updated[editIndex] = entry;
		else updated.push(entry);
		setExperience(updated);
		setExperienceForm({ title: "", company: "", location: "", date: "", responsibilities: "", editIndex: -2 });
		saveCV({ experience: updated });
	}
	function handleExperienceCancel() {
		setExperienceForm({ title: "", company: "", location: "", date: "", responsibilities: "", editIndex: -2 });
	}

	// Education
	function handleEducationEdit(index: number) {
		setEducationForm({ ...education[index], editIndex: index });
	}
	function handleEducationDelete(index: number) {
		const updated = education.filter((_, i) => i !== index);
		setEducation(updated);
		saveCV({ education: updated });
	}
	function handleEducationSave() {
		const { degree, institution, date, details, editIndex } = educationForm;
		let updated = [...education];
		const entry = { degree, institution, date, details };
		if (editIndex >= 0) updated[editIndex] = entry;
		else updated.push(entry);
		setEducation(updated);
		setEducationForm({ degree: "", institution: "", date: "", details: "", editIndex: -2 });
		saveCV({ education: updated });
	}
	function handleEducationCancel() {
		setEducationForm({ degree: "", institution: "", date: "", details: "", editIndex: -2 });
	}

	// Certifications
	function handleCertificationEdit(index: number) {
		setCertificationForm({ ...certifications[index], editIndex: index });
	}
	function handleCertificationDelete(index: number) {
		const updated = certifications.filter((_, i) => i !== index);
		setCertifications(updated);
		saveCV({ certifications: updated });
	}
	function handleCertificationSave() {
		const { title, issuer, date, editIndex } = certificationForm;
		let updated = [...certifications];
		const entry = { title, issuer, date };
		if (editIndex >= 0) updated[editIndex] = entry;
		else updated.push(entry);
		setCertifications(updated);
		setCertificationForm({ title: "", issuer: "", date: "", editIndex: -2 });
		saveCV({ certifications: updated });
	}
	function handleCertificationCancel() {
		setCertificationForm({ title: "", issuer: "", date: "", editIndex: -2 });
	}

	// Languages
	function handleLanguageEdit(index: number) {
		setLanguageForm({ ...languages[index], editIndex: index });
	}
	function handleLanguageDelete(index: number) {
		const updated = languages.filter((_, i) => i !== index);
		setLanguages(updated);
		saveCV({ languages: updated });
	}
	function handleLanguageSave() {
		const { language, level, editIndex } = languageForm;
		let updated = [...languages];
		const entry = { language, level };
		if (editIndex >= 0) updated[editIndex] = entry;
		else updated.push(entry);
		setLanguages(updated);
		setLanguageForm({ language: "", level: "", editIndex: -2 });
		saveCV({ languages: updated });
	}
	function handleLanguageCancel() {
		setLanguageForm({ language: "", level: "", editIndex: -2 });
	}

	// References
	function handleReferenceEdit(index: number) {
		setReferenceForm({ ...references[index], editIndex: index });
	}
	function handleReferenceDelete(index: number) {
		const updated = references.filter((_, i) => i !== index);
		setReferences(updated);
		saveCV({ references: updated });
	}
	function handleReferenceSave() {
		const { name, position, company, location, phone, email, editIndex } = referenceForm;
		let updated = [...references];
		const entry = { name, position, company, location, phone, email };
		if (editIndex >= 0) updated[editIndex] = entry;
		else updated.push(entry);
		setReferences(updated);
		setReferenceForm({ name: "", position: "", company: "", location: "", phone: "", email: "", editIndex: -2 });
		saveCV({ references: updated });
	}
	function handleReferenceCancel() {
		setReferenceForm({ name: "", position: "", company: "", location: "", phone: "", email: "", editIndex: -2 });
	}

	// Projects
	function handleProjectEdit(index: number) {
		setProjectForm({ ...projects[index], editIndex: index });
	}
	function handleProjectDelete(index: number) {
		const updated = projects.filter((_, i) => i !== index);
		setProjects(updated);
		saveCV({ projects: updated });
	}
	function handleProjectSave() {
		const { title, description, tech, github, preview, editIndex } = projectForm;
		let updated = [...projects];
		const entry = { title, description, tech, github, preview };
		if (editIndex >= 0) updated[editIndex] = entry;
		else updated.push(entry);
		setProjects(updated);
		setProjectForm({ title: "", description: "", tech: "", github: "", preview: "", editIndex: -2 });
		saveCV({ projects: updated });
	}
	function handleProjectCancel() {
		setProjectForm({ title: "", description: "", tech: "", github: "", preview: "", editIndex: -2 });
	}

	// Save CV (partial update)
	async function saveCV(update: any) {
		await fetch("/api/cv", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(update),
		});
		fetchCV();
	}

	return (
		<div className="space-y-8">
			{/* Header Section */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold mb-4">CV Header Information</h2>
				<form className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-gray-700 font-semibold mb-2">Full Name</label>
						<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={header.name} onChange={(e) => setHeader({ ...header, name: e.target.value })} />
					</div>
					<div>
						<label className="block text-gray-700 font-semibold mb-2">Professional Title</label>
						<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={header.title} onChange={(e) => setHeader({ ...header, title: e.target.value })} />
					</div>
					<div className="md:col-span-2">
						<label className="block text-gray-700 font-semibold mb-2">Address</label>
						<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={header.address} onChange={(e) => setHeader({ ...header, address: e.target.value })} />
					</div>
					<div>
						<label className="block text-gray-700 font-semibold mb-2">Phone</label>
						<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={header.phone} onChange={(e) => setHeader({ ...header, phone: e.target.value })} />
					</div>
					<div>
						<label className="block text-gray-700 font-semibold mb-2">Email</label>
						<input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={header.email} onChange={(e) => setHeader({ ...header, email: e.target.value })} />
					</div>
					<div>
						<label className="block text-gray-700 font-semibold mb-2">LinkedIn URL</label>
						<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={header.linkedin} onChange={(e) => setHeader({ ...header, linkedin: e.target.value })} />
					</div>
					<div>
						<label className="block text-gray-700 font-semibold mb-2">GitHub URL</label>
						<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={header.github} onChange={(e) => setHeader({ ...header, github: e.target.value })} />
					</div>
					<div className="md:col-span-2">
						<label className="block text-gray-700 font-semibold mb-2">Portfolio URL</label>
						<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={header.portfolio} onChange={(e) => setHeader({ ...header, portfolio: e.target.value })} />
					</div>
				</form>
				<div className="mt-4">
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							saveHeader();
						}}
						className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
					>
						Save Header
					</button>
				</div>
			</div>

			{/* Summary Section */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold mb-4">Professional Summary</h2>
				<form>
					<div>
						<label className="block text-gray-700 font-semibold mb-2">Summary</label>
						<textarea rows={4} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={summary} onChange={(e) => setSummary(e.target.value)}></textarea>
					</div>
				</form>
				<div className="mt-4">
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							saveSummary();
						}}
						className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
					>
						Save Summary
					</button>
				</div>
			</div>

			{/* Competencies Section */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold mb-4">Key Competencies</h2>
				<div className="space-y-2 mb-4">
					{competencies.map((c, i) => (
						<div key={i} className="flex items-center gap-2">
							<div className="flex-1">
								<span className="font-semibold">{c.category}:</span> {c.skills}
							</div>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									handleCompetencyEdit(i);
								}}
								className="px-3 py-1 bg-yellow-500 text-white rounded text-xs"
							>
								Edit
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									handleCompetencyDelete(i);
								}}
								className="px-3 py-1 bg-red-500 text-white rounded text-xs"
							>
								Delete
							</button>
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						setCompetencyForm({ category: "", skills: "", editIndex: -1 });
					}}
					className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mb-2 font-semibold"
				>
					+ Add Competency Category
				</button>
				{competencyForm.editIndex !== -2 && (
					<div className="mt-4 p-4 border-2 border-green-500 rounded-lg">
						<div className="space-y-3">
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Category</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={competencyForm.category} onChange={(e) => setCompetencyForm((f) => ({ ...f, category: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Skills (comma separated)</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={competencyForm.skills} onChange={(e) => setCompetencyForm((f) => ({ ...f, skills: e.target.value }))} />
							</div>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleCompetencySave();
									}}
									className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
								>
									Save
								</button>
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleCompetencyCancel();
									}}
									className="px-6 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Experience Section */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold mb-4">Professional Experience</h2>
				<div className="space-y-2 mb-4">
					{experience.map((exp, i) => (
						<div key={i} className="flex items-center gap-2">
							<div className="flex-1">
								<span className="font-semibold">{exp.title}</span> at {exp.company}, {exp.location} <span className="text-xs text-gray-400">({exp.date})</span>
								<ul className="list-disc ml-6 text-sm text-gray-700">
									{exp.responsibilities.map((r: string, idx: number) => (
										<li key={idx}>{r}</li>
									))}
								</ul>
							</div>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									handleExperienceEdit(i);
								}}
								className="px-3 py-1 bg-yellow-500 text-white rounded text-xs"
							>
								Edit
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									handleExperienceDelete(i);
								}}
								className="px-3 py-1 bg-red-500 text-white rounded text-xs"
							>
								Delete
							</button>
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						setExperienceForm({ title: "", company: "", location: "", date: "", responsibilities: "", editIndex: -1 });
					}}
					className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mb-2 font-semibold"
				>
					+ Add Experience
				</button>
				{experienceForm.editIndex !== -2 && (
					<div className="mt-4 p-4 border-2 border-green-500 rounded-lg">
						<div className="space-y-3">
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Job Title</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={experienceForm.title} onChange={(e) => setExperienceForm((f) => ({ ...f, title: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Company</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={experienceForm.company} onChange={(e) => setExperienceForm((f) => ({ ...f, company: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Location</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={experienceForm.location} onChange={(e) => setExperienceForm((f) => ({ ...f, location: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Date</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={experienceForm.date} onChange={(e) => setExperienceForm((f) => ({ ...f, date: e.target.value }))} placeholder="e.g., January 2020 - Present" />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Responsibilities (one per line)</label>
								<textarea rows={5} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={experienceForm.responsibilities} onChange={(e) => setExperienceForm((f) => ({ ...f, responsibilities: e.target.value }))} placeholder="Enter each responsibility on a new line"></textarea>
							</div>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleExperienceSave();
									}}
									className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
								>
									Save
								</button>
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleExperienceCancel();
									}}
									className="px-6 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Projects Section */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold mb-4">CV Projects</h2>
				<div className="space-y-2 mb-4">
					{projects.map((proj, i) => (
						<div key={i} className="flex items-center gap-2">
							<div className="flex-1">
								<span className="font-semibold">{proj.title}</span> <span className="text-xs text-gray-400">({proj.tech})</span>
								{proj.description && <div className="text-sm text-gray-600">{proj.description}</div>}
								<div className="text-xs text-gray-500">
									{proj.github && <span className="mr-2">GitHub</span>}
									{proj.preview && <span>Live Preview</span>}
								</div>
							</div>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									handleProjectEdit(i);
								}}
								className="px-3 py-1 bg-yellow-500 text-white rounded text-xs"
							>
								Edit
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									handleProjectDelete(i);
								}}
								className="px-3 py-1 bg-red-500 text-white rounded text-xs"
							>
								Delete
							</button>
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						setProjectForm({ title: "", description: "", tech: "", github: "", preview: "", editIndex: -1 });
					}}
					className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mb-2 font-semibold"
				>
					+ Add Project
				</button>
				{projectForm.editIndex !== -2 && (
					<div className="mt-4 p-4 border-2 border-green-500 rounded-lg">
						<div className="space-y-3">
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Project Title</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={projectForm.title} onChange={(e) => setProjectForm((f) => ({ ...f, title: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Tech Stack</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={projectForm.tech} onChange={(e) => setProjectForm((f) => ({ ...f, tech: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Description</label>
								<textarea rows={3} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={projectForm.description} onChange={(e) => setProjectForm((f) => ({ ...f, description: e.target.value }))}></textarea>
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">GitHub URL</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={projectForm.github} onChange={(e) => setProjectForm((f) => ({ ...f, github: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Live Preview URL</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={projectForm.preview} onChange={(e) => setProjectForm((f) => ({ ...f, preview: e.target.value }))} />
							</div>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleProjectSave();
									}}
									className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
								>
									Save
								</button>
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleProjectCancel();
									}}
									className="px-6 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Education Section */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold mb-4">Education</h2>
				<div className="space-y-2 mb-4">
					{education.map((edu, i) => (
						<div key={i} className="flex items-center gap-2">
							<div className="flex-1">
								<span className="font-semibold">{edu.degree}</span> at {edu.institution} <span className="text-xs text-gray-400">({edu.date})</span> {edu.details && <span className="text-xs text-gray-500">- {edu.details}</span>}
							</div>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									handleEducationEdit(i);
								}}
								className="px-3 py-1 bg-yellow-500 text-white rounded text-xs"
							>
								Edit
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									handleEducationDelete(i);
								}}
								className="px-3 py-1 bg-red-500 text-white rounded text-xs"
							>
								Delete
							</button>
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						setEducationForm({ degree: "", institution: "", date: "", details: "", editIndex: -1 });
					}}
					className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mb-2 font-semibold"
				>
					+ Add Education
				</button>
				{educationForm.editIndex !== -2 && (
					<div className="mt-4 p-4 border-2 border-green-500 rounded-lg">
						<div className="space-y-3">
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Degree/Certificate</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={educationForm.degree} onChange={(e) => setEducationForm((f) => ({ ...f, degree: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Institution</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={educationForm.institution} onChange={(e) => setEducationForm((f) => ({ ...f, institution: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Date/Year</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={educationForm.date} onChange={(e) => setEducationForm((f) => ({ ...f, date: e.target.value }))} placeholder="e.g., 2015-2019" />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Details (optional)</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={educationForm.details} onChange={(e) => setEducationForm((f) => ({ ...f, details: e.target.value }))} placeholder="e.g., GPA, honors" />
							</div>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleEducationSave();
									}}
									className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
								>
									Save
								</button>
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleEducationCancel();
									}}
									className="px-6 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Certifications Section */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold mb-4">Certifications</h2>
				<div className="space-y-2 mb-4">
					{certifications.map((cert, i) => (
						<div key={i} className="flex items-center gap-2">
							<div className="flex-1">
								<span className="font-semibold">{cert.title}</span> – {cert.issuer}, {cert.date}
							</div>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									handleCertificationEdit(i);
								}}
								className="px-3 py-1 bg-yellow-500 text-white rounded text-xs"
							>
								Edit
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									handleCertificationDelete(i);
								}}
								className="px-3 py-1 bg-red-500 text-white rounded text-xs"
							>
								Delete
							</button>
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						setCertificationForm({ title: "", issuer: "", date: "", editIndex: -1 });
					}}
					className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mb-2 font-semibold"
				>
					+ Add Certification
				</button>
				{certificationForm.editIndex !== -2 && (
					<div className="mt-4 p-4 border-2 border-green-500 rounded-lg">
						<div className="space-y-3">
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Certification Title</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={certificationForm.title} onChange={(e) => setCertificationForm((f) => ({ ...f, title: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Issuer</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={certificationForm.issuer} onChange={(e) => setCertificationForm((f) => ({ ...f, issuer: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Date/Serial Number</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={certificationForm.date} onChange={(e) => setCertificationForm((f) => ({ ...f, date: e.target.value }))} />
							</div>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleCertificationSave();
									}}
									className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
								>
									Save
								</button>
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleCertificationCancel();
									}}
									className="px-6 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Languages Section */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold mb-4">Languages</h2>
				<div className="space-y-2 mb-4">
					{languages.map((lang, i) => (
						<div key={i} className="flex items-center gap-2">
							<div className="flex-1">
								<span className="font-semibold">{lang.language}</span> – {lang.level}
							</div>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									handleLanguageEdit(i);
								}}
								className="px-3 py-1 bg-yellow-500 text-white rounded text-xs"
							>
								Edit
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									handleLanguageDelete(i);
								}}
								className="px-3 py-1 bg-red-500 text-white rounded text-xs"
							>
								Delete
							</button>
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						setLanguageForm({ language: "", level: "", editIndex: -1 });
					}}
					className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mb-2 font-semibold"
				>
					+ Add Language
				</button>
				{languageForm.editIndex !== -2 && (
					<div className="mt-4 p-4 border-2 border-green-500 rounded-lg">
						<div className="space-y-3">
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Language</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={languageForm.language} onChange={(e) => setLanguageForm((f) => ({ ...f, language: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Proficiency Level</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={languageForm.level} onChange={(e) => setLanguageForm((f) => ({ ...f, level: e.target.value }))} placeholder="e.g., Native, Fluent, Intermediate" />
							</div>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleLanguageSave();
									}}
									className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
								>
									Save
								</button>
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleLanguageCancel();
									}}
									className="px-6 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* References Section */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-2xl font-bold mb-4">References</h2>
				<div className="space-y-2 mb-4">
					{references.map((ref, i) => (
						<div key={i} className="flex items-center gap-2">
							<div className="flex-1">
								<span className="font-semibold">{ref.name}</span> – {ref.position}, {ref.company} {ref.location && <span className="text-xs text-gray-500">({ref.location})</span>} {ref.phone && <span className="text-xs text-gray-400">{ref.phone}</span>} {ref.email && <span className="text-xs text-gray-400">{ref.email}</span>}
							</div>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									handleReferenceEdit(i);
								}}
								className="px-3 py-1 bg-yellow-500 text-white rounded text-xs"
							>
								Edit
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									handleReferenceDelete(i);
								}}
								className="px-3 py-1 bg-red-500 text-white rounded text-xs"
							>
								Delete
							</button>
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						setReferenceForm({ name: "", position: "", company: "", location: "", phone: "", email: "", editIndex: -1 });
					}}
					className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 mb-2 font-semibold"
				>
					+ Add Reference
				</button>
				{referenceForm.editIndex !== -2 && (
					<div className="mt-4 p-4 border-2 border-green-500 rounded-lg">
						<div className="space-y-3">
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Full Name</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={referenceForm.name} onChange={(e) => setReferenceForm((f) => ({ ...f, name: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Position/Title</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={referenceForm.position} onChange={(e) => setReferenceForm((f) => ({ ...f, position: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Company</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={referenceForm.company} onChange={(e) => setReferenceForm((f) => ({ ...f, company: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Location</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={referenceForm.location} onChange={(e) => setReferenceForm((f) => ({ ...f, location: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Phone</label>
								<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={referenceForm.phone} onChange={(e) => setReferenceForm((f) => ({ ...f, phone: e.target.value }))} />
							</div>
							<div>
								<label className="block text-gray-700 font-semibold mb-2">Email</label>
								<input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={referenceForm.email} onChange={(e) => setReferenceForm((f) => ({ ...f, email: e.target.value }))} />
							</div>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleReferenceSave();
									}}
									className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
								>
									Save
								</button>
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										handleReferenceCancel();
									}}
									className="px-6 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
