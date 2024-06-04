import { HomeController } from "../controllers/HomeController.js";
import { TeamController } from "../controllers/TeamController.js";
import { PredictController } from "../controllers/PredictController.js";

export class PageRouter{
    constructor(){
        this.routes = {
            "": HomeController,
            "home": HomeController,
            "team": TeamController,
            "predict": PredictController
        };
    }

    getController(path){
        return new this.routes[path]();
    }
}



