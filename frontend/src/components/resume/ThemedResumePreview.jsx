import ReactMarkdown from 'react-markdown'
import { RESUME_THEMES } from './themes/index'

export default function ThemedResumePreview({ content, themeId }) {
  const theme = RESUME_THEMES[themeId] || RESUME_THEMES.modern

  return (
    <div style={{ fontFamily: theme.fontFamily }}
      className="resume-preview text-sm leading-snug text-foreground"
    >
      <ReactMarkdown
        components={{
          h1: ({ ...props }) => (
            <h1 className={`text-center py-2 mb-2 font-bold ${theme.nameSize}`}>
              {props.children}
            </h1>
          ),
          h2: ({ ...props }) => (
            <h2 className={`text-xs font-bold mt-3 mb-1 ${theme.headingStyle}`}>
              {props.children}
            </h2>
          ),
          h3: ({ ...props }) => (
            <h3 className="text-xs font-bold mt-1.5 mb-0.5">{props.children}</h3>
          ),
          p: ({ ...props }) => (
            <p className="text-xs mb-0.5 leading-snug">{props.children}</p>
          ),
          ul: ({ ...props }) => (
            <ul className="list-none pl-0 space-y-0 mb-1">{props.children}</ul>
          ),
          li: ({ ...props }) => (
            <li className="text-xs flex items-start gap-1 leading-snug">
              <span style={{ color: theme.accent }}>◦</span>
              <span>{props.children}</span>
            </li>
          ),
          strong: ({ ...props }) => (
            <strong className="font-bold">{props.children}</strong>
          ),
          a: ({ ...props }) => (
            <a className="hover:underline text-xs" style={{ color: theme.accent }}
              href={props.href} target="_blank" rel="noopener noreferrer">
              {props.children}
            </a>
          ),
          hr: () => null,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}