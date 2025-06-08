import { Router } from "express";
const blogRouter = Router();


import { getBlogsByTitle, getLiveBlogs, publishBlog } from "../controller/blog.controller";


blogRouter.get("/live",getLiveBlogs)
blogRouter.post("/publish/:notionBlogId",publishBlog);
blogRouter.get("/title/:blogTitle",getBlogsByTitle)




export default blogRouter;  