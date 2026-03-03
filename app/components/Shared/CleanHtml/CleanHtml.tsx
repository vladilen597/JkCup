"use client";

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

interface HtmlRendererProps {
  html: string;
  className?: string;
}

const CleanHtml = ({ html, className }: HtmlRendererProps) => {
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    const clean = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "ul",
        "ol",
        "li",
        "span",
        "h1",
        "h2",
        "h3",
      ],
      ALLOWED_ATTR: ["style", "class"],
    });
    setSanitizedHtml(clean);
  }, [html]);

  return (
    <div
      className={`prose-container ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default CleanHtml;
