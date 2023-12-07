
const jwt = require('jsonwebtoken');

import { Request, Response, NextFunction } from 'express';
export function checkAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Authentification requise' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY as string) as { userId: string };
        const userId = decodedToken.userId;
        res.locals.userId = userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalide' });
    }
}





