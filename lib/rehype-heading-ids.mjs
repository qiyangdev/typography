function isElement(node) {
  return node.type === "element";
}

function textContent(node) {
  if (node.type === "text") {
    return node.value;
  }

  if (isElement(node) && node.children) {
    return node.children.map(textContent).join("");
  }

  return "";
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueSlug(value, counts) {
  const base = slugify(value) || "section";
  const count = counts.get(base) ?? 0;
  counts.set(base, count + 1);

  return count === 0 ? base : `${base}-${count + 1}`;
}

function addHeadingIds(node, counts) {
  if (!("children" in node) || !Array.isArray(node.children)) {
    return;
  }

  for (const child of node.children) {
    if (
      isElement(child) &&
      (child.tagName === "h2" || child.tagName === "h3") &&
      !child.properties?.id
    ) {
      child.properties = {
        ...child.properties,
        id: uniqueSlug(textContent(child), counts),
      };
    }

    addHeadingIds(child, counts);
  }
}

export default function rehypeHeadingIds() {
  return (tree) => {
    addHeadingIds(tree, new Map());
  };
}
