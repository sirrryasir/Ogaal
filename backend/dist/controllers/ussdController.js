import { prisma } from "../config/prisma.js";
const handleUssdRequest = async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    let response = "";
    let type = "CON"; // CON = Continue, END = End
    // text is a string like "1*2*1" representing the input path
    // Split text to get navigation steps
    const parts = text ? text.split("*") : [];
    try {
        if (text === "") {
            // Main Menu
            response = `Welcome to Ogaal
1. Check Water Availability
2. Report Water Source Status`;
        }
        // Flow 1: Check Water Availability
        else if (parts[0] === "1") {
            // Step 1: Select Village
            if (parts.length === 1) {
                const villages = await prisma.village.findMany({
                    take: 10,
                    orderBy: { name: 'asc' }
                });
                if (villages.length === 0) {
                    response = "No villages found.";
                    type = "END";
                }
                else {
                    response = "Select Village:\n";
                    villages.forEach((v, index) => {
                        response += `${index + 1}. ${v.name}\n`;
                    });
                }
            }
            // Step 2: Select Water Source
            else if (parts.length === 2) {
                const villageIndex = parseInt(parts[1]) - 1;
                const villages = await prisma.village.findMany({
                    take: 10,
                    orderBy: { name: 'asc' }
                });
                if (villageIndex >= 0 && villageIndex < villages.length) {
                    const village = villages[villageIndex];
                    const sources = await prisma.waterSource.findMany({
                        where: { village_id: village.id },
                        take: 10
                    });
                    if (sources.length === 0) {
                        response = `No sources found in ${village.name}`;
                        type = "END";
                    }
                    else {
                        response = "Select Water Source:\n";
                        sources.forEach((s, index) => {
                            response += `${index + 1}. ${s.name}\n`;
                        });
                    }
                }
                else {
                    response = "Invalid choice. Please try again.";
                    type = "END";
                }
            }
            // Step 3: Show Status
            else if (parts.length === 3) {
                // Need to resolve village and source again to get final data
                // Optimization: In real USSD, usually session caches this, here we re-fetch
                const villageIndex = parseInt(parts[1]) - 1;
                const sourceIndex = parseInt(parts[2]) - 1;
                const villages = await prisma.village.findMany({
                    take: 10,
                    orderBy: { name: 'asc' }
                });
                if (villageIndex >= 0 && villageIndex < villages.length) {
                    const village = villages[villageIndex];
                    const sources = await prisma.waterSource.findMany({
                        where: { village_id: village.id },
                        take: 10
                    });
                    if (sourceIndex >= 0 && sourceIndex < sources.length) {
                        const src = sources[sourceIndex];
                        response = `${src.name} Status:
Status: ${src.status || 'Unknown'}
Level: ${src.water_level || 0}%
Last: ${src.last_maintained ? new Date(src.last_maintained).toLocaleDateString() : 'N/A'}`;
                        type = "END";
                    }
                    else {
                        response = "Invalid source choice.";
                        type = "END";
                    }
                }
                else {
                    response = "Invalid village choice.";
                    type = "END";
                }
            }
        }
        // Flow 2: Report Status
        else if (parts[0] === "2") {
            // Step 1: Select Village (Same logic as Flow 1 Step 1)
            if (parts.length === 1) {
                const villages = await prisma.village.findMany({
                    take: 10,
                    orderBy: { name: 'asc' }
                });
                if (villages.length === 0) {
                    response = "No villages found.";
                    type = "END";
                }
                else {
                    response = "Select Village for Report:\n";
                    villages.forEach((v, index) => {
                        response += `${index + 1}. ${v.name}\n`;
                    });
                }
            }
            // Step 2: Select Water Source (Same logic as Flow 1 Step 2)
            else if (parts.length === 2) {
                const villageIndex = parseInt(parts[1]) - 1;
                const villages = await prisma.village.findMany({
                    take: 10,
                    orderBy: { name: 'asc' }
                });
                if (villageIndex >= 0 && villageIndex < villages.length) {
                    const village = villages[villageIndex];
                    const sources = await prisma.waterSource.findMany({
                        where: { village_id: village.id },
                        take: 10
                    });
                    if (sources.length === 0) {
                        response = `No sources found in ${village.name}`;
                        type = "END";
                    }
                    else {
                        response = "Select Source to Report:\n";
                        sources.forEach((s, index) => {
                            response += `${index + 1}. ${s.name}\n`;
                        });
                    }
                }
                else {
                    response = "Invalid choice.";
                    type = "END";
                }
            }
            // Step 3: Select Issue Type
            else if (parts.length === 3) {
                response = `Select Status:
1. Water Finished
2. Pump Broken
3. Water Available`;
            }
            // Step 4: Submit Report
            else if (parts.length === 4) {
                // Resolve IDs
                const villageIndex = parseInt(parts[1]) - 1;
                const sourceIndex = parseInt(parts[2]) - 1;
                const statusChoice = parts[3];
                const villages = await prisma.village.findMany({
                    take: 10,
                    orderBy: { name: 'asc' }
                });
                if (villageIndex >= 0 && villageIndex < villages.length) {
                    const village = villages[villageIndex];
                    const sources = await prisma.waterSource.findMany({
                        where: { village_id: village.id },
                        take: 10
                    });
                    if (sourceIndex >= 0 && sourceIndex < sources.length) {
                        const src = sources[sourceIndex];
                        const statusMap = {
                            "1": "Low Water",
                            "2": "Broken",
                            "3": "Working",
                        };
                        const statusReport = statusMap[statusChoice] || "Other Issue";
                        await prisma.report.create({
                            data: {
                                water_source_id: src.id,
                                village_id: village.id,
                                reporter_type: "USSD",
                                content: `User reported status: ${statusReport}`,
                            },
                        });
                        response = `Report received for ${src.name}. Thank you.`;
                        type = "END";
                    }
                    else {
                        response = "Invalid source choice.";
                        type = "END";
                    }
                }
                else {
                    response = "Invalid village choice.";
                    type = "END";
                }
            }
        }
        else {
            response = "Invalid option.";
            type = "END";
        }
    }
    catch (error) {
        console.error("USSD Error:", error);
        response = "An error occurred. Please try again.";
        type = "END";
    }
    res.json({ message: response, type });
};
export default handleUssdRequest;
//# sourceMappingURL=ussdController.js.map