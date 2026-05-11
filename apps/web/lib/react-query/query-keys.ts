/**
 * Pillar 1: Type-Safe Query Key Factory
 *
 * Hierarchical array keys for precise cache control.
 * Usage: queryKey: inventoryKeys.detail(id)
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */

// ─── Inventory (Tủ lạnh số) ───────────────────────────

export const inventoryKeys = {
  /** ['inventory'] — matches everything inventory */
  all: ["inventory"] as const,

  /** ['inventory', 'list'] — matches all list variants */
  lists: () => [...inventoryKeys.all, "list"] as const,

  /** ['inventory', 'list', { …filters }] — one specific list */
  list: (filters: Record<string, unknown> = {}) =>
    [...inventoryKeys.lists(), filters] as const,

  /** ['inventory', 'detail'] — matches all details */
  details: () => [...inventoryKeys.all, "detail"] as const,

  /** ['inventory', 'detail', id] — one specific item */
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
} as const;

// ─── Products (Sản phẩm catalog) ──────────────────────

export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,

  list: (filters: { global?: boolean; ownerId?: string } = {}) =>
    [...productKeys.lists(), filters] as const,

  details: () => [...productKeys.all, "detail"] as const,

  detail: (id: string) => [...productKeys.details(), id] as const,
} as const;

// ─── Auth ──────────────────────────────────────────────

export const authKeys = {
  all: ["auth"] as const,

  session: () => [...authKeys.all, "session"] as const,
} as const;
