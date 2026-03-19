"use client";

import { ReactNode } from "react";
import Header from "../components/Shared/Header/Header";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import CustomButton from "../components/Shared/CustomButton/CustomButton";
import { useAppDispatch, useAppSelector } from "../utils/store/hooks";
import { setTournaments } from "../utils/store/tournamentsSlice";
import { Slide, ToastContainer } from "react-toastify";
import { Check, Info, X } from "lucide-react";
import PollWidget from "../components/PollWidget/PollWidget";

type Props = {
  children: ReactNode;
};

type ErrorComponentProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ErrorComponent = ({ error, reset }: ErrorComponentProps) => {
  const dispatch = useAppDispatch();

  const handleClickClear = () => {
    dispatch(setTournaments([]));
    window.location.href = "/tournaments";
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center p-8 max-w-md ">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          😕 Что-то пошло не так
        </h2>

        <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg mb-6 text-left">
          <p className="text-red-400 font-mono text-sm wrap-break-word">
            {error.message || "Неизвестная ошибка"}
          </p>
          {error.digest && (
            <p className="text-gray-500 text-xs mt-2">ID: {error.digest}</p>
          )}
        </div>

        <p className="text-gray-300 mb-6">
          Пожалуйста, попробуйте обновить страницу или вернуться назад.
        </p>

        <CustomButton
          className="mx-auto"
          label="Попробовать снова"
          onClick={() => reset()}
        />

        <div className="mt-6 text-gray-500 text-sm">
          Если ошибка не пропадает - нажмите{" "}
          <button
            className="underline hover:text-white transition-colors"
            type="button"
            onClick={handleClickClear}
          >
            очистить данные
          </button>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children }: Props) => {
  const { user } = useAppSelector((state) => state.user);

  return (
    <div className="font-inter">
      <Header />
      <ErrorBoundary errorComponent={ErrorComponent}>{children}</ErrorBoundary>
      <PollWidget currentUser={user} />
      <ToastContainer
        position="top-center"
        transition={Slide}
        toastClassName="relative flex p-1 min-h-10 rounded-lg bg-card! font-inter! text-white!"
        progressClassName="bg-neon!"
        icon={({ type }) => {
          switch (type) {
            case "success":
              return <Check className="text-neon!" />;
            case "error":
              return <X className="text-red-500!" />;
            default:
              return <Info className="text-primary!" />;
          }
        }}
      />
    </div>
  );
};

export default Layout;
