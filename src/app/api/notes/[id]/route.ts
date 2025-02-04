import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Note } from "@/models/note.model";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";
import { uploadImage } from "@/utils/cloudinary";

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
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File | null;

    if (!title && !content && !image) {
      return NextResponse.json(
        { success: false, message: "At least one field is required to update" },
        { status: 400 }
      );
    }

    const updateData: { title?: string; content?: string; imgUrl?: string } =
      {};

    if (title) {
      updateData.title = title;
    }

    if (content) {
      updateData.content = content;
    }

    let imgUrl = null;
    if (image) {
      imgUrl = (await uploadImage(image)) as string;
      updateData.imgUrl = imgUrl;
    }

    const note = await Note.findOneAndUpdate(
      { _id: id, userId: decryptedData.id },
      updateData,
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
