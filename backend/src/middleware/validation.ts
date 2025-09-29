import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const validateVideoRequest = (req: Request, res: Response, next: NextFunction) => {
  const { name, phone, country } = req.body;

  const errors: string[] = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }

  if (!phone || typeof phone !== 'string' || !/^\+?\d{10,15}$/.test(phone.replace(/\s/g, ''))) {
    errors.push('Valid phone number is required');
  }

  if (!country || typeof country !== 'string' || country.trim().length < 2) {
    errors.push('Country is required');
  }

  if (errors.length > 0) {
    logger.warn('Validation failed:', { errors, body: req.body });
    return res.status(400).json({ success: false, error: errors.join(', ') });
  }

  next();
};