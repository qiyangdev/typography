type FrontmatterValue = string | boolean | string[];

export interface ParsedContent {
  data: Record<string, FrontmatterValue>;
  body: string;
}

export function parseContentFile(source: string): ParsedContent {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, body: source };
  }

  return {
    data: parseFrontmatter(match[1]),
    body: match[2].trim(),
  };
}

export function stripMarkup(source: string) {
  return source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/^\[\^[^\]]+\]:[^\n]*(?:\n[ \t]+[^\n]*)*/gm, " ")
    .replace(/\[\^[^\]]+\]/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/^[#>*+\-\d.\s|:]+/gm, " ")
    .replace(/[*_~{}[\]()`|\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseFrontmatter(source: string) {
  const data: Record<string, FrontmatterValue> = {};

  for (const line of source.split("\n")) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) {
      continue;
    }
    data[match[1]] = parseValue(match[2]);
  }

  return data;
}

function parseValue(value: string): FrontmatterValue {
  const trimmed = value.trim();

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => stripQuotes(item.trim()))
      .filter(Boolean);
  }

  return stripQuotes(trimmed);
}

function stripQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
