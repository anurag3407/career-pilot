import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";

import FileExplorer from "../visualizer/FileExplorer";

const {
  mockGetFileContent,
  mockExplainFile,
  mockSetChatExpanded,
  mockAddMessage,
  mockSetChatMode,
} = vi.hoisted(() => ({
  mockGetFileContent: vi.fn(),
  mockExplainFile: vi.fn(),
  mockSetChatExpanded: vi.fn(),
  mockAddMessage: vi.fn(),
  mockSetChatMode: vi.fn(),
}));

vi.mock("../../stores/useProjectVisualizerStore", () => ({
useProjectVisualizerStore: () => ({
fileGraph: {
nodes: [
{
id: "src/App.jsx",
data: { language: "javascript" },
},
{
id: "src/Other.jsx",
data: { language: "javascript" },
},
],
},
sessionId: "session-1",
setChatExpanded: mockSetChatExpanded,
addMessage: mockAddMessage,
setChatMode: mockSetChatMode,
}),
}));

vi.mock("../../services/api", () => ({
projectVisualizerApi: {
getFileContent: mockGetFileContent,
explainFile: mockExplainFile,
},
}));

vi.mock("../visualizer/CodeViewer", () => ({
default: ({ fileName, onExplain }) => ( <div> <div>{fileName}</div> <button type="button" onClick={onExplain}>Explain</button> </div>
),
}));

describe("FileExplorer", () => {
beforeEach(() => {
vi.clearAllMocks();
});

test("renders search input", () => {
render(<FileExplorer />);
expect(screen.getByPlaceholderText(/search files/i)).toBeInTheDocument();
});

test("filters files using search", async () => {
const user = userEvent.setup();


render(<FileExplorer />);

const search = screen.getByPlaceholderText(/search files/i);

await user.click(screen.getByText("src"));
await user.type(search, "App");

expect(screen.getByText("App.jsx")).toBeInTheDocument();
expect(screen.queryByText("Other.jsx")).not.toBeInTheDocument();


});

test("loads file content when file selected", async () => {
const user = userEvent.setup();


mockGetFileContent.mockResolvedValueOnce("export default App");

render(<FileExplorer />);

await user.click(screen.getByText("src"));
await user.click(screen.getByText("App.jsx"));


await waitFor(() => {
  expect(mockGetFileContent).toHaveBeenCalledWith(
    "session-1",
    "src/App.jsx"
  );
});


});

test("generates explanation when explain clicked", async () => {
const user = userEvent.setup();


mockGetFileContent.mockResolvedValueOnce("content");

mockExplainFile.mockResolvedValueOnce({
  purpose: "Test purpose",
  keyFunctions: ["Function A"],
  dependencies: "React",
});

render(<FileExplorer />);

await user.click(screen.getByText("src"));
await user.click(screen.getByText("App.jsx"));

await waitFor(() =>
  expect(mockGetFileContent).toHaveBeenCalled()
);

const explainButton = await screen.findByText("Explain");
await user.click(explainButton);

await waitFor(() =>
  expect(mockExplainFile).toHaveBeenCalled()
);

});

test("starts chat from explanation panel", async () => {
const user = userEvent.setup();


mockGetFileContent.mockResolvedValueOnce("content");

mockExplainFile.mockResolvedValueOnce({
  purpose: "Purpose",
  keyFunctions: ["Fn"],
  dependencies: "React",
});

render(<FileExplorer />);

await user.click(screen.getByText("src"));
await user.click(screen.getByText("App.jsx"));

await waitFor(() =>
  expect(mockGetFileContent).toHaveBeenCalled()
);

const explainButton = await screen.findByText("Explain");
await user.click(explainButton);

await waitFor(() =>
  expect(mockExplainFile).toHaveBeenCalled()
);

await waitFor(() =>
  screen.getByText(/chat about this file/i)
);

await user.click(
  screen.getByText(/chat about this file/i)
);

expect(mockSetChatExpanded).toHaveBeenCalled();
expect(mockSetChatMode).toHaveBeenCalledWith("qa");
expect(mockAddMessage).toHaveBeenCalled();


});
});
