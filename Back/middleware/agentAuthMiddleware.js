import jwt from 'jsonwebtoken';
import DeliveryAgent from '../models/DeliveryAgent.js';

export const protectAgent = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.agent = await DeliveryAgent.findById(decoded.id).select('-password_hash');
             if (!req.agent) {
                return res.status(401).json({ message: 'Not authorized, agent not found' });
            }
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};