"use server";

import api from "./api";
import { revalidatePath } from "next/cache";

export async function submitReport(formData: FormData) {
  const sourceId = formData.get("sourceId");
  const status = formData.get("status") as string;
  const note = formData.get("note") as string;

  if (!sourceId || !status) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    await api.post("/reports/secure", {
      water_source_id: parseInt(sourceId.toString()),
      content: note || status,
      reporter_type: "Web Agent",
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
    await api.put(`/reports/${id}/verify`);
    revalidatePath("/admin/reports");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function rejectReport(id: number) {
  try {
    await api.delete(`/reports/${id}`);
    revalidatePath("/admin/reports");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function addSource(formData: FormData) {
  const name = formData.get("name") as string;
  const villageId = formData.get("villageId");
  const type = formData.get("type") as string;
  const status = formData.get("status") as string;
  const latStr = formData.get("lat") as string;
  const lngStr = formData.get("lng") as string;

  try {
    const lat = latStr ? parseFloat(latStr) : 0;
    const lng = lngStr ? parseFloat(lngStr) : 0;

    await api.post("/water-sources", {
      village_id: Number(villageId),
      name,
      type,
      status, // Optional, but good to set initial status
      latitude: lat,
      longitude: lng,
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
    await api.delete(`/water-sources/${id}`);
    revalidatePath("/admin/sources");
    revalidatePath("/water-sources");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}
