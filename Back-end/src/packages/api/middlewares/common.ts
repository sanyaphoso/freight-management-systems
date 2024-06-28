import express from 'express';

enum Role {
  Admin = 'admin',
  Editor = 'editor',
  User = 'user',
}

export const checkRole = (roles: Role[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.user && roles.includes('admin' as Role)) {
      next();
    } else {
      res.status(403).json({ message: 'Access Denied' });
    }
  };
};
