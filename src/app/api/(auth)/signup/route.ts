import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateToken } from "@/utils/auth";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/user.model";

interface SignupRequestInterface {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { name, email, password }: SignupRequestInterface = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required!",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists!",
        },
        {
          status: 400,
        }
      );
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Error while creating user!",
        },
        {
          status: 500,
        }
      );
    }

    const newToken = generateToken({ id: user._id as string, email: user.email });

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "User created successfully!",
        user: userResponse,
      },
      {
        status: 200,
      }
    );

    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        {
          status: 500,
        }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Unknown error occurred" },
        { status: 500 }
      );
    }
  }
}