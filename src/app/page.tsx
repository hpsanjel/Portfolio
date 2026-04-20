import Main from "./components/Main";
import About from "./about/About";
import Services from "./services/Services";
import Projects from "./projects/Projects";
import Blogs from "./blog/Blogs";
import Contact from "./contact/Contact";

export default function HomePage() {
	return (
		<>
			<Main />
			<About />
			<Services />
			<Projects />
			<Blogs />
			<Contact />
		</>
	);
}
