import { Request, Response } from 'express';
import { IInventoryRepository } from '@repo/repositories';
import { CreateInventoryItemBody, UpdateInventoryItemBody } from '@/validation/inventory.validation';

/**
 * InventoryController
 * 
 * Quản lý kho thực phẩm của người dùng.
 * Mọi DB operation đều đi qua IInventoryRepository.
 */
export class InventoryController {
  constructor(private readonly inventoryRepo: IInventoryRepository) {}

  // ─── POST /inventory ──────────────────────────────────────────────────────
  
  /**
   * Tạo mới một vật phẩm trong kho.
   * userId được lấy từ auth middleware (giả định đã được validate).
   */
  create = async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = (req as any).userId; // Lấy từ auth middleware
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Thiếu thông tin người dùng' });
      }

      const body: CreateInventoryItemBody = req.body;
      
      const newItem = await this.inventoryRepo.create({
        ...body,
        userId,
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
