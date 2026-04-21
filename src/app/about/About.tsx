import Image from "next/image";
import SectionHeader from "../components/SectionHeader";

export default function About() {
    const techStack = [
        { src: "/images/html5.svg", alt: "HTML5" },
        { src: "/images/css3.svg", alt: "CSS3" },
        { src: "/images/js.png", alt: "JavaScript" },
        { src: "/images/react.webp", alt: "React" },
        { src: "/images/vscode.svg", alt: "VS Code" },
        { src: "/images/git.png", alt: "Git" },
        { src: "/images/docker.svg", alt: "Docker" },
        { src: "/images/python.svg", alt: "Python" },
        { src: "/images/figma.svg", alt: "Figma" },
        { src: "/images/googlecloud.svg", alt: "Google Cloud" },
        { src: "/images/mongodb.svg", alt: "MongoDB" },
        { src: "/images/postman.svg", alt: "Postman" },
        { src: "/images/sql.svg", alt: "SQL" },
        { src: "/images/tailwind.svg", alt: "Tailwind" },
        { src: "/images/nextjs.svg", alt: "Next.js" },
    ];
    return (
        <>
            <style>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                .marquee-container {
                    overflow: hidden;
                    white-space: nowrap;
                }
                
                .marquee-content {
                    display: inline-block;
                    animation: marquee 50s linear infinite;
                    will-change: transform;
                }
                
                .marquee-content:hover {
                    animation-play-state: paused;
                }
            `}</style>
            <section id="about" className="w-full px-6 sm:px-8 md:px-12 lg:px-[15%] py-10">
            <SectionHeader 
                intro="Introduction"
                title="About Me"
                description=""
            />
            <div className="flex w-full max-w-6xl mx-auto flex-col lg:flex-row items-center gap-10 sm:gap-16 lg:gap-20 my-10 sm:my-16 lg:my-20">
                <div className="shrink-0">
                    <Image src="/images/profile.jpeg" alt="My Profile Image" width={320} height={320} className="w-48 sm:w-64 md:w-80 rounded-3xl max-w-none" />
                </div>
                <div className="flex-1 w-full">
                    <p className="mb-8 sm:mb-10 px-4 sm:px-6 font-Outfit text-left text-base sm:text-lg leading-relaxed">
                        Passionate Full Stack Web Developer with two years of hands-on experience who has mastered in-house web development using HTML, CSS (Bootstrap & Tailwind CSS), JavaScript, ReactJS, Next.js, Git, SQL, MongoDB, Firebase, and Google Cloud Platform.
                        <br />
                        <br />
                        Committed to creating user-focused, accessible, and visually compelling applications, I bring both certified expertise and a strong drive to contribute and collaborate within dynamic teams.
                        <br />
                        <br />
                        Let's connect and explore how we can build impactful digital experiences together!
                    </p>
             
                </div>
            </div>
            
            {/* Tech Stack Marquee */}
            <div className="mt-16 sm:mt-20 marquee-container">
                <div className="marquee-content">
                    <ul className="flex gap-3 sm:gap-4 md:gap-5">
                        {/* First set */}
                        {techStack.map((tech, i) => (
                            <li key={`${tech.alt}-1-${i}`} className="flex items-center justify-center w-12 sm:w-14 aspect-square border border-gray-400 rounded-lg cursor-pointer hover:shadow-md duration-500">
                                <Image src={tech.src} alt={tech.alt} width={24} height={24} className="w-6" />
                            </li>
                        ))}
                        {/* Second set for seamless loop */}
                        {techStack.map((tech, i) => (
                            <li key={`${tech.alt}-2-${i}`} className="flex items-center justify-center w-12 sm:w-14 aspect-square border border-gray-400 rounded-lg cursor-pointer hover:shadow-md duration-500">
                                <Image src={tech.src} alt={tech.alt} width={24} height={24} className="w-6" />
                            </li>
                        ))}
                        {/* Third set for extra smoothness */}
                        {techStack.map((tech, i) => (
                            <li key={`${tech.alt}-3-${i}`} className="flex items-center justify-center w-12 sm:w-14 aspect-square border border-gray-400 rounded-lg cursor-pointer hover:shadow-md duration-500">
                                <Image src={tech.src} alt={tech.alt} width={24} height={24} className="w-6" />
                            </li>
                        ))}
                        {/* Fourth set for continuous effect */}
                        {techStack.map((tech, i) => (
                            <li key={`${tech.alt}-4-${i}`} className="flex items-center justify-center w-12 sm:w-14 aspect-square border border-gray-400 rounded-lg cursor-pointer hover:shadow-md duration-500">
                                <Image src={tech.src} alt={tech.alt} width={24} height={24} className="w-6" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
        </>
    );
}

