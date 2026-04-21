import Image from "next/image";

export default function Footer() {
    return (
        <footer className="relative mt-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239CA3AF&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:opacity-10"></div>
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="text-center md:text-left">
                        <a href="/" className="group inline-block">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                <Image 
                                    src="/images/logo-black.png" 
                                    alt="logo" 
                                    width={96} 
                                    height={40} 
                                    className="w-20 transition-transform duration-300 group-hover:scale-105 dark:hidden" 
                                />
                                <Image 
                                    src="/images/logo-white.png" 
                                    alt="logo" 
                                    width={96} 
                                    height={40} 
                                    className="w-20 transition-transform duration-300 group-hover:scale-105 hidden dark:block" 
                                />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                                Crafting digital experiences with passion and precision. Let&apos;s build something amazing together.
                            </p>
                        </a>
                    </div>
                    
                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
                        <ul className="max-w-sm text-sm space-y-2">
                            <li>
                                <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="/projects" className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300">
                                    Projects
                                </a>
                            </li>
                            <li>
                                <a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Social Links */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
                        <div className="flex justify-center md:justify-start gap-3">
                            <a 
                                href="https://www.linkedin.com/in/hpsanjel/" 
                                className="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-400 p-1 hover:bg-yellow-100 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110"
                                aria-label="LinkedIn"
                            >
                                <Image 
                                    src="/images/linkedin.png" 
                                    alt="LinkedIn" 
                                    width={20} 
                                    height={20} 
                                    className="w-8 h-8 transition-transform duration-300 group-hover:scale-125" 
                                />
                            </a>
                            <a 
                                href="https://github.com/hpsanjel" 
                                className="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-400 p-1 hover:bg-yellow-100 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110"
                                aria-label="GitHub"
                            >
                                <Image 
                                    src="/images/github.png" 
                                    alt="GitHub" 
                                    width={20} 
                                    height={20} 
                                    className="w-8 h-8 transition-transform duration-300 group-hover:scale-125" 
                                />
                            </a>
                            <a 
                                href="https://www.facebook.com/hpsanjel/" 
                                className="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-400 p-1 hover:bg-yellow-100 dark:hover:bg-gray-200 transition-all duration-300 hover:scale-110"
                                aria-label="Facebook"
                            >
                                <Image 
                                    src="/images/facebook.png" 
                                    alt="Facebook" 
                                    width={20} 
                                    height={20} 
                                    className="w-8 h-8 transition-transform duration-300 group-hover:scale-125" 
                                />
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* Bottom Bar */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                            © {new Date().getFullYear()} Hari Prasad Sanjel. All rights reserved.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      
                            <div className="flex items-center gap-4">
                                <a 
                                    href="/privacy" 
                                    className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300"
                                >
                                    Privacy Policy
                                </a>
                                <a 
                                    href="/terms" 
                                    className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-300"
                                >
                                    Terms of Service
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}