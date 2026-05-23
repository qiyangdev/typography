const cjkBeforeSoftBreak =
  /([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}])\r?\n[ \t]*(?=[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}])/gu;

export default function remarkCjkSoftBreaks() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === "text" && typeof node.value === "string") {
        node.value = node.value.replace(cjkBeforeSoftBreak, "$1");
      }
    });
  };
}

function visit(node, visitor) {
  visitor(node);

  if (!Array.isArray(node.children)) {
    return;
  }

  for (const child of node.children) {
    visit(child, visitor);
  }
}
