/** 共享的 Markdown 标题解析 — BlogPost 和 TableOfContents 共用 */

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

/** 将标题文本转换为 slug 格式的 ID */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s\n\r]+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** 从 Markdown 内容中提取所有 h2/h3 标题 */
export function parseHeadings(content: string): HeadingItem[] {
  const lines = content.split("\n");
  const headings: HeadingItem[] = [];

  for (const line of lines) {
    if (line.startsWith("## ") && !line.startsWith("### ")) {
      const text = line.replace(/^##\s*/, "").trim();
      headings.push({
        id: slugify(text),
        text,
        level: 2,
      });
    } else if (line.startsWith("### ")) {
      const text = line.replace(/^###\s*/, "").trim();
      headings.push({
        id: slugify(text),
        text,
        level: 3,
      });
    }
  }

  return headings;
}
