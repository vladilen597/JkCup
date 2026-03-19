import CustomButton from "../Shared/CustomButton/CustomButton";
import CustomInput from "../Shared/CustomInput/CustomInput";
import ErrorBlock from "../Shared/ErrorBlock/ErrorBlock";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { setUser } from "@/app/utils/store/userSlice";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import CustomPasswordInput from "../Shared/CustomPasswordInput/CustomPasswordInput";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";

const AuthModalContent = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    full_name?: string;
    who_invited?: string;
  }>({
    email: "",
    password: "",
    full_name: "",
    who_invited: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleSwitchContent = () => {
    setError("");
    setIsSignUp((prevState) => !prevState);
  };

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSignUp = async () => {
    setError("");
    setIsLoading(true);
    try {
      await axios.post("/api/auth/signup", formData);
      handleSwitchContent();
    } catch (error: any) {
      setError(error.response?.data?.message || "Ошибка регистрации");
      console.error(error.response?.data?.message || "Ошибка регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setError("");
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/auth/signin", formData);
      dispatch(setUser(data.user));
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || "Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignUp) {
      handleSignUp();
    } else {
      handleSignIn();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <header className="mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? "signup" : "signin"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-[22px] font-semibold tracking-tight text-foreground">
              {isSignUp ? "Создать аккаунт" : "С возвращением"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              {isSignUp
                ? "Введите данные, чтобы начать."
                : "Введите данные для входа."}
            </p>
          </motion.div>
        </AnimatePresence>
      </header>
      <CustomInput
        className="px-1"
        name="email"
        type="email"
        label="Email"
        value={formData.email}
        onChange={handleChangeInput}
        required
        autoComplete="email"
      />
      <CustomPasswordInput
        className="px-1"
        name="password"
        label="Пароль"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChangeInput}
      />
      <AnimatePresence>
        {isSignUp && (
          <motion.div
            className="space-y-2 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: {
                delay: 0.2,
              },
            }}
          >
            <CustomInput
              className="px-1"
              name="full_name"
              label="Никнейм"
              value={formData.full_name}
              onChange={handleChangeInput}
              required
            />
            <CustomInput
              className="px-1 pb-1"
              name="who_invited"
              label="Приглашение"
              placeholder="Кто вас пригласил?"
              value={formData.who_invited}
              onChange={handleChangeInput}
              required
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div
          key={isSignUp ? "signup" : "signin"}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {isSignUp ? (
            <CustomButton
              isLoading={isLoading}
              type="submit"
              label="Зарегистрироваться"
            />
          ) : (
            <CustomButton isLoading={isLoading} type="submit" label="Войти" />
          )}
        </motion.div>
      </AnimatePresence>
      {error && <ErrorBlock error={error} />}
      <footer className="mt-8 pt-6 border-t border-auth-border/50 text-center">
        <button
          type="button"
          onClick={() => {
            setError("");
            setIsSignUp(!isSignUp);
          }}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer"
        >
          {isSignUp ? (
            <>
              Уже есть аккаунт?{" "}
              <span className="text-foreground font-medium">Войти</span>
            </>
          ) : (
            <>
              Ещё нет аккаунта?{" "}
              <span className="text-foreground font-medium">Создать</span>
            </>
          )}
        </button>
      </footer>
    </form>
  );
};

export default AuthModalContent;
