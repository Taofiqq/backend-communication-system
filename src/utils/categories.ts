export const categories = {
  BALANCE_INQUIRY: "balance_inquiry",
  TRANSACTION_HISTORY: "transaction_history",
  GENERAL_SUPPORT: "general_support",
};

export const categorizeUserIntent = (query: string): string => {
  if (query.includes("balance")) {
    return categories.BALANCE_INQUIRY;
  }
  if (query.includes("transactions") || query.includes("history")) {
    return categories.TRANSACTION_HISTORY;
  }
  return categories.GENERAL_SUPPORT;
};
