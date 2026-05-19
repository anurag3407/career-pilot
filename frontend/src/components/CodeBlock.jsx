import React, { useState } from "react";
import { Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({
  code,
  language = "javascript",
  showLineNumbers = false,
  copyable = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden">
      {copyable && (
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="absolute top-2 right-2 z-10 bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-md transition"
        >
          {copied ? <span style={{ fontSize: "12px" }}>Copied!</span> : <Copy size={16} />}
        </button>
      )}

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={showLineNumbers}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;