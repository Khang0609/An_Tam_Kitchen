import { Request, Response } from 'express';
import { IInventoryRepository, IProductRepository } from '@repo/repositories';
import { CreateInventoryItemBody, UpdateInventoryItemBody } from '@/validation/inventory.validation';
import { FoodCategory } from '@repo/types';

/**
 * InventoryController
 * 
 * Quản lý kho thực phẩm của người dùng.
 * Mọi DB operation đều đi qua IInventoryRepository.
 */
export class InventoryController {
  constructor(
    private readonly inventoryRepo: IInventoryRepository,
    private readonly productRepo: IProductRepository
  ) {}

  // ─── POST /inventory ──────────────────────────────────────────────────────
  
  /**
   * Tạo mới một vật phẩm trong kho.
   * Hỗ trợ tạo Product "on-the-fly" nếu chỉ gửi name/category.
   */
  create = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = (req as any).userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Thiếu thông tin người dùng' });
      }

      const body: CreateInventoryItemBody & { name?: string; category?: string } = req.body;
      let productId = body.productId;

      // Logic "Smart Create": Nếu không có productId, tạo Product mới
      if (!productId && body.name && body.category) {
        const newProduct = await this.productRepo.create({
          name: body.name,
          category: body.category as FoodCategory, // Đổi từ FoodCategory về category
          company: 'Unknown',
          daysBeforeOpen: 30,
          daysAfterOpen: 7,
          isGlobal: false,
          ownerId: userId,
        });
        productId = newProduct.id;
      }

      if (!productId) {
        return res.status(400).json({ error: 'Không thể xác định Product ID' });
      }

      // Đảm bảo expiryDate là Date (mặc định +1 năm nếu không có)
      const expiryDate = body.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

      const newItem = await this.inventoryRepo.create({
        userId,
        productId,
        displayName: body.displayName || body.name || 'Sản phẩm mới',
        openedAt: body.openedAt,
        expiryDate,
        location: body.location || 'fridge',
        status: body.status || 'fresh',
        notes: body.notes,
        quantity: body.quantity,
      });

      return res.status(201).json({ data: newItem });
    } catch (error) {
      console.error('[InventoryController.create]', error);
      return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
  };

  // ─── GET /inventory ───────────────────────────────────────────────────────
  
  /**
   * Liệt kê tất cả vật phẩm trong kho của người dùng hiện tại.
   */
  getAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = (req as any).userId;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Thiếu thông tin người dùng' });
      }

      const items = await this.inventoryRepo.findAllByUserId(userId);
      return res.status(200).json({ data: items, count: items.length });
    } catch (error) {
      console.error('[InventoryController.getAll]', error);
      return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
  };

  // ─── PATCH /inventory/:id ─────────────────────────────────────────────────
  
  /**
   * Cập nhật số lượng, trạng thái, hoặc ngày mở nắp của vật phẩm.
   */
  update = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params as { id: string };
      const body: UpdateInventoryItemBody = req.body;
      const userId = (req as any).userId;

      const existing = await this.inventoryRepo.findById(id);
      if (!existing) {
        return res.status(404).json({ error: `Không tìm thấy vật phẩm với id: ${id}` });
      }

      // Đảm bảo người dùng chỉ có thể cập nhật vật phẩm của chính họ
      if (existing.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden: Bạn không có quyền truy cập vật phẩm này' });
      }

      const updated = await this.inventoryRepo.update(id, body);
      return res.status(200).json({ data: updated });
    } catch (error) {
      console.error('[InventoryController.update]', error);
      return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
  };

  // ─── DELETE /inventory/:id ────────────────────────────────────────────────
  
  /**
   * Xóa vật phẩm khỏi kho.
   */
  delete = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params as { id: string };
      const userId = (req as any).userId;

      const existing = await this.inventoryRepo.findById(id);
      if (!existing) {
        return res.status(404).json({ error: `Không tìm thấy vật phẩm với id: ${id}` });
      }

      if (existing.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden: Bạn không có quyền truy cập vật phẩm này' });
      }

      await this.inventoryRepo.delete(id);
      return res.status(204).send();
    } catch (error) {
      console.error('[InventoryController.delete]', error);
      return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
  };
}
