import Link from "next/link";
import localData from "../../public/data/local-info.json";

interface InfoItem {
  id: string | number;
  title?: string;
  name?: string;
  category: "행사" | "혜택";
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
  tags?: string[];
}

export default function HomePage() {
  const events = localData.items.filter(
    (item) => item.category === "행사"
  ) as InfoItem[];
  const benefits = localData.items.filter(
    (item) => item.category === "혜택"
  ) as InfoItem[];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* 상단 네비게이션 & 헤더 */}
      <header className="border-b border-amber-200/60 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white text-xl shadow-md shadow-amber-200 group-hover:scale-105 transition-transform">
              🏡
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  성남시 생활 정보
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                  성남시 소식
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                우리 동네 축제·행사 일정과 정부·지자체 지원금 알리미
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1.5 text-sm font-semibold">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-sm shadow-amber-200"
              >
                생활 정보
              </Link>
              <Link
                href="/blog"
                className="px-3 py-1.5 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 text-xs font-semibold transition-colors"
              >
                블로그
              </Link>
            </nav>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>데이터 갱신 ({localData.lastUpdated})</span>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full space-y-12">
        {/* 히어로 배너 */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white p-6 sm:p-10 shadow-xl shadow-amber-900/10">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-block px-3 py-1 text-xs font-bold bg-white/20 backdrop-blur-md rounded-full border border-white/30 tracking-wide uppercase">
              ✨ 성남시민 생활 나침반
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              놓치면 아쉬운 <br className="hidden sm:inline" />
              <span className="text-amber-100 underline decoration-amber-300 decoration-wavy decoration-2">
                이달의 행사 & 맞춤 혜택
              </span>
              을 확인하세요!
            </h2>
            <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
              공공데이터포털을 통해 매일 엄선된 성남시 축제 일정과 놓치기 쉬운
              청년·가족 지원금 정보를 정리해 드립니다.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </section>

        {/* 1. 이번 달 행사/축제 섹션 */}
        <section id="events" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-amber-200/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎉</span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  이번 달 행사 & 축제
                </h3>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                가족, 친구, 연인과 함께 즐길 수 있는 성남시 주요 문화 행사입니다.
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full self-start sm:self-auto">
              총 {events.length}개의 행사
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => {
              const eventTitle = event.title || event.name || "행사 안내";
              return (
                <article
                  key={String(event.id)}
                  className="group flex flex-col justify-between bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-amber-100 hover:border-amber-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded-lg">
                        {event.category}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        📅 {event.startDate === event.endDate ? event.startDate : `${event.startDate} ~ ${event.endDate}`}
                      </span>
                    </div>

                    <Link href={`/info/${event.id}`} className="block">
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
                        {eventTitle}
                      </h4>
                    </Link>

                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {event.summary}
                    </p>

                    <div className="pt-2 space-y-1.5 text-xs text-slate-500 border-t border-slate-100">
                      <div className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-semibold shrink-0">📍 장소:</span>
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-semibold shrink-0">👥 대상:</span>
                        <span className="line-clamp-1">{event.target}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 flex items-center justify-between border-t border-slate-100">
                    <div className="flex flex-wrap gap-1">
                      {(event.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/info/${event.id}`}
                      className="inline-flex items-center text-xs font-bold text-amber-700 hover:text-amber-900 hover:underline shrink-0 ml-2"
                    >
                      자세히 보기 &rarr;
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 2. 지원금 / 혜택 정보 섹션 */}
        <section id="benefits" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-amber-200/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  지원금 & 생활 혜택
                </h3>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                성남시민과 청년, 가정을 위한 맞춤 복지 및 보조금 지원 정보입니다.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full self-start sm:self-auto">
              총 {benefits.length}개의 혜택
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit) => {
              const benefitTitle = benefit.title || benefit.name || "혜택 안내";
              return (
                <article
                  key={String(benefit.id)}
                  className="group flex flex-col justify-between bg-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-emerald-100 hover:border-emerald-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-lg">
                        {benefit.category}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        신청 기간: {benefit.startDate} ~ {benefit.endDate}
                      </span>
                    </div>

                    <Link href={`/info/${benefit.id}`} className="block">
                      <h4 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {benefitTitle}
                      </h4>
                    </Link>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {benefit.summary}
                    </p>

                    <div className="rounded-xl bg-emerald-50/70 p-3.5 space-y-2 text-xs border border-emerald-200/60">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-emerald-900 shrink-0">📌 신청 대상:</span>
                        <span className="text-slate-700 leading-tight">{benefit.target}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-emerald-900 shrink-0">🏢 신청 방법:</span>
                        <span className="text-slate-700 leading-tight">{benefit.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 flex items-center justify-between border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5">
                      {(benefit.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200/50"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/info/${benefit.id}`}
                      className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline shrink-0 ml-2"
                    >
                      자세히 보기 &rarr;
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* 안내 배너 */}
        <section className="bg-amber-100/70 rounded-2xl p-5 sm:p-6 border border-amber-300/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-bold text-amber-950">
              💡 지원금 및 행사 정보는 매일 아침 업데이트됩니다
            </h4>
            <p className="text-xs text-amber-800">
              새로운 지자체 공고와 축제 소식을 빠르게 전달해 드려요. 북마크해두고 자주 확인해 보세요!
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors shrink-0"
          >
            즐겨찾기 추가
          </button>
        </section>
      </main>

      {/* 하단 푸터 */}
      <footer className="border-t border-amber-200/80 bg-white mt-12 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-semibold text-slate-700">
              우리 동네 생활 정보 (성남시)
            </p>
            <p>
              데이터 출처:{" "}
              <span className="font-medium text-slate-700">
                {localData.source}
              </span>
            </p>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <p>
              마지막 업데이트 날짜:{" "}
              <span className="font-semibold text-slate-800">
                {localData.lastUpdated}
              </span>
            </p>
            <p className="text-[11px] text-slate-400">
              © 2026 우리 동네 생활 정보. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
