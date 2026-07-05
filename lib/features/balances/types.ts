export type FiatBalance = {
  currency: string;
  balance: string | number;
  provider: string;
};

export type CryptoBalance = {
  symbol: string;
  balance: string | number;
  provider: string;
};

export type BalancesData = {
  fiatBalances: FiatBalance[];
  cryptoBalances: CryptoBalance[];
};
