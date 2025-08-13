import DeliveryAgent from '../models/DeliveryAgent.js';
import jwt from 'jsonwebtoken';

// --- Helper to generate JWT ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new delivery agent
// @route   POST /api/delivery-agents/register
// @access  Public
const registerAgent = async (req, res) => {
    const { name, phone_number, password } = req.body;

    try {
        const agentExists = await DeliveryAgent.findOne({ phone_number });

        if (agentExists) {
            return res.status(400).json({ message: 'Delivery agent with this phone number already exists' });
        }

        const agent = await DeliveryAgent.create({
            name,
            phone_number,
            password_hash: password,
        });

        if (agent) {
            res.status(201).json({
                _id: agent._id,
                name: agent.name,
                phone_number: agent.phone_number,
                token: generateToken(agent._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid agent data' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Auth agent & get token
// @route   POST /api/delivery-agents/login
// @access  Public
const loginAgent = async (req, res) => {
    const { phone_number, password } = req.body;

    try {
        const agent = await DeliveryAgent.findOne({ phone_number });

        if (agent && (await agent.comparePassword(password))) {
            res.json({
                _id: agent._id,
                name: agent.name,
                phone_number: agent.phone_number,
                token: generateToken(agent._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid phone number or password' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Get agent profile
// @route   GET /api/delivery-agents/profile
// @access  Private
const getAgentProfile = async (req, res) => {
    // The agent's data is already fetched in the `protectAgent` middleware
    if (req.agent) {
        res.json(req.agent);
    } else {
        res.status(404).json({ message: 'Agent not found' });
    }
};


// @desc    Update agent status
// @route   PUT /api/delivery-agents/status
// @access  Private
const updateAgentStatus = async (req, res) => {
    const { status } = req.body; // e.g., 'available', 'on_delivery', 'offline'

    try {
        const agent = await DeliveryAgent.findById(req.agent._id);

        if (agent) {
            agent.status = status;
            const updatedAgent = await agent.save();
            res.json(updatedAgent);
        } else {
            res.status(404).json({ message: 'Agent not found' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Update agent's real-time location
// @route   PUT /api/delivery-agents/location
// @access  Private
const updateAgentLocation = async (req, res) => {
    const { latitude, longitude } = req.body;

    try {
        const agent = await DeliveryAgent.findById(req.agent._id);

        if (agent) {
            agent.current_location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
            const updatedAgent = await agent.save();
            res.json({ message: 'Location updated successfully', location: updatedAgent.current_location });
        } else {
            res.status(404).json({ message: 'Agent not found' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

export {
    registerAgent,
    loginAgent,
    getAgentProfile,
    updateAgentStatus,
    updateAgentLocation
};