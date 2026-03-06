import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <h2 className="font-mono! text-primary text-[124px]">404</h2>
      <h2 className="text-2xl">Страница не найдена</h2>
      <Link href="/tournaments" className="mt-4 underline">
        Вернуться на главную
      </Link>
    </div>
  );
}
