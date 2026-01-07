import LessonEditor from "../components/LessonEditor";

export default function NewLessonPage() {
  return (
    <LessonEditor
      mode="new"
      lesson={{
        practiced_on: "",
        practice_name: "",
        tabs: {
          chashitsu: "",
          teishu: "",
          kyaku: "",
        },
      }}
    />
  );
}
