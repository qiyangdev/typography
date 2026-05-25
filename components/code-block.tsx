import {
  isValidElement,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { CopyButton } from "@/components/copy-button";
import { translate } from "@/lib/i18n";

type CodeBlockProps = ComponentPropsWithoutRef<"pre">;

const codeBlockStyle: CSSProperties = {
  position: "relative",
  marginTop: 24,
  marginBottom: 24,
};

const codeBlockCopyButtonStyle: CSSProperties = {
  position: "absolute",
  top: 8,
  right: 8,
  zIndex: 1,
  padding: "2px 8px",
  fontSize: 12,
  lineHeight: "20px",
  textShadow: "none",
};

const codeBlockPreStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: 0,
  paddingRight: 78,
};

export function CodeBlock({ children, ...props }: CodeBlockProps) {
  const code = extractText(children).replace(/\n$/, "");

  return (
    <div className="code-block" style={codeBlockStyle}>
      <CopyButton
        className="code-block-copy-button"
        style={codeBlockCopyButtonStyle}
        value={code}
        labels={{
          copy: translate("copy"),
          copied: translate("copied"),
        }}
      />
      <pre {...props} style={{ ...props.style, ...codeBlockPreStyle }}>
        {children}
      </pre>
    </div>
  );
}

function extractText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }

  return "";
}
