import { useEffect, useState } from "react";

import { AddWordsForm } from "@/components/addWords";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function AddPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          {isMobile ? (
            <h1 className={title({ size: "sm" })}>Dictionary Words</h1>
          ) : (
            <h1 className={title()}>Add to Dictionary</h1>
          )}
        </div>
        <div style={{ paddingTop: "1rem" }}>
          <AddWordsForm />
        </div>
      </section>
    </DefaultLayout>
  );
}
