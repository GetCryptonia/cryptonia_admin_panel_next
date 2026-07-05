export function isUnauthorized(statusCode: number, message: string): boolean {
  if (statusCode === 401 || statusCode === 403) {
    return true;
  }

  return /invalid token|not authenticated|unauthorized|jwt expired|token expired/i.test(
    message,
  );
}
