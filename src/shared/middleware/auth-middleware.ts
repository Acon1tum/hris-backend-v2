import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest, JWTPayload } from '@/types';
import { CustomError } from './error-handler';

const prisma = new PrismaClient();

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError('Access token required', 401);
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new CustomError('JWT secret not configured', 500);
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    // Check token age and activity
    const now = Math.floor(Date.now() / 1000);
    const tokenAge = now - (decoded.iat || 0);
    const lastActivity = decoded.lastActivity || decoded.iat || 0;
    const inactivityTime = now - lastActivity;
    
    // Session timeout check (30 minutes = 1800 seconds)
    const sessionTimeout = parseInt(process.env.SESSION_TIMEOUT_SECONDS || '1800');
    if (inactivityTime > sessionTimeout) {
      throw new CustomError('Session expired due to inactivity', 401);
    }
    
    // Get user with roles and permissions
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        personnel: true,
        user_roles: {
          include: {
            role: {
              include: {
                role_permissions: true
              }
            }
          }
        }
      }
    });

    if (!user || user.status !== 'Active') {
      throw new CustomError('User not found or inactive', 401);
    }

    // Extract permissions from user roles
    const permissions = user.user_roles
      .filter(ur => ur.is_active)
      .flatMap(ur => ur.role.role_permissions.map(rp => rp.permission));

    // Add user and permissions to request
    (req.user as any) = {
      ...user,
      permissions: [...new Set(permissions)] // Remove duplicates
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new CustomError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new CustomError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new CustomError('Authentication required', 401));
    }

    const userPermissions = (req.user as any).permissions || [];
    
    if (!userPermissions.includes(permission)) {
      return next(new CustomError('Insufficient permissions', 403));
    }

    next();
  };
};

export const requireAnyPermission = (permissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new CustomError('Authentication required', 401));
    }

    const userPermissions = (req.user as any).permissions || [];
    const hasPermission = permissions.some(permission => 
      userPermissions.includes(permission)
    );
    
    if (!hasPermission) {
      return next(new CustomError('Insufficient permissions', 403));
    }

    next();
  };
};

export const requireAllPermissions = (permissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new CustomError('Authentication required', 401));
    }

    const userPermissions = (req.user as any).permissions || [];
    const hasAllPermissions = permissions.every(permission => 
      userPermissions.includes(permission)
    );
    
    if (!hasAllPermissions) {
      return next(new CustomError('Insufficient permissions', 403));
    }

    next();
  };
}; 