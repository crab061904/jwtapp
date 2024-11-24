import express from "express";
import authentication from "./authentication";
import users from "./users";

const router = express.Router();

export default (): express.Router => {
    console.log("Registering authentication and user routes...");
    authentication(router);
    users(router);
  
    // Log registered routes
    console.log(
      "Registered routes:",
      router.stack.map((r) => r.route?.path) // List all paths
    );
  
    return router;
  };
  
