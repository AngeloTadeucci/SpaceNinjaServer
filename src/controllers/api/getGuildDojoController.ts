import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Guild } from "@/src/models/guildModel";
import { IDojoClient } from "@/src/types/guildTypes";
import { toOid, toMongoDate } from "@/src/helpers/inventoryHelpers";

export const getGuildDojoController: RequestHandler = async (req, res) => {
    const guildId = req.query.guildId as string;

    const guild = await Guild.findOne({ _id: guildId });
    if (!guild) {
        res.status(404).end();
        return;
    }

    // Populate dojo info if not present
    if (!guild.DojoComponents || guild.DojoComponents.length == 0) {
        guild.DojoComponents = [
            {
                _id: new Types.ObjectId(),
                pf: "/Lotus/Levels/ClanDojo/DojoHall.level",
                ppf: "",
                CompletionTime: new Date(Date.now())
            }
        ];
        await guild.save();
    }

    const dojo: IDojoClient = {
        _id: { $oid: guildId },
        Name: guild.Name,
        Tier: 1,
        FixedContributions: true,
        DojoRevision: 1,
        RevisionTime: Math.round(Date.now() / 1000),
        Energy: 5,
        Capacity: 100,
        DojoRequestStatus: 0,
        DojoComponents: []
    };
    guild.DojoComponents.forEach(dojoComponent => {
        dojo.DojoComponents.push({
            id: toOid(dojoComponent._id),
            pf: dojoComponent.pf,
            ppf: dojoComponent.ppf,
            CompletionTime: toMongoDate(dojoComponent.CompletionTime),
            DecoCapacity: 600
        });
    });
    res.json(dojo);
};
