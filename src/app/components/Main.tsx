import Image from "next/image";
import Link from "next/link";
import GradientButton from "./GradientButton";

export default function Main() {
    return (
            <section id="main" className="max-w-3xl text-center px-4 sm:px-6 md:px-8 lg:px-[12%] xl:px-[15%] mx-auto flex flex-col items-center justify-center gap-4 py-16 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-linear-to-r from-[#eda40d]/20 to-[#c17e0a]/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>
                {/* Profile Image with Enhanced Effects */}
                <div className="relative group" data-control>
                    <div className="absolute inset-0 bg-linear-to-r from-[#eda40d] to-[#c17e0a] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
                    <Image src="/images/logo.png" alt="Profile Image" width={112} height={112} className="relative rounded-full w-28 h-28 object-cover shadow-2xl border-4 border-white dark:border-gray-800 animate-bounce-slow hover:scale-110 transition-transform duration-500" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-linear-to-r from-[#eda40d] to-[#c17e0a] rounded-full flex items-center justify-center shadow-lg animate-ping"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-linear-to-r from-[#eda40d] to-[#c17e0a] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs">✓</span>
                    </div>
                </div>
                {/* Animated Greeting */}
                <div className="flex items-center gap-2 animate-fade-in-down" data-control>
                    <span className="text-2xl animate-wave">👋</span>
                    <h3 className="text-lg md:text-xl font-Outfit text-gray-600 dark:text-gray-300">Hello, I'm a</h3>
                </div>
                {/* Main Title with Gradient */}
                <h1 className="text-3xl sm:text-5xl font-bold font-Outfit bg-linear-to-r from-[#eda40d] via-[#c17e0a] to-[#eda40d] bg-clip-text text-transparent animate-gradient bg-size-[200%_auto] hover:scale-105 transition-transform duration-300" data-control data-scroll-speed="5">
                    Full Stack Developer
                </h1>
                {/* Enhanced Description */}
                <p className="max-w-2xl mx-auto font-Outfit text-base text-gray-700 dark:text-gray-300 leading-relaxed animate-fade-in" data-scroll-controller>
                    With over <span className="font-bold text-[#eda40d]">2+ years</span> of experience crafting
                    <span className="relative inline-block">
                        <span className="relative z-10">responsive</span>
                        <span className="absolute bottom-0 left-0 w-full h-2 bg-[#eda40d]/30 -rotate-1"></span>
                    </span>
                    and
                    <span className="relative inline-block">
                        <span className="relative z-10">user-friendly</span>
                        <span className="absolute bottom-0 left-0 w-full h-2 bg-[#c17e0a]/30 rotate-1"></span>
                    </span>
                    web applications. Committed to continuous learning and passionate about solving complex problems.
                </p>
                {/* Tech Stack Pills */}
                <div className="flex flex-wrap justify-center gap-2 animate-fade-in-up">
                    <span className="px-3 py-1 text-xs font-semibold bg-linear-to-r from-[#eda40d]/20 to-[#c17e0a]/20 text-[#c17e0a] dark:text-[#eda40d] rounded-full border border-[#eda40d]/30 hover:scale-110 transition-transform duration-300">React</span>
                    <span className="px-3 py-1 text-xs font-semibold bg-linear-to-r from-[#eda40d]/20 to-[#c17e0a]/20 text-[#c17e0a] dark:text-[#eda40d] rounded-full border border-[#eda40d]/30 hover:scale-110 transition-transform duration-300">Node.js</span>
                    <span className="px-3 py-1 text-xs font-semibold bg-linear-to-r from-[#eda40d]/20 to-[#c17e0a]/20 text-[#c17e0a] dark:text-[#eda40d] rounded-full border border-[#eda40d]/30 hover:scale-110 transition-transform duration-300">TypeScript</span>
                    <span className="px-3 py-1 text-xs font-semibold bg-linear-to-r from-[#eda40d]/20 to-[#c17e0a]/20 text-[#c17e0a] dark:text-[#eda40d] rounded-full border border-[#eda40d]/30 hover:scale-110 transition-transform duration-300">Tailwind</span>
                </div>
                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2 animate-fade-in-up">
                    <GradientButton text="Explore My Projects" href="/projects" />
                    <a href="/cv" target="_blank" className="group px-10 py-3 border-2 rounded-full border-gray-300 dark:border-gray-600 flex items-center gap-2 bg-white dark:bg-gray-900 dark:text-white font-semibold hover:border-[#eda40d] hover:bg-linear-to-r hover:from-[#eda40d]/5 hover:to-[#c17e0a]/5 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">
                        <span>View Resume</span>
                        <Image src="/images/download.svg" alt="download icon" width={20} height={20} className="w-5 group-hover:animate-bounce" />
                    </a>
                </div>
                {/* Social Proof Badge */}
                <div className="animate-fade-in-up flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-linear-to-r from-blue-400 to-blue-600 border-2 border-white dark:border-gray-900"></div>
                            <div className="w-6 h-6 rounded-full bg-linear-to-r from-purple-400 to-purple-600 border-2 border-white dark:border-gray-900"></div>
                            <div className="w-6 h-6 rounded-full bg-linear-to-r from-pink-400 to-pink-600 border-2 border-white dark:border-gray-900"></div>
                        </div>
                        <span className="font-medium">10+ Projects</span>
                    </div>
                    <span className="text-gray-400 hidden sm:inline">•</span>
                    <span className="font-medium">Available for Hire 🟢</span>
                </div>
            </section>
    );
}