import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();
import z from "zod";

export const createAuthor = async(req: Request, res: Response) => {
  try {
    const schema = z.object({
      authorName: z.string().min(4, "Name is required"),
      authorBio: z.string().min(10, "Bio must be of 10 characters"),
      authorLocation: z.string(),
      authorAvatar: z.string().url(),
      authorLinkedin: z.string().url("Must be Linkedin Profile url "),
      authorX: z.string().url("Must be a x profile url"),
    });
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: "Invalid input",
        error: result.error,
      });
      return;
    }

    const {
      authorName,
      authorBio,
      authorLocation,
      authorAvatar,
      authorLinkedin,
      authorX,
    } = result.data;

    const newAuthor = await prisma.author.create({
      data: {
        authorName,
        authorBio,
        authorLocation,
        authorAvatar,
        authorLinkedin,
        authorX,
      },
    });
    if(!newAuthor){
        res.status(400).json({
            message: "Failed to create new Author"
        });
        return
    }
    res.status(200).json({
        message: `${newAuthor.authorName} is now Author`
    })
  } catch (error) {
    const err = error as Error
    res.status(500).json({
        message:"Internal server error",
        error:err.message
    })
  }
};


export const getAuthorByName = async(req:Request,res:Response)=>{
  const {name} = req.params
  if(!name?.trim()){
    res.status(400).json({
      message: "All fields are required"
    })
  }
 console.log(name)
  try {
    const author = await prisma.author.findFirst({
      where:{
        authorName:name
      }
    })
    console.log(author)
    if(!author){
      res.status(404).json({
        message: "No Author found"
      });
      return
    }
    res.status(200).json({
      message: "Author found successfully",
      author:author
    })
  } catch (error) {
    const err = error as Error
    res.status(500).json({
      message: "Internal server error",
      error:err.message
    })
  }
}