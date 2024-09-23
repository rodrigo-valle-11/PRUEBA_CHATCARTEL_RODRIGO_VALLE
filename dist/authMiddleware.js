"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || '1234';
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, secret);
        req.user = verified; // Guarda el usuario que ya está en el request
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Token no válido.' });
    }
};
exports.authMiddleware = authMiddleware;
