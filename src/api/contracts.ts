import type { Asset, PortfolioSnapshot, PricePoint } from "./types";
import * as assetsApi from "./mock/assets";
import * as portfolioApi from "./mock/portfolio";
import * as pricesApi from "./mock/prices";

export namespace Api {
  export interface GetAssets {
    method: "GET";
    path: "/assets";
    query: {};
    response: Asset[];
  }

  export interface GetPrices {
    method: "GET";
    path: "/prices";
    query: {
      assets: string;
      asOf?: string;
      from?: string;
      to?: string;
    };
    response: PricePoint[];
  }

  export interface GetPortfolios {
    method: "GET";
    path: "/portfolios";
    query: {
      asOf?: string;
    };
    response: PortfolioSnapshot;
  }
}

type Endpoint = Api.GetAssets | Api.GetPrices | Api.GetPortfolios;
type Paths = Endpoint["path"];
type EndpointForPath<P extends Paths> = Extract<Endpoint, { path: P }>;

export async function request<P extends Paths>(
  path: P,
  options: { query: EndpointForPath<P>["query"] }
): Promise<EndpointForPath<P>["response"]> {
  switch (path) {
    case "/assets": {
      return assetsApi.getAssets() as Promise<EndpointForPath<P>["response"]>;
    }
    case "/portfolios": {
      const q = options.query as Api.GetPortfolios["query"];
      return portfolioApi.getPortfolio(q) as Promise<
        EndpointForPath<P>["response"]
      >;
    }
    case "/prices": {
      const q = options.query as Api.GetPrices["query"];
      return pricesApi.getPrices(q) as Promise<EndpointForPath<P>["response"]>;
    }
    default:
      throw new Error(`Unknown path: ${path}`);
  }
}
