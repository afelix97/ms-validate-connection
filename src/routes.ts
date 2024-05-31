import { ValidateConnectionController } from "./controller/validateConnectionController";
import structure from './source/data';

export const Routes = [
    {
        method: "post",
        route: structure.APP_MSVALIDATECONNECTION_ROUTE_DO_CONNECTION,
        controller: ValidateConnectionController,
        action: "doConnection"
    }
];
