import LessonEditor from "../components/LessonEditor";
import { fetchLesson } from "../lib/fetchlesson";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await fetchLesson(id);

  return (
    <LessonEditor
      mode="read"
      lesson={{
        id: data.lesson.id,
        practiced_on: data.lesson.practiced_on,
        practice_name: data.lesson.practice_name,
      }}
      tabs={data.tabs}
    />
  );
}
