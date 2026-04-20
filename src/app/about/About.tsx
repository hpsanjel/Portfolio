import Image from "next/image";

export default function About() {
    return (
        <section id="about" className="w-full px-4 sm:px-8 md:px-12 lg:px-[12%] py-10 scroll-mt-20">
            <h4 className="text-center mb-2 text-lg font-Outfit">Introduction</h4>
            <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-Outfit">About Me</h2>
            <div className="flex w-full max-w-6xl mx-auto flex-col lg:flex-row items-center gap-10 sm:gap-16 lg:gap-20 my-10 sm:my-16 lg:my-20">
                <div className="shrink-0">
                    <Image src="/images/profile.jpeg" alt="My Profile Image" width={320} height={320} className="w-48 sm:w-64 md:w-80 rounded-3xl max-w-none" />
                </div>
                <div className="flex-1 w-full">
                    <p className="mb-8 sm:mb-10 font-Outfit text-justify text-base sm:text-lg leading-relaxed">
                        Passionate Full Stack Web Developer with two years of hands-on experience who has mastered in-house web development using HTML, CSS (Bootstrap & Tailwind CSS), JavaScript, ReactJS, Next.js, Git, SQL, MongoDB, Firebase, and Google Cloud Platform.
                        <br />
                        <br />
                        Committed to creating user-focused, accessible, and visually compelling applications, I bring both certified expertise and a strong drive to contribute and collaborate within dynamic teams.
                        <br />
                        <br />
                        Let's connect and explore how we can build impactful digital experiences together!
                    </p>
                    <h4 className="my-6 text-gray-700 font-Outfit dark:text-white/80">I love using following tools and technologies.</h4>
                    <ul className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 md:gap-5">
                        {[
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
                        ].map((tech, i) => (
                            <li key={`${tech.alt}-${i}`} className="flex items-center justify-center w-12 sm:w-14 aspect-square border border-gray-400 rounded-lg cursor-pointer hover:-translate-y-1 duration-500">
                                <Image src={tech.src} alt={tech.alt} width={24} height={24} className="w-6" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

