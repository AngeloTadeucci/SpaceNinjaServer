import { parseSlotPurchaseName } from "@/src/helpers/purchaseHelpers";
import { getSubstringFromKeyword } from "@/src/helpers/stringHelpers";
import { addItem, addBooster, updateCurrency, updateSlots } from "@/src/services/inventoryService";
import { IPurchaseRequest, SlotPurchase } from "@/src/types/purchaseTypes";
import { logger } from "@/src/utils/logger";

export const getStoreItemCategory = (storeItem: string) => {
    const storeItemString = getSubstringFromKeyword(storeItem, "StoreItems/");
    const storeItemElements = storeItemString.split("/");
    return storeItemElements[1];
};

export const getStoreItemTypesCategory = (typesItem: string) => {
    const typesString = getSubstringFromKeyword(typesItem, "Types");
    const typeElements = typesString.split("/");
    if (typesItem.includes("StoreItems")) {
        return typeElements[2];
    }
    return typeElements[1];
};

export const handlePurchase = async (purchaseRequest: IPurchaseRequest, accountId: string) => {
    logger.debug("purchase request", purchaseRequest);
    const storeCategory = getStoreItemCategory(purchaseRequest.PurchaseParams.StoreItem);
    const internalName = purchaseRequest.PurchaseParams.StoreItem.replace("/StoreItems", "");
    logger.debug(`store category ${storeCategory}`);

    let purchaseResponse;
    switch (storeCategory) {
        default:
            purchaseResponse = await addItem(accountId, internalName);
            break;
        case "Types":
            purchaseResponse = await handleTypesPurchase(
                internalName,
                accountId,
                purchaseRequest.PurchaseParams.Quantity
            );
            break;
        case "Boosters":
            purchaseResponse = await handleBoostersPurchase(internalName, accountId);
            break;
    }

    if (!purchaseResponse) throw new Error("purchase response was undefined");

    const currencyChanges = await updateCurrency(
        purchaseRequest.PurchaseParams.ExpectedPrice,
        purchaseRequest.PurchaseParams.UsePremium,
        accountId
    );

    purchaseResponse.InventoryChanges = {
        ...currencyChanges,
        ...purchaseResponse.InventoryChanges
    };

    return purchaseResponse;
};

export const slotPurchaseNameToSlotName: SlotPurchase = {
    SuitSlotItem: { name: "SuitBin", slotsPerPurchase: 1 },
    TwoSentinelSlotItem: { name: "SentinelBin", slotsPerPurchase: 2 },
    TwoWeaponSlotItem: { name: "WeaponBin", slotsPerPurchase: 2 },
    SpaceSuitSlotItem: { name: "SpaceSuitBin", slotsPerPurchase: 1 },
    TwoSpaceWeaponSlotItem: { name: "SpaceWeaponBin", slotsPerPurchase: 2 },
    MechSlotItem: { name: "MechBin", slotsPerPurchase: 1 },
    TwoOperatorWeaponSlotItem: { name: "OperatorAmpBin", slotsPerPurchase: 2 },
    RandomModSlotItem: { name: "RandomModBin", slotsPerPurchase: 3 },
    TwoCrewShipSalvageSlotItem: { name: "CrewShipSalvageBin", slotsPerPurchase: 2 },
    CrewMemberSlotItem: { name: "CrewMemberBin", slotsPerPurchase: 1 }
};

// // extra = everything above the base +2 slots (depending on slot type)
// // new slot above base = extra + 1 and slots +1
// // new frame = slots -1
// // number of frames = extra - slots + 2
const handleSlotPurchase = async (slotPurchaseNameFull: string, accountId: string) => {
    logger.debug(`slot name ${slotPurchaseNameFull}`);
    const slotPurchaseName = parseSlotPurchaseName(
        slotPurchaseNameFull.substring(slotPurchaseNameFull.lastIndexOf("/") + 1)
    );
    logger.debug(`slot purchase name ${slotPurchaseName}`);

    const slotName = slotPurchaseNameToSlotName[slotPurchaseName].name;
    const slotsPerPurchase = slotPurchaseNameToSlotName[slotPurchaseName].slotsPerPurchase;

    await updateSlots(accountId, slotName, slotsPerPurchase, slotsPerPurchase);

    logger.debug(`added ${slotsPerPurchase} slot ${slotName}`);

    return {
        InventoryChanges: {
            [slotName]: {
                count: 0,
                platinum: 1,
                Slots: slotsPerPurchase,
                Extra: slotsPerPurchase
            }
        }
    };
};

//TODO: change to getInventory, apply changes then save at the end
const handleTypesPurchase = async (typesName: string, accountId: string, quantity: number) => {
    const typeCategory = getStoreItemTypesCategory(typesName);
    logger.debug(`type category ${typeCategory}`);
    switch (typeCategory) {
        default:
            return await addItem(accountId, typesName, quantity);
        case "SlotItems":
            return await handleSlotPurchase(typesName, accountId);
    }
};

const boosterCollection = [
    "/Lotus/Types/Boosters/ResourceAmountBooster",
    "/Lotus/Types/Boosters/AffinityBooster",
    "/Lotus/Types/Boosters/ResourceDropChanceBooster",
    "/Lotus/Types/Boosters/CreditBooster"
];

const handleBoostersPurchase = async (boosterStoreName: string, accountId: string) => {
    const match = boosterStoreName.match(/(\d+)Day/);
    if (!match) return;

    const extractedDigit = Number(match[1]);
    const ItemType = boosterCollection.find(i =>
        boosterStoreName.includes(i.split("/").pop()!.replace("Booster", ""))
    )!;
    const ExpiryDate = extractedDigit * 86400;

    await addBooster(ItemType, ExpiryDate, accountId);

    return {
        InventoryChanges: {
            Boosters: [{ ItemType, ExpiryDate }]
        }
    };
};
