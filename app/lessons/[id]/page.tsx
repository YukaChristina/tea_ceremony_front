import LessonEditor from "../components/LessonEditor";
import { fetchLesson } from "../lib/fetchlesson";

export default async function LessonDetailPage({ params }: any) {
  const data = await fetchLesson(params.id); // 既存API

  return (
    <LessonEditor
      mode="read"
      lesson={{
        practiced_on: data.lesson.practiced_on,
        practice_name: data.lesson.practice_name,
        tabs: {
          chashitsu: data.tabs.chashitsu.items[0]?.note ?? "",
          teishu: "",
          kyaku: "",
        },
      }}
    />
  );
}
