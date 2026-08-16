import Dynamic from "@/components/Dynamic";

export default async function TestPage({
  params,
}: {
  params: Promise<{ test: string }>;
}) {
  const { test } = await params;
  return <Dynamic test={test} />;
}
