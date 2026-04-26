import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data.json");

export async function GET() {
  try {
    const fileData = await fs.readFile(dataFilePath, "utf-8");
    const data = JSON.parse(fileData);
    // Don't send password to client
    const { password, ...safeSettings } = data.settings;
    return NextResponse.json({ ...data, settings: safeSettings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    // Read current data to verify password
    const fileData = await fs.readFile(dataFilePath, "utf-8");
    const currentData = JSON.parse(fileData);
    
    if (authHeader !== currentData.settings.password) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newData = await request.json();
    
    // Merge new data but keep password intact unless explicitly changed
    const updatedData = {
      ...currentData,
      ...newData,
      settings: {
        ...currentData.settings,
        ...(newData.settings || {}),
        password: newData.settings?.password || currentData.settings.password
      }
    };

    await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to write data" }, { status: 500 });
  }
}
