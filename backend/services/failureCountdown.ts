export async function sendWaterSources(sources: any | any[]) {
  try {
    const response = await fetch("/api/failure-countdown", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // MUST have this
      },
      body: JSON.stringify(sources), // Must serialize object/array
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data.error);
      return null;
    }

    return data;
  } catch (err: any) {
    console.error("Network Error:", err.message || err);
    return null;
  }
}
