import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "동네 소식 블로그 - 성남시 생활 정보",
  description: "성남시의 최신 축제, 행사, 혜택 및 알찬 생활 꿀팁을 전해드리는 블로그입니다.",
};

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* 상단 네비게이션 & 헤더 */}
      <header className="border-b border-amber-200/60 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white text-xl shadow-md shadow-amber-200">
              🏡
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  성남시 생활 정보
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                  블로그
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                우리 동네 축제·행사 일정과 맞춤 혜택 알리미
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 text-sm font-semibold">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
            >
              생활 정보 홈
            </Link>
            <Link
              href="/blog"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white font-bold shadow-sm shadow-amber-200"
            >
              블로그
            </Link>
          </nav>
        </div>
      </header>

      {/* 메인 블로그 목록 영역 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-10">
        {/* 상단 타이틀 영역 */}
        <section className="space-y-3 border-b border-amber-200/80 pb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              동네 소식 & 생활 꿀팁 블로그
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600">
            성남시의 유용한 정책 소식과 가볼 만한 축제 이야기를 읽기 쉽게 전달해 드립니다.
          </p>
        </section>

        {/* 게시글 목록 */}
        {posts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-amber-100 shadow-sm space-y-3">
            <span className="text-4xl block">✨</span>
            <h3 className="text-lg font-bold text-slate-800">
              아직 등록된 블로그 글이 없습니다
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              곧 새롭고 유익한 지역 생활 정보 소식이 업데이트될 예정입니다.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-200"
              >
                &larr; 생활 정보 둘러보기
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col justify-between bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-amber-100 hover:border-amber-300"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-lg">
                      {post.category}
                    </span>
                    {post.date && (
                      <span className="text-xs font-medium text-slate-400">
                        📅 {post.date}
                      </span>
                    )}
                  </div>

                  <Link href={`/blog/${post.slug}`} className="block">
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 flex items-center justify-between border-t border-slate-100">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline shrink-0 ml-2"
                  >
                    글 읽기 &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* 하단 푸터 */}
      <footer className="border-t border-amber-200/80 bg-white mt-12 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-semibold text-slate-700">
              우리 동네 생활 정보 (성남시)
            </p>
            <p>공공데이터포털 기반 로컬 소식 알리미</p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-[11px] text-slate-400">
              © 2026 우리 동네 생활 정보. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
