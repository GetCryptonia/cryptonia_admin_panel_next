import type { BalancesData, CryptoBalance, FiatBalance } from "./types";

export type FiatCurrencyCode = "NGN" | "USD" | "GBP" | "EUR";
export type StablecoinFilter = "all" | "usdt" | "usdc";

export const FIAT_CURRENCY_CODES: FiatCurrencyCode[] = [
  "NGN",
  "USD",
  "GBP",
  "EUR",
];

const FIAT_SYMBOLS: Record<FiatCurrencyCode, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

const FIAT_FLAG_PATHS: Record<FiatCurrencyCode, string> = {
  NGN: "/flags/ng.png",
  USD: "/flags/us.png",
  GBP: "/flags/uk.png",
  EUR: "/flags/eu.png",
};

const FIAT_FLAG_BACKGROUNDS: Record<FiatCurrencyCode, string> = {
  NGN: "#E8F5EC",
  USD: "#ECEEF6",
  GBP: "#F1EEF6",
  EUR: "#E9EFF6",
};

const NETWORK_DISPLAY_NAMES: Record<string, string> = {
  BNB: "BEP",
  ERC20: "ETH",
  TRX: "TRX",
  SOL: "SOL",
  ARB: "ARB",
  BASE: "BASE",
  POL: "POL",
  CELO: "CELO",
  LISK: "LISK",
};

const NETWORK_ASSET_SUFFIXES: Record<string, string> = {
  BNB: "bnb",
  ERC20: "erc",
  TRX: "trc",
  SOL: "sol",
  ARB: "arbitrium",
  BASE: "base",
  POL: "polygon",
  CELO: "celo",
  LISK: "lisk",
};

const TOKEN_ORDER = ["USDT", "USDC"];
const NETWORK_ORDER = [
  "BNB",
  "ERC20",
  "SOL",
  "TRX",
  "ARB",
  "BASE",
  "POL",
  "CELO",
  "LISK",
];

export type ParsedCryptoBalance = CryptoBalance & {
  token: string;
  network: string;
  displayNetwork: string;
  numericBalance: number;
};

export function parseBalanceValue(balance: string | number): number {
  const value = typeof balance === "number" ? balance : Number.parseFloat(balance);
  return Number.isFinite(value) ? value : 0;
}

export function formatFiatBalance(
  amount: number,
  currency: FiatCurrencyCode,
): string {
  const symbol = FIAT_SYMBOLS[currency];

  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatStablecoinAmount(amount: number): string {
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getFiatFlagPath(currency: FiatCurrencyCode): string {
  return FIAT_FLAG_PATHS[currency];
}

export function getFiatFlagBackground(currency: FiatCurrencyCode): string {
  return FIAT_FLAG_BACKGROUNDS[currency];
}

export function getFiatBalanceLabel(currency: FiatCurrencyCode): string {
  return `${currency} Balance`;
}

export function getCryptoTokenAssetPath(token: string, network: string): string {
  const suffix =
    NETWORK_ASSET_SUFFIXES[network.toUpperCase()] ?? network.toLowerCase();

  return `/tokens/${token.toLowerCase()}-${suffix}.png`;
}

export function mapFiatBalances(
  fiatBalances: FiatBalance[] | undefined,
): Record<FiatCurrencyCode, FiatBalance | null> {
  const mapped = Object.fromEntries(
    FIAT_CURRENCY_CODES.map((currency) => [currency, null]),
  ) as Record<FiatCurrencyCode, FiatBalance | null>;

  for (const balance of fiatBalances ?? []) {
    const currency = balance.currency.toUpperCase();

    if (currency in mapped) {
      mapped[currency as FiatCurrencyCode] = balance;
    }
  }

  return mapped;
}

export function parseCryptoSymbol(symbol: string): {
  token: string;
  network: string;
} {
  const match = symbol.match(/^([A-Z0-9]+)\(([^)]+)\)$/i);

  if (!match) {
    return { token: symbol.toUpperCase(), network: "UNKNOWN" };
  }

  return {
    token: match[1].toUpperCase(),
    network: match[2].toUpperCase(),
  };
}

export function getNetworkDisplayName(network: string): string {
  return NETWORK_DISPLAY_NAMES[network] ?? network;
}

export function parseCryptoBalances(
  cryptoBalances: CryptoBalance[] | undefined,
): ParsedCryptoBalance[] {
  return (cryptoBalances ?? []).map((balance) => {
    const { token, network } = parseCryptoSymbol(balance.symbol);

    return {
      ...balance,
      token,
      network,
      displayNetwork: getNetworkDisplayName(network),
      numericBalance: parseBalanceValue(balance.balance),
    };
  });
}

export function getStablecoinTotal(
  cryptoBalances: CryptoBalance[] | undefined,
): number {
  return parseCryptoBalances(cryptoBalances).reduce(
    (sum, balance) => sum + balance.numericBalance,
    0,
  );
}

export function filterCryptoBalances(
  cryptoBalances: ParsedCryptoBalance[],
  filter: StablecoinFilter,
): ParsedCryptoBalance[] {
  if (filter === "all") {
    return cryptoBalances;
  }

  const token = filter === "usdt" ? "USDT" : "USDC";
  return cryptoBalances.filter((balance) => balance.token === token);
}

function getSortIndex(values: string[], value: string): number {
  const index = values.indexOf(value);
  return index === -1 ? values.length : index;
}

export function sortCryptoBalances(
  cryptoBalances: ParsedCryptoBalance[],
): ParsedCryptoBalance[] {
  return [...cryptoBalances].sort((left, right) => {
    const tokenDiff =
      getSortIndex(TOKEN_ORDER, left.token) -
      getSortIndex(TOKEN_ORDER, right.token);

    if (tokenDiff !== 0) {
      return tokenDiff;
    }

    return (
      getSortIndex(NETWORK_ORDER, left.network) -
      getSortIndex(NETWORK_ORDER, right.network)
    );
  });
}

export function getBalanceViewModel(data: BalancesData | null) {
  const parsedCryptoBalances = sortCryptoBalances(
    parseCryptoBalances(data?.cryptoBalances),
  );

  return {
    fiatBalances: mapFiatBalances(data?.fiatBalances),
    cryptoBalances: parsedCryptoBalances,
    stablecoinTotal: getStablecoinTotal(data?.cryptoBalances),
  };
}
