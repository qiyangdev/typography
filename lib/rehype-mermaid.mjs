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

function toMermaidNode(source) {
  return {
    type: "element",
    tagName: "div",
    properties: {
      className: ["mermaid-chart"],
      "data-mermaid-source": source,
      role: "img",
      "aria-label": "Mermaid diagram",
    },
    children: [
      {
        type: "text",
        value: source,
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
        return toMermaidNode(textContent(code).trim());
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
