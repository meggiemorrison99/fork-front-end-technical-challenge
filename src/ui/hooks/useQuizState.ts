import React from "react";
import type { QuizState, QuizEvent } from "@/types";
import * as QuizAPI from "@/api/quizAPI";
import * as LocalStorageAPI from "@/api/localStorageAPI";
import { makeInitialState } from "./makeInitialState";

export type UseQuizStateProps = {
  quizState: QuizState;
  resumeQuestionIndex: number | null;
};

export function useQuizState({
  quizState,
  resumeQuestionIndex,
}: UseQuizStateProps) {
  const [state, setState] = React.useState(quizState);

  async function handleEvent(event: QuizEvent) {
    switch (event.kind) {
      case "StartQuiz": {
        const newState: QuizState = {
          ...state,
          page: { kind: "QuestionPage", questionIndex: 0 },
        };

        setState(newState);

        return;
      }

      case "RepeatQuiz": {
        const newState = makeInitialState(state.quiz);

        setState(newState);
        LocalStorageAPI.clearQuizState();

        return;
      }
      case "RestartQuiz": {
        const newState = makeInitialState(state.quiz);

        setState(newState);
        LocalStorageAPI.clearQuizState();

        return;
      }

      case "CloseQuiz": {
        const newState: QuizState = {
          ...state,
          page: { kind: "StartPage" },
        };

        setState(newState);

        return;
      }

      case "FinishQuiz": {
        const marks = state.questionStates.reduce(
          (acc, questionState) =>
            questionState.result === "Correct" ? acc + 1 : acc,
          0,
        );

        const totalMarks = state.quiz.questions.length;

        const newState: QuizState = {
          ...state,
          page: { kind: "ResultsPage", marks, totalMarks },
        };

        setState(newState);

        LocalStorageAPI.clearQuizState();

        QuizAPI.completeQuiz({ quizId: state.quiz.id, marks });

        return;
      }

      case "GoToNextQuestion": {
        if (state.page.kind !== "QuestionPage") {
          return;
        }

        const { questionIndex } = state.page;

        const newState: QuizState = {
          ...state,
          page: { kind: "QuestionPage", questionIndex: questionIndex + 1 },
        };

        setState(newState);

        return;
      }

      case "GoToPreviousQuestion": {
        if (state.page.kind !== "QuestionPage") {
          return;
        }

        const { questionIndex } = state.page;

        const newState: QuizState = {
          ...state,
          page: { kind: "QuestionPage", questionIndex: questionIndex - 1 },
        };

        setState(newState);

        return;
      }

      case "MultipleChoiceQuestionCheckAnswer": {
        if (state.page.kind !== "QuestionPage") {
          return;
        }

        const { quiz, page } = state;

        const newState: QuizState = {
          ...state,
          questionStates: state.questionStates.map((questionState, index) => {
            if (index === page.questionIndex) {
              const question = quiz.questions[index];
              const isCorrect =
                questionState.selectedOptionId === question.correctOptionId;
              return {
                ...questionState,
                result: isCorrect ? "Correct" : "Incorrect",
              };
            }
            return questionState;
          }),
        };

        setState(newState);

        return;
      }

      case "MultipleChoiceQuestionOptionSelected": {
        if (state.page.kind !== "QuestionPage") {
          return;
        }

        const { questionIndex } = state.page;

        const { selectedOptionId } = event;

        const newState: QuizState = {
          ...state,
          questionStates: state.questionStates.map((questionState, index) => {
            return index === questionIndex
              ? { ...questionState, selectedOptionId }
              : questionState;
          }),
        };

        setState(newState);

        return;
      }
      case "ResumeQuiz": {
        const newState: QuizState = {
          ...state,
          page: {
            kind: "QuestionPage",
            questionIndex: resumeQuestionIndex ?? 0,
          },
        };
        setState(newState);
        return;
      }

      default: {
        event satisfies never;
      }
    }
  }

  return {
    state,
    handleEvent,
  };
}
