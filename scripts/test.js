import { PageRouter } from "./routers/PageRouter.js";
import { Database } from "./models/Database.js";

var database = new Database();
export { database };
// This is the entry point of the application.
const router = new PageRouter();

// This is the controller that will be used to handle the current page.
let path = window.location.pathname;
path = path.split("/").pop().replace(".html", "");
const controller = router.getController(path);

// This is the query string that will be used to determine the model used by the controller.
let query = window.location.search;
query = query.replace("?", "");

while(!database.ready){
    console.log("waiting");
    await new Promise(r => setTimeout(r, 500));
}

controller.renderPage(query);

