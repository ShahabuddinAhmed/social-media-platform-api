import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

import { initializeDBConnection } from "./infra/db";

import { UserModel } from "./model/user";
import { PostModel } from "./model/post";

import { newUserRepo } from "./repo/user";
import { newPostRepo } from "./repo/post";

import { newUserService } from "./service/user";
import { newPostService } from "./service/post";

import { newV1Router } from "./web/router/v1/index";
import { newUserController } from "./web/controller/user";
import { newPostController } from "./web/controller/post";

import config from "./config/config";
import { newLogManager, newLogManagerStreamer } from "./infra/logger";


const app = express();

// registering app level middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// bootstrapping the application
(async () => {
    // initialize logger
    const logger = await newLogManager();
    const requestLogStreamer = await newLogManagerStreamer(logger);

    // initializing db connection
    const db = await initializeDBConnection(config.MONGO.MONGO_HOST, config.MONGO.MONGO_DB);

    // initializing repos
    const userRepo = await newUserRepo(UserModel);
    const postRepo = await newPostRepo(PostModel);

    // initializing services
    const userService = await newUserService(userRepo);
    const postService = await newPostService(postRepo);

    // initializing controllers
    const userController = await newUserController(userService, logger);
    const postController = await newPostController(postService, logger);

    //initialize routers
    const v1Router = await newV1Router(userController, postController);

    app.use(morgan("short", { stream: requestLogStreamer }));
    app.use("/api", v1Router);

})();


export default app;