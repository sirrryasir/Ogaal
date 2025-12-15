export async function getClimateData(
  lat: number,
  lon: number
) {
  const url =
    `https://power.larc.nasa.gov/api/temporal/daily/point` +
    `?parameters=PRECTOTCORR,T2M` +
    `&latitude=${lat}&longitude=${lon}` +
    `&format=JSON`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Climate API failed");

  const data = await res.json();

  return {
    rainfall_mm: Object.values(data.properties.parameter.PRECTOTCORR)[0],
    temperature_c: Object.values(data.properties.parameter.T2M)[0],
  };
}
