import { z } from 'zod';

/**
 * Represents a Country within the system.
 */
export const CountrySchema = z.object({
  /** Unique identifier for the country (UUID string) */
  id: z.uuidv7(),

  /** Full name of the country (e.g., "Vietnam", "Japan") */
  name: z.string().min(1, "Tên quốc gia là bắt buộc"),

  /** Two-letter ISO 3166-1 alpha-2 country code (e.g., "VN", "JP") */
  countryCode: z.string().min(1, "Mã quốc gia là bắt buộc"),
});

export type Country = z.infer<typeof CountrySchema>;

/**
 * Represents a Company/Manufacturer that produces products.
 */
export const CompanySchema = z.object({
  /** Unique identifier for the company (UUID string) */
  id: z.uuidv7(),

  /** Reference to the country where the company is based (UUID string) */
  countryId: z.uuidv7(),

  /** Name of the company/manufacturer */
  name: z.string().min(1, "Tên công ty là bắt buộc"),
});

export type Company = z.infer<typeof CompanySchema>;

/**
 * Represents a product Category (e.g., Dairy, Meat & Poultry).
 * Serves as a grouping mechanism and provides default fallback indicators for spoilage.
 */
export const CategorySchema = z.object({
  /** Unique identifier for the category (UUID string) */
  id: z.uuidv7(),

  /** Name of the category */
  name: z.string().min(1, "Tên danh mục là bắt buộc"),

  /**
   * Optional fallback description of indicators that a product in this category has spoiled
   * (e.g., "Check for mold, sour odor, or curdling").
   */
  defaultSpoiledSign: z.string().optional(),
});

export type Category = z.infer<typeof CategorySchema>;
