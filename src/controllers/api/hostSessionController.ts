import { RequestHandler } from "express";
import { getAccountIdForRequest } from "@/src/services/loginService";
import { createNewSession } from "@/src/managers/sessionManager";
import { logger } from "@/src/utils/logger";
import { ISession } from "@/src/types/session";

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const hostSessionController: RequestHandler = async (req, res) => {
    const accountId = await getAccountIdForRequest(req);
    const hostSessionRequest = JSON.parse(String(req.body)) as ISession;
    logger.debug("HostSession Request", { hostSessionRequest });
    const session = createNewSession(hostSessionRequest, accountId);
    logger.debug(`New Session Created`, { session });

    res.json({ sessionId: { $oid: session.sessionId }, rewardSeed: 99999999 });
};

export { hostSessionController };
