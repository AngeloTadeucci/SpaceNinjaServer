import { checkDailyMissionBonusController } from "@/src/controllers/api/checkDailyMissionBonusController";
import { deleteSessionController } from "@/src/controllers/api/deleteSessionController";
import { dronesController } from "@/src/controllers/api/dronesController";
import { findSessionsController } from "@/src/controllers/api/findSessionsController";
import { genericUpdateController } from "@/src/controllers/api/genericUpdateController";
import { getAllianceController } from "@/src/controllers/api/getAllianceController";
import { getCreditsController } from "@/src/controllers/api/getCreditsController";
import { getFriendsController } from "@/src/controllers/api/getFriendsController";
import { getIgnoredUsersController } from "@/src/controllers/api/getIgnoredUsersController";
import { getNewRewardSeedController } from "@/src/controllers/api/getNewRewardSeedController";
import { getShipController } from "@/src/controllers/api/getShipController";
import { hostSessionController } from "@/src/controllers/api/hostSessionController";
import { hubController } from "@/src/controllers/api/hubController";
import { hubInstancesController } from "@/src/controllers/api/hubInstancesController";
import { inboxController } from "@/src/controllers/api/inboxController";
import { inventoryController } from "@/src/controllers/api/inventoryController";
import { loginController } from "@/src/controllers/api/loginController";
import { loginRewardsController } from "@/src/controllers/api/loginRewardsController";
import { logoutController } from "@/src/controllers/api/logoutController";
import { marketRecommendationsController } from "@/src/controllers/api/marketRecommendationsController";
import { missionInventoryUpdateController } from "@/src/controllers/api/missionInventoryUpdateController";
import { modularWeaponSaleController } from "@/src/controllers/api/modularWeaponSaleController";
import { purchaseController } from "@/src/controllers/api/purchaseController";
import { rerollRandomModController } from "@/src/controllers/api/rerollRandomModController";
import { setActiveQuestController } from "@/src/controllers/api/setActiveQuestController";
import { surveysController } from "@/src/controllers/api/surveysController";
import { updateChallengeProgressController } from "@/src/controllers/api/updateChallengeProgressController";
import { updateSessionGetController, updateSessionPostController } from "@/src/controllers/api/updateSessionController";
import { joinSessionController } from "@/src/controllers/api/joinSessionController";
import { saveLoadoutController } from "@/src/controllers/api/saveLoadout";
import { trainingResultController } from "@/src/controllers/api/trainingResultController";
import { artifactsController } from "../controllers/api/artifactsController";

import express from "express";
import { setBootLocationController } from "@/src/controllers/api/setBootLocationController";
import { focusController } from "@/src/controllers/api/focusController";
import { inventorySlotsController } from "@/src/controllers/api/inventorySlotsController";
import { startRecipeController } from "@/src/controllers/api/startRecipeController";
import { claimCompletedRecipeController } from "@/src/controllers/api/claimCompletedRecipeController";
import { shipDecorationsController } from "@/src/controllers/api/shipDecorationsController";
import { setShipCustomizationsController } from "@/src/controllers/api/setShipCustomizationsController";
import { setActiveShipController } from "@/src/controllers/api/setActiveShipController";
import { updateThemeController } from "../controllers/api/updateThemeController";
import { getGuildController } from "@/src/controllers/api/getGuildController";
import { addFriendImageController } from "@/src/controllers/api/addFriendImageController";
import { createGuildController } from "@/src/controllers/api/createGuildController";
import { sellController } from "@/src/controllers/api/sellController";
import { upgradesController } from "@/src/controllers/api/upgradesController";
import { setSupportedSyndicateController } from "@/src/controllers/api/setSupportedSyndicateController";

const apiRouter = express.Router();

// get
apiRouter.get("/inventory.php", inventoryController);
apiRouter.get("/getFriends.php", getFriendsController);
apiRouter.get("/marketRecommendations.php", marketRecommendationsController);
apiRouter.get("/marketSearchRecommendations.php", marketRecommendationsController);
apiRouter.get("/surveys.php", surveysController);
apiRouter.get("/loginRewards.php", loginRewardsController);
apiRouter.get("/checkDailyMissionBonus.php", checkDailyMissionBonusController);
apiRouter.get("/inbox.php", inboxController);
apiRouter.get("/getShip.php", getShipController);
apiRouter.get("/drones.php", dronesController);
apiRouter.get("/getIgnoredUsers.php", getIgnoredUsersController);
apiRouter.get("/getNewRewardSeed.php", getNewRewardSeedController);
apiRouter.get("/setActiveQuest.php", setActiveQuestController);
apiRouter.get("/updateSession.php", updateSessionGetController);
apiRouter.get("/credits.php", getCreditsController);
apiRouter.get("/hubInstances", hubInstancesController);
apiRouter.get("/hub", hubController);
apiRouter.get("/modularWeaponSale.php", modularWeaponSaleController);
apiRouter.get("/deleteSession.php", deleteSessionController);
apiRouter.get("/logout.php", logoutController);
apiRouter.get("/setBootLocation.php", setBootLocationController);
apiRouter.get("/setActiveShip.php", setActiveShipController);
apiRouter.get("/getGuild.php", getGuildController);
apiRouter.get("/setSupportedSyndicate.php", setSupportedSyndicateController);

// post
// eslint-disable-next-line @typescript-eslint/no-misused-promises
apiRouter.post("/shipDecorations.php", shipDecorationsController);
apiRouter.post("/setShipCustomizations.php", setShipCustomizationsController);
apiRouter.post("/claimCompletedRecipe.php", claimCompletedRecipeController);
apiRouter.post("/startRecipe.php", startRecipeController);
apiRouter.post("/inventorySlots.php", inventorySlotsController);
apiRouter.post("/focus.php", focusController);
apiRouter.post("/artifacts.php", artifactsController);
apiRouter.post("/findSessions.php", findSessionsController);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
apiRouter.post("/purchase.php", purchaseController);
apiRouter.post("/login.php", loginController);
apiRouter.post("/getAlliance.php", getAllianceController);
apiRouter.post("/updateChallengeProgress.php", updateChallengeProgressController);
apiRouter.post("/hostSession.php", hostSessionController);
apiRouter.post("/updateSession.php", updateSessionPostController);
apiRouter.post("/missionInventoryUpdate.php", missionInventoryUpdateController);
apiRouter.post("/genericUpdate.php", genericUpdateController);
apiRouter.post("/rerollRandomMod.php", rerollRandomModController);
apiRouter.post("/joinSession.php", joinSessionController);
apiRouter.post("/saveLoadout.php", saveLoadoutController);
apiRouter.post("/trainingResult.php", trainingResultController);
apiRouter.post("/updateTheme.php", updateThemeController);
apiRouter.post("/addFriendImage.php", addFriendImageController);
apiRouter.post("/createGuild.php", createGuildController);
apiRouter.post("/sell.php", sellController);
apiRouter.post("/upgrades.php", upgradesController);

export { apiRouter };
