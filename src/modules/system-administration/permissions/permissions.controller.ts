import { Request, Response } from 'express';
import { PrismaClient, Permission } from '@prisma/client';
import { CustomError } from '@/shared/middleware/error-handler';

const prisma = new PrismaClient();

export class PermissionsController {
  // List all possible permissions (from enum)
  static async listPermissions(req: Request, res: Response) {
    res.json({
      success: true,
      data: Object.values(Permission)
    });
  }

  // List all roles
  static async listRoles(req: Request, res: Response) {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: roles });
  }

  // List permissions for a specific role
  static async getRolePermissions(req: Request, res: Response) {
    const { id } = req.params;
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        role_permissions: true
      }
    });
    if (!role) throw new CustomError('Role not found', 404);
    res.json({
      success: true,
      data: role.role_permissions.map(rp => rp.permission)
    });
  }

  // Assign permissions to a role (replaces all existing)
  static async setRolePermissions(req: Request, res: Response) {
    const { id } = req.params;
    const { permissions } = req.body; // array of permission strings
    if (!Array.isArray(permissions)) throw new CustomError('Permissions must be an array', 400);
    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) throw new CustomError('Role not found', 404);
    // Remove all current permissions
    await prisma.rolePermission.deleteMany({ where: { role_id: id } });
    // Add new permissions
    await prisma.rolePermission.createMany({
      data: permissions.map((permission: string) => ({
        role_id: id,
        permission: permission as Permission
      })),
      skipDuplicates: true
    });
    res.json({ success: true, message: 'Permissions updated' });
  }

  // Remove a single permission from a role
  static async removeRolePermission(req: Request, res: Response) {
    const { id, perm } = req.params;
    await prisma.rolePermission.deleteMany({
      where: { role_id: id, permission: perm as Permission }
    });
    res.json({ success: true, message: 'Permission removed' });
  }

  // List effective permissions for a user
  static async getUserPermissions(req: Request, res: Response) {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        user_roles: {
          include: {
            role: {
              include: { role_permissions: true }
            }
          }
        }
      }
    });
    if (!user) throw new CustomError('User not found', 404);
    const permissions = user.user_roles
      .filter(ur => ur.is_active)
      .flatMap(ur => ur.role.role_permissions.map(rp => rp.permission));
    res.json({
      success: true,
      data: [...new Set(permissions)]
    });
  }
} 