import React from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../hooks/useTheme';

/**
 * Reusable CodeEditor component powered by Monaco Editor.
 * 
 * Props:
 * - language (string): The language for syntax highlighting (e.g. JavaScript, Python, Java, C++).
 * - code (string): The current value of the editor code.
 * - onChange (function): Callback triggered when the code changes, receives the new value.
 * - readOnly (boolean): Set to true to disable editing.
 */
const CodeEditor = ({
  language,
  code,
  onChange,
  readOnly = false
}) => {
  const { theme } = useTheme();

  // Helper to map supported languages to standard Monaco identifiers
  const getMonacoLanguage = (lang) => {
    if (!lang) return 'javascript';
    const lower = lang.toLowerCase().trim();
    switch (lower) {
      case 'c++':
      case 'cpp':
        return 'cpp';
      case 'js':
      case 'javascript':
        return 'javascript';
      case 'py':
      case 'python':
        return 'python';
      case 'java':
        return 'java';
      default:
        return lower;
    }
  };

  const handleEditorChange = (value) => {
    if (onChange) {
      onChange(value || '');
    }
  };

  const editorTheme = theme === 'dark' ? 'vs-dark' : 'light';

  return (
    <div className="w-full h-full min-h-[300px] border border-border rounded-md overflow-hidden bg-card text-card-foreground">
      <Editor
        height="100%"
        width="100%"
        language={getMonacoLanguage(language)}
        value={code}
        onChange={handleEditorChange}
        theme={editorTheme}
        options={{
          readOnly,
          minimap: { enabled: false },
          lineNumbers: 'on',
          folding: true,
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          formatOnPaste: true,
          formatOnType: true,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
