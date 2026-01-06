import express, { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import crypto from "crypto";
import axios from "axios";

// SMS Sending Function - CORRECT MD5 HASH METHOD
const sendSMS = async (to: string, message: string) => {
  try {
    const username = process.env.TELESOM_USERNAME!;
    const password = process.env.TELESOM_PASSWORD!;
    
    // Get current date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const timestamp = `${year}-${month}-${day}`;
    
    // Generate MD5 hash: username + password + YYYY-MM-DD
    const authKey = crypto
      .createHash('md5')
      .update(username + password + timestamp)
      .digest('hex');
    
    const response = await axios.post(
      'https://sms.mytelesom.com/index.php/smsapi/v1/messages',
      {
        to: [to],
        message,
        type: 'unicode',
        client_ref: process.env.TELESOM_CLIENT_REF || 'TLS-191'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'SenderID': process.env.TELESOM_SENDER_ID || 'Ogaal1',
          'X-Auth-Key': authKey
        }
      }
    );
    
    console.log('SMS sent successfully to:', to);
    return response.data;
  } catch (error: any) {
    console.error('SMS send error:', {
      status: error.response?.status,
      error: error.response?.data,
      timestamp: new Date().toISOString().split('T')[0]
    });
    // Don't throw error - let USSD continue even if SMS fails
    return null;
  }
};

// Helper function for paginated USSD menus (10 items per page)
const getPaginatedUssdMenu = async (
  model: any,
  page: number = 1,
  where: any = {},
  title: string,
  backText: string = "0. Dib ugu noqo",
  includeBack: boolean = true
) => {
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  
  // Get items for current page
  const items = await model.findMany({
    where,
    skip,
    take: pageSize + 1, // Get one extra to check if there's more
    orderBy: { name: 'asc' }
  });
  
  const hasMore = items.length > pageSize;
  const displayItems = hasMore ? items.slice(0, pageSize) : items;
  
  let response = title + "\n";
  
  // Add numbered items (1-10 for page 1, 11-20 for page 2, etc.)
  displayItems.forEach((item: any, index: number) => {
    const itemNumber = (page - 1) * pageSize + index + 1;
    response += `${itemNumber}. ${item.name}\n`;
  });
  
  // Add navigation options
  if (hasMore) {
    const nextNumber = page * pageSize + 1;
    response += `${nextNumber}. Next (Page ${page + 1})\n`;
  }
  
  if (page > 1) {
    const prevNumber = page * pageSize + (hasMore ? 2 : 1);
    response += `${prevNumber}. Previous (Page ${page - 1})\n`;
  }
  
  if (includeBack) {
    let backNumber = page * pageSize;
    if (hasMore) backNumber += 1;
    if (page > 1) backNumber += 1;
    response += `${backNumber + 1}. ${backText}\n`;
  }
  
  return {
    response,
    hasMore,
    currentPage: page,
    items: displayItems
  };
};

