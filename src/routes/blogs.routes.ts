import { Router } from "express";
const blogRouter = Router();


import { getBlogsByTitle, getLiveBlogs, publishBlog,  } from "../controller/blog/blog.controller";


blogRouter.get("/live",getLiveBlogs)
blogRouter.post("/publish/:notionBlogId",publishBlog);
blogRouter.get("/title/:blogTitle",getBlogsByTitle);
// blogRouter.put("/update/:notionBlogId",updateBlog);




export default blogRouter;  