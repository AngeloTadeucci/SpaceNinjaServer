import { RequestHandler } from "express";
import { getJSONfromString } from "@/src/helpers/stringHelpers";
import { Inventory } from "@/src/models/inventoryModels/inventoryModel";
import { Guild } from "@/src/models/guildModel";
import { IGuild, guildDbToResponse, ICreateGuildRequest } from "@/src/types/guildTypes";

const createGuildController: RequestHandler = async (req, res) => {
    let payload: ICreateGuildRequest = getJSONfromString(req.body.toString());

    // Create guild on database
    let guild = new Guild({
        Name: payload.guildName
    } satisfies IGuild);
    await guild.save();

    // Update inventory
    let inventory = await Inventory.findOne({ accountOwnerId: req.query.accountId });
    if (inventory) {
        // Set GuildId
        inventory.GuildId = guild._id;

        // Give clan key
        inventory.LevelKeys ??= [];
        inventory.LevelKeys.push({
            ItemType: "/Lotus/Types/Keys/DojoKey",
            ItemCount: 1
        });

        await inventory.save();
    }

    res.json(guildDbToResponse(guild));
};

export { createGuildController };
