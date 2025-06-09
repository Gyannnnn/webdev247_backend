import { Client, PageObjectResponse } from "@notionhq/client";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();
import z from "zod";

export const notion = new Client({
  auth: process.env.NOTION_INTEGRATION_SECRET,
});

export const getLiveBlogs = async (req: Request, res: Response) => {
  try {
    const liveBlogs = await prisma.blog.findMany({
      where: {
        blogStatus: "LIVE",
      },
      orderBy: {
        blogDate: "desc",
      },
    });

    if (!liveBlogs || liveBlogs.length === 0) {
      res.status(404).json({
        message: "No Live Blogs found !",
      });
      return;
    }
    res.status(200).json({
      message: "Fetched successfully",
      liveBlogs: liveBlogs,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const publishBlog = async (req: Request, res: Response) => {
  const { notionBlogId } = req.params;
  if (!notionBlogId?.trim()) {
    res.status(400).json({
      message: "All fields are required",
    });
  }
  try {
    await notion.pages.update({
      page_id: notionBlogId,
      properties: {
        status: {
          select: {
            name: "LIVE",
          },
        },
      },
    });
    console.log(1);
    const dataBlocks = await notion.blocks.children.list({
      block_id: notionBlogId,
    });
    const page = await notion.pages.retrieve({ page_id: notionBlogId });
    console.log(page);
    //@ts-ignore
    const props = page.properties;
    console.log("xxxxxxxxxxxxxxxxxx");
    console.log(props.Author.people[0].name);
    const blogTitle =
      //@ts-ignore
      props.title?.title?.map((t) => t.plain_text).join("") ||
      //@ts-ignore
      props.Name?.title?.map((t) => t.plain_text).join("") ||
      null;

    // 2. thumbnail (rich_text or url)
    const thumbnail = props.Thumbnail?.rich_text?.[0]?.plain_text || null;

    // 3. blogStatus (select)
    const blogStatus = props.status?.select?.name || null;

    // 4. relatedTags (multi_select)
    //@ts-ignore
    const relatedTags =
      //@ts-ignore
      props.related_tags?.multi_select?.map((tag) => tag.name) || [];

    // 5. mainTag (select)
    const mainTag = props.main_tag?.select?.name || null;
    const blogAuthor = props.Author.people[0].name;
    // 6. relatedBlogs (multi_select)
    //@ts-ignore
    const relatedBlogs =
      //@ts-ignore
      props["related blog"]?.multi_select?.map((blog) => blog.name) || [];
    console.log(
      blogTitle,
      thumbnail,
      blogStatus,
      relatedTags,
      mainTag,
      relatedBlogs
    );

    console.log("======================================");
    const newBlog = await prisma.blog.create({
      data: {
        blogNotionId: notionBlogId as string,
        blogTitle: blogTitle,
        thumbnail,

        blogStatus,
        blogAuthor,
        relatedBlogs,
        relatedTags,
        mainTag,
      },
    });
    console.log(newBlog);
    if (!newBlog) {
      res.status(500).json({
        message: "Internal server error",
      });
    }
    res.status(200).json({
      message: `${blogTitle} published successfully`,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getBlogsByTitle = async (req: Request, res: Response) => {
  const { blogTitle } = req.params;
  if (!blogTitle?.trim()) {
    res.status(400).json({
      message: "All Fields are required",
    });
  }

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        blogTitle,
      },
      select: {
        blogId: true,
        blogNotionId: true,
        blogTitle: true,
        thumbnail: true,
        likes: true,
        blogStatus: true,
        blogAuthor: true,
        blogDate: true,
        relatedTags: true,
        mainTag: true,
        relatedBlogs: true,
        comments: true,
      },
    });

    res.status(200).json({
      message: "Blog fetched successfully",
      blog: blog,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

// export const updateBlog = async (req: Request, res: Response) => {
//   try {
//     const schema = z.object({
//       notionBlogId: z.string().uuid(),
//     });
//     const result = schema.safeParse(req.params);
//     if (!result.success) {
//       res.status(400).json({
//         message: "Invalid input",
//         error: result.error,
//       });
//       return;
//     }
//     const { notionBlogId } = result.data;

//     await notion.pages.update({
//       page_id: notionBlogId,
//       properties: {
//         status: {
//           select: {
//             name: "LIVE",
//           },
//         },
//       },
//     });

//     const dataBlocks = await notion.blocks.children.list({
//       block_id: notionBlogId,
//     });

//     if(!dataBlocks){
//       res.status(400).json({
//         message: "Failed to fetch notion content !",
//       });
//       return
//     }

//     const blog = await prisma.blog.update({
//       where: {
//         blogNotionId: notionBlogId,
//       }
//     });
//     if (!blog) {
//       res.status(400).json({
//         message: "Failed to update blog",
//       });
//       return;
//     }

//     res.status(200).json({
//       message: `${blog.blogTitle}  updated successfully`,
//     });
//   } catch (error) {
//     const err = error as Error;
//     res.status(500).json({
//       message: "Internal server error",
//       error: err.message,
//     });
//   }
// };
