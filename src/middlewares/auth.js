import { request, response } from 'express';

export const authMiddleware = (req = request, res = response, next) => {
    if (!req.user) {
        return res.status(401).redirect('/views/login');
    }

    next();
}

export const adminMiddleware = (req = request, res = response, next) => {
    if (!req.user || req.user._doc.role !== 'ADMIN_ROLE') {
        return res.status(403).redirect('/views/products');
    }

    next();
}