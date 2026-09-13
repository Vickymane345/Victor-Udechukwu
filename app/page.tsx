import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Manifesto from "@/components/sections/Manifesto";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Stack from "@/components/sections/Stack";
import Contact from "@/components/sections/Contact";
import { getProjects } from "@/lib/projects";

/**
 * Projects are pulled live from GitHub + Vercel and cached for an hour, so a
 * newly deployed repo appears here on its own. See lib/portfolio-config.ts.
 */
export const revalidate = 3600;

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Nav />
      <main className="w-full max-w-full overflow-x-clip">
        <Hero />
        <About />
        <Manifesto />
        <Services />
        <Work projects={projects} />
        <Stack />
      </main>
      <Contact />
    </>
  );
}
