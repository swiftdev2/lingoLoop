import { AddWordsForm } from "@/components/addWords";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function AddPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Add to Dictionary</h1>
        </div>
        <div style={{paddingTop: "1rem"}}>
            <AddWordsForm />
          </div>
      </section>
    </DefaultLayout>
  );
}
