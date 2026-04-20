import React from "react";
import type { QuizState } from "@/types";
import * as QuizAPI from "@/api/quizAPI";
import * as LocalStorageAPI from "@/api/localStorageAPI";
import { makeInitialState } from "./makeInitialState";

export type UseLoadQuizStateProps = {
  quizId: string;
};

export type UseLoadQuizStateResult =
  | { kind: "Loading" }
  | { kind: "Error"; error: string }
  | {
      kind: "Success";
      quizState: QuizState;
      resumeQuestionIndex: number | null;
    };

export function useLoadQuizState(props: UseLoadQuizStateProps) {
  const { quizId } = props;

  const [result, setResult] = React.useState<UseLoadQuizStateResult>({
    kind: "Loading",
  });

  React.useEffect(() => {
    async function loadQuizState() {
      try {
        const quizStateFromLocalStorage = LocalStorageAPI.loadQuizState();

        if (quizStateFromLocalStorage) {
          const savedPage = quizStateFromLocalStorage.page;
          const resumeQuestionIndex =
            savedPage.kind === "QuestionPage" ? savedPage.questionIndex : null;
          setResult({
            kind: "Success",
            quizState: {
              ...quizStateFromLocalStorage,
              page: { kind: "StartPage" },
            },
            resumeQuestionIndex,
          });
          return;
        }

        const quiz = await QuizAPI.fetchQuiz({ quizId });

        const quizState = makeInitialState(quiz);

        setResult({
          kind: "Success",
          quizState,
          resumeQuestionIndex: null,
        });
      } catch (error) {
        setResult({ kind: "Error", error: String(error) });
      }
    }

    loadQuizState();
  }, [quizId]);

  return result;
}
