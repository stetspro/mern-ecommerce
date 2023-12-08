import { request, response } from 'express';

export const authMiddleware = (req = request, res = response, next) => {
    if (!req.session.user) {
        return res.status(401).redirect('/views/login');
    }

    next();
}

export const adminMiddleware = (req = request, res = response, next) => {
    if (!req.session.user || req.session.user.role !== 'ADMIN_ROLE') {
        return res.status(401).redirect('/views/products');
    }

    next();
}