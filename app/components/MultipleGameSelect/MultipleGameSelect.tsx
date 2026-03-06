import { ChevronDown, X } from "lucide-react";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { IGame, setGames } from "@/app/utils/store/gamesSlice";
import { useAppDispatch, useAppSelector } from "@/app/utils/store/hooks";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/app/utils/firebase";

interface IMultipleGameSelectProps {
  value: IGame[];
  containerClassName?: string;
  triggerClassName?: string;
  onChange: (value: IGame) => void;
  handleDelete: (gameId: string) => void;
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

const MultipleGameSelect = ({
  value = [],
  containerClassName,
  onChange,
  handleDelete,
  required = false,
  error = false,
}: IMultipleGameSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { games } = useAppSelector((state) => state.games);
  const dispatch = useAppDispatch();

  const handleToggleIsOpen = (e: MouseEvent<HTMLDivElement>) => {
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

  const borderClass = error
    ? "border-red-500 focus:border-red-500"
    : "border-border";

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="collapsed"
      animate={isOpen ? "expanded" : "collapsed"}
      exit="collapsed"
      className={`block border relative bg-muted rounded-lg ${borderClass} ${containerClassName}`}
      onClick={handleToggleIsOpen}
    >
      <motion.div className="flex items-center p-1.5 justify-between text-sm">
        <div className="flex flex-wrap items-center gap-2">
          {value.length ? (
            value?.map((game) => (
              <div
                key={game.id}
                className="flex bg-primary/20 p-1.5 rounded-lg items-center gap-2"
              >
                {game?.image && (
                  <Image
                    className="rounded object-cover h-4 w-4"
                    src={game.image}
                    width={16}
                    height={16}
                    alt="Game image"
                  />
                )}
                <span>{game?.name}</span>
                {handleDelete && (
                  <button
                    className="cursor-pointer"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(game.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center p-1">Выберите игры</div>
          )}
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
            className="w-full box-border text-sm absolute top-full right-0 bg-muted rounded-bl-lg rounded-br-lg overflow-hidden z-10 shadow-2xl select-none max-h-60 overflow-y-auto"
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
              games.map((game) => {
                const isGameSelected = value?.find(
                  (valueGame) => valueGame.id === game.id,
                );
                return (
                  <li
                    key={game.id}
                    className={`flex items-center gap-2 p-3 hover:bg-primary-foreground/50 cursor-pointer ${
                      isGameSelected && "bg-primary-foreground/80"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isGameSelected) {
                        handleDelete(game.id);
                      } else {
                        onChange(game);
                      }
                    }}
                  >
                    <Image
                      className="rounded"
                      src={game.image}
                      width={16}
                      height={16}
                      alt={game.name}
                    />
                    <span>{game.name}</span>
                  </li>
                );
              })
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MultipleGameSelect;
