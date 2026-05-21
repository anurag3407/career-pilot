import { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-bash";

export default function CodeBlock({
    code = "",
    language = "javascript",
    copyable = true,
}) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // safer + scoped highlight
        Prism.highlightAll();
    }, [code, language]);

    const handleCopy = async () => {
        try {
            if (!navigator.clipboard) {
                console.warn("Clipboard not supported");
                return;
            }

            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    };

    return (
        <div className="relative rounded-2xl overflow-hidden border border-border bg-[#0d1117] shadow-lg">

            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-border">
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                    {language}
                </span>

                {copyable && (
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="text-xs px-3 py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition"
                    >
                        {copied ? "Copied!" : "Copy"}
                    </button>
                )}
            </div>

            {/* Code */}
            <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className={`language-${language}`}>
                    {code}
                </code>
            </pre>
        </div>
    );
}