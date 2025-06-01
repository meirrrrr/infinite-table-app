import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { CreateRecordPage } from "@/components/CreateRecord";
import { DEFAULT_COLUMNS } from "@/constants/columns";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

jest.mock("@/api/records", () => ({
  createRecord: jest.fn(),
}));

jest.mock("@/stores/useUserIdStore", () => ({
  useUserIdStore: jest.fn(() => ({
    lastId: 42,
    getNextId: jest.fn(() => 43),
  })),
}));

describe("CreateRecordPage – простые тесты", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <CreateRecordPage />
      </BrowserRouter>
    );

  it("должен отобразить disabled-поле ID со значением lastId+1", () => {
    renderComponent();

    const idLabel = DEFAULT_COLUMNS.find((c) => c.key === "id")!.label;
    const idInput = screen.getByLabelText(idLabel) as HTMLInputElement;

    expect(idInput).toBeInTheDocument();
    expect(idInput.disabled).toBe(true);
    expect(idInput.value).toBe("43");
  });

  it("показывает ошибку, если нажать «Add Record» без заполнения First Name", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /add record/i }));

    await waitFor(() => {
      expect(screen.getByText(/Поле "Имя" обязательно\./i)).toBeInTheDocument();
    });
  });
});
