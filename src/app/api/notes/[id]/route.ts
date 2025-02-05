import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Note } from "@/models/note.model";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decryptedData = verifyToken(token as string);

    if (!decryptedData) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { title, content, images, isFavourite } = await req.json();

    if (!title && !content && !images && !isFavourite) {
      return NextResponse.json(
        { success: false, message: "At least one field is required to update" },
        { status: 400 }
      );
    }

    const dataToUpdate: {
      title?: string;
      content?: string;
      images?: string[];
      isFavorite?: boolean;
    } = {};
    if (title) {
      dataToUpdate.title = title;
    }
    if (content) {
      dataToUpdate.content = content;
    }
    if (images && images.length > 0) {
      dataToUpdate.images = images;
    }

    if (isFavourite) {
      dataToUpdate.isFavorite = isFavourite;
    }

    const note = await Note.findOneAndUpdate(
      { _id: id, userId: decryptedData.id },
      dataToUpdate,
      { new: true }
    );

    if (!note) {
      return NextResponse.json(
        { success: false, message: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: note }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decryptedData = verifyToken(token as string);

    if (!decryptedData) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    const note = await Note.findOneAndDelete({
      _id: id,
      userId: decryptedData.id,
    });

    if (!note) {
      return NextResponse.json(
        { success: false, message: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
