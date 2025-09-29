import express from 'express';
import videoRoutes from './videoRoutes';

const router = express.Router();

router.use('/video', videoRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

export default router;