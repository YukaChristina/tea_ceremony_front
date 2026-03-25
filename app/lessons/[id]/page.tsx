import { redirect } from "next/navigation";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/lessons/${id}/edit`);
}
