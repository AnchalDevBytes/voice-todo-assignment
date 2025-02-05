import { uploadImage } from "@/utils/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const image = formData.get("image") as File;
  if (!image) {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }
  try {
    const url = await uploadImage(image);
    if (!url) {
      return NextResponse.json(
        { error: "Something went wrong while uploading image" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "image Uploaded successfully",
        data: { imgUrl: url },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Something went wrong while uploading image" },
      { status: 500 }
    );
  }
}
