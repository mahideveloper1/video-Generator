import express from 'express';
import { VideoController } from '../controllers/videoController';
import { validateVideoRequest } from '../middleware/validation';

const router = express.Router();
const videoController = new VideoController();

router.post('/generate-video', validateVideoRequest, videoController.generateVideo.bind(videoController));
router.get('/status/:id', videoController.getStatus.bind(videoController));

export default router;
