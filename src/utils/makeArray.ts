export const makeArray = (field: unknown): unknown[] =>
  field && Array.isArray(field) ? field : [field].filter(Boolean);
