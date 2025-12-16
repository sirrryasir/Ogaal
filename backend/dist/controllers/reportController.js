import { prisma } from "../config/prisma.js";
// Get all reports
const getAll = async (req, res) => {
    try {
        const reports = await prisma.report.findMany({
            include: {
                water_source: true,
                village: true,
                user: true,
            },
            orderBy: { timestamp: "desc" },
        });
        res.json(reports);
    }
    catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// Create a new report
const create = async (req, res) => {
    try {
        const { water_source_id, content, reporter_type } = req.body;
        // user_id might come from authenticated user in req.user, but for now optional or passed
        // Assuming simple creation for now
        const report = await prisma.report.create({
            data: {
                water_source_id: Number(water_source_id),
                content,
                reporter_type: reporter_type || "App",
                timestamp: new Date(),
            },
        });
        res.status(201).json(report);
    }
    catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// Verify a report (Approve)
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
        console.error("Error verifying report:", error);
        res.status(500).json({ message: "Server error" });
    }
};
// Delete a report (Reject)
const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.report.delete({ where: { id: Number(id) } });
        res.json({ message: "Report deleted" });
    }
    catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export default {
    getAll,
    create,
    verifyReport,
    deleteReport,
};
//# sourceMappingURL=reportController.js.map