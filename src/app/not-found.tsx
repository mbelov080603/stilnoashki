import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[70svh] place-items-center bg-black px-5 py-16 sm:px-6 lg:px-10">
      <div className="w-full max-w-2xl rounded-[2.6rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_42%),linear-gradient(145deg,#0a0a0a,#17181b)] p-8 text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-10">
        <p className="text-xs uppercase tracking-[0.45em] text-white/38">404</p>
        <h1 className="mt-6 text-5xl font-semibold tracking-[-0.06em]">
          Страница не найдена.
        </h1>
        <p className="mt-5 text-lg leading-8 text-white/68">
          Маршрут отсутствует в текущей STILNO architecture. Вернитесь на главную
          или откройте разделы, уже подготовленные под growth.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full border border-white/16 bg-white/[0.05] px-5 py-3 text-center text-sm font-medium transition hover:border-white/36 hover:bg-white/[0.1]"
          >
            На главную
          </Link>
          <Link
            href="/products"
            className="rounded-full border border-white/16 bg-white/[0.05] px-5 py-3 text-center text-sm font-medium transition hover:border-white/36 hover:bg-white/[0.1]"
          >
            К продукции
          </Link>
        </div>
      </div>
    </section>
  );
}

