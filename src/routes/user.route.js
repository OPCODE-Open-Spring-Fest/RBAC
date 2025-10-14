import { Router } from "express";
import { CheckHealth ,UserRegistration} from "../controllers/user.controller.js";
const router = Router();


router.route('/health').get(CheckHealth)


router.route('/register').post(UserRegistration)

export default router;
