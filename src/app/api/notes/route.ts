import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Note } from "@/models/note.model";
import { uploadImage } from "@/utils/cloudinary";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const token = cookies().get("token")?.value as string;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const decryptedData = verifyToken(token);

    if (!decryptedData) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File | null;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: "Title and content are required" },
        { status: 400 }
      );
    }

    let imgUrl = null;
    if (image) {
      imgUrl = (await uploadImage(image)) as string;
    }

    const note = await Note.create({
      title,
      content,
      imgUrl,
      userId: decryptedData?.id,
    });

    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Error creating note" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const token = cookies().get("token")?.value as string;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const decryptedData = verifyToken(token);

    if (!decryptedData) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const notes = await Note.find({ userId: decryptedData?.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, data: notes }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Error fetching notes" },
      { status: 500 }
    );
  }
}
