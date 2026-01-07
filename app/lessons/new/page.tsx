import LessonEditor from "../components/LessonEditor";

export default function NewLessonPage() {
  return (
    <LessonEditor
      mode="new"
      lesson={{ id: null, practiced_on: "", practice_name: "" }}
      tabs={{
        chashitsu: { items: [] },
        teishu: { entries: [] },
        kyaku: { entries: [] },
      }}
    />
  );
}
