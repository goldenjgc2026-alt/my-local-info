import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

export interface PostData {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  content: string;
}

/**
 * Date 객체 또는 문자열 형태의 날짜를 YYYY-MM-DD 문자열로 변환합니다.
 */
function formatDate(dateVal: unknown): string {
  if (dateVal instanceof Date) {
    const year = dateVal.getFullYear();
    const month = String(dateVal.getMonth() + 1).padStart(2, "0");
    const day = String(dateVal.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (typeof dateVal === "string") {
    // 만약 "2026-09-02T..." 형태의 ISO 문자열인 경우도 고려
    if (dateVal.includes("T")) {
      return dateVal.split("T")[0];
    }
    return dateVal.trim();
  }
  return "";
}

/**
 * src/content/posts 폴더의 모든 마크다운(.md) 파일을 파싱하여
 * 최신 날짜순으로 정렬된 블로그 목록을 반환합니다.
 */
export function getAllPosts(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      
      let data: Record<string, any> = {};
      let content = "";
      try {
        const parsed = matter(fileContents);
        data = parsed.data || {};
        content = parsed.content || "";
      } catch {
        // YAML 파싱 실패 시 정규식으로 직접 추출
        const titleMatch = fileContents.match(/^title:\s*["']?(.*?)["']?$/m);
        const summaryMatch = fileContents.match(/^summary:\s*["']?(.*?)["']?$/m);
        const dateMatch = fileContents.match(/^date:\s*(.*)$/m);
        data = {
          title: titleMatch ? titleMatch[1].trim() : slug,
          summary: summaryMatch ? summaryMatch[1].trim() : "",
          date: dateMatch ? dateMatch[1].trim() : "",
        };
      }

      const formattedDate = formatDate(data.date);

      const tags = Array.isArray(data.tags)
        ? data.tags
        : typeof data.tags === "string"
        ? data.tags.split(",").map((t: string) => t.trim())
        : [];

      return {
        slug,
        title: data.title || slug,
        date: formattedDate,
        summary: data.summary || "",
        category: data.category || "일반",
        tags,
        content,
      };
    });

  // 최신 날짜순 정렬
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * 정적 페이지 생성을 위한 모든 포스트의 slug 목록을 반환합니다.
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

/**
 * 특정 slug에 해당하는 블로그 포스트 상세 정보를 가져옵니다.
 */
export function getPostBySlug(slug: string): PostData | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    let data: Record<string, any> = {};
    let content = "";
    try {
      const parsed = matter(fileContents);
      data = parsed.data || {};
      content = parsed.content || "";
    } catch {
      const titleMatch = fileContents.match(/^title:\s*["']?(.*?)["']?$/m);
      const summaryMatch = fileContents.match(/^summary:\s*["']?(.*?)["']?$/m);
      const dateMatch = fileContents.match(/^date:\s*(.*)$/m);
      data = {
        title: titleMatch ? titleMatch[1].trim() : slug,
        summary: summaryMatch ? summaryMatch[1].trim() : "",
        date: dateMatch ? dateMatch[1].trim() : "",
      };
      content = fileContents.replace(/^---[\s\S]*?---/, "").trim();
    }

    const formattedDate = formatDate(data.date);

    const tags = Array.isArray(data.tags)
      ? data.tags
      : typeof data.tags === "string"
      ? data.tags.split(",").map((t: string) => t.trim())
      : [];

    return {
      slug,
      title: data.title || slug,
      date: formattedDate,
      summary: data.summary || "",
      category: data.category || "일반",
      tags,
      content,
    };
  } catch {
    return null;
  }
}
