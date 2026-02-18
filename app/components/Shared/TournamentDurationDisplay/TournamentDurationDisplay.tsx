import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface TournamentDurationDisplayProps {
  duration?: number;
  startedAt?: string | Date | any;
}

const TournamentDurationDisplay = ({
  duration,
  startedAt,
}: TournamentDurationDisplayProps) => {
  const formatDuration = (ms: number) => {
    if (!ms || ms <= 0) return "00:00:00";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const calculateRemaining = () => {
    if (!startedAt || !duration) return duration || 0;

    const startTime = new Date(
      startedAt?.seconds ? startedAt.seconds * 1000 : startedAt,
    );
    const elapsedMs = Date.now() - startTime.getTime();

    const remaining = duration - elapsedMs;
    return Math.max(remaining, 0);
  };

  const [remainingMs, setRemainingMs] = useState(calculateRemaining());

  useEffect(() => {
    if (!startedAt || !duration) return;

    const timer = setInterval(() => {
      setRemainingMs(calculateRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [startedAt, duration]);

  if (!duration && !remainingMs) {
    return null;
  }

  return (
    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      {startedAt ? (
        remainingMs > 0 ? (
          <>
            Осталось:{" "}
            <span className="font-mono text-foreground">
              {formatDuration(remainingMs)}
            </span>
          </>
        ) : (
          <span className="text-red-400">Турнир окончен</span>
        )
      ) : (
        <>
          Длительность:{" "}
          <span className="font-mono text-foreground">
            {formatDuration(duration || 0)}
          </span>
        </>
      )}
    </div>
  );
};

export default TournamentDurationDisplay;
