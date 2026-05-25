interface XmlCodeProps {
  value: string;
}

export function XmlCode({ value }: XmlCodeProps) {
  return <>{highlightXml(value)}</>;
}

function highlightXml(value: string) {
  return value.split(/(<[^>]+>)/g).map((part, index) => {
    if (!part) {
      return null;
    }

    if (!part.startsWith("<")) {
      return <span key={index}>{part}</span>;
    }

    return (
      <span key={index} className="xml-token-tag">
        {highlightTag(part)}
      </span>
    );
  });
}

function highlightTag(tag: string) {
  const tokens = tag.match(/\s+|<\/?|\/?>|\?>|=|"[^"]*"|'[^']*'|[^\s=<>]+/g) ?? [
    tag,
  ];
  let expectingTagName = true;

  return tokens.map((token, index) => {
    if (/^\s+$/.test(token)) {
      return token;
    }

    if (token === "<" || token === "</" || token === "<?") {
      expectingTagName = true;
      return (
        <span key={index} className="xml-token-punctuation">
          {token}
        </span>
      );
    }

    if (token === ">" || token === "/>" || token === "?>" || token === "=") {
      return (
        <span key={index} className="xml-token-punctuation">
          {token}
        </span>
      );
    }

    if (token.startsWith('"') || token.startsWith("'")) {
      return (
        <span key={index} className="xml-token-string">
          {token}
        </span>
      );
    }

    if (expectingTagName) {
      expectingTagName = false;
      return (
        <span key={index} className="xml-token-name">
          {token}
        </span>
      );
    }

    return (
      <span key={index} className="xml-token-attribute">
        {token}
      </span>
    );
  });
}
