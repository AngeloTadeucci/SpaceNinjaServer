import { RequestHandler } from "express";
import { getAccountIdForRequest } from "@/src/services/loginService";
import { getJSONfromString } from "@/src/helpers/stringHelpers";
import { getInventory, addMiscItems } from "@/src/services/inventoryService";
import { IOid } from "@/src/types/commonTypes";

export const infestedFoundryController: RequestHandler = async (req, res) => {
    const accountId = await getAccountIdForRequest(req);
    const payload = getJSONfromString(req.body.toString());
    switch (req.query.mode) {
        case "s": { // shard installation
            const request = payload as IShardInstallRequest;
            const inventory = await getInventory(accountId);
            const suit = inventory.Suits.find(suit => suit._id.toString() == request.SuitId.$oid)!;
            if (!suit.ArchonCrystalUpgrades
                || suit.ArchonCrystalUpgrades.length != 5 // we shouldn't have an array like this, but older inventories may disagree...
            ) {
                suit.ArchonCrystalUpgrades = [ {}, {}, {}, {}, {} ];
            }
            suit.ArchonCrystalUpgrades[request.Slot] = {
                UpgradeType: request.UpgradeType,
                Color: request.Color
            };
            const miscItemChanges = [
                {
                    ItemType: colorToShard[request.Color],
                    ItemCount: -1
                }
            ];
            addMiscItems(inventory, miscItemChanges);
            await inventory.save();
            res.json({
                InventoryChanges: {
                    MiscItems: miscItemChanges
                }
            });
            break;
        }

        case "n": { // name the beast
            const inventory = await getInventory(accountId);
            inventory.InfestedFoundry ??= {};
            inventory.InfestedFoundry.Name = payload.newName as string;
            await inventory.save();
            res.json({
                InventoryChanges: {
                    InfestedFoundry: {
                        Name: inventory.InfestedFoundry.Name
                    }
                }
            });
            break;
        }

        case "o": // offerings update
            // {"OfferingsIndex":540,"SuitTypes":["/Lotus/Powersuits/PaxDuviricus/PaxDuviricusBaseSuit","/Lotus/Powersuits/Nezha/NezhaBaseSuit","/Lotus/Powersuits/Devourer/DevourerBaseSuit"],"Extra":false}
            res.status(404).end();
            break;

        default:
            throw new Error(`unhandled infestedFoundry mode: ${req.query.mode}`);
    }
};

interface IShardInstallRequest {
    SuitId: IOid;
    Slot: number;
    UpgradeType: string;
    Color: string;
}

const colorToShard: Record<string, string> = {
    "ACC_RED": "/Lotus/Types/Gameplay/NarmerSorties/ArchonCrystalAmar",
    "ACC_RED_MYTHIC": "/Lotus/Types/Gameplay/NarmerSorties/ArchonCrystalAmarMythic",
    "ACC_YELLOW": "/Lotus/Types/Gameplay/NarmerSorties/ArchonCrystalNira",
    "ACC_YELLOW_MYTHIC": "/Lotus/Types/Gameplay/NarmerSorties/ArchonCrystalNiraMythic",
    "ACC_BLUE": "/Lotus/Types/Gameplay/NarmerSorties/ArchonCrystalBoreal",
    "ACC_BLUE_MYTHIC": "/Lotus/Types/Gameplay/NarmerSorties/ArchonCrystalBorealMythic",
    "ACC_GREEN": "/Lotus/Types/Gameplay/NarmerSorties/ArchonCrystalGreen",
    "ACC_GREEN_MYTHIC": "/Lotus/Types/Gameplay/NarmerSorties/ArchonCrystalGreenMythic",
    "ACC_ORANGE": "/Lotus/Types/Gameplay/NarmerSorties/ArchonCrystalOrange",
    "ACC_ORANGE_MYTHIC": "/Lotus/Types/Gameplay/NarmerSorties/ArchonCrystalOrangeMythic",
    "ACC_PURPLE": "/Lotus/Types/Gameplay/NarmerSorties/ArchonCrystalViolet",
    "ACC_PURPLE_MYTHIC": "/Lotus/Types/Gameplay/NarmerSorties/ArchonCrystalVioletMythic",
};
