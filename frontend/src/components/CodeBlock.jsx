import React from "react";
import { Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({
  code,
  language = "javascript",
  showLineNumbers = false,
  copyable = true,
}) => {

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
  };

  return (
    <div className="relative rounded-lg overflow-hidden">
      {copyable && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 z-10 bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-md transition"
        >
          <Copy size={16} />
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