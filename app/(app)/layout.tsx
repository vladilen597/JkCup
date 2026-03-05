"use client";

import { ReactNode } from "react";
import Header from "../components/Shared/Header/Header";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import CustomButton from "../components/Shared/CustomButton/CustomButton";

type Props = {
  children: ReactNode;
};

const ErrorComponent = () => {
  const handleClickClear = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center p-8 max-w-md ">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          😕 Что-то пошло не так
        </h2>
        <p className="text-gray-300 mb-6">
          Произошла ошибка при загрузке страницы. Пожалуйста, попробуйте
          обновить страницу.
        </p>
        <CustomButton
          className="mx-auto"
          label="Перезагрузить страницу"
          onClick={() => window.location.reload()}
        />
        <div className="mt-6 text-gray-500 text-sm">
          Если ошибка не пропадает - нажмите{" "}
          <button
            className="underline"
            type="button"
            onClick={handleClickClear}
          >
            сюда
          </button>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children }: Props) => {
  return (
    <div className="font-inter">
      <Header />
      <ErrorBoundary errorComponent={ErrorComponent}>{children}</ErrorBoundary>
    </div>
  );
};

export default Layout;
