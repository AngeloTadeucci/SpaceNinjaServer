import { Inventory } from "@/src/models/inventoryModels/inventoryModel";
import { RequestHandler } from "express";
import util from "util";
import {
    EquipmentCategories,
    IConfigEntry,
    ILoadoutRequest,
    ILoadoutKey,
    ISaveLoadoutRequest,
    ISaveLoadoutRequestNoUpgradeVer,
    ILoadoutConfigDatabase
} from "@/src/types/saveLoadoutTypes";
import { LoadoutModel } from "@/src/models/inventoryModels/loadoutModel";
import { Types } from "mongoose";

export const isEmptyObject = (obj: unknown): boolean => {
    return Boolean(obj && Object.keys(obj).length === 0 && obj.constructor === Object);
};

//setup default items on account creation or like originally in giveStartingItems.php

//export const updateLoadout = (loadout: ISaveLoadoutRequest, accountId: string) => {};

export const handleInventoryItemConfigChange = async (equipmentChanges: ISaveLoadoutRequestNoUpgradeVer) => {
    for (const [_equipmentName, _equipment] of Object.entries(equipmentChanges)) {
        const equipment = _equipment as ISaveLoadoutRequestNoUpgradeVer[keyof ISaveLoadoutRequestNoUpgradeVer];
        const equipmentName = _equipmentName as keyof ISaveLoadoutRequestNoUpgradeVer;

        if (isEmptyObject(equipment)) {
            continue;
        }
        // non-empty is a change in loadout(or suit...)

        switch (equipmentName) {
            case "LoadOuts": {
                console.log("loadout received");

                for (const [_loadoutSlot, _loadout] of Object.entries(equipment)) {
                    const loadoutSlot = _loadoutSlot as keyof ILoadoutRequest;
                    const loadout = _loadout as ILoadoutKey;

                    //console.log("key", loadoutSlot, "value", loadout);

                    if (isEmptyObject(loadout)) {
                        continue;
                    }
                    // all non-empty entries are one loadout slot
                    for (const [loadoutId, loadoutConfig] of Object.entries(loadout)) {
                        // console.log("loadoutId", loadoutId, "loadoutconfig", loadoutConfig);
                        const loadout = await LoadoutModel.findById("656a184a9cefa0e5627689af");
                        if (!loadout) {
                            throw new Error("loadout not found");
                        }

                        const oldLoadoutConfig = loadout[loadoutSlot].find(
                            loadout => loadout._id.toString() === loadoutId
                        );

                        // if no config with this id exists, create a new one
                        if (!oldLoadoutConfig) {
                            const { ItemId, ...loadoutConfigItemIdRemoved } = loadoutConfig;
                            loadout[loadoutSlot].push({
                                _id: ItemId.$oid,
                                ...loadoutConfigItemIdRemoved
                            });
                            await loadout.save();
                            continue;
                        }

                        const loadoutIndex = loadout[loadoutSlot].indexOf(oldLoadoutConfig);

                        if (loadoutIndex === undefined || loadoutIndex === -1) {
                            throw new Error("loadout index not found");
                        }

                        //console.log("parent id", oldLoadoutConfig.ownerDocument()._id);
                        loadout[loadoutSlot][loadoutIndex].set(loadoutConfig);
                        //loadout.NORMAL[loadoutIndex].overwrite(loadoutConfig);
                        //console.log("db", loadout[loadoutSlot][loadoutIndex].schema);

                        await loadout.save();
                        //({ _id: loadoutId }, loadoutConfig);
                    }
                }
                break;
            }
            case "LongGuns": {
                console.log("longgun received");
                console.log(equipmentName, equipment);

                const longGun = equipment as IConfigEntry;
                //   longGun["key"].PvpUpgrades;
                break;
            }
            case "OperatorAmps":
            case "Pistols":
            case "Suits":
            case "Melee":
            case "Sentinels":
            case "SentinelWeapons":
            case "KubrowPets":
            case "SpaceSuits":
            case "SpaceGuns":
            case "SpaceMelee":
            case "Scoops":
            case "SpecialItems":
            case "MoaPets":
            case "Hoverboards":
            case "DataKnives":
            case "MechSuits":
            case "CrewShipHarnesses":
            case "Horses":
            case "DrifterMelee":
            case "OperatorLoadOuts":
            case "AdultOperatorLoadOuts":
            case "KahlLoadOuts":
            case "CrewShips":

            default: {
                console.log("category not implemented", equipmentName);
            }
        }
        // Object.keys(value).forEach(element => {
        //     console.log("name of inner objects keys", element);
        // });
        // for (const innerValue of Object.values(value)) {
        //     console.log(innerValue);
        // }

        // console.log(innerObjects);
        // if (isObjectEmpty(innerObjects)) {
        //     console.log(innerObjects, "is empty");
        // }
    }
};

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const saveLoadoutController: RequestHandler = async (req, res) => {
    //validate here
    const body: ISaveLoadoutRequest = JSON.parse(req.body as string) as ISaveLoadoutRequest;
    // console.log(util.inspect(body, { showHidden: false, depth: null, colors: true }));

    const { UpgradeVer, ...equipmentChanges } = body;
    handleInventoryItemConfigChange(equipmentChanges);

    res.status(200).end();
};

export { saveLoadoutController };
