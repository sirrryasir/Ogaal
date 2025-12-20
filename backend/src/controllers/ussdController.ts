import express, { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

const handleUssdRequest = async (req: Request, res: Response) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  let response = "";
  let type = "CON"; // CON = Continue, END = End

  // text format: "regionCode*districtCode*villageCode*action*sourceCode"
  const parts = text ? text.split("*") : [];

  try {
    // Step 1: Main Menu - Select Region
    if (text === "" || text === "0") {
      const regions = await prisma.region.findMany({
        take: 9,
        orderBy: { name: 'asc' }
      });

      if (regions.length === 0) {
        response = "Ma diwaangashana gobollada.";
        type = "END";
      } else {
        response = "Kusoo dhawoow Ogaal\nDooro Gobol:\n";
        regions.forEach((region, index) => {
          response += `${index + 1}. ${region.name}\n`;
        });
        const totalRegions = await prisma.region.count();
        if (totalRegions > 9) {
          response += "10. Next\n";
        }
      }
    } else if (text === "10") {
      const regions = await prisma.region.findMany({
        skip: 9,
        take: 9,
        orderBy: { name: 'asc' }
      });

      if (regions.length === 0) {
        response = "Ma diwaangashana gobollada dheeraad ah.";
        type = "END";
      } else {
        response = "Kusoo dhawoow Ogaal\nDooro Gobol (Page 2):\n";
        regions.forEach((region, index) => {
          response += `${index + 11}. ${region.name}\n`;
        });
        const totalRegions = await prisma.region.count();
        if (totalRegions > 18) {
          response += "20. Next\n";
        }
        response += "0. Back\n";
      }
    }

    // Step 2: Select District within Region
    else if (parts.length === 1) {
      const regionCode = parseInt(parts[0]);
      let regionIndex = 0;
      if (regionCode >= 1 && regionCode <= 9) {
        regionIndex = regionCode - 1;
      } else if (regionCode >= 11 && regionCode <= 19) {
        regionIndex = regionCode - 11 + 9;
      } else {
        response = "Doorasho aan saxsanayn. Fadlan isku day mar kale.";
        type = "END";
        return res.json({ message: response, type });
      }
      const regions = await prisma.region.findMany({
        orderBy: { name: 'asc' }
      });

      if (regionIndex >= 0 && regionIndex < regions.length) {
        const region = regions[regionIndex];
        const districts = await prisma.district.findMany({
          where: { region_id: region.id },
          take: 10,
          orderBy: { name: 'asc' }
        });

        if (districts.length === 0) {
          response = `Ma diwaangashana degmo gobolka ${region.name}`;
          type = "END";
        } else {
          response = `Dooro Degmo ${region.name}:\n`;
          districts.forEach((district, index) => {
            response += `${index + 1}. ${district.name}\n`;
          });
        }
      } else {
        response = "Doorasho aan saxsanayn. Fadlan isku day mar kale.";
        type = "END";
      }
    }

    // Step 3: Select Village within District
    else if (parts.length === 2) {
      const regionIndex = parseInt(parts[0]) - 1;
      const districtIndex = parseInt(parts[1]) - 1;

      const regions = await prisma.region.findMany({
        take: 10,
        orderBy: { name: 'asc' }
      });

      if (regionIndex >= 0 && regionIndex < regions.length) {
        const region = regions[regionIndex];
        const districts = await prisma.district.findMany({
          where: { region_id: region.id },
          take: 10,
          orderBy: { name: 'asc' }
        });

        if (districtIndex >= 0 && districtIndex < districts.length) {
          const district = districts[districtIndex];
          const villages = await prisma.village.findMany({
            where: { district_id: district.id },
            take: 10,
            orderBy: { name: 'asc' }
          });

          if (villages.length === 0) {
            response = `Ma diwaangashana tuulo degmada ${district.name}`;
            type = "END";
          } else {
            response = `Dooro Tuulo ${district.name}:\n`;
            villages.forEach((village, index) => {
              response += `${index + 1}. ${village.name}\n`;
            });
          }
        } else {
          response = "Doorasho degmo aan saxsanayn.";
          type = "END";
        }
      } else {
        response = "Doorasho gobol aan saxsanayn.";
        type = "END";
      }
    }

    // Step 4: Select Action (Check Water or Report)
    else if (parts.length === 3) {
      response = `Dooro waxaad rabto:
1. Hubi helitaanka biyaha
2. Ka warbixi xaalad taagan`;
    }

    // FLOW 1: CHECK WATER AVAILABILITY
    else if (parts.length === 4 && parts[3] === "1") {
      // Show water sources for selected village
      const regionIndex = parseInt(parts[0]) - 1;
      const districtIndex = parseInt(parts[1]) - 1;
      const villageIndex = parseInt(parts[2]) - 1;

      const regions = await prisma.region.findMany({
        take: 10,
        orderBy: { name: 'asc' }
      });

      if (regionIndex >= 0 && regionIndex < regions.length) {
        const region = regions[regionIndex];
        const districts = await prisma.district.findMany({
          where: { region_id: region.id },
          take: 10,
          orderBy: { name: 'asc' }
        });

        if (districtIndex >= 0 && districtIndex < districts.length) {
          const district = districts[districtIndex];
          const villages = await prisma.village.findMany({
            where: { district_id: district.id },
            take: 10,
            orderBy: { name: 'asc' }
          });

          if (villageIndex >= 0 && villageIndex < villages.length) {
            const village = villages[villageIndex];
            const waterSources = await prisma.waterSource.findMany({
              where: { village_id: village.id },
              take: 10,
              orderBy: { name: 'asc' }
            });

            if (waterSources.length === 0) {
              response = `Ma jirto ilo biyood ah ${village.name}`;
              type = "END";
            } else {
              response = `Dooro Isha Biyaha ${village.name}:\n`;
              waterSources.forEach((source, index) => {
                response += `${index + 1}. ${source.name}\n`;
              });
            }
          } else {
            response = "Doorasho tuulo aan saxsanayn.";
            type = "END";
          }
        } else {
          response = "Doorasho degmo aan saxsanayn.";
          type = "END";
        }
      } else {
        response = "Doorasho gobol aan saxsanayn.";
        type = "END";
      }
    }

    // FLOW 1: Show Water Source Status (Final Step)
    else if (parts.length === 5 && parts[3] === "1") {
      const regionIndex = parseInt(parts[0]) - 1;
      const districtIndex = parseInt(parts[1]) - 1;
      const villageIndex = parseInt(parts[2]) - 1;
      const sourceIndex = parseInt(parts[4]) - 1;

      const regions = await prisma.region.findMany({
        take: 10,
        orderBy: { name: 'asc' }
      });

      if (regionIndex >= 0 && regionIndex < regions.length) {
        const region = regions[regionIndex];
        const districts = await prisma.district.findMany({
          where: { region_id: region.id },
          take: 10,
          orderBy: { name: 'asc' }
        });

        if (districtIndex >= 0 && districtIndex < districts.length) {
          const district = districts[districtIndex];
          const villages = await prisma.village.findMany({
            where: { district_id: district.id },
            take: 10,
            orderBy: { name: 'asc' }
          });

          if (villageIndex >= 0 && villageIndex < villages.length) {
            const village = villages[villageIndex];
            const waterSources = await prisma.waterSource.findMany({
              where: { village_id: village.id },
              take: 10,
              orderBy: { name: 'asc' }
            });

            if (sourceIndex >= 0 && sourceIndex < waterSources.length) {
              const source = waterSources[sourceIndex];

              // Status mapping
              const statusMap: Record<string, string> = {
                "Working": "Wuu shaqaynayaa, biyo leh",
                "Broken": "Jaban",
                "Dry": "Qalalan",
                "Low Water": "Biyo yar",
                "Contaminated": "Wasakh"
              };

              const statusSomali = statusMap[source.status || ''] || "Aan la aqoon";

              response = `${source.name} - ${village.name}
Noolaha: ${statusSomali}
Nooca: ${source.type}
Aqoonsiga: ${source.inspecting_agency || "La aqoon"}`;
              type = "END";
            } else {
              response = "Doorasho isha aan saxsanayn.";
              type = "END";
            }
          } else {
            response = "Doorasho tuulo aan saxsanayn.";
            type = "END";
          }
        } else {
          response = "Doorasho degmo aan saxsanayn.";
          type = "END";
        }
      } else {
        response = "Doorasho gobol aan saxsanayn.";
        type = "END";
      }
    }

    // FLOW 2: REPORT ISSUE - Select Issue Type
    else if (parts.length === 4 && parts[3] === "2") {
      response = `Dooro dhibka aad ka warbixinaysid:
1. Biyihii dhammaaday
2. Ceelkaa jabay
3. Biyo way jiraan laakiin qashan`;
    }

    // FLOW 2: Submit Report (Final Step)
    else if (parts.length === 5 && parts[3] === "2") {
      const regionIndex = parseInt(parts[0]) - 1;
      const districtIndex = parseInt(parts[1]) - 1;
      const villageIndex = parseInt(parts[2]) - 1;
      const issueType = parts[4];

      const regions = await prisma.region.findMany({
        take: 10,
        orderBy: { name: 'asc' }
      });

      if (regionIndex >= 0 && regionIndex < regions.length) {
        const region = regions[regionIndex];
        const districts = await prisma.district.findMany({
          where: { region_id: region.id },
          take: 10,
          orderBy: { name: 'asc' }
        });

        if (districtIndex >= 0 && districtIndex < districts.length) {
          const district = districts[districtIndex];
          const villages = await prisma.village.findMany({
            where: { district_id: district.id },
            take: 10,
            orderBy: { name: 'asc' }
          });

          if (villageIndex >= 0 && villageIndex < villages.length) {
            const village = villages[villageIndex];

            // Issue mapping
            const issueMap: Record<string, string> = {
              "1": "Biyihii dhammaaday",
              "2": "Ceelkaa jabay",
              "3": "Biyo qashan"
            };

            const statusMapForReport: Record<string, string> = {
              "1": "DRY",
              "2": "BROKEN",
              "3": "CONTAMINATION"
            };

            const issueDescription = issueMap[issueType] || "Dhib kale";
            const reportStatus = statusMapForReport[issueType] || null;

            // Create report
            await prisma.report.create({
              data: {
                village_id: village.id,
                district_id: district.id,
                region_id: region.id,
                reporter_type: "USSD",
                reporter_phone: phoneNumber,
                content: `Warbixinta USSD: ${issueDescription} - ${village.name}, ${district.name}, ${region.name}`,
                status: reportStatus as any,
                issue_type: issueType
              }
            });

            response = `Waad mahadsan tahay!
Warbixintaada waa la diray ${village.name}.
Lambarkan waa la xasuusinayaa: ${phoneNumber}`;
            type = "END";
          } else {
            response = "Doorasho tuulo aan saxsanayn.";
            type = "END";
          }
        } else {
          response = "Doorasho degmo aan saxsanayn.";
          type = "END";
        }
      } else {
        response = "Doorasho gobol aan saxsanayn.";
        type = "END";
      }
    }

    // Invalid selection
    else {
      response = "Doorasho aan sax ahayn. Fadlan bilaabi mar kale *384*12345#";
      type = "END";
    }

  } catch (error) {
    console.error("USSD Error:", error);
    response = "Khalad baa dhacay. Fadlan isku day mar kale.";
    type = "END";
  }

  res.json({ message: response, type });
};

export default handleUssdRequest;