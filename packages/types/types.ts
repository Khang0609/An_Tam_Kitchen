/**
 * Represents a Country within the system.
 */
export interface Country {
  /** Unique identifier for the country (UUID string) */
  id: string;

  /** Full name of the country (e.g., "Vietnam", "Japan") */
  name: string;

  /** Two-letter ISO 3166-1 alpha-2 country code (e.g., "VN", "JP") */
  countryCode: string;
}

/**
 * Represents a Company/Manufacturer that produces products.
 */
export interface Company {
  /** Unique identifier for the company (UUID string) */
  id: string;

  /** Reference to the country where the company is based (UUID string) */
  countryId: string;

  /** Name of the company/manufacturer */
  name: string;
}

/**
 * Represents a product Category (e.g., Dairy, Meat & Poultry).
 * Serves as a grouping mechanism and provides default fallback indicators for spoilage.
 */
export interface Category {
  /** Unique identifier for the category (UUID string) */
  id: string;

  /** Name of the category */
  name: string;

  /**
   * Optional fallback description of indicators that a product in this category has spoiled
   * (e.g., "Check for mold, sour odor, or curdling").
   */
  defaultSpoiledSign?: string;
}

/**
 * Represents the Master Data definition of a Product.
 * Contains default shelf-life parameters and warning buffer periods.
 */
export interface Product {
  /** Unique identifier for the product (UUID string) */
  id: string;

  /** Reference to the category this product belongs to (UUID string) */
  categoryId: string;

  /** Reference to the company manufacturing this product (UUID string) */
  companyId: string;

  /** Name of the product */
  name: string;

  /** Unique barcode number (EAN-13, UPC, etc.) */
  barcode: string;

  /**
   * The default shelf life duration in days for the product when unopened.
   * Typically used to calculate expiration date from manufacture/purchase date.
   */
  shelfLifeUnopenedDays: number;

  /**
   * The default shelf life duration in days for the product once opened.
   * Used to adjust the safe consumption timeline after the item is opened.
   */
  shelfLifeOpenedDays: number;

  /**
   * The duration in days from purchase/manufacture during which the product remains completely fresh.
   * Status is considered optimal within this period.
   */
  freshDays: number;

  /**
   * Safety buffer period in days before actual expiration to flag the product for early consumption
   * (e.g., warning to "use soon").
   */
  earlyConsumptionDays: number;

  /**
   * Safety buffer period in days before actual expiration to warn the user to inspect the product closely
   * (e.g., warning to "check before use").
   */
  checkBeforeUseDays: number;

  /**
   * Specific signs or indicators of spoilage for this product (e.g., separation, sour smell).
   * Set to `null` if there is no product-specific indicator, in which case the system should
   * fall back to the category's `defaultSpoiledSign`.
   */
  spoiledSign: string | null;
}

/**
 * The tracking and consumption state of a physical inventory item:
 * - `unopened`: Item is stored and has not been opened yet.
 * - `opened`: Item has been opened by the user, triggering post-opening shelf life logic.
 * - `consumed`: Item has been fully used/eaten.
 * - `wasted`: Item was discarded due to spoilage, expiration, etc.
 */
export type InventoryItemStatus = 'unopened' | 'opened' | 'consumed' | 'wasted';

/**
 * Represents a physical item currently tracked in user storage (e.g., fridge, freezer, pantry).
 */
export interface InventoryItem {
  /** Unique identifier for the specific physical item (UUID string) */
  id: string;

  /** Reference to the master product definition (UUID string) */
  productId: string;

  /**
   * The date the item was purchased.
   * Format: ISO 8601 Date (`YYYY-MM-DD`)
   */
  purchaseDate: string;

  /**
   * The date the item was manufactured (if printed on packaging).
   * Format: ISO 8601 Date (`YYYY-MM-DD`)
   */
  manufactureDate?: string;

  /**
   * The expiration date, either printed on the packaging or calculated from the shelf life.
   * Format: ISO 8601 Date (`YYYY-MM-DD`)
   */
  expirationDate: string;

  /**
   * The exact datetime when the user opened the item.
   * Format: ISO 8601 DateTime (`YYYY-MM-DDTHH:mm:ssZ`)
   */
  openedAt?: string;

  /**
   * Current consumption and tracking status of the inventory item.
   */
  status: InventoryItemStatus;
}
