import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest) {
  
  const { name, isActive } = await req.json();

  if (!name || typeof isActive === "undefined") {
    return NextResponse.json(
      { success: false, message: "Invalid request data" },
      { status: 400 }
    );
  }

  const filePath = path.join(process.cwd(), "public", "data.json");
  

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { success: false, message: "Data file not found" },
      { status: 404 }
    );
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    
    const cardIndex = data.findIndex((card: { name: string }) => card.name === name);

    if (cardIndex !== -1) {
      data[cardIndex].isActive = isActive;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Card not found" },
        { status: 404 }
      );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: `Failed to read/write data: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { name } = await req.json();
  

  
  if (!name) {
      return NextResponse.json(
      { success: false, message: "Invalid request data" },
      { status: 400 }
      );
  }
  
  const filePath = path.join(process.cwd(), "public", "data.json");
  
  if (!fs.existsSync(filePath)) {
      return NextResponse.json(
      { success: false, message: "Data file not found" },
      { status: 404 }
      );
  }
  
  try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  
      const updatedData = data.filter((card: { name: string }) => card.name !== name);
  
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
      
      return NextResponse.json({ success: true });
  } catch (error: unknown) {
      const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
      { success: false, message: `Failed to read/write data: ${errorMessage}` },
      { status: 500 }
      );
  }
}