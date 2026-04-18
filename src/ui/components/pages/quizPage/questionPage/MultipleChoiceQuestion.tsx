import React from "react";
import { Question, QuestionState, QuestionStateResult } from "@/types";
import { Button } from "@/ui/components/common/Button";
import { Markdown } from "@/ui/components/common/Markdown";
import styles from "./MultipleChoiceQuestion.module.css";

export type MultipleChoiceQuestionProps = {
  question: Question;
  questionState: QuestionState;
  onOptionSelected: (optionId: string) => void;
  onCheckAnswer: () => void;
};

export function MultipleChoiceQuestion(props: MultipleChoiceQuestionProps) {
  const { question, questionState, onOptionSelected, onCheckAnswer } = props;

  if (questionState.result) {
    return (
      <MultipleChoiceQuestionMarked
        question={question}
        selectedOptionId={questionState.selectedOptionId}
        result={questionState.result}
      />
    );
  }

  return (
    <MultipleChoiceQuestionNotMarked
      question={question}
      selectedOptionId={questionState.selectedOptionId}
      onOptionSelected={onOptionSelected}
      onCheckAnswer={onCheckAnswer}
    />
  );
}

type MultipleChoiceQuestionNotMarkedProps = {
  question: Question;
  selectedOptionId: string | null;
  onOptionSelected: (optionId: string) => void;
  onCheckAnswer: () => void;
};

function MultipleChoiceQuestionNotMarked(
  props: MultipleChoiceQuestionNotMarkedProps
) {
  const { question, selectedOptionId, onOptionSelected, onCheckAnswer } = props;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const btnCheck = selectedOptionId as boolean;

  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);

  React.useEffect(() => {
    setIsButtonDisabled(!btnCheck);
  }, [btnCheck]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <Markdown>{question.prompt}</Markdown>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        {question.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <div
              key={option.id}
              className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
              tabIndex={0}
              onClick={() => onOptionSelected(option.id)}
              onKeyDown={(e) => {
                if (e.keyCode === 13 || e.keyCode === 32) {
                  onOptionSelected(option.id);
                }
              }}
            >
              <span className={styles.optionLabel}>
                {"ABCD".split("")[index]}
              </span>
              <span>{option.text}</span>
            </div>
          );
        })}
      </div>

      <div>
        <Button disabled={isButtonDisabled} onClick={onCheckAnswer}>
          Check Answer
        </Button>
      </div>
    </div>
  );
}

type MultipleChoiceQuestionMarkedProps = {
  question: Question;
  selectedOptionId: string | null;
  result: QuestionStateResult;
};

function MultipleChoiceQuestionMarked(
  props: MultipleChoiceQuestionMarkedProps
) {
  const { question, selectedOptionId, result } = props;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <Markdown>{question.prompt}</Markdown>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        {question.options.map((option, index) => {
          const isCorrect = option.id === question.correctOptionId;
          return (
            <div
              key={option.id}
              className={`${styles.option} ${
                isCorrect ? styles.optionCorrect : styles.optionIncorrect
              }`}
            >
              <span className={styles.optionLabel}>
                {["A", "B", "C", "D"][index]}
              </span>
              <span>{option.text}</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <MultipleChoiceQuestionResult result={result} />
      </div>

      <div>
        <Markdown>{question.explanation}</Markdown>
      </div>
    </div>
  );
}

function MultipleChoiceQuestionResult({
  result,
}: {
  result: QuestionStateResult;
}) {
  switch (result) {
    case "Correct": {
      return <div>✅ Correct</div>;
    }
    case "Incorrect": {
      return <div>❌ Incorrect</div>;
    }
  }
}
