import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Note } from "@/models/note.model";
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

    const { title, content, images } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: "Title and content are required" },
        { status: 400 }
      );
    }

    const note = await Note.create({
      title,
      content,
      images,
      userId: decryptedData.id,
    });

    if (!note) {
      return NextResponse.json(
        { success: false, message: "Error creating note" },
        { status: 500 }
      );
    }

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
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const isFavouriteFilter = params.get("isFavourite");
  const sortByFilter = params.get("sortBy"); // "OLDEST" or "NEWEST"
  const searchFilter = params.get("search");

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

    const query: any = { userId: decryptedData.id };
    if (isFavouriteFilter === "true") {
      query.isFavorite = true;
    }

    if (searchFilter) {
      query.$or = [
        { title: { $regex: searchFilter, $options: "i" } },
        { content: { $regex: searchFilter, $options: "i" } },
      ];
    }

    let notesQuery = Note.find(query);

    if (sortByFilter === "NEWEST") {
      notesQuery = notesQuery.sort({ createdAt: -1 });
    } else if (sortByFilter === "OLDEST") {
      notesQuery = notesQuery.sort({ createdAt: 1 });
    }

    const notes = await notesQuery.exec();

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
