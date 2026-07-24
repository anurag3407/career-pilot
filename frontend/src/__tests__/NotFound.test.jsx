import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound';

const setSearchParams = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/missing', search: '?q=abc' }),
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams(), setSearchParams],
  };
});

vi.mock('../components/SearchInput', () => ({
  default: ({ value, onChange }) => <input value={value} onChange={(event) => onChange(event.target.value)} />,
}));

vi.mock('../components/ReportBugModal', () => ({
  default: () => null,
}));

describe('NotFound page', () => {
  beforeEach(() => {
    setSearchParams.mockClear();
  });

  test('syncs the search query without adding a history entry', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(setSearchParams).toHaveBeenCalledWith({ q: '/missing?q=abc' }, { replace: true });
  });
});
