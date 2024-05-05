import { parseString } from "@/src/helpers/general";
import { getJSONfromString } from "@/src/helpers/stringHelpers";
import { upgradeMod } from "@/src/services/inventoryService";
import { IArtifactsRequest } from "@/src/types/requestTypes";
import { RequestHandler } from "express";

const artifactsController: RequestHandler = async (req, res) => {
    const accountId = parseString(req.query.accountId);

    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
        const artifactsData = getJSONfromString(req.body.toString()) as IArtifactsRequest;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const upgradeModId = await upgradeMod(artifactsData, accountId);
        res.send(upgradeModId);
    } catch (err) {
        console.error("Error parsing JSON data:", err);
    }
};

export { artifactsController };
