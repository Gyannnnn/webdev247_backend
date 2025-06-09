"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const author_controller_1 = require("../controller/author/author.controller");
const authorRouter = (0, express_1.Router)();
authorRouter.post("/create", author_controller_1.createAuthor);
authorRouter.get("/get/:name", author_controller_1.getAuthorByName);
exports.default = authorRouter;
