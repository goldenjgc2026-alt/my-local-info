import Link from "next/link";
import { notFound } from "next/navigation";
import localData from "../../../../public/data/local-info.json";

interface InfoItem {
  id: string;
  title: string;
  category: "행사" | "혜택";
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  fee?: string;
  inquiry?: string;
  summary: string;
  description?: string;
  link: string;
  tags: string[];
}

export function generateStaticParams() {
  return localData.items.map((item) => ({
    id: item.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = localData.items.find((i) => i.id === id) as InfoItem | undefined;

  if (!item) {
    return {
      title: "정보를 찾을 수 없습니다 - 성남시 생활 정보",
    };
  }

  return {
    title: `${item.title} - 성남시 생활 정보`,
    description: item.summary,
  };
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = localData.items.find((i) => i.id === id) as InfoItem | undefined;

  if (!item) {
    notFound();
  }

  const isEvent = item.category === "행사";

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* 상단 네비게이션 */}
      <header className="border-b border-amber-200/60 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-800 hover:text-amber-600 transition-colors font-bold text-sm sm:text-base group"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 group-hover:bg-amber-200 text-amber-900 transition-colors">
              &larr;
            </span>
            <span>전체 생활 정보 목록</span>
          </Link>

          <span
            className={`px-3 py-1 text-xs font-bold rounded-full border ${
              isEvent
                ? "bg-amber-100 text-amber-800 border-amber-300"
                : "bg-emerald-100 text-emerald-800 border-emerald-300"
            }`}
          >
            {item.category} 안내
          </span>
        </div>
      </header>

      {/* 메인 상세 정보 영역 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-8">
        {/* 상단 뒤로가기 링크 */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-600 transition-colors"
          >
            <span>&larr;</span>
            <span>홈으로 돌아가기</span>
          </Link>
        </div>

        {/* 상세 정보 카드 */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg shadow-amber-900/5 border border-amber-100 space-y-8">
          {/* 제목 및 카테고리 헤더 */}
          <div className="space-y-4 border-b border-slate-100 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 text-xs font-extrabold rounded-lg ${
                  isEvent
                    ? "bg-amber-500 text-white"
                    : "bg-emerald-600 text-white"
                }`}
              >
                {item.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                등록 기준: 성남시 공공데이터
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {item.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              {item.summary}
            </p>
          </div>

          {/* 주요 핵심 요약 정보 (기간, 장소, 대상 등) */}
          <div
            className={`rounded-2xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border ${
              isEvent
                ? "bg-amber-50/70 border-amber-200/70"
                : "bg-emerald-50/70 border-emerald-200/70"
            }`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                📅 기간 (일정)
              </span>
              <p className="text-sm sm:text-base font-semibold text-slate-800">
                {item.startDate === item.endDate
                  ? item.startDate
                  : `${item.startDate} ~ ${item.endDate}`}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                📍 {isEvent ? "행사 장소" : "신청처 / 접수 방법"}
              </span>
              <p className="text-sm sm:text-base font-semibold text-slate-800">
                {item.location}
              </p>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                👥 대상 및 자격
              </span>
              <p className="text-sm sm:text-base font-semibold text-slate-800">
                {item.target}
              </p>
            </div>

            {item.fee && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  💵 {isEvent ? "참가 비용" : "지원 규모 / 금액"}
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-800">
                  {item.fee}
                </p>
              </div>
            )}

            {item.inquiry && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  📞 문의처
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-800">
                  {item.inquiry}
                </p>
              </div>
            )}
          </div>

          {/* 상세 설명 전문 */}
          <div className="space-y-4 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>📋</span>
              <span>상세 안내 내용</span>
            </h2>

            <div className="bg-slate-50 rounded-2xl p-6 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line border border-slate-200/70">
              {item.description || item.summary}
            </div>
          </div>

          {/* 해시태그 목록 */}
          {item.tags && item.tags.length > 0 && (
            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                연관 태그
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-lg bg-amber-50 text-amber-800 font-medium border border-amber-200/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 하단 액션 버튼 영역 */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm text-center transition-all"
            >
              &larr; 목록으로 돌아가기
            </Link>

            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm text-white text-center shadow-lg transition-all ${
                isEvent
                  ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
              }`}
            >
              공식 상세 정보 확인하기 &rarr;
            </a>
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
            <p>데이터 출처: 공공데이터포털 (data.go.kr)</p>
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
