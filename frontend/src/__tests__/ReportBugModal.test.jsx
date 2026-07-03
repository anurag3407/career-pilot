import { fireEvent, render, screen } from '@testing-library/react'
import ReportBugModal from '../components/ReportBugModal'

describe('ReportBugModal', () => {
  test('exposes dialog semantics and closes on Escape', () => {
    const onClose = vi.fn()

    render(<ReportBugModal isOpen onClose={onClose} invalidPath="/missing" />)

    const dialog = screen.getByRole('dialog', { name: /report broken link/i })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
