import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { usePortfolioData } from "../hooks/usePortfolioData";
import { useHistoricalData } from "../hooks/useHistoricalData";
import { PortfolioDashboard } from "./PortfolioDashboard";

jest.mock("../hooks/usePortfolioData");
jest.mock("../hooks/useHistoricalData");

type PortfolioResult = ReturnType<typeof usePortfolioData>;
type HistoricalResult = ReturnType<typeof useHistoricalData>;

const mockUsePortfolioData = usePortfolioData as jest.MockedFunction<
  typeof usePortfolioData
>;
const mockUseHistoricalData = useHistoricalData as jest.MockedFunction<
  typeof useHistoricalData
>;

function setupHappyPath() {
  const portfolioSuccess: PortfolioResult = {
    assets: [
      { symbol: "USD", name: "US Dollar", class: "cash" },
      { symbol: "AAPL", name: "Apple Inc.", class: "stock" },
    ],
    snapshot: {
      asOf: "2023-01-01",
      positions: [
        { asset: "USD", quantity: 1000 },
        { asset: "AAPL", quantity: 2 },
      ],
    },
    prices: [
      { asset: "USD", asOf: "2023-01-01", priceUsd: 1 },
      { asset: "AAPL", asOf: "2023-01-01", priceUsd: 10 },
    ],
    isLoading: false,
    isError: false,
  };

  const historicalSuccess = {
    data: [
      { date: "2022-12-31", valueUsd: 1016 },
      { date: "2023-01-01", valueUsd: 1020 },
    ],
    isLoading: false,
    isError: false,
    error: null,
    status: "success",
  } as HistoricalResult;

  mockUsePortfolioData.mockReturnValue(portfolioSuccess);
  mockUseHistoricalData.mockReturnValue(historicalSuccess);
}

describe("PortfolioDashboard", () => {
  it("renders main dashboard sections", () => {
    setupHappyPath();

    render(<PortfolioDashboard />);

    expect(
      screen.getByRole("heading", { name: /portfolio balance/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /positions/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /historical portfolio value/i })
    ).toBeInTheDocument();
  });

  it("allows toggling donut view mode", () => {
    setupHappyPath();

    render(<PortfolioDashboard />);

    const byAsset = screen.getByRole("button", { name: /by asset/i });
    const byClass = screen.getByRole("button", { name: /by class/i });

    expect(byAsset).toHaveClass("bg-(--color-primary)");

    fireEvent.click(byClass);

    expect(byClass).toHaveClass("bg-(--color-primary)");
  });

  it("shows portfolio error message when load fails", () => {
    const portfolioError: PortfolioResult = {
      assets: undefined,
      snapshot: undefined,
      prices: undefined,
      isLoading: false,
      isError: true,
    };

    const historicalError = {
      data: undefined,
      isLoading: false,
      isError: true,
    } as HistoricalResult;

    mockUsePortfolioData.mockReturnValue(portfolioError);
    mockUseHistoricalData.mockReturnValue(historicalError);

    render(<PortfolioDashboard />);

    expect(
      screen.getByText(/failed to load portfolio data/i)
    ).toBeInTheDocument();
  });
});
