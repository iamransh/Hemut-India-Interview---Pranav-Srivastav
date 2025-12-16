export const sortQuestions = (questions: any[]) => {
  return [...questions].sort((a, b) => {
    if (a.status === "ESCALATED" && b.status !== "ESCALATED") return -1;
    if (a.status !== "ESCALATED" && b.status === "ESCALATED") return 1;

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};
