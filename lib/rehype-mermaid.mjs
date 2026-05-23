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

function hasMermaidClass(node) {
  const className = node.properties?.className;

  if (Array.isArray(className)) {
    return className.some(
      (value) => value === "language-mermaid" || value === "mermaid",
    );
  }

  return typeof className === "string"
    ? className.split(/\s+/).some((value) => value === "language-mermaid")
    : false;
}

function getMetaString(node) {
  const meta =
    node.properties?.metastring ??
    node.properties?.meta ??
    node.properties?.dataMeta ??
    node.data?.meta;

  return typeof meta === "string" ? meta : "";
}

function getTitleFromMeta(meta) {
  const match = meta.match(
    /(?:^|\s)title=(?:"([^"]*)"|'([^']*)'|([^\s"']+))/,
  );

  return match?.[1] ?? match?.[2] ?? match?.[3];
}

function toMermaidChartNode(source, title) {
  const properties = {
    className: ["mermaid-chart"],
    "data-mermaid-source": source,
    role: "img",
    "aria-label": title ?? "Mermaid diagram",
  };

  return {
    type: "element",
    tagName: "div",
    properties,
    children: [
      {
        type: "text",
        value: source,
      },
    ],
  };
}

function toMermaidNode(source, title) {
  const chart = toMermaidChartNode(source, title);

  if (!title) {
    return chart;
  }

  return {
    type: "element",
    tagName: "figure",
    properties: {
      className: ["mermaid-figure"],
    },
    children: [
      chart,
      {
        type: "element",
        tagName: "figcaption",
        properties: {
          className: ["mermaid-caption"],
        },
        children: [
          {
            type: "text",
            value: title,
          },
        ],
      },
    ],
  };
}

function transformMermaidBlocks(node) {
  if (!("children" in node) || !Array.isArray(node.children)) {
    return;
  }

  node.children = node.children.map((child) => {
    if (isElement(child) && child.tagName === "pre") {
      const [code] = child.children ?? [];

      if (code && isElement(code) && hasMermaidClass(code)) {
        const title = getTitleFromMeta(getMetaString(code));
        return toMermaidNode(textContent(code).trim(), title);
      }
    }

    transformMermaidBlocks(child);
    return child;
  });
}

export default function rehypeMermaid() {
  return (tree) => {
    transformMermaidBlocks(tree);
  };
}
