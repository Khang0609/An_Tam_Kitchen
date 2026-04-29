import { Request, Response } from 'express';
import { IProductRepository } from '@repo/repositories';
import { CreateProductBody, UpdateProductBody } from '../validation/product.validation.js';

/**
 * ProductController
 *
 * Nhận IProductRepository qua constructor injection.
 * KHÔNG gọi Prisma trực tiếp - mọi thao tác DB đều qua Repository.
 */
export class ProductController {
  constructor(private readonly productRepo: IProductRepository) {}

  // ─── GET /products ────────────────────────────────────────────────────────

  /**
   * Lấy danh sách sản phẩm.
   * Hỗ trợ query: ?global=true để chỉ lấy sản phẩm toàn cầu,
   *               ?ownerId=<id> để lấy sản phẩm của một user cụ thể.
   */
  getAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const { global: isGlobal, ownerId } = req.query;

      let products;
      if (isGlobal === 'true') {
        products = await this.productRepo.findGlobal();
      } else if (typeof ownerId === 'string' && ownerId) {
        products = await this.productRepo.findByOwner(ownerId);
      } else {
        products = await this.productRepo.findAll();
      }

      return res.status(200).json({ data: products, count: products.length });
    } catch (error) {
      console.error('[ProductController.getAll]', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  // ─── GET /products/:id ────────────────────────────────────────────────────

  getById = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params as { id: string };
      const product = await this.productRepo.findById(id);

      if (!product) {
        return res
          .status(404)
          .json({ error: `Không tìm thấy sản phẩm với id: ${id}` });
      }

      return res.status(200).json({ data: product });
    } catch (error) {
      console.error('[ProductController.getById]', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  // ─── POST /products ───────────────────────────────────────────────────────

  create = async (req: Request, res: Response): Promise<any> => {
    try {
      // req.body đã được validate & parse bởi Zod middleware
      const body: CreateProductBody = req.body;

      // Kiểm tra barcode trùng lặp (nếu có)
      if (body.barcode) {
        const existing = await this.productRepo.findByBarcode(body.barcode);
        if (existing) {
          return res
            .status(409)
            .json({ error: `Barcode '${body.barcode}' đã tồn tại trong hệ thống` });
        }
      }

      const newProduct = await this.productRepo.create(body);
      return res.status(201).json({ data: newProduct });
    } catch (error) {
      console.error('[ProductController.create]', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  // ─── PATCH /products/:id ──────────────────────────────────────────────────

  update = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params as { id: string };
      const body: UpdateProductBody = req.body;

      // Kiểm tra sản phẩm tồn tại
      const existing = await this.productRepo.findById(id);
      if (!existing) {
        return res
          .status(404)
          .json({ error: `Không tìm thấy sản phẩm với id: ${id}` });
      }

      // Nếu cập nhật barcode, kiểm tra trùng lặp với sản phẩm khác
      if (body.barcode && body.barcode !== existing.barcode) {
        const barcodeOwner = await this.productRepo.findByBarcode(body.barcode);
        if (barcodeOwner && barcodeOwner.id !== id) {
          return res
            .status(409)
            .json({ error: `Barcode '${body.barcode}' đã được dùng bởi sản phẩm khác` });
        }
      }

      const updated = await this.productRepo.update(id, body);
      return res.status(200).json({ data: updated });
    } catch (error) {
      console.error('[ProductController.update]', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  // ─── DELETE /products/:id ─────────────────────────────────────────────────

  delete = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params as { id: string };

      const existing = await this.productRepo.findById(id);
      if (!existing) {
        return res
          .status(404)
          .json({ error: `Không tìm thấy sản phẩm với id: ${id}` });
      }

      await this.productRepo.delete(id);
      return res.status(204).send();
    } catch (error) {
      console.error('[ProductController.delete]', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
