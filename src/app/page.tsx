import Main from "./components/Main";
import StatsBar from "./components/StatsBar";
import About from "./about/About";
import Services from "./services/Services";
import HowWeWork from "./components/HowWeWork";
import Projects from "./projects/Projects";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Contact from "./contact/Contact";

export default function HomePage() {
	return (
		<>
			<Main />
			<StatsBar />
			<About />
			<Services />
			<HowWeWork />
			<Projects />
			<Testimonials />
			<FAQ />
			<Contact />
		</>
	);
}
