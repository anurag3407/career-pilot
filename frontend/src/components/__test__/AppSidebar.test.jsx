import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppSidebar from "../AppSidebar";

const mockNavigate = jest.fn();
const mockLogout = jest.fn();
const mockToggleTheme = jest.fn();
const mockSetOpen = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    pathname: "/dashboard",
  }),
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      displayName: "John Doe",
      email: "john@example.com",
    },
    logout: mockLogout,
  }),
}));

jest.mock("../../hooks/useTheme", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: mockToggleTheme,
  }),
}));

jest.mock("../../hooks/useSidebar", () => ({
  useSidebar: () => ({
    open: true,
    animate: false,
    setOpen: mockSetOpen,
  }),
}));

jest.mock("../settings/AIProviderIndicator", () => ({
  __esModule: true,
  default: () => <div>AI Provider Indicator</div>,
}));

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, initial, animate, exit, transition, ...props }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

jest.mock("../ui/Sidebar", () => ({
  Sidebar: ({ children }) => <div>{children}</div>,

  SidebarBody: ({ children }) => (
    <div data-testid="sidebar-body">{children}</div>
  ),

  SidebarDivider: () => <hr />,

  SidebarLink: ({ link, onClick }) => (
    <button onClick={onClick}>{link.label}</button>
  ),
}));

describe("AppSidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders primary navigation links", () => {
    render(<AppSidebar />);

    expect(
      screen.getByRole("button", { name: /dashboard/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /resume builder/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /job finder/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /settings/i })
    ).toBeInTheDocument();
  });

  test("renders authenticated user information", () => {
    render(<AppSidebar />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  test("calls toggleTheme when theme button is clicked", async () => {
    const user = userEvent.setup();

    render(<AppSidebar />);

    const themeButton = screen.getByRole("button", {
      name: /dark mode/i,
    });

    await user.click(themeButton);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  test("calls logout when logout button is clicked", async () => {
    const user = userEvent.setup();

    mockLogout.mockResolvedValueOnce();

    render(<AppSidebar />);

    const logoutButton = screen.getByRole("button", {
      name: /logout/i,
    });

    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  test("expands AI tools section when clicked", async () => {
    const user = userEvent.setup();

    render(<AppSidebar />);

    const aiToolsButton = screen.getByRole("button", {
      name: /ai tools/i,
    });

    await user.click(aiToolsButton);

    expect(
      screen.getByRole("button", {
        name: /skill gap analyzer/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /career trajectory/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /salary estimator/i,
      })
    ).toBeInTheDocument();
  });

  test("renders AI provider indicator", () => {
    render(<AppSidebar />);

    expect(
      screen.getByText(/ai provider indicator/i)
    ).toBeInTheDocument();
  });
});