export type QuizEvent =
  | { kind: "StartQuiz" }
  | { kind: "RepeatQuiz" }
  | { kind: "GoToNextQuestion" }
  | { kind: "GoToPreviousQuestion" }
  | { kind: "FinishQuiz" }
  | { kind: "CloseQuiz" }
  | { kind: "MultipleChoiceQuestionOptionSelected"; selectedOptionId: string }
  | { kind: "MultipleChoiceQuestionCheckAnswer" }
  | { kind: "RestartQuiz" };
