import { request, response } from 'express';

export const authMiddleware = (req = request, res = response, next) => {
    if (!req.session.user) {
        return res.status(401).redirect('/views/login');
    }

    next();
}