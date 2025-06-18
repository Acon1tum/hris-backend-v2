import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CustomError } from '@/shared/middleware/error-handler';

const prisma = new PrismaClient();

export class RolesController {
  // List all roles
  static async listRoles(req: Request, res: Response) {
    const roles = await prisma.role.findMany({ include: { role_permissions: true } });
    res.json({ success: true, data: roles });
  }

  // Get role by ID
  static async getRole(req: Request, res: Response) {
    const { id } = req.params;
    const role = await prisma.role.findUnique({
      where: { id },
      include: { role_permissions: true }
    });
    if (!role) throw new CustomError('Role not found', 404);
    res.json({ success: true, data: role });
  }

  // Create role
  static async createRole(req: Request, res: Response) {
    const { name, description } = req.body;
    const role = await prisma.role.create({
      data: { name, description, is_active: true }
    });
    res.status(201).json({ success: true, data: role });
  }

  // Update role
  static async updateRole(req: Request, res: Response) {
    const { id } = req.params;
    const { name, description, is_active } = req.body;
    const role = await prisma.role.update({
      where: { id },
      data: { name, description, is_active }
    });
    res.json({ success: true, data: role });
  }

  // Delete role
  static async deleteRole(req: Request, res: Response) {
    const { id } = req.params;
    await prisma.role.delete({ where: { id } });
    res.json({ success: true, message: 'Role deleted' });
  }

  // Assign permissions to role (replace all)
  static async assignPermissions(req: Request, res: Response) {
    const { id } = req.params;
    const { permissions } = req.body; // array of permission strings
    if (!Array.isArray(permissions)) throw new CustomError('Permissions must be an array', 400);
    // Remove all current permissions
    await prisma.rolePermission.deleteMany({ where: { role_id: id } });
    // Add new permissions
    await prisma.rolePermission.createMany({
      data: permissions.map((permission: string) => ({ role_id: id, permission })),
      skipDuplicates: true
    });
    res.json({ success: true, message: 'Permissions updated' });
  }
} 