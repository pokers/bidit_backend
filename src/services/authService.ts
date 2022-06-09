import { Service } from "typedi";
import { Repositories } from "../repository";

@Service()
class AuthService {
    constructor(private repositories:Repositories){

    }
}

export { AuthService }