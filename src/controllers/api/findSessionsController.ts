import { RequestHandler } from "express";

const findSessionsController: RequestHandler = (_req, res) => {
    console.log("FindSession Request:", JSON.parse(_req.body));

    res.json({ sessionId: { $oid: "64768f104722f795300c9fc0" }, rewardSeed: 5867309943877621023 });
};

export { findSessionsController };
