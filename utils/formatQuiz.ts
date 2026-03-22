// utils/formatQuiz.ts
export const formatQuizQuestions = (questions: any[]) => {
  return questions.map((q: any, index: number) => {
    const options = q.options.map(
      (opt: any, i: number) =>
        `${String.fromCharCode(65 + i)}) ${opt.optionText}`,
    );

    const correctIndex = q.options.findIndex((opt: any) => opt.isCorrect);

    return {
      id: index + 1,
      question: q.questionText,
      options,
      correctIndex,
    };
  });
};
