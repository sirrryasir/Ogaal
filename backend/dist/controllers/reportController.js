import { prisma } from "../config/prisma.js";
const getAll = async (req, res) => {
    try {
        const reports = await prisma.report.findMany({
            include: {
                village: { select: { name: true } },
                water_source: { select: { name: true } },
                user: { select: { fullName: true, email: true } },
            },
            orderBy: { timestamp: "desc" },
        });
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
const create = async (req, res) => {
    try {
        const { village_id, water_source_id, content, reporter_type } = req.body;
        // If logged in, use user id
        // @ts-ignore
        const user_id = req.user ? req.user.id : null;
        const report = await prisma.report.create({
            data: {
                village_id,
                water_source_id,
                content,
                reporter_type: reporter_type || "App",
                user_id,
                timestamp: new Date(),
            },
        });
        // If critical report, could trigger logic here (e.g. alerts)
        res.status(201).json(report);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
const verifyReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await prisma.report.update({
            where: { id: Number(id) },
            data: { is_verified: true },
        });
        res.json(report);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
export default {
    getAll,
    create,
    verifyReport,
};
//# sourceMappingURL=reportController.js.map