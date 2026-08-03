import { render } from '@testing-library/react'
import TrainJourney from '../components/portfolio/templates/Train_Journey'

// Mock IntersectionObserver which is not implemented in jsdom
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('TrainJourney component', () => {
  test('renders successfully', () => {
    const { container } = render(<TrainJourney />)
    expect(container).toBeInTheDocument()
  })
})
