"use client";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Home, FileText, Briefcase, Settings, User, Plus, Edit2, Trash2, Search, Filter, Download, Upload, Eye, ChevronDown, ChevronLeft, ChevronRight, LogOut, Bell, BarChart3, Users, Calendar, MessageSquare, Star, HelpCircle, Phone, Mail } from "lucide-react";
import Image from "next/image";
import { BLOG_CATEGORIES, PREDEFINED_TAGS } from "../../lib/blogCategories";
import { TIME_SLOTS, formatTimeLabel } from "../../lib/booking";

interface Project {
	_id: string;
	title: string;
	description: string;
	image: string;
	liveUrl: string;
	codeUrl: string;
	technologies: string[];
	slug: string;
	projectstory?: string;
	status: 'draft' | 'published';
	order: number;
	translations?: { nb?: { title?: string; description?: string; projectstory?: string } };
}

interface SearchResultItem {
	type: 'blog' | 'project' | 'service';
	title: string;
	content: string;
	[key: string]: unknown;
}

// Shared by every content section's edit form (Blogs, Projects, Services,
// Testimonials, FAQs) to switch which language's fields are visible.
function LocaleTabs({ tab, onChange }: { tab: "en" | "nb"; onChange: (tab: "en" | "nb") => void }) {
	return (
		<div className="flex gap-2 mb-4">
			<button
				type="button"
				onClick={() => onChange("en")}
				className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${tab === "en" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
			>
				English
			</button>
			<button
				type="button"
				onClick={() => onChange("nb")}
				className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${tab === "nb" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
			>
				Norwegian
			</button>
		</div>
	);
}

// Shown next to a list item whose Norwegian translation hasn't been filled in yet.
function MissingTranslationBadge() {
	return (
		<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800" title="Missing Norwegian translation">
			NO missing
		</span>
	);
}

const MENU_ITEMS = [
	{ key: "dashboard", label: "Dashboard", icon: Home },
	{ key: "blogs", label: "Blog Posts", icon: FileText },
	{ key: "comments", label: "Comments", icon: MessageSquare },
	{ key: "projects", label: "Projects", icon: Briefcase },
	{ key: "services", label: "Services", icon: Settings },
	{ key: "testimonials", label: "Testimonials", icon: Star },
	{ key: "faqs", label: "FAQs", icon: HelpCircle },
	{ key: "bookings", label: "Bookings", icon: Calendar },
	{ key: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminPage() {
	const [activeTab, setActiveTab] = useState("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const [currentDate, setCurrentDate] = useState<string>("");
	const [mounted, setMounted] = useState(false);
	const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
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

				const allData: SearchResultItem[] = [
					...(Array.isArray(blogs) ? blogs.map((blog: { title: string; content: string }) => ({ ...blog, type: 'blog' as const, title: blog.title, content: blog.content })) : []),
					...(Array.isArray(projects) ? projects.map((project: { title: string; description: string }) => ({ ...project, type: 'project' as const, title: project.title, content: project.description })) : []),
					...(Array.isArray(services) ? services.map((service: { title: string; description: string }) => ({ ...service, type: 'service' as const, title: service.title, content: service.description })) : []),
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
		<div className="min-h-screen bg-gray-50 text-gray-900 flex">
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
								<p className="text-xs text-gray-500">harisanjel@gmail.com</p>
							</div>
							<button
								onClick={() => {
									fetch('/api/admin/logout', { method: 'POST' }).finally(() => {
										window.location.href = '/admin-login'
									})
								}}
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
					{activeTab === "blogs" && <BlogsSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />}
					{activeTab === "comments" && <CommentsSection />}
					{activeTab === "projects" && <ProjectsSection setActiveTab={setActiveTab} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
					{activeTab === "services" && <ServicesSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
					{activeTab === "testimonials" && <TestimonialsSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
					{activeTab === "faqs" && <FAQsSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
					{activeTab === "bookings" && <BookingsSection />}
					{activeTab === "analytics" && <AnalyticsSection />}
				</main>
			</div>
		</div>
	);
}

interface ActivityItem {
	_id: string;
	action: string;
	entityTitle?: string;
	timestamp: string;
}

// Dashboard Section
function DashboardSection({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
	const [stats, setStats] = useState({
		blogs: 0,
		projects: 0,
		services: 0,
		views: 0,
	});
	const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const [blogsRes, projectsRes, servicesRes, analyticsRes, activitiesRes] = await Promise.all([
					fetch("/api/blogs"),
					fetch("/api/projects"),
					fetch("/api/services"),
					fetch("/api/analytics"),
					fetch("/api/admin/activities"),
				]);
				const blogs = await blogsRes.json();
				const projects = await projectsRes.json();
				const services = await servicesRes.json();
				const analytics = analyticsRes.ok ? await analyticsRes.json() : null;
				const activities = activitiesRes.ok ? await activitiesRes.json() : [];

				setStats({
					blogs: Array.isArray(blogs) ? blogs.length : 0,
					projects: Array.isArray(projects) ? projects.length : 0,
					services: Array.isArray(services) ? services.length : 0,
					views: analytics?.totalViews ?? 0,
				});
				setRecentActivities(activities);
			} catch (error) {
				console.error("Error fetching stats:", error);
			}
		};
		fetchStats();
	}, []);

	const statCards = [
		{ title: "Total Blogs", value: stats.blogs, icon: FileText, color: "from-blue-500 to-blue-600" },
		{ title: "Projects", value: stats.projects, icon: Briefcase, color: "from-purple-500 to-purple-600" },
		{ title: "Services", value: stats.services, icon: Settings, color: "from-green-500 to-green-600" },
		{ title: "Total Views", value: stats.views, icon: Eye, color: "from-orange-500 to-orange-600" },
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
					<p className="text-gray-600 mt-1">Welcome back! Here&apos;s an overview of your portfolio.</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{statCards.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">{stat.title}</p>
									<p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
								</div>
								<div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
									<Icon size={24} className="text-white" />
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
					<div className="space-y-4">
						{recentActivities.length === 0 && (
							<p className="text-sm text-gray-500">No activities recorded yet.</p>
						)}
						{recentActivities.slice(0, 10).map((activity: ActivityItem, index: number) => (
							<div key={activity._id || index} className="flex items-center space-x-3">
								<div className="w-2 h-2 rounded-full bg-blue-100 text-blue-600"></div>
								<div className="flex-1">
									<p className="text-sm text-gray-900">
										{activity.action} {activity.entityTitle ? `- ${activity.entityTitle}` : ""}
									</p>
									<p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
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
							onClick={() => setActiveTab('testimonials')}
							className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors"
						>
							<Plus size={24} className="text-gray-400 mb-2" />
							<span className="text-sm text-gray-600">Add Testimonial</span>
						</button>
						<button
							onClick={() => setActiveTab('faqs')}
							className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
						>
							<Plus size={24} className="text-gray-400 mb-2" />
							<span className="text-sm text-gray-600">Add FAQ</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

interface AnalyticsData {
	totalViews: number;
	totalSessions: number;
	totalPages: number;
	bounceRate: string;
	dailyViews: { date: string; views: number }[];
	topPages: { path: string; views: number }[];
	recentViews?: unknown[];
}

// Analytics Section
function AnalyticsSection() {
	const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
	const [days, setDays] = useState(30);
	const maxViews = analytics?.dailyViews?.length
		? Math.max(...analytics.dailyViews.map((d) => d.views), 1)
		: 1;

	useEffect(() => {
		const fetchAnalytics = async () => {
			try {
				const res = await fetch(`/api/analytics?days=${days}`);
				if (res.ok) {
					setAnalytics(await res.json());
				}
			} catch (error) {
				console.error("Error fetching analytics:", error);
			}
		};
		fetchAnalytics();
	}, [days]);

	const topMax = analytics?.topPages?.length
		? Math.max(...analytics.topPages.map((p) => p.views), 1)
		: 1;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
					<p className="text-gray-600 mt-1">Track your portfolio performance and user engagement.</p>
				</div>
				<div className="flex items-center space-x-3">
					<select
						className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={days}
						onChange={(e) => setDays(Number(e.target.value))}
					>
						<option value={7}>Last 7 days</option>
						<option value={30}>Last 30 days</option>
						<option value={90}>Last 3 months</option>
						<option value={365}>Last year</option>
					</select>
				</div>
			</div>

			{/* Summary cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 className="text-sm font-medium text-gray-600 mb-2">Total Views</h3>
					<p className="text-2xl font-bold text-gray-900">{analytics?.totalViews ?? "—"}</p>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 className="text-sm font-medium text-gray-600 mb-2">Unique Visitors</h3>
					<p className="text-2xl font-bold text-gray-900">{analytics?.totalSessions ?? "—"}</p>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 className="text-sm font-medium text-gray-600 mb-2">Pages</h3>
					<p className="text-2xl font-bold text-gray-900">{analytics?.totalPages ?? "—"}</p>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h3 className="text-sm font-medium text-gray-600 mb-2">Bounce Rate</h3>
					<p className="text-2xl font-bold text-gray-900">{analytics?.bounceRate ?? "—"}</p>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Views (last {days} days)</h2>
					<div className="h-64 flex items-end gap-1">
						{analytics?.dailyViews?.length ? (
							analytics.dailyViews.map((d, i: number) => (
								<div
									key={i}
									className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors relative group"
									style={{ height: `${(d.views / maxViews) * 100}%` }}
									title={`${d.date}: ${d.views} views`}
								>
									<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100">
										{d.views}
									</div>
								</div>
							))
						) : (
							<div className="w-full h-full flex items-center justify-center">
								<p className="text-gray-500">No data yet.</p>
							</div>
						)}
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h2>
					<div className="space-y-4">
						{analytics?.topPages?.length ? (
							analytics.topPages.map((item, index: number) => (
								<div key={index}>
									<div className="flex items-center justify-between mb-1">
										<span className="text-sm text-gray-900 truncate mr-2">{item.path}</span>
										<span className="text-sm text-gray-500 whitespace-nowrap">{item.views} views</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-blue-600 h-2 rounded-full"
											style={{ width: `${(item.views / topMax) * 100}%` }}
										></div>
									</div>
								</div>
							))
						) : (
							<p className="text-sm text-gray-500">No data yet.</p>
						)}
					</div>
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
	categories: string[];
	tags: string[];
	status: 'draft' | 'published';
	order: number;
	translations?: { nb?: { title?: string; excerpt?: string; content?: string } };
}

// Utility function to strip HTML tags
function stripHtml(html: string): string {
	const tmp = document.createElement('div');
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || '';
}

// WYSIWYG Editor Component
function WYSIWYGEditor({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
	const editorRef = useRef<HTMLDivElement>(null);
	const lastValueRef = useRef(value);
	const initializedRef = useRef(false);

	useEffect(() => {
		if (editorRef.current && (!initializedRef.current || value !== lastValueRef.current)) {
			editorRef.current.innerHTML = value;
			lastValueRef.current = value;
			initializedRef.current = true;
		}
	}, [value]);

	const execCommand = (command: string, value?: string) => {
		if (editorRef.current) {
			// Save current selection before losing focus
			const selection = window.getSelection();
			const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
			
			// Focus the editor
			editorRef.current.focus();
			
			// Restore selection if it was lost
			if (range && selection) {
				try {
					selection.removeAllRanges();
					selection.addRange(range);
				} catch (e) {
					// If restoring selection fails, place cursor at end
					const newRange = document.createRange();
					newRange.selectNodeContents(editorRef.current);
					newRange.collapse(false);
					selection.removeAllRanges();
					selection.addRange(newRange);
				}
			}
			
			// Execute the command
			try {
				document.execCommand(command, false, value);
			} catch (error) {
				console.error('Command failed:', command, error);
			}
			
			// Update content state
			const content = editorRef.current.innerHTML || '';
			lastValueRef.current = content;
			onChange(content);
		}
	};

	const handleInput = () => {
		if (editorRef.current) {
			const content = editorRef.current.innerHTML || '';
			lastValueRef.current = content;
			onChange(content);
		}
	};

	// Prevent cursor jumping when clicking away and back to editor
	const handleFocus = () => {
		if (editorRef.current) {
			const selection = window.getSelection();
			if (selection && selection.rangeCount === 0) {
				// If no range, place cursor at the end
				const range = document.createRange();
				range.selectNodeContents(editorRef.current);
				range.collapse(false);
				selection.addRange(range);
			}
		}
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			try {
				// Create FormData for Cloudinary upload
				const formData = new FormData();
				formData.append('file', file);
				formData.append('folder', 'content'); // Upload to content folder for blog/project images

				// Upload to Cloudinary
				const response = await fetch('/api/upload', {
					method: 'POST',
					body: formData,
				});

				if (!response.ok) {
					throw new Error('Upload failed');
				}

				const result = await response.json();
				
				// Insert the Cloudinary image URL at cursor position
				if (editorRef.current) {
					const imgHtml = `<Image src="${result.url}" alt="Uploaded image" width={800} height={600} style="max-width: 100%; height: auto; display: block; margin: 10px 0;" />`;
					
					// Focus the editor first
					editorRef.current.focus();
					
					// Get current selection
					const selection = window.getSelection();
					let range: Range | null = null;
					
					if (selection && selection.rangeCount > 0) {
						range = selection.getRangeAt(0);
					} else {
						// If no selection, create a new range at the end
						range = document.createRange();
						range.selectNodeContents(editorRef.current);
						range.collapse(false); // Collapse to end
					}
					
					// Insert the image
					if (range) {
						// Create a temporary element to hold the image HTML
						const tempDiv = document.createElement('div');
						tempDiv.innerHTML = imgHtml;
						const imgNode = tempDiv.firstChild;
						
						if (imgNode) {
							// Insert the image at the cursor position
							range.insertNode(imgNode);
							
							// Create a new range after the image for cursor positioning
							const newRange = document.createRange();
							newRange.setStartAfter(imgNode);
							newRange.collapse(true);
							
							// Update selection to new position
							if (selection) {
								selection.removeAllRanges();
								selection.addRange(newRange);
							}
						}
					}
					
					// Update content state
					const content = editorRef.current.innerHTML || '';
					lastValueRef.current = content;
					onChange(content);
				}
			} catch (error) {
				console.error('Image upload error:', error);
				alert('Failed to upload image. Please try again.');
			}
		}
		// Reset the file input
		e.target.value = '';
	};

	const handleLinkInsert = () => {
		const url = prompt('Enter URL:');
		if (url) {
			execCommand('createLink', url);
		}
	};

	return (
		<div className="border border-gray-300 rounded-lg overflow-hidden bg-white text-gray-900">
			<style jsx>{`
				.admin-wysiwyg-editor,
				.admin-wysiwyg-editor * {
					color: #111827 !important;
					-webkit-text-fill-color: #111827 !important;
				}
				.admin-wysiwyg-editor {
					caret-color: #111827;
				}
			`}</style>
			{/* Toolbar */}
			<div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 text-gray-900">
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
					<span className="inline-block w-4 h-0.5 bg-gray-600"></span>
				</button>
				<button
					type="button"
					onClick={handleLinkInsert}
					className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
					title="Insert Link"
				>
					<span className="text-blue-600">Link</span>
				</button>
				<select
					onChange={(e) => {
						const command = e.target.value;
						if (command) {
							execCommand(command);
							e.target.value = ''; // Reset to default
						}
					}}
					className="px-2 py-1 text-sm border border-gray-300 rounded"
					title="Text Alignment"
				>
					<option value="">Align</option>
					<option value="justifyLeft">Left</option>
					<option value="justifyCenter">Center</option>
					<option value="justifyRight">Right</option>
					<option value="justifyFull">Justify</option>
				</select>
				<button
					type="button"
					onClick={() => execCommand('formatBlock', 'blockquote')}
					className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
					title="Blockquote"
				>
					&quot;
				</button>
				<button
					type="button"
					onClick={() => execCommand('formatBlock', 'pre')}
					className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
					title="Code Block"
				>
					&lt;/&gt;
				</button>
				<label className="px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900 hover:bg-gray-100 cursor-pointer" title="Insert Image">
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
				ref={editorRef}
				contentEditable
				suppressContentEditableWarning
				onInput={handleInput}
				onFocus={handleFocus}
				className="admin-wysiwyg-editor min-h-[200px] p-4 focus:outline-none bg-white text-gray-900"
				style={{ minHeight: '200px', color: '#111827', WebkitTextFillColor: '#111827' }}
				data-placeholder={placeholder}
			/>
		</div>
	);
}

function BlogsSection({ 
	searchQuery, 
	setSearchQuery, 
	statusFilter, 
	setStatusFilter 
}: { 
	searchQuery: string; 
	setSearchQuery: (query: string) => void; 
	statusFilter: "all" | "draft" | "published"; 
	setStatusFilter: (filter: "all" | "draft" | "published") => void; 
}) {
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
		categories: [] as string[],
		tags: [] as string[],
		status: "published" as 'draft' | 'published',
		order: 0,
		nb_title: "",
		nb_excerpt: "",
		nb_content: "",
	});
	const [formLocaleTab, setFormLocaleTab] = useState<"en" | "nb">("en");
	const [editMode, setEditMode] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const [mounted, setMounted] = useState(false);
	const [draggedBlog, setDraggedBlog] = useState<Blog | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
	const [isReordering, setIsReordering] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		fetchBlogs();
	}, [searchQuery, statusFilter]);

	async function fetchBlogs() {
		setLoading(true);
		try {
			const url = statusFilter === "all" ? "/api/blogs" : `/api/blogs?status=${statusFilter}`;
			const res = await fetch(url);
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
			categories: blog.categories || [],
			tags: blog.tags || [],
			status: blog.status || "published",
			order: blog.order || 0,
			nb_title: blog.translations?.nb?.title || "",
			nb_excerpt: blog.translations?.nb?.excerpt || "",
			nb_content: blog.translations?.nb?.content || "",
		});
		setFormLocaleTab("en");
		setEditMode(true);
		setShowForm(true);
	}

	function handleCancel() {
		setForm({ _id: "", title: "", excerpt: "", content: "", image: "", date: "", categories: [], tags: [], status: "published", order: 0, nb_title: "", nb_excerpt: "", nb_content: "" });
		setFormLocaleTab("en");
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
			categories: form.categories,
			tags: form.tags,
			translations: { nb: { title: form.nb_title, excerpt: form.nb_excerpt, content: form.nb_content } },
			status: form.status,
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

	async function handleToggleStatus(blog: Blog) {
		const newStatus = blog.status === 'published' ? 'draft' : 'published';
		const action = newStatus === 'published' ? 'publish' : 'set to draft';
		if (!confirm(`Are you sure you want to ${action} this blog post?`)) return;
		
		try {
			const res = await fetch(`/api/blogs/${blog._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...blog, status: newStatus }),
			});
			if (res.ok) {
				fetchBlogs();
			} else {
				alert('Failed to update blog status. Please try again.');
			}
		} catch (error) {
			console.error('Error updating blog status:', error);
			alert('Failed to update blog status. Please try again.');
		}
	}

	async function handleDelete(id: string) {
		if (!confirm("Are you sure you want to delete this blog post?")) return;
		const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
		if (res.ok) fetchBlogs();
	}

	// Drag and drop handlers
	function handleDragStart(blog: Blog, index: number) {
		setDraggedBlog(blog);
	}

	function handleDragOver(e: React.DragEvent, index: number) {
		e.preventDefault();
		setDragOverIndex(index);
	}

	function handleDragLeave() {
		setDragOverIndex(null);
	}

	async function handleDrop(e: React.DragEvent, dropIndex: number) {
		e.preventDefault();
		setDragOverIndex(null);
		
		if (!draggedBlog) return;
		
		const draggedIndex = paginatedBlogs.findIndex(blog => blog._id === draggedBlog._id);
		if (draggedIndex === dropIndex) return;
		
		// Create a new array with the reordered blogs
		const newBlogs = [...paginatedBlogs];
		const [removed] = newBlogs.splice(draggedIndex, 1);
		newBlogs.splice(dropIndex, 0, removed);
		
		// Update the order values based on the new position
		const updatedBlogs = newBlogs.map((blog, index) => ({
			...blog,
			order: (currentPage - 1) * itemsPerPage + index
		}));
		
		// Update the local state immediately for better UX
		const allBlogs = [...blogs];
		const allDraggedIndex = allBlogs.findIndex(blog => blog._id === draggedBlog._id);
		const allDropIndex = allBlogs.findIndex(blog => blog._id === newBlogs[dropIndex]._id);
		const [allRemoved] = allBlogs.splice(allDraggedIndex, 1);
		allBlogs.splice(allDropIndex, 0, allRemoved);
		
		// Update order values for all blogs
		allBlogs.forEach((blog, index) => {
			blog.order = index;
		});
		
		setBlogs(allBlogs);
		setDraggedBlog(null);
		
		// Send the update to the server
		setIsReordering(true);
		try {
			const blogOrders = allBlogs.map((blog, index) => ({
				id: blog._id,
				order: index
			}));
			
			const res = await fetch('/api/blogs/order', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ blogOrders })
			});
			
			if (!res.ok) {
				// If the server update fails, revert the changes
				await fetchBlogs();
				alert('Failed to update blog order. Changes have been reverted.');
			}
		} catch (error) {
			console.error('Error updating blog order:', error);
			await fetchBlogs();
			alert('Failed to update blog order. Changes have been reverted.');
		} finally {
			setIsReordering(false);
		}
	}

	function handleDragEnd() {
		setDraggedBlog(null);
		setDragOverIndex(null);
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
						<LocaleTabs tab={formLocaleTab} onChange={setFormLocaleTab} />
						{formLocaleTab === "en" ? (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Blog Title</label>
										<input
											type="text"
											name="title"
											value={form.title}
											onChange={handleChange}
											required
											className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
											className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
										className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Enter a short excerpt or subtitle for this blog post..."
									/>
								</div>
							</>
						) : (
							<>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Blog Title (Norwegian)</label>
									<input
										type="text"
										name="nb_title"
										value={form.nb_title}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Skriv inn bloggtittel"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Blog Excerpt (Norwegian)</label>
									<textarea
										name="nb_excerpt"
										value={form.nb_excerpt}
										onChange={handleChange}
										rows={2}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Skriv inn et kort sammendrag..."
									/>
								</div>
							</>
						)}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
								{BLOG_CATEGORIES.map((category) => (
									<label key={category} className="flex items-center space-x-2 cursor-pointer">
										<input
											type="checkbox"
											checked={form.categories.includes(category)}
											onChange={(e) => {
												if (e.target.checked) {
													setForm({ ...form, categories: [...form.categories, category] });
												} else {
													setForm({ ...form, categories: form.categories.filter(c => c !== category) });
												}
											}}
											className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
										/>
										<span className="text-sm text-gray-700">{category}</span>
									</label>
								))}
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
							<div className="space-y-2">
								<div className="flex flex-wrap gap-2">
									{form.tags.map((tag, index) => (
										<span key={index} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
											{tag}
											<button
												type="button"
												onClick={() => setForm({ ...form, tags: form.tags.filter((_, i) => i !== index) })}
												className="ml-2 text-blue-600 hover:text-blue-800"
											>
												<X size={14} />
											</button>
										</span>
									))}
								</div>
								<div className="flex gap-2">
									<input
										type="text"
										placeholder="Add a tag and press Enter"
										className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												const input = e.target as HTMLInputElement;
												const tag = input.value.trim();
												if (tag && !form.tags.includes(tag)) {
													setForm({ ...form, tags: [...form.tags, tag] });
													input.value = '';
												}
											}
										}}
									/>
								</div>
								<div className="text-xs text-gray-500">
									Suggested tags: {PREDEFINED_TAGS.slice(0, 8).join(', ')}...
								</div>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
							<select
								name="status"
								value={form.status}
								onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="draft">Draft</option>
								<option value="published">Published</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Content{formLocaleTab === "nb" ? " (Norwegian)" : ""}</label>
							{formLocaleTab === "en" ? (
								<WYSIWYGEditor
									value={form.content}
									onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
									placeholder="Write your blog content here..."
								/>
							) : (
								<WYSIWYGEditor
									value={form.nb_content}
									onChange={(value) => setForm((prev) => ({ ...prev, nb_content: value }))}
									placeholder="Skriv bloggens innhold her..."
								/>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
							<div className="space-y-3">
								<div className="flex items-center gap-4">
									<input
										type="file"
										accept="image/*"
										onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
										className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
									/>
									{imageUploading && <span className="text-sm text-gray-500">Uploading...</span>}
								</div>
								{imageUploadError && <div className="text-sm text-red-600">{imageUploadError}</div>}
								{form.image && (
									<div className="flex items-center gap-4">
										<Image
											src={form.image}
											alt="Blog preview"
											width={96}
											height={96}
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
											className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value as "all" | "draft" | "published")}
						className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="all">All Status</option>
						<option value="published">Published</option>
						<option value="draft">Draft</option>
					</select>
				</div>
				{isReordering && (
					<div className="mt-3 flex items-center justify-center p-2 bg-blue-50 rounded-lg">
						<div className="flex items-center space-x-2 text-blue-700">
							<div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
							<span className="text-sm">Updating blog order...</span>
						</div>
					</div>
				)}
			</div>

			{/* Data Table */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
									<span className="text-gray-400" title="Drag to reorder">☰</span>
								</th>
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
									<td colSpan={6} className="px-6 py-8 text-center text-gray-500">
										Loading blog posts...
									</td>
								</tr>
							) : filteredBlogs.length === 0 ? (
								<tr>
									<td colSpan={6} className="px-6 py-8 text-center text-gray-500">
										No blog posts found
									</td>
								</tr>
							) : (
								paginatedBlogs.map((blog, index) => (
									<tr 
										key={blog._id} 
										className={`hover:bg-gray-50 transition-colors ${
											draggedBlog?._id === blog._id ? 'opacity-50' : ''
										} ${
											dragOverIndex === index ? 'bg-blue-50 border-blue-300' : ''
										}`}
										draggable
										onDragStart={() => handleDragStart(blog, index)}
										onDragOver={(e) => handleDragOver(e, index)}
										onDragLeave={handleDragLeave}
										onDrop={(e) => handleDrop(e, index)}
										onDragEnd={handleDragEnd}
									>
										<td className="px-6 py-4">
											<div className="flex items-center justify-center">
												<div 
													className="w-6 h-6 flex items-center justify-center text-gray-400 cursor-move hover:text-gray-600"
													title="Drag to reorder"
												>
													<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
														<path d="M2.5 7a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM3 9.5a.5.5 0 0 0 0 1h10a.5.5 0 0 0 0-1H3zM2.5 12.5A.5.5 0 0 1 3 12h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
													</svg>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center space-x-4">
												<Image
													src={blog.image}
													alt={blog.title}
													width={64}
													height={64}
													className="w-16 h-16 object-cover rounded-lg"
													onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/64")}
												/>
												<div>
													<a 
														href={`/blog/${blog._id}`}
														target="_blank"
														rel="noopener noreferrer"
														className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors hover:underline"
														title="View blog post"
													>
														{blog.title}
													</a>
													{!blog.translations?.nb?.title && <MissingTranslationBadge />}
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
											<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
												blog.status === 'published' 
													? 'bg-green-100 text-green-800' 
													: 'bg-yellow-100 text-yellow-800'
											}`}>
												{blog.status === 'published' ? 'Published' : 'Draft'}
											</span>
										</td>
										<td className="px-6 py-4 text-right text-sm font-medium">
											<div className="flex items-center justify-end space-x-2">
												<button
													onClick={() => handleEdit(blog)}
													className="text-blue-600 hover:text-blue-900 transition-colors"
													title="Edit"
													disabled={isReordering}
												>
													<Edit2 size={18} />
												</button>
												<button
													onClick={() => handleToggleStatus(blog)}
													className={`transition-colors ${
														blog.status === 'published' 
															? 'text-yellow-600 hover:text-yellow-900' 
															: 'text-green-600 hover:text-green-900'
													}`}
													title={blog.status === 'published' ? 'Set to Draft' : 'Publish'}
													disabled={isReordering}
												>
													{blog.status === 'published' ? '📝' : '✅'} {blog.status === 'published' ? 'Draft' : 'Publish'}
												</button>
												<button
													onClick={() => handleDelete(blog._id)}
													className="text-red-600 hover:text-red-900 transition-colors"
													title="Delete"
													disabled={isReordering}
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

interface AdminComment {
	_id: string;
	author: string;
	email: string;
	content: string;
	createdAt: string;
	isApproved: boolean;
	isAdminReply?: boolean;
	blogId?: { _id: string; title?: string };
}

// Comments Section
function CommentsSection() {
	const [comments, setComments] = useState<AdminComment[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved'
	const [selectedComments, setSelectedComments] = useState<string[]>([]);
	const [actionLoading, setActionLoading] = useState(false);
	const [replyingToId, setReplyingToId] = useState<string | null>(null);
	const [replyDraft, setReplyDraft] = useState('');
	const [replySubmitting, setReplySubmitting] = useState(false);

	const refetchComments = async () => {
		const response = await fetch(`/api/admin/comments${filter !== 'all' ? `?status=${filter}` : ''}`);
		const data = await response.json();
		setComments(data);
	};

	useEffect(() => {
		async function fetchComments() {
			try {
				const res = await fetch(`/api/admin/comments${filter !== 'all' ? `?status=${filter}` : ''}`);
				if (res.ok) {
					const data = await res.json();
					setComments(data);
				}
			} catch (error) {
				console.error('Error fetching comments:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchComments();
	}, [filter]);

	const handleSendReply = async (commentId: string) => {
		if (!replyDraft.trim()) return;

		setReplySubmitting(true);
		try {
			const res = await fetch(`/api/admin/comments/${commentId}/reply`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content: replyDraft.trim() })
			});

			if (res.ok) {
				setReplyDraft('');
				setReplyingToId(null);
				await refetchComments();
				alert('Reply posted successfully!');
			} else {
				const errorData = await res.json();
				alert(`Failed to post reply: ${errorData.error || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Error posting reply:', error);
			alert('Failed to post reply');
		} finally {
			setReplySubmitting(false);
		}
	};

	const handleSelectComment = (commentId: string) => {
		setSelectedComments(prev => 
			prev.includes(commentId) 
				? prev.filter(id => id !== commentId)
				: [...prev, commentId]
		);
	};

	const handleSelectAll = () => {
		setSelectedComments(
			selectedComments.length === comments.length 
				? [] 
				: comments.map((c: AdminComment) => c._id)
		);
	};

	const handleBulkAction = async (action: 'approve' | 'reject') => {
		if (selectedComments.length === 0) return;

		const confirmed = window.confirm(
			`Are you sure you want to ${action} ${selectedComments.length} comment(s)?`
		);

		if (!confirmed) return;

		setActionLoading(true);
		try {
			const res = await fetch('/api/admin/comments', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ commentIds: selectedComments, action })
			});

			if (res.ok) {
				const result = await res.json();
				// Refresh comments
				const response = await fetch(`/api/admin/comments${filter !== 'all' ? `?status=${filter}` : ''}`);
				const data = await response.json();
				setComments(data);
				setSelectedComments([]);
				const count = result.modifiedCount || result.deletedCount || 0;
				alert(`Comments ${action}d successfully! ${count > 0 ? `(${count} comments affected)` : ''}`);
			} else {
				const errorData = await res.json();
				alert(`Failed to ${action} comments: ${errorData.error || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Error updating comments:', error);
			alert('Failed to update comments');
		} finally {
			setActionLoading(false);
		}
	};

	const handleIndividualAction = async (commentId: string, action: 'approve' | 'reject' | 'delete') => {
		const confirmed = window.confirm(`Are you sure you want to ${action} this comment?`);
		if (!confirmed) return;

		setActionLoading(true);
		try {
			// Use bulk API for individual actions to avoid ObjectId issues
			const res = await fetch('/api/admin/comments', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ commentIds: [commentId], action })
			});

			if (res.ok) {
				const result = await res.json();
				// Refresh comments
				const response = await fetch(`/api/admin/comments${filter !== 'all' ? `?status=${filter}` : ''}`);
				const data = await response.json();
				setComments(data);
				setSelectedComments([]); // Clear selection
				const count = result.modifiedCount || result.deletedCount || 0;
				alert(`Comment ${action}d successfully! ${count > 0 ? `(${count} comments affected)` : ''}`);
			} else {
				const errorData = await res.json();
				alert(`Failed to ${action} comment: ${errorData.error || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Error updating comment:', error);
			alert('Failed to update comment');
		} finally {
			setActionLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	if (loading) {
		return (
			<div className="space-y-6">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-gray-200 rounded w-1/4"></div>
					<div className="space-y-2">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="h-20 bg-gray-200 rounded"></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold text-gray-900">Comments Management</h2>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<label className="text-sm font-medium text-gray-700">Filter:</label>
						<select
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="all">All Comments</option>
							<option value="pending">Pending Approval</option>
							<option value="approved">Approved</option>
						</select>
					</div>
					<div className="text-sm text-gray-600">
						Total: {comments.length} comments
					</div>
				</div>
			</div>

			{selectedComments.length > 0 && (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<div className="flex items-center justify-between">
						<span className="text-sm text-blue-800">
							{selectedComments.length} comment(s) selected
						</span>
						<div className="flex gap-2">
							<button
								onClick={() => handleBulkAction('approve')}
								disabled={actionLoading}
								className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
							>
								{actionLoading ? 'Processing...' : 'Approve Selected'}
							</button>
							<button
								onClick={() => handleBulkAction('reject')}
								disabled={actionLoading}
								className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
							>
								{actionLoading ? 'Processing...' : 'Reject Selected'}
							</button>
						</div>
					</div>
				</div>
			)}

			<div className="bg-white rounded-xl shadow-sm border border-gray-200">
				{comments.length === 0 ? (
					<div className="text-center py-12">
						<MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
						<p className="text-gray-600">
							{filter === 'pending' 
								? 'No comments pending approval' 
								: filter === 'approved' 
								? 'No approved comments' 
								: 'No comments yet'}
						</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="text-left p-4">
										<input
											type="checkbox"
											checked={selectedComments.length === comments.length}
											onChange={handleSelectAll}
											className="rounded border-gray-300"
										/>
									</th>
									<th className="text-left p-4 font-medium text-gray-900">Author</th>
									<th className="text-left p-4 font-medium text-gray-900">Comment</th>
									<th className="text-left p-4 font-medium text-gray-900">Blog Post</th>
									<th className="text-left p-4 font-medium text-gray-900">Date</th>
									<th className="text-left p-4 font-medium text-gray-900">Status</th>
									<th className="text-left p-4 font-medium text-gray-900">Actions</th>
								</tr>
							</thead>
							<tbody>
								{comments.map((comment: AdminComment) => (
									<tr key={comment._id} className="border-b border-gray-100 hover:bg-gray-50">
										<td className="p-4">
											<input
												type="checkbox"
												checked={selectedComments.includes(comment._id)}
												onChange={() => handleSelectComment(comment._id)}
												className="rounded border-gray-300"
											/>
										</td>
										<td className="p-4">
											<div>
												<div className="font-medium text-gray-900 flex items-center gap-2">
													{comment.author}
													{comment.isAdminReply && (
														<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
															Admin Reply
														</span>
													)}
												</div>
												<div className="text-sm text-gray-600">{comment.email}</div>
											</div>
										</td>
										<td className="p-4">
											<div className="max-w-xs">
												<p className="text-sm text-gray-700 line-clamp-3">
													{comment.content}
												</p>
											</div>
										</td>
										<td className="p-4">
											{comment.blogId?._id ? (
												<a
													href={`/blog/${comment.blogId._id}`}
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
												>
													{comment.blogId.title || comment.blogId._id}
												</a>
											) : (
												<span className="text-sm text-gray-400 italic">Blog not found</span>
											)}
										</td>
										<td className="p-4 text-sm text-gray-600">
											{formatDate(comment.createdAt)}
										</td>
										<td className="p-4">
											<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
												comment.isApproved 
													? 'bg-green-100 text-green-800' 
													: 'bg-yellow-100 text-yellow-800'
											}`}>
												{comment.isApproved ? 'Approved' : 'Pending'}
											</span>
										</td>
										<td className="p-4">
											<div className="flex flex-col gap-2">
												<div className="flex gap-2">
													{!comment.isApproved && (
														<button
															onClick={() => handleIndividualAction(comment._id, 'approve')}
															disabled={actionLoading}
															className="text-green-600 hover:text-green-800 text-sm disabled:text-green-400 disabled:cursor-not-allowed transition-colors"
														>
															{actionLoading ? '...' : 'Approve'}
														</button>
													)}
													{comment.isApproved && !comment.isAdminReply && (
														<button
															onClick={() => {
																setReplyingToId(replyingToId === comment._id ? null : comment._id);
																setReplyDraft('');
															}}
															disabled={actionLoading}
															className="text-blue-600 hover:text-blue-800 text-sm disabled:text-blue-400 disabled:cursor-not-allowed transition-colors"
														>
															{replyingToId === comment._id ? 'Cancel' : 'Reply'}
														</button>
													)}
													<button
														onClick={() => handleIndividualAction(comment._id, 'reject')}
														disabled={actionLoading}
														className="text-red-600 hover:text-red-800 text-sm disabled:text-red-400 disabled:cursor-not-allowed transition-colors"
													>
														{actionLoading ? '...' : 'Reject'}
													</button>
													<button
														onClick={() => handleIndividualAction(comment._id, 'delete')}
														disabled={actionLoading}
														className="text-gray-600 hover:text-gray-800 text-sm disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
													>
														{actionLoading ? '...' : 'Delete'}
													</button>
												</div>
												{replyingToId === comment._id && (
													<div className="flex flex-col gap-2 w-64">
														<textarea
															value={replyDraft}
															onChange={(e) => setReplyDraft(e.target.value)}
															rows={3}
															placeholder="Write your reply..."
															className="text-sm p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
														/>
														<button
															onClick={() => handleSendReply(comment._id)}
															disabled={replySubmitting || !replyDraft.trim()}
															className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors self-start"
														>
															{replySubmitting ? 'Sending...' : 'Send Reply'}
														</button>
													</div>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
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
		status: "published" as 'draft' | 'published',
		order: 0,
		nb_title: "",
		nb_description: "",
		nb_projectstory: "",
	});
	const [formLocaleTab, setFormLocaleTab] = useState<"en" | "nb">("en");
	const [editMode, setEditMode] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;
	const [mounted, setMounted] = useState(false);
	const [draggedProject, setDraggedProject] = useState<Project | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
	const [isReordering, setIsReordering] = useState(false);

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
			status: project.status || "published",
			order: project.order || 0,
			nb_title: project.translations?.nb?.title || "",
			nb_description: project.translations?.nb?.description || "",
			nb_projectstory: project.translations?.nb?.projectstory || "",
		});
		setFormLocaleTab("en");
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
			status: "published",
			order: 0,
			nb_title: "",
			nb_description: "",
			nb_projectstory: "",
		});
		setFormLocaleTab("en");
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
			status: form.status,
			order: form.order,
			translations: { nb: { title: form.nb_title, description: form.nb_description, projectstory: form.nb_projectstory } },
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

	// Drag and drop handlers
	function handleDragStart(project: Project, index: number) {
		console.log('Drag started:', project.title, 'at index:', index);
		setDraggedProject(project);
	}

	function handleDragOver(e: React.DragEvent, index: number) {
		e.preventDefault();
		setDragOverIndex(index);
	}

	function handleDragLeave() {
		setDragOverIndex(null);
	}

	async function handleDrop(e: React.DragEvent, dropIndex: number) {
		e.preventDefault();
		setDragOverIndex(null);
		
		if (!draggedProject) {
			console.log('No dragged project');
			return;
		}
		
		const draggedIndex = paginatedProjects.findIndex(project => project._id === draggedProject._id);
		console.log('Dragged index:', draggedIndex, 'Drop index:', dropIndex);
		
		if (draggedIndex === dropIndex) {
			console.log('Same index, no change');
			return;
		}
		
		// Create a new array with the reordered projects (paginated view)
		const newPaginatedProjects = [...paginatedProjects];
		const [removed] = newPaginatedProjects.splice(draggedIndex, 1);
		newPaginatedProjects.splice(dropIndex, 0, removed);
		
		console.log('New paginated order:', newPaginatedProjects.map(p => p.title));
		
		// Update the local state immediately for better UX
		const allProjects = [...projects];
		const allDraggedIndex = allProjects.findIndex(project => project._id === draggedProject._id);
		const allDropIndex = allProjects.findIndex(project => project._id === newPaginatedProjects[dropIndex]._id);
		
		console.log('All dragged index:', allDraggedIndex, 'All drop index:', allDropIndex);
		
		// Reorder in the full array
		const [allRemoved] = allProjects.splice(allDraggedIndex, 1);
		allProjects.splice(allDropIndex, 0, allRemoved);
		
		// Update order values for all projects
		allProjects.forEach((project, index) => {
			project.order = index;
		});
		
		console.log('Final all projects order:', allProjects.map(p => `${p.title} (${p.order})`));
		
		setProjects(allProjects);
		setDraggedProject(null);
		
		// Send the update to the server
		setIsReordering(true);
		try {
			const projectOrders = allProjects.map((project, index) => ({
				id: project._id,
				order: index
			}));
			
			console.log('Sending order update:', projectOrders);
			
			const res = await fetch('/api/projects/order', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ projectOrders })
			});
			
			if (!res.ok) {
				console.error('Server update failed');
				// If the server update fails, revert the changes
				await fetchProjects();
				alert('Failed to update project order. Changes have been reverted.');
			} else {
				console.log('Server update successful');
			}
		} catch (error) {
			console.error('Error updating project order:', error);
			await fetchProjects();
			alert('Failed to update project order. Changes have been reverted.');
		} finally {
			setIsReordering(false);
		}
	}

	function handleDragEnd() {
		console.log('Drag ended');
		setDraggedProject(null);
		setDragOverIndex(null);
	}

	async function handleToggleStatus(project: Project) {
		const newStatus = project.status === 'published' ? 'draft' : 'published';
		const action = newStatus === 'published' ? 'publish' : 'set to draft';
		if (!confirm(`Are you sure you want to ${action} this project?`)) return;
		
		try {
			const res = await fetch(`/api/projects/${project._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...project, status: newStatus }),
			});
			if (res.ok) {
				fetchProjects();
			} else {
				alert('Failed to update project status. Please try again.');
			}
		} catch (error) {
			console.error('Error updating project status:', error);
			alert('Failed to update project status. Please try again.');
		}
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
						<LocaleTabs tab={formLocaleTab} onChange={setFormLocaleTab} />
						{formLocaleTab === "en" ? (
							<>
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
							</>
						) : (
							<>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Project Title (Norwegian)</label>
									<input
										type="text"
										name="nb_title"
										value={form.nb_title}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Skriv inn prosjekttittel"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Description (Norwegian)</label>
									<textarea
										name="nb_description"
										value={form.nb_description}
										onChange={handleChange}
										rows={3}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Beskriv prosjektet ditt..."
									/>
								</div>
							</>
						)}
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
										<Image
											src={form.image}
											alt="Project preview"
											width={128}
											height={96}
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
							<label className="block text-sm font-medium text-gray-700 mb-2">Project Story{formLocaleTab === "nb" ? " (Norwegian)" : ""}</label>
							{formLocaleTab === "en" ? (
								<WYSIWYGEditor
									value={form.projectstory}
									onChange={(value) => setForm({ ...form, projectstory: value })}
									placeholder="Describe your project story, challenges, and learnings..."
								/>
							) : (
								<WYSIWYGEditor
									value={form.nb_projectstory}
									onChange={(value) => setForm({ ...form, nb_projectstory: value })}
									placeholder="Beskriv prosjekthistorien, utfordringene og læringspunktene..."
								/>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
							<select
								name="status"
								value={form.status}
								onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="draft">Draft</option>
								<option value="published">Published</option>
							</select>
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
				{isReordering && (
					<div className="mt-3 flex items-center justify-center p-2 bg-blue-50 rounded-lg">
						<div className="flex items-center space-x-2 text-blue-700">
							<div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
							<span className="text-sm">Updating project order...</span>
						</div>
					</div>
				)}
			</div>

			{/* Data Table */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
									<span className="text-gray-400" title="Drag to reorder">☰</span>
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technologies</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{loading ? (
								<tr>
									<td colSpan={6} className="px-6 py-8 text-center text-gray-500">
										Loading projects...
									</td>
								</tr>
							) : filteredProjects.length === 0 ? (
								<tr>
									<td colSpan={6} className="px-6 py-8 text-center text-gray-500">
										No projects found
									</td>
								</tr>
							) : (
								paginatedProjects.map((project, index) => (
									<tr 
										key={project._id} 
										className={`hover:bg-gray-50 transition-colors ${
											draggedProject?._id === project._id ? 'opacity-50' : ''
										} ${
										dragOverIndex === index ? 'bg-blue-50 border-blue-300' : ''
									}`}
										draggable
										onDragStart={() => handleDragStart(project, index)}
										onDragOver={(e) => handleDragOver(e, index)}
										onDragLeave={handleDragLeave}
										onDrop={(e) => handleDrop(e, index)}
										onDragEnd={handleDragEnd}
									>
										<td className="px-6 py-4">
											<div className="flex items-center justify-center">
												<div 
													className="w-6 h-6 flex items-center justify-center text-gray-400 cursor-move hover:text-gray-600"
													title="Drag to reorder"
												>
													<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
														<path d="M2.5 7a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM3 9.5a.5.5 0 0 0 0 1h10a.5.5 0 0 0 0-1H3zM2.5 12.5A.5.5 0 0 1 3 12h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
													</svg>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center space-x-4">
												<Image
													src={project.image}
													alt={project.title}
													width={80}
													height={64}
													className="w-20 h-16 object-cover rounded-lg"
													onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/80x64")}
												/>
												<div>
													<div className="text-sm font-medium text-gray-900 flex items-center gap-2">
														{project.title}
														{!project.translations?.nb?.title && <MissingTranslationBadge />}
													</div>
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
										<td className="px-6 py-4">
											<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
														project.status === 'published' 
															? 'bg-green-100 text-green-800' 
															: 'bg-yellow-100 text-yellow-800'
														}`}>
														{project.status === 'published' ? 'Published' : 'Draft'}
													</span>
										</td>
										<td className="px-6 py-4 text-right text-sm font-medium">
											<div className="flex items-center justify-end space-x-2">
												<button
													 onClick={() => handleEdit(project)}
													 className="text-blue-600 hover:text-blue-900 transition-colors"
													 title="Edit"
													 disabled={isReordering}
												>
													<Edit2 size={18} />
												</button>
												<button
													 onClick={() => handleToggleStatus(project)}
													 className={`transition-colors ${
														project.status === 'published' 
															? 'text-yellow-600 hover:text-yellow-900' 
															: 'text-green-600 hover:text-green-900'
													}`}
													 title={project.status === 'published' ? 'Set to Draft' : 'Publish'}
													 disabled={isReordering}
												>
													{project.status === 'published' ? '📝' : '✅'} {project.status === 'published' ? 'Draft' : 'Publish'}
												</button>
												<button
													 onClick={() => handleDelete(project._id)}
												 className="text-red-600 hover:text-red-900 transition-colors"
													 title="Delete"
													 disabled={isReordering}
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
	translations?: { nb?: { title?: string; description?: string } };
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
		nb_title: "",
		nb_description: "",
	});
	const [formLocaleTab, setFormLocaleTab] = useState<"en" | "nb">("en");
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
			nb_title: service.translations?.nb?.title || "",
			nb_description: service.translations?.nb?.description || "",
		});
		setFormLocaleTab("en");
		setEditMode(true);
		setShowForm(true);
	}

	function handleCancel() {
		setForm({ _id: "", title: "", description: "", icon: "", nb_title: "", nb_description: "" });
		setFormLocaleTab("en");
		setEditMode(false);
		setShowForm(false);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const payload = {
			title: form.title,
			description: form.description,
			icon: form.icon,
			translations: { nb: { title: form.nb_title, description: form.nb_description } },
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
						<LocaleTabs tab={formLocaleTab} onChange={setFormLocaleTab} />
						{formLocaleTab === "en" ? (
							<>
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
							</>
						) : (
							<>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Service Title (Norwegian)</label>
									<input
										type="text"
										name="nb_title"
										value={form.nb_title}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Skriv inn tjenestetittel"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Description (Norwegian)</label>
									<textarea
										name="nb_description"
										value={form.nb_description}
										onChange={handleChange}
										rows={3}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Beskriv tjenesten din..."
									/>
								</div>
							</>
						)}
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
										<Image
											src={form.icon}
											alt="Service icon preview"
											width={64}
											height={64}
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
												<Image
													src={service.icon}
													alt={service.title}
													width={48}
													height={48}
													className="w-12 h-12 object-contain rounded-lg"
													onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/48")}
												/>
												<div className="text-sm font-medium text-gray-900 flex items-center gap-2">
													{service.title}
													{!service.translations?.nb?.title && <MissingTranslationBadge />}
												</div>
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

interface Testimonial {
	_id: string;
	name: string;
	role: string;
	quote: string;
	rating: number;
	avatar?: string;
	translations?: { nb?: { quote?: string } };
}

function TestimonialsSection({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) {
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [loading, setLoading] = useState(true);
	const [avatarUploading, setAvatarUploading] = useState(false);
	const [avatarUploadError, setAvatarUploadError] = useState("");
	const [form, setForm] = useState({
		_id: "",
		name: "",
		role: "",
		quote: "",
		rating: "5",
		avatar: "",
		nb_quote: "",
	});
	const [formLocaleTab, setFormLocaleTab] = useState<"en" | "nb">("en");
	const [editMode, setEditMode] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	useEffect(() => {
		fetchTestimonials();
	}, [searchQuery]);

	async function fetchTestimonials() {
		setLoading(true);
		try {
			const res = await fetch("/api/testimonials");
			const data = await res.json();
			setTestimonials(Array.isArray(data) ? data : []);
		} catch {
			setTestimonials([]);
		}
		setLoading(false);
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	async function handleAvatarUpload(file: File | null) {
		if (!file) return;
		if (file.size > 1024 * 1024) {
			setAvatarUploadError("Image must be less than 1 MB.");
			return;
		}
		setAvatarUploadError("");
		setAvatarUploading(true);
		try {
			const data = new FormData();
			data.append("file", file);
			const res = await fetch("/api/upload", { method: "POST", body: data });
			const payload = await res.json();
			if (res.ok) {
				setForm((prev) => ({ ...prev, avatar: payload.url }));
			}
		} finally {
			setAvatarUploading(false);
		}
	}

	function handleEdit(testimonial: Testimonial) {
		setForm({
			_id: testimonial._id,
			name: testimonial.name,
			role: testimonial.role,
			quote: testimonial.quote,
			rating: String(testimonial.rating),
			avatar: testimonial.avatar || "",
			nb_quote: testimonial.translations?.nb?.quote || "",
		});
		setFormLocaleTab("en");
		setEditMode(true);
		setShowForm(true);
	}

	function handleCancel() {
		setForm({ _id: "", name: "", role: "", quote: "", rating: "5", avatar: "", nb_quote: "" });
		setFormLocaleTab("en");
		setEditMode(false);
		setShowForm(false);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const payload = {
			name: form.name,
			role: form.role,
			quote: form.quote,
			rating: Number(form.rating),
			avatar: form.avatar,
			translations: { nb: { quote: form.nb_quote } },
		};
		const url = editMode ? `/api/testimonials/${form._id}` : "/api/testimonials";
		const method = editMode ? "PUT" : "POST";
		const res = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (res.ok) {
			fetchTestimonials();
			handleCancel();
		}
	}

	async function handleDelete(id: string) {
		if (!confirm("Are you sure you want to delete this testimonial?")) return;
		const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
		if (res.ok) fetchTestimonials();
	}

	const filteredTestimonials = testimonials.filter(
		(testimonial) => testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) || testimonial.quote.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
	const paginatedTestimonials = filteredTestimonials.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
					<p className="text-gray-600 mt-1">Manage client testimonials shown on the homepage.</p>
				</div>
				<button onClick={() => setShowForm(!showForm)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
					<Plus size={20} />
					<span>{editMode ? "Edit Testimonial" : "Add New Testimonial"}</span>
				</button>
			</div>

			{/* Form Modal/Card */}
			{showForm && (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-semibold text-gray-900">{editMode ? "Edit Testimonial" : "Add New Testimonial"}</h2>
						<button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
							<X size={24} />
						</button>
					</div>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<input type="hidden" name="editingTestimonialId" value={form._id} />
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
								<input
									type="text"
									name="name"
									value={form.name}
									onChange={handleChange}
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="e.g. Jane Doe"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Role / Company</label>
								<input
									type="text"
									name="role"
									value={form.role}
									onChange={handleChange}
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="e.g. Founder, Acme Inc."
								/>
							</div>
						</div>
						<LocaleTabs tab={formLocaleTab} onChange={setFormLocaleTab} />
						{formLocaleTab === "en" ? (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Quote</label>
								<textarea
									name="quote"
									value={form.quote}
									onChange={handleChange}
									required
									rows={3}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="What did the client say about working with you?"
								/>
							</div>
						) : (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Quote (Norwegian)</label>
								<textarea
									name="nb_quote"
									value={form.nb_quote}
									onChange={handleChange}
									rows={3}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									placeholder="Hva sa kunden om å jobbe med deg?"
								/>
							</div>
						)}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
							<select
								name="rating"
								value={form.rating}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								{[5, 4, 3, 2, 1].map((n) => (
									<option key={n} value={n}>
										{n} star{n === 1 ? "" : "s"}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Avatar (optional)</label>
							<div className="space-y-3">
								<div className="flex items-center gap-4">
									<input
										type="file"
										accept="image/*"
										onChange={(e) => handleAvatarUpload(e.target.files?.[0] ?? null)}
										className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
									/>
									{avatarUploading && <span className="text-sm text-gray-500">Uploading...</span>}
								</div>
								{avatarUploadError && <div className="text-sm text-red-600">{avatarUploadError}</div>}
								{form.avatar && (
									<div className="flex items-center gap-4">
										<Image
											src={form.avatar}
											alt="Avatar preview"
											width={64}
											height={64}
											className="h-16 w-16 object-cover rounded-full border border-gray-200"
											onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/64")}
										/>
										<input
											type="text"
											name="avatar"
											value={form.avatar}
											onChange={handleChange}
											placeholder="Avatar URL"
											className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										/>
									</div>
								)}
							</div>
						</div>
						<div className="flex gap-3 pt-4">
							<button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
								{editMode ? "Update Testimonial" : "Add Testimonial"}
							</button>
							<button type="button" onClick={handleCancel} className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium">
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Search */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
						<input
							type="text"
							placeholder="Search testimonials..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
				</div>
			</div>

			{/* Data Table */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{loading ? (
								<tr>
									<td colSpan={4} className="px-6 py-8 text-center text-gray-500">
										Loading testimonials...
									</td>
								</tr>
							) : filteredTestimonials.length === 0 ? (
								<tr>
									<td colSpan={4} className="px-6 py-8 text-center text-gray-500">
										No testimonials found
									</td>
								</tr>
							) : (
								paginatedTestimonials.map((testimonial) => (
									<tr key={testimonial._id} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4">
											<div className="flex items-center space-x-4">
												{testimonial.avatar ? (
													<Image
														src={testimonial.avatar}
														alt={testimonial.name}
														width={40}
														height={40}
														className="w-10 h-10 object-cover rounded-full"
														onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40")}
													/>
												) : (
													<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
														{testimonial.name.split(" ").map((n) => n[0]).join("")}
													</div>
												)}
												<div>
													<div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
													<div className="text-xs text-gray-500">{testimonial.role}</div>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2">
												<div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{testimonial.quote}</div>
												{!testimonial.translations?.nb?.quote && <MissingTranslationBadge />}
											</div>
										</td>
										<td className="px-6 py-4">
											<span className="text-sm text-gray-700">{"★".repeat(testimonial.rating)}{"☆".repeat(5 - testimonial.rating)}</span>
										</td>
										<td className="px-6 py-4 text-right text-sm font-medium">
											<div className="flex items-center justify-end space-x-2">
												<button onClick={() => handleEdit(testimonial)} className="text-blue-600 hover:text-blue-900 transition-colors" title="Edit">
													<Edit2 size={18} />
												</button>
												<button onClick={() => handleDelete(testimonial._id)} className="text-red-600 hover:text-red-900 transition-colors" title="Delete">
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
								Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTestimonials.length)} of {filteredTestimonials.length} results
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
											currentPage === page ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-50"
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

interface FAQItem {
	_id: string;
	question: string;
	answer: string;
	order: number;
	translations?: { nb?: { question?: string; answer?: string } };
}

function FAQsSection({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) {
	const [faqs, setFaqs] = useState<FAQItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [form, setForm] = useState({
		_id: "",
		question: "",
		answer: "",
		order: "0",
		nb_question: "",
		nb_answer: "",
	});
	const [formLocaleTab, setFormLocaleTab] = useState<"en" | "nb">("en");
	const [editMode, setEditMode] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	async function fetchFaqs() {
		setLoading(true);
		try {
			const res = await fetch("/api/faqs");
			const data = await res.json();
			setFaqs(Array.isArray(data) ? data : []);
		} catch {
			setFaqs([]);
		}
		setLoading(false);
	}

	useEffect(() => {
		fetchFaqs();
	}, [searchQuery]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		setForm({ ...form, [e.target.name]: e.target.value });
	}

	function handleEdit(faq: FAQItem) {
		setForm({
			_id: faq._id,
			question: faq.question,
			answer: faq.answer,
			order: String(faq.order),
			nb_question: faq.translations?.nb?.question || "",
			nb_answer: faq.translations?.nb?.answer || "",
		});
		setFormLocaleTab("en");
		setEditMode(true);
		setShowForm(true);
	}

	function handleCancel() {
		setForm({ _id: "", question: "", answer: "", order: "0", nb_question: "", nb_answer: "" });
		setFormLocaleTab("en");
		setEditMode(false);
		setShowForm(false);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const payload = {
			question: form.question,
			answer: form.answer,
			order: Number(form.order),
			translations: { nb: { question: form.nb_question, answer: form.nb_answer } },
		};
		const url = editMode ? `/api/faqs/${form._id}` : "/api/faqs";
		const method = editMode ? "PUT" : "POST";
		const res = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
		if (res.ok) {
			fetchFaqs();
			handleCancel();
		}
	}

	async function handleDelete(id: string) {
		if (!confirm("Are you sure you want to delete this FAQ?")) return;
		const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
		if (res.ok) fetchFaqs();
	}

	const filteredFaqs = faqs.filter(
		(faq) => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
	const paginatedFaqs = filteredFaqs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">FAQs</h1>
					<p className="text-gray-600 mt-1">Manage the frequently asked questions shown on the homepage.</p>
				</div>
				<button onClick={() => setShowForm(!showForm)} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
					<Plus size={20} />
					<span>{editMode ? "Edit FAQ" : "Add New FAQ"}</span>
				</button>
			</div>

			{/* Form Modal/Card */}
			{showForm && (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-semibold text-gray-900">{editMode ? "Edit FAQ" : "Add New FAQ"}</h2>
						<button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
							<X size={24} />
						</button>
					</div>
					<form className="space-y-4" onSubmit={handleSubmit}>
						<input type="hidden" name="editingFaqId" value={form._id} />
						<LocaleTabs tab={formLocaleTab} onChange={setFormLocaleTab} />
						{formLocaleTab === "en" ? (
							<>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
									<input
										type="text"
										name="question"
										value={form.question}
										onChange={handleChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="e.g. How much does a project cost?"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
									<textarea
										name="answer"
										value={form.answer}
										onChange={handleChange}
										required
										rows={4}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Write a clear, honest answer..."
									/>
								</div>
							</>
						) : (
							<>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Question (Norwegian)</label>
									<input
										type="text"
										name="nb_question"
										value={form.nb_question}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="f.eks. Hva koster et prosjekt?"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">Answer (Norwegian)</label>
									<textarea
										name="nb_answer"
										value={form.nb_answer}
										onChange={handleChange}
										rows={4}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										placeholder="Skriv et tydelig, ærlig svar..."
									/>
								</div>
							</>
						)}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
							<input
								type="number"
								name="order"
								value={form.order}
								onChange={handleChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="0"
							/>
							<p className="text-xs text-gray-500 mt-1">Lower numbers appear first on the page.</p>
						</div>
						<div className="flex gap-3 pt-4">
							<button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
								{editMode ? "Update FAQ" : "Add FAQ"}
							</button>
							<button type="button" onClick={handleCancel} className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium">
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			{/* Search */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
						<input
							type="text"
							placeholder="Search FAQs..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
				</div>
			</div>

			{/* Data Table */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{loading ? (
								<tr>
									<td colSpan={4} className="px-6 py-8 text-center text-gray-500">
										Loading FAQs...
									</td>
								</tr>
							) : filteredFaqs.length === 0 ? (
								<tr>
									<td colSpan={4} className="px-6 py-8 text-center text-gray-500">
										No FAQs found
									</td>
								</tr>
							) : (
								paginatedFaqs.map((faq) => (
									<tr key={faq._id} className="hover:bg-gray-50 transition-colors">
										<td className="px-6 py-4">
											<span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-700">{faq.order}</span>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm font-medium text-gray-900 max-w-xs flex items-center gap-2">
												{faq.question}
												{!faq.translations?.nb?.question && <MissingTranslationBadge />}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{faq.answer}</div>
										</td>
										<td className="px-6 py-4 text-right text-sm font-medium">
											<div className="flex items-center justify-end space-x-2">
												<button onClick={() => handleEdit(faq)} className="text-blue-600 hover:text-blue-900 transition-colors" title="Edit">
													<Edit2 size={18} />
												</button>
												<button onClick={() => handleDelete(faq._id)} className="text-red-600 hover:text-red-900 transition-colors" title="Delete">
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
								Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredFaqs.length)} of {filteredFaqs.length} results
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
											currentPage === page ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-50"
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

interface AvailabilitySlot {
	_id: string;
	date: string;
	time: string;
	isBooked: boolean;
	booking?: { name: string; email: string; phone: string; message?: string; bookedAt: string };
}

function monthKeyOf(year: number, month: number): string {
	return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function dateStringOf(year: number, month: number, day: number): string {
	return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function BookingsSection() {
	const now = new Date();
	const todayStr = dateStringOf(now.getFullYear(), now.getMonth(), now.getDate());

	const [viewYear, setViewYear] = useState(now.getFullYear());
	const [viewMonth, setViewMonth] = useState(now.getMonth());
	const [monthSummary, setMonthSummary] = useState<Record<string, { available: number; booked: number }>>({});
	const [loadingMonth, setLoadingMonth] = useState(true);

	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [daySlots, setDaySlots] = useState<AvailabilitySlot[]>([]);
	const [loadingDay, setLoadingDay] = useState(false);
	const [savingTime, setSavingTime] = useState<string | null>(null);

	const [bookings, setBookings] = useState<AvailabilitySlot[]>([]);
	const [loadingBookings, setLoadingBookings] = useState(true);

	async function fetchMonth(year: number, month: number) {
		setLoadingMonth(true);
		try {
			const res = await fetch(`/api/admin/availability?month=${monthKeyOf(year, month)}`);
			setMonthSummary(await res.json());
		} catch {
			setMonthSummary({});
		}
		setLoadingMonth(false);
	}

	async function fetchDay(date: string) {
		setLoadingDay(true);
		try {
			const res = await fetch(`/api/admin/availability?date=${date}`);
			setDaySlots(await res.json());
		} catch {
			setDaySlots([]);
		}
		setLoadingDay(false);
	}

	async function fetchBookings() {
		setLoadingBookings(true);
		try {
			const res = await fetch(`/api/admin/availability?booked=true`);
			setBookings(await res.json());
		} catch {
			setBookings([]);
		}
		setLoadingBookings(false);
	}

	useEffect(() => {
		fetchMonth(viewYear, viewMonth);
	}, [viewYear, viewMonth]);

	useEffect(() => {
		fetchBookings();
	}, []);

	useEffect(() => {
		if (selectedDate) fetchDay(selectedDate);
	}, [selectedDate]);

	async function toggleSlot(date: string, time: string) {
		const existing = daySlots.find((s) => s.time === time);
		setSavingTime(time);
		try {
			if (existing) {
				await fetch(`/api/admin/availability/${existing._id}`, { method: "DELETE" });
			} else {
				await fetch("/api/admin/availability", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ date, times: [time] }),
				});
			}
			await fetchDay(date);
			await fetchMonth(viewYear, viewMonth);
		} finally {
			setSavingTime(null);
		}
	}

	async function cancelBooking(slot: AvailabilitySlot) {
		if (!confirm(`Cancel the booking with ${slot.booking?.name} on ${slot.date} at ${formatTimeLabel(slot.time)}?`)) return;
		await fetch(`/api/admin/availability/${slot._id}`, { method: "DELETE" });
		await fetchBookings();
		if (selectedDate === slot.date) await fetchDay(slot.date);
		await fetchMonth(viewYear, viewMonth);
	}

	const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
	const rawFirstWeekday = new Date(viewYear, viewMonth, 1).getDay();
	const firstWeekday = (rawFirstWeekday + 6) % 7; // Monday-first
	const isViewingCurrentOrPastMonth = viewYear < now.getFullYear() || (viewYear === now.getFullYear() && viewMonth <= now.getMonth());

	const goPrevMonth = () => {
		setSelectedDate(null);
		if (viewMonth === 0) {
			setViewYear(viewYear - 1);
			setViewMonth(11);
		} else {
			setViewMonth(viewMonth - 1);
		}
	};
	const goNextMonth = () => {
		setSelectedDate(null);
		if (viewMonth === 11) {
			setViewYear(viewYear + 1);
			setViewMonth(0);
		} else {
			setViewMonth(viewMonth + 1);
		}
	};

	const upcomingBookings = bookings.filter((b) => b.date >= todayStr);
	const pastBookings = bookings.filter((b) => b.date < todayStr);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
				<p className="text-gray-600 mt-1">Set which days and times are open for meetings, and manage confirmed bookings.</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Availability calendar */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Manage Availability</h2>

					<div className="flex items-center justify-between mb-4">
						<button type="button" onClick={goPrevMonth} disabled={isViewingCurrentOrPastMonth} aria-label="Previous month" className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
							<ChevronLeft className="w-4 h-4" />
						</button>
						<span className="font-medium text-gray-900">{new Date(viewYear, viewMonth, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
						<button type="button" onClick={goNextMonth} aria-label="Next month" className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>

					<div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
						{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
							<div key={d}>{d}</div>
						))}
					</div>

					{loadingMonth ? (
						<div className="flex justify-center py-8">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
						</div>
					) : (
						<div className="grid grid-cols-7 gap-1">
							{Array.from({ length: firstWeekday }).map((_, i) => (
								<div key={`pad-${i}`} aria-hidden="true" />
							))}
							{Array.from({ length: daysInMonth }).map((_, i) => {
								const day = i + 1;
								const dateStr = dateStringOf(viewYear, viewMonth, day);
								const isPast = dateStr < todayStr;
								const summary = monthSummary[dateStr];
								const isSelected = dateStr === selectedDate;
								return (
									<button
										key={dateStr}
										type="button"
										disabled={isPast}
										onClick={() => setSelectedDate(dateStr)}
										className={`relative aspect-square rounded-lg text-sm flex items-center justify-center transition-colors duration-150 ${
											isSelected ? "bg-blue-600 text-white font-semibold" : isPast ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100 cursor-pointer"
										}`}
									>
										{day}
										{summary && (summary.available > 0 || summary.booked > 0) && (
											<span className="absolute bottom-1 flex gap-0.5">
												{summary.available > 0 && <span className="w-1 h-1 rounded-full bg-amber-500" aria-hidden="true" />}
												{summary.booked > 0 && <span className="w-1 h-1 rounded-full bg-green-500" aria-hidden="true" />}
											</span>
										)}
									</button>
								);
							})}
						</div>
					)}

					<div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
						<span className="flex items-center gap-1.5">
							<span className="w-2 h-2 rounded-full bg-amber-500" /> Open
						</span>
						<span className="flex items-center gap-1.5">
							<span className="w-2 h-2 rounded-full bg-green-500" /> Booked
						</span>
					</div>

					{selectedDate && (
						<div className="mt-6 pt-6 border-t border-gray-200">
							<h3 className="text-sm font-semibold text-gray-900 mb-3">
								{new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-GB", { weekday: "long", month: "long", day: "numeric" })}
							</h3>
							{loadingDay ? (
								<div className="flex justify-center py-4">
									<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
								</div>
							) : (
								<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
									{TIME_SLOTS.map((time) => {
										const slot = daySlots.find((s) => s.time === time);
										const isSaving = savingTime === time;
										if (slot?.isBooked) {
											return (
												<div key={time} className="col-span-2 flex items-center justify-between px-3 py-2 rounded-lg border border-green-200 bg-green-50 text-xs">
													<div>
														<div className="font-semibold text-gray-900">{formatTimeLabel(time)}</div>
														<div className="text-gray-600">{slot.booking?.name}</div>
													</div>
													<button type="button" onClick={() => cancelBooking(slot)} aria-label={`Cancel booking at ${formatTimeLabel(time)}`} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600">
														<Trash2 className="w-3.5 h-3.5" />
													</button>
												</div>
											);
										}
										return (
											<button
												key={time}
												type="button"
												disabled={isSaving}
												onClick={() => toggleSlot(selectedDate, time)}
												className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors duration-150 disabled:opacity-50 ${
													slot ? "bg-amber-100 border-amber-300 text-amber-800" : "border-gray-300 text-gray-500 hover:border-amber-400 hover:text-amber-700"
												}`}
											>
												{formatTimeLabel(time)}
											</button>
										);
									})}
								</div>
							)}
							<p className="text-xs text-gray-500 mt-3">Click a time to make it available. Click an open time again to remove it. Booked times can only be cancelled.</p>
						</div>
					)}
				</div>

				{/* Bookings list */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h2>
					{loadingBookings ? (
						<div className="flex justify-center py-8">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
						</div>
					) : upcomingBookings.length === 0 ? (
						<p className="text-sm text-gray-500 py-4">No upcoming bookings yet.</p>
					) : (
						<ul className="space-y-3 max-h-125 overflow-y-auto">
							{upcomingBookings.map((slot) => (
								<li key={slot._id} className="border border-gray-200 rounded-lg p-4">
									<div className="flex items-start justify-between gap-3">
										<div>
											<div className="font-semibold text-gray-900">
												{new Date(`${slot.date}T00:00:00`).toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" })} · {formatTimeLabel(slot.time)}
											</div>
											<div className="text-sm text-gray-700 mt-1">{slot.booking?.name}</div>
											<div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
												<Mail className="w-3 h-3" /> {slot.booking?.email}
											</div>
											<div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
												<Phone className="w-3 h-3" /> {slot.booking?.phone}
											</div>
											{slot.booking?.message && <p className="text-xs text-gray-600 mt-2 italic">&ldquo;{slot.booking.message}&rdquo;</p>}
										</div>
										<button type="button" onClick={() => cancelBooking(slot)} aria-label={`Cancel booking with ${slot.booking?.name}`} className="shrink-0 p-2 rounded-lg hover:bg-red-50 text-red-600">
											<Trash2 className="w-4 h-4" />
										</button>
									</div>
								</li>
							))}
						</ul>
					)}

					{pastBookings.length > 0 && <p className="text-xs text-gray-400 mt-4">{pastBookings.length} past booking{pastBookings.length === 1 ? "" : "s"} not shown.</p>}
				</div>
			</div>
		</div>
	);
}
