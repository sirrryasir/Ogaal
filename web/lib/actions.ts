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
  const district = formData.get("district") as string;
  const village = formData.get("village") as string;
  const source_type = formData.get("source_type") as string;
  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);
  const design_capacity_liters = formData.get("design_capacity_liters") 
    ? parseInt(formData.get("design_capacity_liters") as string) 
    : null;
  const current_capacity_liters = formData.get("current_capacity_liters")
    ? parseInt(formData.get("current_capacity_liters") as string)
    : null;
  const population_served = formData.get("population_served")
    ? parseInt(formData.get("population_served") as string)
    : null;
  const installation_date = formData.get("installation_date") as string;
  const operational_status = formData.get("operational_status") as string;

  // Validate required fields
  if (!name || !source_type || !operational_status || 
      isNaN(latitude) || isNaN(longitude)) {
    return { success: false, message: "Please fill in all required fields" };
  }

  try {
    // The backend expects village_id, so we'll send district and village names
    // and let the backend handle finding/creating the village
    await api.post("/water-sources", {
      name,
      district_name: district,
      village_name: village,
      type: source_type,
      latitude,
      longitude,
      design_capacity_liters,
      current_capacity_liters,
      population_served,
      installation_date: installation_date || null,
      status: operational_status,
    });

    revalidatePath("/admin/sources");
    revalidatePath("/water-sources");
    revalidatePath("/statistics");
    return { success: true, message: "Water source added successfully" };
  } catch (e: any) {
    console.error("Add source error:", e);
    return { 
      success: false, 
      message: e?.response?.data?.error || e?.message || "Failed to add water source" 
    };
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