// Main USSD Handler
const handleUssdRequest = async (req: Request, res: Response) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  const parts = text ? text.split("*") : [];
  const step = parts.length;
  
  let response = "";
  let type = "CON";
  
  try {
    console.log(`USSD: ${phoneNumber}, Step: ${step}, Input: ${text}`);
    
    // STEP 0: Main Menu - Show Regions (Page 1)
    if (step === 0) {
      const result = await getPaginatedUssdMenu(
        prisma.region,
        1,
        {},
        "Kusoo dhawoow Ogaal\nDooro Gobol:",
        "0. Exit",
        false
      );
      response = result.response;
    }
    
    // Handle pagination navigation (Next/Previous)
    else if (step >= 1) {
      const lastInput = parts[parts.length - 1];
      const lastNumber = parseInt(lastInput);
      
      // Check if this is a navigation selection (Next/Previous/Back)
      if (lastInput.includes('next') || lastInput.includes('prev') || lastInput.includes('back')) {
        // We'll handle this in specific step logic
      }
      
      // STEP 1: Handle region selection or pagination
      if (step === 1) {
        const inputNum = parseInt(parts[0]);
        
        // Check if it's a navigation command
        if (parts[0].includes('page')) {
          const pageMatch = parts[0].match(/page(\d+)/);
          if (pageMatch) {
            const page = parseInt(pageMatch[1]);
            const result = await getPaginatedUssdMenu(
              prisma.region,
              page,
              {},
              `Kusoo dhawoow Ogaal\nDooro Gobol (Page ${page}):`,
              "0. Dib ugu noqo"
            );
            response = result.response;
          }
        }
        // Regular region selection (1-10, 11-20, etc.)
        else if (inputNum > 0) {
          const allRegions = await prisma.region.findMany({
            orderBy: { name: 'asc' }
          });
          
          if (inputNum <= allRegions.length) {
            const selectedRegion = allRegions[inputNum - 1];
            
            // Show districts for selected region (Page 1)
            const result = await getPaginatedUssdMenu(
              prisma.district,
              1,
              { region_id: selectedRegion.id },
              `Gobolka: ${selectedRegion.name}\nDooro Degmo:`,
              "0. Dib ugu noqo gobollada"
            );
            response = result.response;
          } else {
            response = "Gobol aan sax ahayn. Fadlan dooro lambar sax ah.";
          }
        }
        else if (inputNum === 0) {
          response = "Mahadsanid! Waqtiga kale.\n";
          type = "END";
        }
      }
      
      // STEP 2: Handle district selection or pagination
      else if (step === 2) {
        const regionIndex = parseInt(parts[0]) - 1;
        const districtInput = parts[1];
        
        if (districtInput.includes('page')) {
          const pageMatch = districtInput.match(/page(\d+)/);
          if (pageMatch) {
            const page = parseInt(pageMatch[1]);
            const allRegions = await prisma.region.findMany({ orderBy: { name: 'asc' } });
            const selectedRegion = allRegions[regionIndex];
            
            const result = await getPaginatedUssdMenu(
              prisma.district,
              page,
              { region_id: selectedRegion.id },
              `Gobolka: ${selectedRegion.name}\nDooro Degmo (Page ${page}):`,
              "0. Dib ugu noqo"
            );
            response = result.response;
          }
        }
        else {
          const allRegions = await prisma.region.findMany({ orderBy: { name: 'asc' } });
          const selectedRegion = allRegions[regionIndex];
          const allDistricts = await prisma.district.findMany({
            where: { region_id: selectedRegion.id },
            orderBy: { name: 'asc' }
          });
          
          const districtNum = parseInt(districtInput);
          if (districtNum > 0 && districtNum <= allDistricts.length) {
            const selectedDistrict = allDistricts[districtNum - 1];
            
            // Show villages for selected district (Page 1)
            const result = await getPaginatedUssdMenu(
              prisma.village,
              1,
              { district_id: selectedDistrict.id },
              `Degmada: ${selectedDistrict.name}\nDooro Tuulo:`,
              "0. Dib ugu noqo degmooyinka"
            );
            response = result.response;
          }
          else if (districtNum === 0) {
            // Go back to regions
            const result = await getPaginatedUssdMenu(
              prisma.region,
              1,
              {},
              "Kusoo dhawoow Ogaal\nDooro Gobol:",
              "0. Exit",
              false
            );
            response = result.response;
          }
        }
      }
      
      // STEP 3: Handle village selection or pagination
      else if (step === 3) {
        const regionIndex = parseInt(parts[0]) - 1;
        const districtIndex = parseInt(parts[1]) - 1;
        const villageInput = parts[2];
        
        if (villageInput.includes('page')) {
          const pageMatch = villageInput.match(/page(\d+)/);
          if (pageMatch) {
            const page = parseInt(pageMatch[1]);
            const allRegions = await prisma.region.findMany({ orderBy: { name: 'asc' } });
            const selectedRegion = allRegions[regionIndex];
            const allDistricts = await prisma.district.findMany({
              where: { region_id: selectedRegion.id },
              orderBy: { name: 'asc' }
            });
            const selectedDistrict = allDistricts[districtIndex];
            
            const result = await getPaginatedUssdMenu(
              prisma.village,
              page,
              { district_id: selectedDistrict.id },
              `Degmada: ${selectedDistrict.name}\nDooro Tuulo (Page ${page}):`,
              "0. Dib ugu noqo"
            );
            response = result.response;
          }
        }
        else {
          const allRegions = await prisma.region.findMany({ orderBy: { name: 'asc' } });
          const selectedRegion = allRegions[regionIndex];
          const allDistricts = await prisma.district.findMany({
            where: { region_id: selectedRegion.id },
            orderBy: { name: 'asc' }
          });
          const selectedDistrict = allDistricts[districtIndex];
          const allVillages = await prisma.village.findMany({
            where: { district_id: selectedDistrict.id },
            orderBy: { name: 'asc' }
          });
          
          const villageNum = parseInt(villageInput);
          if (villageNum > 0 && villageNum <= allVillages.length) {
            const selectedVillage = allVillages[villageNum - 1];
            
            // Show actions menu
            response = `Tuulada: ${selectedVillage.name}\nDooro waxaad rabto:\n`;
            response += "1. Hubi helitaanka biyaha\n";
            response += "2. Ka warbixi dhib\n";
            response += "3. Dib ugu noqo tuulooyinka\n";
          }
          else if (villageNum === 0) {
            // Go back to districts
            const result = await getPaginatedUssdMenu(
              prisma.district,
              1,
              { region_id: selectedRegion.id },
              `Gobolka: ${selectedRegion.name}\nDooro Degmo:`,
              "0. Dib ugu noqo gobollada"
            );
            response = result.response;
          }
        }
      }
      
      // STEP 4: Handle action selection
      else if (step === 4) {
        const regionIndex = parseInt(parts[0]) - 1;
        const districtIndex = parseInt(parts[1]) - 1;
        const villageIndex = parseInt(parts[2]) - 1;
        const action = parts[3];
        
        const allRegions = await prisma.region.findMany({ orderBy: { name: 'asc' } });
        const selectedRegion = allRegions[regionIndex];
        const allDistricts = await prisma.district.findMany({
          where: { region_id: selectedRegion.id },
          orderBy: { name: 'asc' }
        });
        const selectedDistrict = allDistricts[districtIndex];
        const allVillages = await prisma.village.findMany({
          where: { district_id: selectedDistrict.id },
          orderBy: { name: 'asc' }
        });
        const selectedVillage = allVillages[villageIndex];
        
        // FLOW 1: Check water availability
        if (action === "1") {
          // Show water sources (Page 1)
          const result = await getPaginatedUssdMenu(
            prisma.waterSource,
            1,
            { village_id: selectedVillage.id },
            `Tuulada: ${selectedVillage.name}\nDooro Isha Biyaha:`,
            "0. Dib ugu noqo"
          );
          
          if (result.items.length === 0) {
            response = `Ma jirto ilo biyood ah ${selectedVillage.name}`;
            type = "END";
          } else {
            response = result.response;
          }
        }
        // FLOW 2: Report issue
        else if (action === "2") {
          response = `Tuulada: ${selectedVillage.name}\nDooro dhibka:\n`;
          response += "1. Biyihii dhammaaday\n";
          response += "2. Ceelkaa jabay\n";
          response += "3. Biyo qashan\n";
          response += "4. Dhib kale\n";
          response += "5. Dib ugu noqo\n";
        }
        // Back to villages
        else if (action === "3") {
          const result = await getPaginatedUssdMenu(
            prisma.village,
            1,
            { district_id: selectedDistrict.id },
            `Degmada: ${selectedDistrict.name}\nDooro Tuulo:`,
            "0. Dib ugu noqo degmooyinka"
          );
          response = result.response;
        }
      }
      
      // STEP 5: Handle final selections
      else if (step === 5) {
        const regionIndex = parseInt(parts[0]) - 1;
        const districtIndex = parseInt(parts[1]) - 1;
        const villageIndex = parseInt(parts[2]) - 1;
        const action = parts[3];
        const selection = parts[4];
        
        const allRegions = await prisma.region.findMany({ orderBy: { name: 'asc' } });
        const selectedRegion = allRegions[regionIndex];
        const allDistricts = await prisma.district.findMany({
          where: { region_id: selectedRegion.id },
          orderBy: { name: 'asc' }
        });
        const selectedDistrict = allDistricts[districtIndex];
        const allVillages = await prisma.village.findMany({
          where: { district_id: selectedDistrict.id },
          orderBy: { name: 'asc' }
        });
        const selectedVillage = allVillages[villageIndex];
        
        // FLOW 1: Water source selected - show status
        if (action === "1") {
          if (selection.includes('page')) {
            // Handle water source pagination
            const pageMatch = selection.match(/page(\d+)/);
            if (pageMatch) {
              const page = parseInt(pageMatch[1]);
              const result = await getPaginatedUssdMenu(
                prisma.waterSource,
                page,
                { village_id: selectedVillage.id },
                `Tuulada: ${selectedVillage.name}\nDooro Isha Biyaha (Page ${page}):`,
                "0. Dib ugu noqo"
              );
              response = result.response;
            }
          }
          else {
            const waterSources = await prisma.waterSource.findMany({
              where: { village_id: selectedVillage.id },
              orderBy: { name: 'asc' }
            });
            
            const sourceNum = parseInt(selection);
            if (sourceNum > 0 && sourceNum <= waterSources.length) {
              const selectedSource = waterSources[sourceNum - 1];
              
              // Status mapping
              const statusMap: Record<string, string> = {
                "Working": "Wuu shaqeynayaa, biyo leh",
                "Broken": "Jaban",
                "Dry": "Qalalan",
                "Low Water": "Biyo yar",
                "Contaminated": "Wasakh",
                "Unknown": "Aan la aqoon"
              };
              
              const statusSomali = statusMap[selectedSource.status || ''] || "Aan la aqoon";
              
              response = `Isha Biyaha: ${selectedSource.name}\n`;
              response += `Tuulada: ${selectedVillage.name}\n`;
              response += `Noolaha: ${statusSomali}\n`;
              response += `Nooca: ${selectedSource.type || "Aan la aqoon"}\n`;
              response += `Aqoonsiga: ${selectedSource.inspecting_agency || "La aqoon"}\n\n`;
              response += "Mahadsanid! SMS waa la diray.";
              type = "END";
              
              // Send SMS
              const smsMessage = `OGAAL: ${selectedSource.name} - ${selectedVillage.name}\nNoolaha: ${statusSomali}\nNooca: ${selectedSource.type}\nAqoonsiga: ${selectedSource.inspecting_agency || "La aqoon"}`;
              await sendSMS(phoneNumber, smsMessage);
            }
            else if (sourceNum === 0) {
              // Go back to actions
              response = `Tuulada: ${selectedVillage.name}\nDooro waxaad rabto:\n`;
              response += "1. Hubi helitaanka biyaha\n";
              response += "2. Ka warbixi dhib\n";
              response += "3. Dib ugu noqo tuulooyinka\n";
            }
          }
        }
        // FLOW 2: Issue type selected - submit report
        else if (action === "2") {
          const issueTypes = ["Biyihii dhammaaday", "Ceelkaa jabay", "Biyo qashan", "Dhib kale"];
          const statusMap = ["DRY", "BROKEN", "CONTAMINATED", "UNKNOWN"];
          
          const issueNum = parseInt(selection);
          if (issueNum >= 1 && issueNum <= 4) {
            const issueDescription = issueTypes[issueNum - 1];
            const reportStatus = statusMap[issueNum - 1];
            
            // Create report
            await prisma.report.create({
              data: {
                village_id: selectedVillage.id,
                district_id: selectedDistrict.id,
                region_id: selectedRegion.id,
                reporter_type: "USSD",
                reporter_phone: phoneNumber,
                content: `Warbixinta USSD: ${issueDescription} - ${selectedVillage.name}`,
                status: reportStatus,
                issue_type: issueDescription
              }
            });
            
            response = `Waad mahadsan tahay!\n`;
            response += `Warbixintaada waa la diray ${selectedVillage.name}.\n`;
            response += `Lambarkaaga: ${phoneNumber}`;
            type = "END";
            
            // Send confirmation SMS
            await sendSMS(phoneNumber, `Warbixintaada waa la helay. Mahadsanid! - OGAAL`);
          }
          else if (issueNum === 5) {
            // Go back to actions
            response = `Tuulada: ${selectedVillage.name}\nDooro waxaad rabto:\n`;
            response += "1. Hubi helitaanka biyaha\n";
            response += "2. Ka warbixi dhib\n";
            response += "3. Dib ugu noqo tuulooyinka\n";
          }
        }
      }
    }
    
    // Handle invalid input
    if (!response) {
      response = "Doorasho aan sax ahayn. Fadlan isku day mar kale.\n";
      response += "0. Bilow mar kale";
    }
    
  } catch (error) {
    console.error("USSD Handler Error:", error);
    response = "Khalad baa dhacay. Fadlan isku day mar kale.\n";
    response += "0. Bilow mar kale";
    type = "CON";
  }
  
  res.json({ message: response, type });
};

export default handleUssdRequest;