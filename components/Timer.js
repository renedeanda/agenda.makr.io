import React, { useEffect, useState } from 'react';

const Timer = ({ duration, timeLeft, isActive, onComplete, onTick }) => {
  const [time, setTime] = useState(timeLeft);

  useEffect(() => {
    let interval;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          onTick(newTime);
          if (newTime <= 0) {
            clearInterval(interval);
            onComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else if (time === 0) {
      onComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, time, onComplete, onTick]);

  useEffect(() => {
    setTime(timeLeft);
  }, [timeLeft]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  useEffect(() => {
    document.title = isActive ? `${minutes}:${seconds.toString().padStart(2, '0')} - Meeting Agenda` : 'Meeting Agenda Planner';
  }, [isActive, minutes, seconds]);

  return (
    <div className="text-4xl font-bold text-center gradient-text">
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
};

export default Timer;