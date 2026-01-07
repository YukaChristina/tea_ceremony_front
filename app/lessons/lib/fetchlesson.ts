export type LessonApiResponse = {
  lesson: {
    id: number;
    practiced_on: string;
    practice_name: string;
  };
  tabs: {
    chashitsu: { items: Array<any> };
    teishu: { entries: Array<any> };
    kyaku: { entries: Array<any> };
  };
};

export async function fetchLesson(id: string | number): Promise<LessonApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }

  const res = await fetch(`${baseUrl}/lessons/${id}`, {
    // サーバー側で毎回最新を取りたい（デモならこれが安全）
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch lesson: ${res.status}`);
  }

  return res.json();
}
