import { redirect } from "next/navigation";

interface TermDetailPageProps {
  params: Promise<{
    termId: string;
  }>;
}

export default async function TermDetailPage({ params }: TermDetailPageProps) {
  const { termId: termKey } = await params;

  redirect(`/dashboard/groups/${termKey}`);
}
