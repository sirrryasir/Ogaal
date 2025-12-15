import { prisma } from "../config/prisma.js";
// Get all water sources
const getAll = async (req, res) => {
    try {
        const sources = await prisma.waterSource.findMany({
            include: {
                village: true,
                sensor_readings: {
                    take: 1,
                    orderBy: { timestamp: "desc" },
                },
            },
        });
        res.json(sources);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
// Create a new water source
const create = async (req, res) => {
    try {
        const { village_id, name, type, latitude, longitude } = req.body;
        const source = await prisma.waterSource.create({
            data: {
                village_id: Number(village_id),
                name,
                type,
                latitude,
                longitude,
            },
        });
        res.status(201).json(source);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
// Update status
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, water_level } = req.body;
        const source = await prisma.waterSource.update({
            where: { id: Number(id) },
            data: {
                status,
                water_level,
                last_maintained: new Date(),
            },
        });
        res.json(source);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
export default {
    getAll,
    create,
    updateStatus,
};
//# sourceMappingURL=waterSourceController.js.map