import { useEffect, useState } from "react";

export default function TimelineScrubber({ currentDay, onChangeDay, maxDay = 10 }) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        onChangeDay((prev) => {
          if (prev >= maxDay) {
            setIsPlaying(false);
            return maxDay;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, maxDay, onChangeDay]);

  return (
    <div className="timeline-scrubber">
      <button 
        className="btn-play" 
        onClick={() => {
          if (currentDay >= maxDay) onChangeDay(1);
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? "Pause" : (currentDay >= maxDay ? "Replay" : "Play")}
      </button>
      
      <div className="scrubber-track">
        <label className="scrubber-label">Day {currentDay}</label>
        <input 
          className="scrubber-input"
          type="range" 
          min="1" 
          max={maxDay} 
          value={currentDay}
          onChange={(e) => {
            onChangeDay(Number(e.target.value));
            setIsPlaying(false);
          }}
        />
      </div>
    </div>
  );
}
