import { useAppSelector } from "@/app/utils/store/hooks";
import axios from "axios";
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import CustomSkeleton from "../Shared/CustomSkeleton/CustomSkeleton";

interface FaceitLevelProps {
  level: number;
}

interface Props {
  level: number;
  elo: number;
}

interface Props {
  level: number;
  elo: number;
}
const ranges: Record<number, { min: number; max: number; color: string }> = {
  1: { min: 0, max: 500, color: "#FFFFFF" },
  2: { min: 501, max: 750, color: "#46e16d" },
  3: { min: 751, max: 900, color: "#46e16d" },
  4: { min: 901, max: 1050, color: "#ffcd25" },
  5: { min: 1051, max: 1200, color: "#ffcd25" },
  6: { min: 1201, max: 1350, color: "#ffcd25" },
  7: { min: 1351, max: 1530, color: "#ffcd25" },
  8: { min: 1531, max: 1750, color: "#fe6b1f" },
  9: { min: 1751, max: 2000, color: "#fe6b1f" },
  10: { min: 2001, max: 5000, color: "#FE1F00" },
};

const FaceitArcLevel = ({ level, elo }: Props) => {
  const { min, max, color } = ranges[level] || ranges[1];

  // Прогресс внутри текущего уровня (от 0 до 1)
  const innerProgress = Math.min(Math.max((elo - min) / (max - min), 0), 1);

  // Общий прогресс дуги: база уровня + кусочек текущего Elo
  // Чтобы на 1 уровне не было пусто, даем базу 0.1
  const totalProgress = level === 10 ? 1 : (level - 1 + innerProgress) / 10;

  const size = 20;
  const strokeWidth = 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = radius * 2 * Math.PI;
  const arcLength = circumference * 0.75; // 270 градусов
  const dashOffset = arcLength - totalProgress * arcLength;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full transform rotate-135"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#2A2A2A"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          style={{
            strokeDashoffset: dashOffset,
            transition: "stroke-dashoffset 0.6s ease",
          }}
          strokeLinecap="round"
        />
      </svg>

      <span
        className="absolute font-black select-none"
        style={{ color, fontSize: "10px", marginTop: "-1px" }}
      >
        {level}
      </span>
    </div>
  );
};

const FaceitInfoBlock = () => {
  const [faceitInfo, setFaceitInfo] = useState({
    nickname: "",
    elo: 0,
    level: 0,
    level_icon: "",
  });
  const { userInfo } = useAppSelector((state) => state.user);
  const [error, setError] = useState(false);

  const handleLoadFaceitCsStats = async () => {
    try {
      const { data } = await axios.post(`/api/users/faceit`, {
        steam_id: userInfo.steam_id,
      });
      setFaceitInfo(data);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  useEffect(() => {
    handleLoadFaceitCsStats();
  }, []);

  return (
    <div className="flex flex-col justify-between bg-card p-3 h-24 rounded-lg">
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-xs font-mono tracking-widest text-muted-foreground"
      >
        FaceIT CS2
      </motion.span>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="font-mono flex items-center gap-2"
      >
        {error ? (
          "-"
        ) : (
          <>
            <FaceitArcLevel elo={faceitInfo.elo} level={faceitInfo.level} />
            {faceitInfo.elo}
          </>
        )}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-xs font-mono tracking-widest text-muted-foreground"
      >
        {error ? "FaceIT не подключен" : faceitInfo.nickname}
      </motion.p>
    </div>
  );
};

export default FaceitInfoBlock;
