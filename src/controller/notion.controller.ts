import { Request, Response } from "express";
import { BlockObjectResponse, Client } from "@notionhq/client";

// notion configuration

export const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
});

export const notionHello = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello From notion controller",
  });
};

// fetches all blogs on notion
export const fetchAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
    });
    if (!blogs) {
      res.status(404).json({
        message: "no blogs found!",
      });
      return;
    }
    res.status(200).json({
      message: "Blog fetched successfully",
      blogs: (await blogs).results,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Something went wrong !",
      error: err.message,
    });
  }
};

// fetches all ready to live blogs on notion

export const fetchReadyBlogs = async (req: Request, res: Response) => {
  try {
    const readyBlogs = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "status",
        select: {
          equals: "READY",
        },
      },
    });
    if (!readyBlogs) {
      res.status(404).json({
        message: "No READY Blogs found",
      });
      return;
    }
    res.status(200).json({
      message: "Successfully fetched READY Blogs",
      Blogs: readyBlogs,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const fetchBlogByTitle = async (req: Request, res: Response) => {
  const { title } = req.params;
  if (!title?.trim()) {
    res.status(400).json({
      message: "All fields are required",
    });
    return;
  }

  try {
    const fetchedBlogs = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: "title",
        rich_text: {
          equals: title,
        },
      },
    });

    if (!fetchedBlogs) {
      res.status(404).json({
        message: "No blogs found",
      });
      return;
    }

    res.status(200).json({
      message: "Fetched successfully",
      blogs: fetchedBlogs,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const fetchPageBlockById = async (req: Request, res: Response) => {
  const { notionBlogId } = req.params;
  if (!notionBlogId?.trim()) {
    res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const blogPageBlock = await notion.blocks.children.list({
      block_id: notionBlogId,
    });
    res.status(200).json({
      message: "Fetched successfully",
      data: blogPageBlock.results as BlockObjectResponse[],
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Internal Server error",
      error: err.message,
    });
  }
};




export const setBlogLive = async(req:Request,res:Response)=>{
  const {notionBlogId} = req.params
  if(!notionBlogId?.trim()){
    res.status(400).json({
      message:"All fields are required"
    });
    return
  }

  try {
    const response = await notion.pages.update({
      page_id:notionBlogId,
      properties:{
        status:{
          select:{
            name:"LIVE"
          }
        }
      }
    })
    res.status(200).json({
      message: "Updated successfully"
    })
  } catch (error) {
    const err = error as Error
    res.status(500).json({
      message: "Internal Server error",
      error:err.message
    })
  }


}