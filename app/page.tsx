import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Stack from "@/components/sections/Stack";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="w-full max-w-full overflow-x-clip">
        <Hero />
        <About />
        <Manifesto />
        <Services />
        <Work />
        <Stack />
      </main>
      <Contact />
    </>
  );
}
