import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';

export class AdminController {
  constructor(private adminService: AdminService) { }

  getOverview = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.adminService.getOverviewStats()();
      if (result._tag === 'Left') {
        res.status(500).json({ success: false, error: result.left.message });
        return;
      }
      res.status(200).json({ success: true, data: result.right });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  };
}


