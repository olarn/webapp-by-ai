import { Request, Response } from 'express';
import * as crypto from 'crypto';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { AdminRepository } from '../repositories/adminRepository';

export class AdminAuthController {
  constructor(private adminRepository: AdminRepository) { }

  private hashPassword = (password: string, salt: string): string => {
    return crypto.createHmac('sha256', salt).update(password).digest('hex');
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body as { username?: string; password?: string };

    if (!username || !password) {
      res.status(400).json({ success: false, error: 'Username and password are required' });
      return;
    }

    const result = await this.adminRepository.findByUsername(username)();
    if (result._tag === 'Left') {
      res.status(500).json({ success: false, error: result.left.message });
      return;
    }

    if (result.right._tag === 'None') {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    const admin = result.right.value;
    const computed = this.hashPassword(password, admin.password_salt);
    if (computed !== admin.password_hash) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username,
        role: 'admin',
        name: admin.name,
      }
    });
  };
}


