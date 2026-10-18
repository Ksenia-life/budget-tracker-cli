import { ApplicationController } from "./classes/ApplicationController";
import { setInitialState } from "./initialState";

const controller = new ApplicationController();

const useInitialData = false;

if (useInitialData) {
    setInitialState(controller);
}

await controller.start();
