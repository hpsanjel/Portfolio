"use client";
import { useState, useEffect } from "react";
import { Menu, X, Home, FileText, Briefcase, Settings, User, Plus, Edit2, Trash2, Search, Filter, Download, Upload, Eye, ChevronDown, LogOut, Bell, BarChart3, Users, Calendar } from "lucide-react";

interface Project {
	_id: string;
	title: string;
	description: string;
	image: string;
	liveUrl: string;
	codeUrl: string;
	technologies: string[];
	projectstory?: string;
}

const MENU_ITEMS = [
	{ key: "dashboard", label: "Dashboard", icon: Home },
	{ key: "blogs", label: "Blog Posts", icon: FileText },
	{ key: "projects", label: "Projects", icon: Briefcase },
	{ key: "services", label: "Services", icon: Settings },
	{ key: "cv", label: "CV Management", icon: User },
	{ key: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminPage() {
	const [activeTab, setActiveTab] = useState("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const [currentDate, setCurrentDate] = useState<string>("");
	const [mounted, setMounted] = useState(false);
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [showSearchResults, setShowSearchResults] = useState(false);

	useEffect(() => {
		setMounted(true);
		setCurrentDate(new Date().toLocaleDateString());
	}, []);

	// Search functionality
	useEffect(() => {
		if (searchQuery.trim() === '') {
			setShowSearchResults(false);
			setSearchResults([]);
			return;
		}

		const performSearch = async () => {
			try {
				const [blogsRes, projectsRes, servicesRes] = await Promise.all([
					fetch("/api/blogs"),
					fetch("/api/projects"),
					fetch("/api/services"),
				]);

				const blogs = await blogsRes.json();
				const projects = await projectsRes.json();
				const services = await servicesRes.json();

				const allData = [
					...(Array.isArray(blogs) ? blogs.map((blog: any) => ({ ...blog, type: 'blog', title: blog.title, content: blog.content })) : []),
					...(Array.isArray(projects) ? projects.map((project: any) => ({ ...project, type: 'project', title: project.title, content: project.description })) : []),
					...(Array.isArray(services) ? services.map((service: any) => ({ ...service, type: 'service', title: service.title, content: service.description })) : []),
				];

				const filtered = allData.filter(item =>
					item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					stripHtml(item.content).toLowerCase().includes(searchQuery.toLowerCase())
				);

				setSearchResults(filtered);
				setShowSearchResults(true);
			} catch (error) {
				console.error('Search error:', error);
			}
		};

		const debounceTimer = setTimeout(performSearch, 300);
		return () => clearTimeout(debounceTimer);
	}, [searchQuery]);

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ctrl/Cmd + K for search focus
			if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
				e.preventDefault();
				const searchInput = document.querySelector('input[placeholder*="Search..."]') as HTMLInputElement;
				if (searchInput) searchInput.focus();
			}
			// Ctrl/Cmd + B for sidebar toggle
			if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
				e.preventDefault();
				setSidebarOpen(!sidebarOpen);
			}
			// Escape to close search results
			if (e.key === 'Escape') {
				setShowSearchResults(false);
				setSearchQuery('');
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [sidebarOpen]);

	return (
		<div className="min-h-screen bg-gray-50 flex">
			{/* Skip to main content link for screen readers */}
			<a 
				href="#main-content" 
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
			>
				Skip to main content
			</a>

			{/* Sidebar */}
			<aside 
				className={`${sidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg transition-all duration-300 ease-in-out fixed left-0 top-0 h-full z-40`}
				aria-label="Main navigation"
			>
				<div className="p-6 border-b border-gray-200">
					<div className={`flex items-center justify-between ${!sidebarOpen && "justify-center"}`}>
						<div className={`flex items-center space-x-3 ${!sidebarOpen && "justify-center"}`}>
							<div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center" aria-hidden="true">
								<span className="text-white font-bold text-lg">A</span>
							</div>
							{sidebarOpen && <span className="font-bold text-xl text-gray-800">Admin</span>}
						</div>
						<button
							onClick={() => setSidebarOpen(!sidebarOpen)}
							className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
							aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
							aria-expanded={sidebarOpen}
						>
							{sidebarOpen ? <X size={20} /> : <Menu size={20} />}
						</button>
					</div>
				</div>

				<nav className="p-4" role="navigation" aria-label="Admin sections">
					{MENU_ITEMS.map((item) => {
						const Icon = item.icon;
						return (
							<button
								key={item.key}
								onClick={() => setActiveTab(item.key)}
								className={`w-full flex items-center ${sidebarOpen ? "justify-start" : "justify-center"} space-x-3 px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
									activeTab === item.key
										? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
										: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
								}`}
								aria-current={activeTab === item.key ? "page" : undefined}
								aria-label={`Navigate to ${item.label}`}
							>
								<Icon size={20} aria-hidden="true" />
								{sidebarOpen && <span className="font-medium">{item.label}</span>}
							</button>
						);
					})}
				</nav>

				{sidebarOpen && (
					<div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center" aria-hidden="true">
								<User size={20} className="text-gray-600" />
							</div>
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-900">Admin User</p>
								<p className="text-xs text-gray-500">admin@portfolio.com</p>
							</div>
							<button 
								className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
								aria-label="Logout"
							>
								<LogOut size={18} />
							</button>
						</div>
					</div>
				)}
			</aside>

			{/* Main Content */}
			<div className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300 ease-in-out`}>
				{/* Header */}
				<header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
					<div className="px-6 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-4 flex-1">
								{!sidebarOpen && (
									<button
										onClick={() => setSidebarOpen(true)}
										className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
										aria-label="Expand sidebar"
									>
										<Menu size={20} />
									</button>
								)}
								<div className="relative flex-1 max-w-md">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
									<input
										type="text"
										placeholder="Search... (Ctrl+K)"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										aria-label="Search across all content"
									/>
								</div>
							</div>
							<div className="flex items-center space-x-4">
								<button
									onClick={() => setNotificationsOpen(!notificationsOpen)}
									className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
									aria-label="View notifications"
									aria-expanded={notificationsOpen}
								>
									<Bell size={20} />
									<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-label="Unread notifications"></span>
								</button>
								<div className="text-right">
									<p className="text-sm font-medium text-gray-900">Welcome back!</p>
									<p className="text-xs text-gray-500">{mounted ? currentDate : ''}</p>
								</div>
							</div>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main id="main-content" className="p-6" role="main">
					<div className="sr-only" aria-live="polite" aria-atomic="true">
						{activeTab && `Currently viewing: ${MENU_ITEMS.find(item => item.key === activeTab)?.label}`}
					</div>
					{activeTab === "dashboard" && <DashboardSection setActiveTab={setActiveTab} />}
					{activeTab === "blogs" && <BlogsSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
					{activeTab === "projects" && <ProjectsSection setActiveTab={setActiveTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
					{activeTab === "services" && <ServicesSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
					{activeTab === "cv" && <CVSection />}
					{activeTab === "analytics" && <AnalyticsSection />}
				</main>
			</div>
		</div>
	);
}

// Dashboard Section
function DashboardSection({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
	const [stats, setStats] = useState({
		blogs: 0,
		projects: 0,
		services: 0,
		views: 0,
	});

	useEffect(() => {
		// Fetch dashboard stats
		const fetchStats = async () => {
			try {
				const [blogsRes, projectsRes, servicesRes] = await Promise.all([
					fetch("/api/blogs"),
					fetch("/api/projects"),
					fetch("/api/services"),
				]);
				const blogs = await blogsRes.json();
				const projects = await projectsRes.json();
				const services = await servicesRes.json();
				
				setStats({
					blogs: Array.isArray(blogs) ? blogs.length : 0,
					projects: Array.isArray(projects) ? projects.length : 0,
					services: Array.isArray(services) ? services.length : 0,
					views: Math.floor(Math.random() * 1000) + 500, // Mock data
				});
			} catch (error) {
				console.error("Error fetching stats:", error);
			}
		};
		fetchStats();
	}, []);

	const statCards = [
		{ title: "Total Blogs", value: stats.blogs, icon: FileText, color: "from-blue-500 to-blue-600", change: "+12%" },
		{ title: "Projects", value: stats.projects, icon: Briefcase, color: "from-purple-500 to-purple-600", change: "+8%" },
		{ title: "Services", value: stats.services, icon: Settings, color: "from-green-500 to-green-600", change: "+5%" },
		{ title: "Total Views", value: stats.views, icon: Eye, color: "from-orange-500 to-orange-600", change: "+25%" },
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
					<p className="text-gray-600 mt-1">Welcome back! Here's an overview of your portfolio.</p>
				</div>
				<button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
					<Download size={20} />
					<span>Export Report</span>
				</button>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{statCards.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">{stat.title}</p>
									<p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
									<p className="text-sm text-green-600 mt-2">{stat.change} from last month</p>
								</div>
								<div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
									<Icon size={24} className="text-white" />
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Recent Activity */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
					<div className="space-y-4">
						{[
							{ action: "New blog post created", item: "Getting Started with React", time: "2 hours ago", color: "bg-blue-100 text-blue-600" },
							{ action: "Project updated", item: "Portfolio Website", time: "5 hours ago", color: "bg-purple-100 text-purple-600" },
							{ action: "Service added", item: "Web Development", time: "1 day ago", color: "bg-green-100 text-green-600" },
						].map((activity, index) => (
							<div key={index} className="flex items-center space-x-3">
								<div className={`w-2 h-2 rounded-full ${activity.color}`}></div>
								<div className="flex-1">
									<p className="text-sm text-gray-900">{activity.action}</p>
									<p className="text-xs text-gray-500">{activity.item} • {activity.time}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
					<div className="grid grid-cols-2 gap-4">
						<button 
							onClick={() => setActiveTab('blogs')}
							className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
						>
							<Plus size={24} className="text-gray-400 mb-2" />
							<span className="text-sm text-gray-600">Add Blog</span>
						</button>
						<button 
							onClick={() => setActiveTab('projects')}
							className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
						>
							<Plus size={24} className="text-gray-400 mb-2" />
							<span className="text-sm text-gray-600">Add Project</span>
						</button>
						<button 
							onClick={() => setActiveTab('services')}
							className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
						>
							<Plus size={24} className="text-gray-400 mb-2" />
							<span className="text-sm text-gray-600">Add Service</span>
						</button>
						<button 
							onClick={() => setActiveTab('cv')}
							className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
						>
							<Upload size={24} className="text-gray-400 mb-2" />
							<span className="text-sm text-gray-600">Upload CV</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

// Analytics Section
function AnalyticsSection() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
					<p className="text-gray-600 mt-1">Track your portfolio performance and user engagement.</p>
				</div>
				<div className="flex items-center space-x-3">
					<select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
						<option>Last 7 days</option>
						<option>Last 30 days</option>
						<option>Last 3 months</option>
						<option>Last year</option>
					</select>
					<button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						<Download size={20} />
						<span>Export</span>
					</button>
				</div>
			</div>

			{/* Analytics Cards */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Traffic Overview</h2>
					<div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
						<div className="text-center">
							<BarChart3 size={48} className="text-gray-400 mx-auto mb-2" />
							<p className="text-gray-500">Analytics charts will be displayed here</p>
							<p className="text-sm text-gray-400">Integration with analytics service needed</p>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h2>
					<div className="space-y-4">
						{[
							{ page: "/projects", views: 1234, percentage: 45 },
							{ page: "/about", views: 987, percentage: 35 },
							{ page: "/blog", views: 654, percentage: 25 },
							{ page: "/contact", views: 432, percentage: 15 },
						].map((item, index) => (
							<div key={index}>
								<div className="flex items-center justify-between mb-1">
									<span className="text-sm text-gray-900">{item.page}</span>
									<span className="text-sm text-gray-500">{item.views} views</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Additional Analytics */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 className="text-sm font-medium text-gray-600 mb-2">Avg. Session Duration</h3>
					<p className="text-2xl font-bold text-gray-900">3m 24s</p>
					<p className="text-sm text-green-600 mt-2">+12% from last month</p>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 className="text-sm font-medium text-gray-600 mb-2">Bounce Rate</h3>
					<p className="text-2xl font-bold text-gray-900">32.5%</p>
					<p className="text-sm text-green-600 mt-2">-5% from last month</p>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 className="text-sm font-medium text-gray-600 mb-2">Conversion Rate</h3>
					<p className="text-2xl font-bold text-gray-900">4.2%</p>
					<p className="text-sm text-green-600 mt-2">+8% from last month</p>
				</div>
			</div>
		</div>
	);
}

interface Blog {
	_id: string;
	title: string;
	excerpt: string;
	content: string;
	image: string;
	date: string;
}

// Utility function to strip HTML tags
function stripHtml(html: string): string {
	const tmp = document.createElement('div');
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || '';
}

// WYSIWYG Editor Component
function WYSIWYGEditor({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
	const [editorContent, setEditorContent] = useState(value);

	useEffect(() => {
		setEditorContent(value);
	}, [value]);

	const execCommand = (command: string, value?: string) => {
		document.execCommand(command, false, value);
		const content = document.getElementById('editor')?.innerHTML || '';
		setEditorContent(content);
		onChange(content);
	};

	const handleInput = () => {
		const content = document.getElementById('editor')?.innerHTML || '';
		setEditorContent(content);
		onChange(content);
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const imageUrl = event.target?.result as string;
				execCommand('insertImage', imageUrl);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="border border-gray-300 rounded-lg overflow-hidden">
			{/* Toolbar */}
			<div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
				<button
					type="button"
					onClick={() => execCommand('bold')}
					className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
					title="Bold"
				>
					<b className="font-bold">B</b>
				</button>
				<button
					type="button"
					onClick={() => execCommand('underline')}
					className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
					title="Underline"
				>
					<u className="underline">U</u>
				</button>
				<select
					onChange={(e) => execCommand('fontSize', e.target.value)}
					className="px-2 py-1 text-sm border border-gray-300 rounded"
					title="Font Size"
				>
					<option value="">Size</option>
					<option value="1">Small</option>
					<option value="3">Normal</option>
					<option value="5">Large</option>
					<option value="7">X-Large</option>
				</select>
				<button
					type="button"
					onClick={() => execCommand('insertUnorderedList')}
					className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
					title="Bullet List"
				>
					••
				</button>
				<button
					type="button"
					onClick={() => execCommand('insertOrderedList')}
					className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
					title="Numbered List"
				>
					1.
				</button>
				<button
					type="button"
					onClick={() => execCommand('insertLineBreak')}
					className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
					title="Line Break"
				>
					↵
				</button>
				<label className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 cursor-pointer" title="Insert Image">
					📷
					<input
						type="file"
						accept="image/*"
						onChange={handleImageUpload}
						className="hidden"
					/>
				</label>
			</div>
			
			{/* Editor */}
			<div
				id="editor"
				contentEditable
				onInput={handleInput}
				className="min-h-[200px] p-4 focus:outline-none bg-white"
				style={{ minHeight: '200px' }}
				dangerouslySetInnerHTML={{ __html: editorContent }}
				data-placeholder={placeholder}
			/>
		</div>
	);
}

function BlogsSection({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) {
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [loading, setLoading] = useState(true);
	const [imageUploading, setImageUploading] = useState(false);
	const [imageUploadError, setImageUploadError] = useState("");
	const [form, setForm] = useState({
		_id: "",
		title: "",
		excerpt: "",
		content: "",
		image: "",
		date: "",
	});
	const [editMode, setEditMode] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		fetchBlogs();
	}, [searchQuery]);

	async function fetchBlogs() {
		setLoading(true);
		try {
			const res = await fetch("/api/blogs");
			const data = await res.json();
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
			excerpt: blog.excerpt || "",
			content: blog.content,
			image: blog.image,
			date: blog.date,
		});
		setEditMode(true);
		setShowForm(true);
	}

	function handleCancel() {
		setForm({ _id: "", title: "", excerpt: "", content: "", image: "", date: "" });
		setEditMode(false);
		setShowForm(false);
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

	const filteredBlogs = blogs.filter(blog =>
		blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		stripHtml(blog.content).toLowerCase().includes(searchQuery.toLowerCase()) ||
		stripHtml(blog.excerpt).toLowerCase().includes(searchQuery.toLowerCase())
	);

	const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
	const paginatedBlogs = filteredBlogs.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
					<p className="text-gray-600 mt-1">Manage your blog content and articles.</p>
				</div>
				<button
					onClick={() => setShowForm(!showForm)}
					className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus size={20} />
					<span>{editMode ? "Edit Blog" : "Add New Blog"}</span>
				</button>
			</div>

			{/* Form Modal/Card */}
			{showForm && (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-semibold text-gray-900">
							{editMode ? "Edit Blog Post" : "Add New Blog Post"}
						</h2>
						<button
							onClick={handleCancel}
							className="text-gray-400 hover:text-gray-600 transition-colors"
						>
							<X size={24} />
						</button>
					</div>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<input type="hidden" name="editingBlogId" value={form._id} />
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
								<input
									type="text"
									name="title"
									value={form.title}
									onChange={handleChange}
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Enter blog title"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
								<input
									type="date"
									name="date"
									value={form.date}
									onChange={handleChange}
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Blog Excerpt</label>
							<textarea
								name="excerpt"
								value={form.excerpt}
								onChange={handleChange}
								rows={2}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter a short excerpt or subtitle for this blog post..."
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
							<WYSIWYGEditor
								value={form.content}
								onChange={(value) => setForm({ ...form, content: value })}
								placeholder="Write your blog content here..."
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
							<div className="space-y-3">
								<div className="flex items-center gap-4">
									<input
										type="file"
										accept="image/*"
										onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
										className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
									/>
									{imageUploading && <span className="text-sm text-gray-500">Uploading...</span>}
								</div>
								{imageUploadError && <div className="text-sm text-red-600">{imageUploadError}</div>}
								{form.image && (
									<div className="flex items-center gap-4">
										<img
											src={form.image}
											alt="Blog preview"
											className="h-24 w-24 object-cover rounded-lg border border-gray-200"
											onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/96")}
										/>
										<input
											type="text"
											name="image"
											value={form.image}
											onChange={handleChange}
											required
											placeholder="Image URL"
											className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
								)}
							</div>
						</div>
						<div className="flex gap-3 pt-4">
							<button
								type="submit"
								className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
							>
								{editMode ? "Update Blog Post" : "Add Blog Post"}
							</button>
							<button
								type="button"
								onClick={handleCancel}
								className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Search and Filters */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
						<input
							type="text"
							placeholder="Search blogs..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
						<Filter size={20} />
						<span>Filter</span>
					</button>
				</div>
			</div>

			{/* Data Table */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blog</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Excerpt</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{loading ? (
								<tr>
									<td colSpan={5} className="px-6 py-8 text-center text-gray-500">
										Loading blog posts...
									</td>
								</tr>
							) : filteredBlogs.length === 0 ? (
								<tr>
									<td colSpan={5} className="px-6 py-8 text-center text-gray-500">
										No blog posts found
									</td>
								</tr>
							) : (
								paginatedBlogs.map((blog) => (
									<tr key={blog._id} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4">
											<div className="flex items-center space-x-4">
												<img
													src={blog.image}
													alt={blog.title}
													className="w-16 h-16 object-cover rounded-lg"
													onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/64")}
												/>
												<div>
													<div className="text-sm font-medium text-gray-900">{blog.title}</div>
													<div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
														{stripHtml(blog.excerpt || blog.content).substring(0, 100)}...
													</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
											{blog.excerpt ? <div dangerouslySetInnerHTML={{ __html: blog.excerpt }} /> : <span className="text-gray-400 italic">No excerpt</span>}
										</td>
										<td className="px-6 py-4 text-sm text-gray-500">
											{mounted ? new Date(blog.date).toLocaleDateString() : ''}
										</td>
										<td className="px-6 py-4">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
												Published
											</span>
										</td>
										<td className="px-6 py-4 text-right text-sm font-medium">
											<div className="flex items-center justify-end space-x-2">
												<button
													onClick={() => handleEdit(blog)}
													className="text-blue-600 hover:text-blue-900 transition-colors"
													title="Edit"
												>
													<Edit2 size={18} />
												</button>
												<button
													onClick={() => handleDelete(blog._id)}
													className="text-red-600 hover:text-red-900 transition-colors"
													title="Delete"
												>
													<Trash2 size={18} />
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="px-6 py-4 border-t border-gray-200">
						<div className="flex items-center justify-between">
							<div className="text-sm text-gray-700">
								Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBlogs.length)} of {filteredBlogs.length} results
							</div>
							<div className="flex items-center space-x-2">
								<button
									onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
									disabled={currentPage === 1}
									className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Previous
								</button>
								{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
									<button
										key={page}
										onClick={() => setCurrentPage(page)}
										className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
											currentPage === page
												? "bg-blue-600 text-white border-blue-600"
												: "border-gray-300 hover:bg-gray-50"
										}`}
									>
										{page}
									</button>
								))}
								<button
									onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
									disabled={currentPage === totalPages}
									className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Next
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
function ProjectsSection({ setActiveTab, searchQuery, setSearchQuery }: { setActiveTab: (tab: string) => void; searchQuery: string; setSearchQuery: (query: string) => void }) {
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
		projectstory: "",
	});
	const [editMode, setEditMode] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		fetchProjects();
	}, [searchQuery]);

	async function fetchProjects() {
		setLoading(true);
		try {
			const res = await fetch("/api/projects");
			const data = await res.json();
			setProjects(Array.isArray(data) ? data : []);
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
			projectstory: project.projectstory || "",
		});
		setEditMode(true);
		setShowForm(true);
	}

	function handleCancel() {
		setForm({ 
			_id: "", 
			title: "", 
			description: "", 
			image: "", 
			liveUrl: "", 
			codeUrl: "", 
			technologies: "",
			projectstory: "",
		});
		setEditMode(false);
		setShowForm(false);
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
			projectstory: form.projectstory,
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

	const filteredProjects = projects.filter(project =>
		project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
		project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
	const paginatedProjects = filteredProjects.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Projects</h1>
					<p className="text-gray-600 mt-1">Manage your portfolio projects and showcase your work.</p>
				</div>
				<button
					onClick={() => setShowForm(!showForm)}
					className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus size={20} />
					<span>{editMode ? "Edit Project" : "Add New Project"}</span>
				</button>
			</div>

			{/* Form Modal/Card */}
			{showForm && (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-semibold text-gray-900">
							{editMode ? "Edit Project" : "Add New Project"}
						</h2>
						<button
							onClick={handleCancel}
							className="text-gray-400 hover:text-gray-600 transition-colors"
						>
							<X size={24} />
						</button>
					</div>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<input type="hidden" name="editingProjectId" value={form._id} />
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
							<input
								type="text"
								name="title"
								value={form.title}
								onChange={handleChange}
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter project title"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
							<textarea
								name="description"
								value={form.description}
								onChange={handleChange}
								required
								rows={3}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Describe your project..."
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
							<div className="space-y-3">
								<div className="flex items-center gap-4">
									<input
										type="file"
										accept="image/*"
										onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
										className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
									/>
									{imageUploading && <span className="text-sm text-gray-500">Uploading...</span>}
								</div>
								{imageUploadError && <div className="text-sm text-red-600">{imageUploadError}</div>}
								{form.image && (
									<div className="flex items-center gap-4">
										<img
											src={form.image}
											alt="Project preview"
											className="h-24 w-32 object-cover rounded-lg border border-gray-200"
											onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/128x96")}
										/>
										<input
											type="text"
											name="image"
											value={form.image}
											onChange={handleChange}
											required
											placeholder="Image URL"
											className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
								)}
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
								<input
									type="url"
									name="liveUrl"
									value={form.liveUrl}
									onChange={handleChange}
									required
									placeholder="https://example.com"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Code URL (optional)</label>
								<input
									type="url"
									name="codeUrl"
									value={form.codeUrl}
									onChange={handleChange}
									placeholder="https://github.com/username/repo"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Technologies (comma separated)</label>
							<input
								type="text"
								name="technologies"
								value={form.technologies}
								onChange={handleChange}
								required
								placeholder="React, Node.js, MongoDB"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Project Story</label>
							<WYSIWYGEditor
								value={form.projectstory}
								onChange={(value) => setForm({ ...form, projectstory: value })}
								placeholder="Describe your project story, challenges, and learnings..."
							/>
						</div>
						<div className="flex gap-3 pt-4">
							<button
								type="submit"
								className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
							>
								{editMode ? "Update Project" : "Add Project"}
							</button>
							<button
								type="button"
								onClick={handleCancel}
								className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Search and Filters */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
						<input
							type="text"
							placeholder="Search projects..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
						<Filter size={20} />
						<span>Filter</span>
					</button>
				</div>
			</div>

			{/* Data Table */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technologies</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{loading ? (
								<tr>
									<td colSpan={4} className="px-6 py-8 text-center text-gray-500">
										Loading projects...
									</td>
								</tr>
							) : filteredProjects.length === 0 ? (
								<tr>
									<td colSpan={4} className="px-6 py-8 text-center text-gray-500">
										No projects found
									</td>
								</tr>
							) : (
								paginatedProjects.map((project) => (
									<tr key={project._id} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4">
											<div className="flex items-center space-x-4">
												<img
													src={project.image}
													alt={project.title}
													className="w-20 h-16 object-cover rounded-lg"
													onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/80x64")}
												/>
												<div>
													<div className="text-sm font-medium text-gray-900">{project.title}</div>
													<div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{project.description}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-wrap gap-1">
												{project.technologies.slice(0, 3).map((tech, i) => (
													<span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
														{tech}
													</span>
												))}
												{project.technologies.length > 3 && (
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
														+{project.technologies.length - 3}
													</span>
												)}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center space-x-2">
												<a
													href={project.liveUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-600 hover:text-blue-900 text-sm flex items-center space-x-1"
												>
													<Eye size={16} />
													<span>Live</span>
												</a>
												{project.codeUrl && project.codeUrl !== "#" && (
													<a
														href={project.codeUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="text-gray-600 hover:text-gray-900 text-sm flex items-center space-x-1"
													>
														<Upload size={16} />
														<span>Code</span>
													</a>
												)}
											</div>
										</td>
										<td className="px-6 py-4 text-right text-sm font-medium">
											<div className="flex items-center justify-end space-x-2">
												<button
													onClick={() => handleEdit(project)}
													className="text-blue-600 hover:text-blue-900 transition-colors"
													title="Edit"
												>
													<Edit2 size={18} />
												</button>
												<button
													onClick={() => handleDelete(project._id)}
													className="text-red-600 hover:text-red-900 transition-colors"
													title="Delete"
												>
													<Trash2 size={18} />
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="px-6 py-4 border-t border-gray-200">
						<div className="flex items-center justify-between">
							<div className="text-sm text-gray-700">
								Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredProjects.length)} of {filteredProjects.length} results
							</div>
							<div className="flex items-center space-x-2">
								<button
									onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
									disabled={currentPage === 1}
									className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Previous
								</button>
								{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
									<button
										key={page}
										onClick={() => setCurrentPage(page)}
										className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
											currentPage === page
												? "bg-blue-600 text-white border-blue-600"
												: "border-gray-300 hover:bg-gray-50"
										}`}
									>
										{page}
									</button>
								))}
								<button
									onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
									disabled={currentPage === totalPages}
									className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Next
								</button>
							</div>
						</div>
					</div>
				)}
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

function ServicesSection({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) {
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
	const [showForm, setShowForm] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		fetchServices();
	}, [searchQuery]);

	async function fetchServices() {
		setLoading(true);
		try {
			const res = await fetch("/api/services");
			const data = await res.json();
			setServices(Array.isArray(data) ? data : []);
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
		setShowForm(true);
	}

	function handleCancel() {
		setForm({ _id: "", title: "", description: "", icon: "" });
		setEditMode(false);
		setShowForm(false);
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

	const filteredServices = services.filter(service =>
		service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		service.description.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
	const paginatedServices = filteredServices.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Services</h1>
					<p className="text-gray-600 mt-1">Manage your professional services and offerings.</p>
				</div>
				<button
					onClick={() => setShowForm(!showForm)}
					className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Plus size={20} />
					<span>{editMode ? "Edit Service" : "Add New Service"}</span>
				</button>
			</div>

			{/* Form Modal/Card */}
			{showForm && (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-semibold text-gray-900">
							{editMode ? "Edit Service" : "Add New Service"}
						</h2>
						<button
							onClick={handleCancel}
							className="text-gray-400 hover:text-gray-600 transition-colors"
						>
							<X size={24} />
						</button>
					</div>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<input type="hidden" name="editingServiceId" value={form._id} />
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
							<input
								type="text"
								name="title"
								value={form.title}
								onChange={handleChange}
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter service title"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
							<textarea
								name="description"
								value={form.description}
								onChange={handleChange}
								required
								rows={3}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Describe your service..."
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
							<div className="space-y-3">
								<div className="flex items-center gap-4">
									<input
										type="file"
										accept="image/*"
										onChange={(e) => handleIconUpload(e.target.files?.[0] ?? null)}
										className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
									/>
									{iconUploading && <span className="text-sm text-gray-500">Uploading...</span>}
								</div>
								{iconUploadError && <div className="text-sm text-red-600">{iconUploadError}</div>}
								{form.icon && (
									<div className="flex items-center gap-4">
										<img
											src={form.icon}
											alt="Service icon preview"
											className="h-16 w-16 object-contain rounded-lg border border-gray-200"
											onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/64")}
										/>
										<input
											type="text"
											name="icon"
											value={form.icon}
											onChange={handleChange}
											required
											placeholder="Icon URL"
											className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
								)}
							</div>
						</div>
						<div className="flex gap-3 pt-4">
							<button
								type="submit"
								className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
							>
								{editMode ? "Update Service" : "Add Service"}
							</button>
							<button
								type="button"
								onClick={handleCancel}
								className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Search and Filters */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
						<input
							type="text"
							placeholder="Search services..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
						<Filter size={20} />
						<span>Filter</span>
					</button>
				</div>
			</div>

			{/* Data Table */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{loading ? (
								<tr>
									<td colSpan={4} className="px-6 py-8 text-center text-gray-500">
										Loading services...
									</td>
								</tr>
							) : filteredServices.length === 0 ? (
								<tr>
									<td colSpan={4} className="px-6 py-8 text-center text-gray-500">
										No services found
									</td>
								</tr>
							) : (
								paginatedServices.map((service) => (
									<tr key={service._id} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4">
											<div className="flex items-center space-x-4">
												<img
													src={service.icon}
													alt={service.title}
													className="w-12 h-12 object-contain rounded-lg"
													onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/48")}
												/>
												<div className="text-sm font-medium text-gray-900">{service.title}</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{service.description}</div>
										</td>
										<td className="px-6 py-4">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
												Active
											</span>
										</td>
										<td className="px-6 py-4 text-right text-sm font-medium">
											<div className="flex items-center justify-end space-x-2">
												<button
													onClick={() => handleEdit(service)}
													className="text-blue-600 hover:text-blue-900 transition-colors"
													title="Edit"
												>
													<Edit2 size={18} />
												</button>
												<button
													onClick={() => handleDelete(service._id)}
													className="text-red-600 hover:text-red-900 transition-colors"
													title="Delete"
												>
													<Trash2 size={18} />
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="px-6 py-4 border-t border-gray-200">
						<div className="flex items-center justify-between">
							<div className="text-sm text-gray-700">
								Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredServices.length)} of {filteredServices.length} results
							</div>
							<div className="flex items-center space-x-2">
								<button
									onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
									disabled={currentPage === 1}
									className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Previous
								</button>
								{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
									<button
										key={page}
										onClick={() => setCurrentPage(page)}
										className={`px-3 py-1 text-sm border rounded-lg transition-colors ${
											currentPage === page
												? "bg-blue-600 text-white border-blue-600"
												: "border-gray-300 hover:bg-gray-50"
										}`}
									>
										{page}
									</button>
								))}
								<button
									onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
									disabled={currentPage === totalPages}
									className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									Next
								</button>
							</div>
						</div>
					</div>
				)}
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
		<div className="space-y-6">
			{/* Header */}
				<div>
					<h1 className="text-3xl font-bold text-gray-900">CV Management</h1>
					<p className="text-gray-600 mt-1">Manage your professional CV information and career details.</p>
				</div>
		

			{/* CV Content */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
