import { Request, Response } from 'express';
import { IUserProductRepository } from '@repo/repositories';

export class UserProductController {
  constructor(private userProductRepository: IUserProductRepository) {}

  create = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const product = await this.userProductRepository.create({
        ...req.body,
        userId,
      });

      res.status(201).json(product);
    } catch (error) {
      console.error('Failed to create user product:', error);
      res.status(500).json({ error: 'Failed to create user product' });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const products = await this.userProductRepository.findAllByUserId(userId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user products' });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.userProductRepository.delete(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  };
}
