import express, { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

const handleUssdRequest = async (req: Request, res: Response) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  let response = "";
  let type = "CON"; // CON = Continue, END = End
  
  // text is a string like "1*2*1" representing the input path
  // Split text to get navigation steps
  const parts = text ? text.split("*") : [];

  try {
    if (text === "") {
      // Main Menu
      response = `Kusoo dhawoow Ogaal
1. Hubi helitaanka biyaha
2. Ka warbixi xaalad taagan`;
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
          response = "Ma diwaangashana tuuladada.";
          type = "END";
        } else {
          response = "Dooro tuulada:\n";
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
            response = `Ma jirto wax ila biyood ah oo laga helay ${village.name}`;
            type = "END";
          } else {
            response = "Dooro isha biyaha:\n";
            sources.forEach((s, index) => {
              response += `${index + 1}. ${s.name}\n`;
            });
          }
        } else {
          response = "Doorasho aan saxsanayn. Fadlan isku day mar kale.";
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
          } else {
            response = "Maaha mid saxa ishan aad dooratay.";
            type = "END";
          }
        } else {
          response = "Maaha mid diwaangashan tuuladani.";
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
          response = "Wax tuulo ah ma diwaangashana.";
          type = "END";
        } else {
          response = "Dooro tuuladaad warbixinta ka gudbinayso:\n";
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
            response = `Ma jirto wax ila biyood ah oo laga diwaangeliyay ${village.name}`;
            type = "END";
          } else {
            response = "Dooro isha biyahaad warbixinta ka gudbinayso:\n";
            sources.forEach((s, index) => {
              response += `${index + 1}. ${s.name}\n`;
            });
          }
        } else {
          response = "Doorasho aan saxsanayn.";
          type = "END";
        }
      }
      // Step 3: Select Issue Type
      else if (parts.length === 3) {
        response = `Dooro xaaladda:
1. Biyahaa dhammaaday
2. Ceelkaa jabay
3. Biyo way jiraan`;
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
            
            const statusMap: Record<string, string> = {
              "1": "Biyahaa hooseeya",
              "2": "Wuu jaban yahay",
              "3": "Wuu shaqaynayaa",
            };
            const statusReport = statusMap[statusChoice] || "Other Issue";

            await prisma.report.create({
              data: {
                water_source_id: src.id,
                village_id: village.id,
                reporter_type: "USSD",
                content: `Xaaladda warbixinta qofka: ${statusReport}`,
              },
            });
            response = `Waad nasoo gaadhsiisay warbixinta ${src.name}. Mahadsanid.`;
            type = "END";

          } else {
            response = "Maaha mid saxa ishan aad dooratay.";
            type = "END";
          }
        } else {
          response = "Maaha mid diwaangashan tuuladani.";
          type = "END";
        }
      }
    } else {
      response = "Doorasho aan sax ahayn.";
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