export type ApiResponse<T = unknown> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export type PaginatedMeta = {
  currentPage: number;
  totalPages: number;
};

export type PaginatedResponse<
  TItem,
  TKey extends string,
  TTotalKey extends string,
> = PaginatedMeta & Record<TKey, TItem[]> & Record<TTotalKey, number>;

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; statusCode?: number };

export type DateRangeParams = {
  startDate: string;
  endDate: string;
};

export type PageParams = {
  page?: number;
  limit?: number;
};

export type OffsetParams = {
  offset?: number;
  limit?: number;
};
