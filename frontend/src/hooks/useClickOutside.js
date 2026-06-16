import { useEffect } from 'react'

/**
 * Custom hook that triggers a callback when clicking outside of a referenced element
 * @param {React.RefObject} ref - React ref object pointing to the element to monitor
 * @param {Function} callback - Function to call when clicking outside
 */
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    // Add event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    // Cleanup event listeners when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [ref, callback])
}

export default useClickOutside
