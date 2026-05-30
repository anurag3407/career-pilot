import { useState, useEffect } from 'react'

/**
 * A custom hook to persist and manage a user's job search queries in local storage.
 * @param {string} key - The localStorage lookup key.
 * @param {number} maxItems - Maximum historical items to store.
 */
export function useSearchHistory(key = 'job_search_history', maxItems = 6) {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Failed to parse search history from localStorage:', error)
      return []
    }
  })

  // Synchronize state back to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(history))
    } catch (error) {
      console.error('Failed to save search history to localStorage:', error)
    }
  }, [history, key])

  /**
   * Adds a new unique query string to the front of the history array.
   * If it already exists, it brings it to the top.
   */
  const addToHistory = (query) => {
    if (!query || !query.trim()) return

    setHistory((prevHistory) => {
      const cleanedQuery = query.trim()
      // Filter out any prior existence of this item to avoid duplicates
      const filtered = prevHistory.filter((item) => item.toLowerCase() !== cleanedQuery.toLowerCase())
      // Add to front and limit capacity
      return [cleanedQuery, ...filtered].slice(0, maxItems)
    })
  }

  /**
   * Removes a single specified string from the history array.
   */
  const removeFromHistory = (queryToRemove) => {
    setHistory((prevHistory) => 
      prevHistory.filter((item) => item !== queryToRemove)
    )
  }

  /**
   * Clears the entire historical record collection.
   */
  const clearHistory = () => {
    setHistory([])
  }

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory
  }
}