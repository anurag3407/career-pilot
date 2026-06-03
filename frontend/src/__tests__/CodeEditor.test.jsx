import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CodeEditor from '../components/CodeEditor'
import { describe, test, expect, vi } from 'vitest'

// Mock the useTheme hook
vi.mock('../hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'dark' }),
}))

// Mock the Editor component from @monaco-editor/react
vi.mock('@monaco-editor/react', () => {
  return {
    default: ({ language, value, onChange, options }) => (
      <div data-testid="mock-monaco-editor">
        <span data-testid="editor-language">{language}</span>
        <textarea
          data-testid="editor-textarea"
          value={value || ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          readOnly={options?.readOnly}
        />
      </div>
    ),
  }
})

describe('CodeEditor Component', () => {
  test('renders the editor with correct default values and language', () => {
    const code = 'const x = 10;'
    render(
      <CodeEditor
        language="JavaScript"
        code={code}
        onChange={() => {}}
      />
    )
    
    expect(screen.getByTestId('mock-monaco-editor')).toBeInTheDocument()
    expect(screen.getByTestId('editor-language').textContent).toBe('javascript')
    expect(screen.getByTestId('editor-textarea').value).toBe(code)
  })

  test('calls onChange when content is edited', () => {
    const handleChange = vi.fn()
    render(
      <CodeEditor
        language="Python"
        code="print('hello')"
        onChange={handleChange}
      />
    )
    
    const textarea = screen.getByTestId('editor-textarea')
    fireEvent.change(textarea, { target: { value: 'print("hello world")' } })
    
    expect(handleChange).toHaveBeenCalledWith('print("hello world")')
  })

  test('maps languages correctly', () => {
    const { rerender } = render(
      <CodeEditor
        language="C++"
        code=""
        onChange={() => {}}
      />
    )
    expect(screen.getByTestId('editor-language').textContent).toBe('cpp')

    rerender(
      <CodeEditor
        language="Java"
        code=""
        onChange={() => {}}
      />
    )
    expect(screen.getByTestId('editor-language').textContent).toBe('java')
  })

  test('passes readOnly prop to editor options', () => {
    render(
      <CodeEditor
        language="javascript"
        code="console.log(1);"
        onChange={() => {}}
        readOnly={true}
      />
    )
    const textarea = screen.getByTestId('editor-textarea')
    expect(textarea).toHaveAttribute('readonly')
  })
})
