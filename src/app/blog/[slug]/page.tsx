import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import type { Metadata } from "next";

export function generateStaticParams() {
  const slugs = getAllPostSlugs();
  // 정적 빌드(output: export) 시 글이 아직 하나도 없는 경우에도 빌드 에러가 나지 않도록 처리
  if (slugs.length === 0) {
    return [{ slug: "welcome" }];
  }
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "글을 찾을 수 없습니다 - 성남시 생활 정보",
    };
  }

  return {
    title: `${post.title} - 성남시 생활 정보`,
    description: post.summary || post.title,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* 상단 네비게이션 */}
      <header className="border-b border-amber-200/60 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-slate-800 hover:text-amber-600 transition-colors font-bold text-sm sm:text-base group"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 group-hover:bg-amber-200 text-amber-900 transition-colors">
              &larr;
            </span>
            <span>블로그 목록으로</span>
          </Link>

          <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            {post.category}
          </span>
        </div>
      </header>

      {/* 메인 상세 글 영역 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-8">
        {/* 뒤로가기 링크 */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-600 transition-colors"
          >
            <span>&larr;</span>
            <span>블로그 목록으로 돌아가기</span>
          </Link>
        </div>

        {/* 본문 아티클 카드 */}
        <article className="bg-white rounded-3xl p-6 sm:p-12 shadow-lg shadow-amber-900/5 border border-amber-100 space-y-8">
          {/* 포스트 헤더 */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 font-bold rounded-md bg-amber-500 text-white">
                {post.category}
              </span>
              {post.date && (
                <span className="text-slate-500 font-medium">
                  📅 작성일: {post.date}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {post.title}
            </h1>

            {post.summary && (
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                {post.summary}
              </p>
            )}
          </div>

          {/* 마크다운 본문 영역 */}
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-amber-600 hover:prose-a:text-amber-700 prose-img:rounded-2xl prose-strong:text-slate-900">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 태그 목록 */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                태그
              </span>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/blog"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center transition-all"
            >
              &larr; 블로그 목록
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs text-center transition-all shadow-md shadow-amber-200"
            >
              생활 정보 홈으로 가기 &rarr;
            </Link>
          </div>
        </article>
      </main>

      {/* 하단 푸터 */}
      <footer className="border-t border-amber-200/80 bg-white mt-12 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
