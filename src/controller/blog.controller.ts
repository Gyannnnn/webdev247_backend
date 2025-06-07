import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getLiveBlogs = async (req: Request, res: Response) => {
  try {
    const liveBlogs = await prisma.blog.findMany({
      where: {
        blogStatus: "LIVE",
      },
    });
    if (!liveBlogs || liveBlogs.length === 0) {
      res.status(404).json({
        message: "No Live Blogs found !",
      });
      return;
    }
    res.status(200).json({
        message:"Fetched successfully",
        liveBlogs:liveBlogs
    })
  } catch (error) {
    const err = error as Error
    res.status(500).json({
        message: "Internal server error",
        error:err.message
    })
  }
};

export const publishBlog = async(req:Request,res:Response)=>{
    const {notionBlogId} = req.params
    if(!notionBlogId?.trim()){
        res.status(400).json({
            message: "All fields are required"
        })
    }
    try {
        
    } catch (error) {
        
    }
}
