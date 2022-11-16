import { useEffect, useState } from "react";

const SECOND_MS = 1000;

export default function useTimer(task) {
  const [seconds, setSeconds] = useState(0);
  const [mustCount, setMustCount] = useState(false);

  useEffect(() => {
    if(task === null) {
      setSeconds(0);
      setMustCount(false);
    } else {
      setSeconds(task.totalTime);
      setMustCount(true);
    }
  }, [task])

  useEffect(() => {
    const interval = setInterval(() => {
      if(mustCount)
        setSeconds(seconds + 1);
    }, SECOND_MS);

    return () => clearInterval(interval);
  }, [seconds, mustCount]);

  return {
    seconds
  };
}
