import HomePage from "@/components/HomePage/HomePage";
import ScrollToTop from "@/components/shared/ScrollToTop";

export default function Home() {
  return (
    <>
      <ScrollToTop />
      <main className="w-full max-w-[1920px] mx-auto overflow-hidden">
        <HomePage />
      </main>
    </>
  );
}
