export default function KeyboardShortcut({ keys = [] }) {
  const isMac =
    typeof window !== 'undefined' &&
    /Mac|iPhone|iPad/.test(navigator.platform)

  return (
    <div className="hidden md:flex items-center gap-1">
      {keys.map((key, index) => {
        let displayKey = key

        if (key === 'Ctrl') {
          displayKey = isMac ? '⌘' : 'Ctrl'
        }

        return (
          <kbd
            key={index}
            className="px-2 py-1 text-xs font-medium rounded bg-gray-800 text-gray-200 border border-gray-700"
          >
            {displayKey}
          </kbd>
        )
      })}
    </div>
  )
}
