import { Clock } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface TournamentDurationDisplayProps {
  duration?: number;
  status: string;
  startedAt?: string | Date | null;
  plain?: boolean;
}

const TournamentDurationDisplay = ({
  duration,
  status,
  startedAt,
  plain,
}: TournamentDurationDisplayProps) => {
  const formatDuration = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((v) => v.toString().padStart(2, "0"))
      .join(":");
  };

  const calculateRemaining = useCallback(() => {
    if (!startedAt || !duration) return duration || 0;

    const startTime = new Date(startedAt).getTime();
    const elapsedMs = Date.now() - startTime;
    return Math.max(duration - elapsedMs, 0);
  }, [startedAt, duration]);

  const [remainingMs, setRemainingMs] = useState(calculateRemaining());

  useEffect(() => {
    if (status !== "in_progress" || !startedAt) {
      setRemainingMs(duration || 0);
      return;
    }

    const timer = setInterval(() => {
      const nextRemaining = calculateRemaining();
      setRemainingMs(nextRemaining);

      if (nextRemaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [status, startedAt, duration, calculateRemaining]);

  if (!duration && !startedAt) return null;

  if (plain) {
    return formatDuration(duration || 0);
  }

  return (
    <div className="px-3 py-1.5 mt-2 flex items-center gap-2 text-sm bg-[#171a21] w-fit rounded-lg border border-neon! text-neon shadow-[0_0_10px_rgba(0,255,255,0.2)]">
      <Clock className="h-4 w-4" />
      {status === "in_progress" && startedAt ? (
        remainingMs > 0 ? (
          <>
            Осталось:{" "}
            <span className="font-mono text-foreground">
              {formatDuration(remainingMs)}
            </span>
          </>
        ) : (
          <span className="text-red-400 font-bold">Турнир окончен</span>
        )
      ) : (
        <>
          Длительность:{" "}
          <span className="font-mono">{formatDuration(duration || 0)}</span>
        </>
      )}
    </div>
  );
};

export default TournamentDurationDisplay;
