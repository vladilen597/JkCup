import axios from "axios";
import { ChangeEvent, SubmitEvent, useState } from "react";
import CustomInput from "../Shared/CustomInput/CustomInput";
import CustomButton from "../Shared/CustomButton/CustomButton";
import { useAppDispatch } from "@/app/utils/store/hooks";
import { setUser } from "@/app/utils/store/userSlice";
import ErrorBlock from "../Shared/ErrorBlock/ErrorBlock";

const AuthModalContent = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleSwitchContent = () => {
    setError("");
    setIsSignUp((prevState) => !prevState);
  };

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleChangeDisplayName = (event: ChangeEvent<HTMLInputElement>) => {
    setDisplayName(event.target.value);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    setError("");
    setIsLoading(true);
    e.preventDefault();
    try {
      await axios.post("/api/auth/signup", {
        email,
        password,
        displayName,
      });
      handleSwitchContent();
    } catch (error: any) {
      setError(error.response?.data?.message || "Ошибка регистрации");
      console.error(error.response?.data?.message || "Ошибка регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    setError("");
    setIsLoading(true);
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/signin", {
        email,
        password,
      });
      console.log(data.user);
      dispatch(setUser(data.user));
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || "Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSignUp) {
    return (
      <form onSubmit={handleSignUp} className="space-y-2">
        <h2 className="text-xl">Зарегистрироваться</h2>
        <CustomInput
          type="email"
          label="Email"
          value={email}
          onChange={handleChangeEmail}
          required
        />
        <CustomInput
          label="Пароль"
          value={password}
          onChange={handleChangePassword}
          required
        />
        <CustomInput
          label="Никнейм"
          value={displayName}
          onChange={handleChangeDisplayName}
          required
        />
        <CustomButton
          isLoading={isLoading}
          type="submit"
          label="Зарегистрироваться"
        />
        {error && <ErrorBlock error={error} />}
        <div className="text-center text-neutral-400 text-sm">
          Уже есть аккаунт?{" "}
          <button
            className="cursor-pointer underline"
            onClick={handleSwitchContent}
          >
            Войти
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-2">
      <h2 className="text-xl">Войти</h2>
      <CustomInput
        type="email"
        label="Email"
        value={email}
        onChange={handleChangeEmail}
      />
      <CustomInput
        label="Пароль"
        value={password}
        onChange={handleChangePassword}
      />
      <CustomButton isLoading={isLoading} type="submit" label="Войти" />
      {error && <ErrorBlock error={error} />}
      <div className="text-center text-neutral-400 text-sm">
        Еще не зарегистрировались?{" "}
        <button
          className="cursor-pointer underline"
          onClick={handleSwitchContent}
        >
          Зарегистрироваться
        </button>
      </div>
    </form>
  );
};

export default AuthModalContent;
