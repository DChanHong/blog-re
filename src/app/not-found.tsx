import Link from "next/link";

export default function NotFound() {
    return (
        <section className="w-full max-w-[1800px] m-auto flex justify-center items-center min-h-[70vh] p-6">
            <div className="w-full max-w-sm text-center rounded-2xl border bg-white shadow-md p-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A0044]">Page404</h1>
                <Link
                    href="/"
                    className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#0A0044] text-white font-semibold hover:opacity-90 active:scale-[0.99]"
                >
                    홈으로 가기
                </Link>
            </div>
        </section>
    );
}
