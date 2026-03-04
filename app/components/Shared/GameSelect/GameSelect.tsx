import { ChevronDown } from "lucide-react";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { IGame, setGames } from "@/app/utils/store/gamesSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

interface IGameSelectProps {
  value: IGame;
  containerClassName?: string;
  triggerClassName?: string;
  onChange: (value: IGame) => void;
}

const containerVariants = {
  expanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  collapsed: {},
};

const labelVariants = {
  expanded: {
    transform: "rotate(180deg)",
  },
  collapsed: {
    transform: "rotate(0deg)",
  },
};

const triggerVariants = {
  expanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  collapsed: {
    transform: "rotate(0deg)",
  },
};

const contentVariants = {
  expanded: {
    opacity: 1,
    height: "auto",
  },
  collapsed: {
    opacity: 0,
    height: 0,
  },
};

const GameSelect = ({
  value,
  containerClassName,
  onChange,
}: IGameSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLLabelElement>(null);
  const { games } = useAppSelector((state) => state.games);
  const dispatch = useAppDispatch();

  const handleToggleIsOpen = (e: MouseEvent<HTMLLabelElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prevState) => !prevState);
  };

  const handleLoadGames = async () => {
    try {
      const q = query(collection(db, "games"));
      const snap = getDocs(q);
      const data = (await snap).docs.map((doc) => ({
        ...(doc.data() as IGame),
        uid: doc.id,
      }));
      dispatch(setGames(data));
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleLoadGames();
  }, []);

  return (
    <motion.label
      ref={containerRef}
      variants={containerVariants}
      initial="collapsed"
      animate={isOpen ? "expanded" : "collapsed"}
      exit="collapsed"
      className={`block relative bg-muted rounded-lg ${containerClassName}`}
      onClick={handleToggleIsOpen}
    >
      <motion.div className="flex items-center p-3 justify-between text-sm">
        <div className="flex items-center gap-2">
          {value?.image && (
            <Image
              className="rounded"
              src={value.image}
              width={16}
              height={16}
              alt="Game image"
            />
          )}
          {value?.name || "Не выбрано"}
        </div>
        <motion.div
          variants={labelVariants}
          initial="collapsed"
          animate={isOpen ? "expanded" : "collapsed"}
          exit="collapsed"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="w-full box-border text-sm absolute top-full right-0 bg-muted rounded-bl-lg rounded-br-lg overflow-hidden z-10 shadow-2xl select-none"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            {games.map((game) => (
              <li
                key={game.id}
                className={`flex items-center gap-2 p-3 hover:bg-primary-foreground/50 ${game.id === value?.id && "bg-primary-foreground/80"}`}
                onClick={() => onChange(game)}
              >
                <Image
                  className="rounded"
                  src={game.image}
                  width={16}
                  height={16}
                  alt="Game image"
                />
                <span>{game.name}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.label>
  );
};

export default GameSelect;
