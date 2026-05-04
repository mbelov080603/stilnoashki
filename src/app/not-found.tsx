import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[70svh] place-items-center bg-white px-5 py-16 sm:px-6 lg:px-10">
      <div className="w-full max-w-2xl rounded-[1rem] border border-black/10 bg-white p-8 text-black sm:p-10">
        <p className="text-xs uppercase tracking-[0.22em] text-black/42">404</p>
        <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em]">
          Страница не найдена.
        </h1>
        <p className="mt-5 text-lg leading-8 text-black/64">
          Такой страницы нет. Вернитесь на главную или откройте каталог продукции.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full border border-black bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-black/82"
          >
            На главную
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-black/14 bg-white px-5 py-3 text-center text-sm font-medium text-black transition hover:border-black/34 hover:bg-black/[0.04]"
          >
            К продукции
          </Link>
        </div>
      </div>
    </section>
  );
}
