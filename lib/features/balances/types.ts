export type FiatBalance = {
  currency: string;
  balance: number;
  provider: string;
};

export type CryptoBalance = {
  symbol: string;
  balance: number;
  provider: string;
};

export type BalancesData = {
  fiatBalances: FiatBalance[];
  cryptoBalances: CryptoBalance[];
};
