"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";

export async function submitReport(formData: FormData) {
  const sourceId = formData.get("sourceId");
  const status = formData.get("status") as string;
  const note = formData.get("note") as string;

  // Basic validation
  if (!sourceId || !status) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    // Find village_id from borehole
    const borehole = await prisma.borehole.findUnique({
      where: { id: parseInt(sourceId.toString()) },
    });

    await prisma.report.create({
      data: {
        borehole_id: parseInt(sourceId.toString()),
        village_id: borehole?.village_id,
        report_content: note || status,
        reporter_type: "Web Agent",
        is_verified: 0,
      },
    });

    revalidatePath("/admin/reports");
    return { success: true, message: "Report submitted successfully" };
  } catch (error) {
    console.error("Submission error:", error);
    return { success: false, message: "Failed to submit report" };
  }
}

export async function approveReport(id: number) {
  try {
    // Update report to verified (1)
    const report = await prisma.report.update({
      where: { id },
      data: { is_verified: 1 },
    });

    // Update source status if report content matches status (simplified)
    if (report.borehole_id) {
      // Ideally we'd parse status from report_content but for now let's skip automatic update or just infer
      // Leaving explicit status update for manual admin action or separate logic
    }

    revalidatePath("/admin/reports");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function rejectReport(id: number) {
  try {
    await prisma.report.delete({
      where: { id },
    });
    revalidatePath("/admin/reports");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function addSource(formData: FormData) {
  const name = formData.get("name") as string;
  const lat = parseFloat(formData.get("lat") as string);
  const lng = parseFloat(formData.get("lng") as string);
  const villageName = formData.get("village") as string;

  try {
    // Find or create Village
    let village = await prisma.village.findFirst({
      where: { name: villageName },
    });

    if (!village) {
      village = await prisma.village.create({
        data: {
          name: villageName,
          latitude: lat,
          longitude: lng,
          drought_risk_level: "Low",
        },
      });
    }

    await prisma.borehole.create({
      data: {
        village_id: village.id,
        name,
        status: "Working",
        water_level: 100.0,
      },
    });

    revalidatePath("/admin/sources");
    revalidatePath("/water-sources");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function deleteSource(id: number) {
  try {
    await prisma.borehole.delete({
      where: { id },
    });
    revalidatePath("/admin/sources");
    revalidatePath("/water-sources");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}
