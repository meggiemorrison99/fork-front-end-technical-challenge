import React from "react";

export function useQuestionTimer() {
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
  }, []);

  const formattedTime = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  return formattedTime;
}
