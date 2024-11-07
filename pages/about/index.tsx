import About from "@/components/aboutPage";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className={title({ size: "sm" })}>
          Lingo Loop - Your Language Flashcard Tool
        </h1>
        <About />
      </section>
    </DefaultLayout>
  );
}
