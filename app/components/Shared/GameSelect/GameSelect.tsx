import { ChevronDown } from "lucide-react";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { setGames } from "@/app/utils/store/gamesSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { IGame } from "@/app/lib/types";
import axios from "axios";

interface IGameSelectProps {
  value: IGame | null;
  containerClassName?: string;
  triggerClassName?: string;
  onChange: (value: IGame) => void;
  required?: boolean;
  error?: boolean;
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
  required = false,
  error = false,
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
      const { data } = await axios.get("/api/games");
      dispatch(setGames(data));
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleLoadGames();
  }, []);

  const borderClass = error
    ? "border-red-500 focus:border-red-500"
    : "border-border";

  return (
    <motion.label
      ref={containerRef}
      variants={containerVariants}
      initial="collapsed"
      animate={isOpen ? "expanded" : "collapsed"}
      exit="collapsed"
      className={`block border relative bg-background rounded-lg ${borderClass} ${containerClassName}`}
      onClick={handleToggleIsOpen}
    >
      <motion.div className="flex items-center p-3 justify-between text-sm">
        <div className="flex items-center gap-2">
          {value?.image_url && (
            <Image
              className="rounded h-4 w-4 object-cover"
              src={value.image_url}
              width={16}
              height={16}
              alt="Game image"
            />
          )}
          <span className={!value && required ? "text-muted-foreground" : ""}>
            {value?.name || (required ? "Выберите игру" : "Не выбрано")}
          </span>
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

      {required && (
        <input
          type="text"
          value={value?.name}
          onChange={() => {}}
          required={required}
          className="sr-only"
          tabIndex={-1}
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="w-full box-border text-sm absolute top-full right-0 bg-background rounded-bl-lg rounded-br-lg overflow-hidden z-10 shadow-2xl select-none max-h-60 overflow-y-auto"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            {games.length === 0 ? (
              <li className="p-3 text-muted-foreground text-center">
                Загрузка игр...
              </li>
            ) : (
              games.map((game) => (
                <li
                  key={game.id}
                  className={`flex items-center gap-2 p-3 hover:bg-primary/20 cursor-pointer ${
                    game.id === value?.id && "bg-primary/10"
                  }`}
                  onClick={() => onChange(game)}
                >
                  <Image
                    className="rounded h-4 w-4 object-cover"
                    src={game.image_url}
                    width={16}
                    height={16}
                    alt={game.name}
                  />
                  <span>{game.name}</span>
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.label>
  );
};

export default GameSelect;
