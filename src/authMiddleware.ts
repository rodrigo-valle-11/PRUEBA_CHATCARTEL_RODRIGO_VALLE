import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || '1234';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const verified = jwt.verify(token, secret);
        (req as any).user = verified; // Guarda el usuario verificado en el request
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token no válido.' });
    }
};
