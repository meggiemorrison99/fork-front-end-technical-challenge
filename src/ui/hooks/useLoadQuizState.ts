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
  | { kind: "Success"; quizState: QuizState };

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
          setResult({
            kind: "Success",
            quizState: quizStateFromLocalStorage,
          });
          return;
        }

        const quiz = await QuizAPI.fetchQuiz({ quizId });

        const quizState = makeInitialState(quiz);

        setResult({
          kind: "Success",
          quizState,
        });
      } catch (error) {
        setResult({ kind: "Error", error: String(error) });
      }
    }

    loadQuizState();
  }, [quizId]);

  return result;
}
