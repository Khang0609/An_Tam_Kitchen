import express, {Router} from 'express';
import { userProductController } from '../container.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router: Router = express.Router();

router.use(authenticate);

router.post('/', userProductController.create);
router.get('/', userProductController.getAll);
router.delete('/:id', userProductController.delete);

export default router;
