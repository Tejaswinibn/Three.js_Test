import HostEventForm from "@/components/forms/HostEventForm";
import { JSX } from "react";

type SearchParams = Promise<{ intent?: string }>;

export default async function HostEventPage({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<JSX.Element> {
  const sp = await searchParams;
  const intent = sp.intent === "speaker" ? "speaker" : "host";

  return (
    <div className="min-h-[70vh] bg-[#F8F6F1] px-4 py-12 sm:px-6 lg:px-8">
      <HostEventForm initialIntent={intent} />
    </div>
  );
}
