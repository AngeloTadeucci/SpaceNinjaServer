import { Model, Schema, Types, model } from "mongoose";
import {
    IFlavourItem,
    IRawUpgrade,
    ICrewShipSalvagedWeaponSkin,
    IMiscItem,
    IInventoryDatabase,
    IBooster,
    IInventoryResponse,
    ISlots,
    IGenericItem,
    IMailbox,
    IDuviriInfo,
    IPendingRecipe as IPendingRecipeDatabase,
    IPendingRecipeResponse,
    ITypeCount,
    IFocusXP,
    IFocusUpgrades,
    IGenericItem2,
    ITypeXPItem,
    IChallengeProgress,
    IStepSequencer,
    IAffiliation,
    INotePacks,
    ICompletedJobChain,
    ISeasonChallengeHistory,
    IPlayerSkills,
    ISettings,
    IInfestedFoundry,
    IConsumedSuit,
    IQuestProgress,
    IQuestKeyDatabase,
    IQuestKeyResponse,
    IFusionTreasure,
    ISpectreLoadout,
    IWeaponSkin,
    ITauntHistory,
    IPeriodicMissionCompletionDatabase,
    IPeriodicMissionCompletionResponse,
    ILoreFragmentScan
} from "../../types/inventoryTypes/inventoryTypes";
import { IOid } from "../../types/commonTypes";
import { ISuitDatabase } from "@/src/types/inventoryTypes/SuitTypes";
import { IWeaponDatabase } from "@/src/types/inventoryTypes/weaponTypes";
import {
    IAbilityOverride,
    IColor,
    IItemConfig,
    IOperatorConfigClient,
    IOperatorConfigDatabase,
    IPolarity
} from "@/src/types/inventoryTypes/commonInventoryTypes";
import { toMongoDate, toOid } from "@/src/helpers/inventoryHelpers";

const typeCountSchema = new Schema<ITypeCount>({ ItemType: String, ItemCount: Number }, { _id: false });

const focusXPSchema = new Schema<IFocusXP>(
    {
        AP_POWER: Number,
        AP_TACTIC: Number,
        AP_DEFENSE: Number,
        AP_ATTACK: Number,
        AP_WARD: Number
    },
    { _id: false }
);

const focusUpgradesSchema = new Schema<IFocusUpgrades>(
    {
        ItemType: String,
        Level: Number,
        IsUniversal: Boolean
    },
    { _id: false }
);

const pendingRecipeSchema = new Schema<IPendingRecipeDatabase>(
    {
        ItemType: String,
        CompletionDate: Date
    },
    { id: false }
);

pendingRecipeSchema.virtual("ItemId").get(function () {
    return { $oid: this._id.toString() };
});

pendingRecipeSchema.set("toJSON", {
    virtuals: true,
    transform(_document, returnedObject) {
        delete returnedObject._id;
        delete returnedObject.__v;
        (returnedObject as IPendingRecipeResponse).CompletionDate = {
            $date: { $numberLong: (returnedObject as IPendingRecipeDatabase).CompletionDate.getTime().toString() }
        };
    }
});

const polaritySchema = new Schema<IPolarity>({
    Slot: Number,
    Value: String
});

const abilityOverrideSchema = new Schema<IAbilityOverride>({
    Ability: String,
    Index: Number
});
export const colorSchema = new Schema<IColor>(
    {
        t0: Number,
        t1: Number,
        t2: Number,
        t3: Number,
        en: Number,
        e1: Number,
        m0: Number,
        m1: Number
    },
    { _id: false }
);

const operatorConfigSchema = new Schema<IOperatorConfigDatabase>(
    {
        Skins: [String],
        pricol: colorSchema,
        attcol: colorSchema,
        sigcol: colorSchema,
        eyecol: colorSchema,
        facial: colorSchema,
        syancol: colorSchema,
        cloth: colorSchema,
        Upgrades: [String],
        Name: String, // not sure if possible in operator
        ugly: Boolean // not sure if possible in operator
    },
    { id: false }
);

operatorConfigSchema.virtual("ItemId").get(function () {
    return { $oid: this._id.toString() } satisfies IOid;
});

operatorConfigSchema.set("toJSON", {
    virtuals: true,
    transform(_document, returnedObject) {
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

///TODO: clearly seperate the different config schemas. (suit and weapon and so on)
const ItemConfigSchema = new Schema<IItemConfig>(
    {
        Skins: [String],
        pricol: colorSchema,
        attcol: colorSchema,
        sigcol: colorSchema,
        eyecol: colorSchema,
        facial: colorSchema,
        syancol: colorSchema,
        Upgrades: [String],
        Songs: [
            {
                m: String,
                b: String,
                p: String,
                s: String
            }
        ],
        Name: String,
        AbilityOverride: abilityOverrideSchema,
        PvpUpgrades: [String],
        ugly: Boolean
    },
    { _id: false }
);

ItemConfigSchema.set("toJSON", {
    transform(_document, returnedObject) {
        delete returnedObject.__v;
    }
});

//TODO: migrate to one schema for weapons and suits.. and possibly others
const WeaponSchema = new Schema<IWeaponDatabase>(
    {
        ItemType: String,
        Configs: [ItemConfigSchema],
        UpgradeVer: Number,
        XP: Number,
        Features: Number,
        Polarized: Number,
        Polarity: [polaritySchema],
        FocusLens: String,
        ModSlotPurchases: Number,
        CustomizationSlotPurchases: Number,
        UpgradeType: Schema.Types.Mixed, //todo
        UpgradeFingerprint: String,
        ItemName: String,
        ModularParts: [String],
        UnlockLevel: Number
    },
    { id: false }
);

WeaponSchema.virtual("ItemId").get(function () {
    return { $oid: this._id.toString() } satisfies IOid;
});

WeaponSchema.set("toJSON", {
    virtuals: true,
    transform(_document, returnedObject) {
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const boosterSchema = new Schema<IBooster>(
    {
        ExpiryDate: Number,
        ItemType: String
    },
    { _id: false }
);

const RawUpgrades = new Schema<IRawUpgrade>(
    {
        ItemType: String,
        ItemCount: Number
    },
    { id: false }
);

RawUpgrades.virtual("LastAdded").get(function () {
    return { $oid: this._id.toString() } satisfies IOid;
});

RawUpgrades.set("toJSON", {
    virtuals: true,
    transform(_document, returnedObject) {
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

//TODO: find out what this is
const upgrqadesSchema = new Schema(
    {
        UpgradeFingerprint: String,
        ItemType: String
    },
    { id: false }
);

upgrqadesSchema.virtual("ItemId").get(function () {
    return toOid(this._id);
});

upgrqadesSchema.set("toJSON", {
    virtuals: true,
    transform(_document, returnedObject) {
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

//TODO: reduce weapon and suit schemas to one schema if reasonable
const suitSchema = new Schema<ISuitDatabase>(
    {
        ItemType: String,
        Configs: [ItemConfigSchema],
        UpgradeVer: Number,
        XP: Number,
        InfestationDate: Date,
        Features: Number,
        Polarity: [polaritySchema],
        Polarized: Number,
        ModSlotPurchases: Number,
        CustomizationSlotPurchases: Number,
        FocusLens: String,
        UnlockLevel: Number
    },
    { id: false }
);

suitSchema.virtual("ItemId").get(function () {
    return { $oid: this._id.toString() } satisfies IOid;
});

suitSchema.set("toJSON", {
    virtuals: true,
    transform(_document, returnedObject) {
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const slotsBinSchema = new Schema<ISlots>(
    {
        Slots: Number,
        Extra: Number
    },
    { _id: false }
);

const FlavourItemSchema = new Schema(
    {
        ItemType: String
    },
    { _id: false }
);

FlavourItemSchema.set("toJSON", {
    transform(_document, returnedObject) {
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const GenericItemSchema = new Schema<IGenericItem>(
    {
        ItemType: String,
        Configs: [ItemConfigSchema],
        UpgradeVer: Number,
        XP: Number,
        Features: Number,
        Polarity: [polaritySchema],
        Polarized: Number,
        ModSlotPurchases: Number,
        CustomizationSlotPurchases: Number
    },
    { id: false }
);

GenericItemSchema.virtual("ItemId").get(function () {
    return { $oid: this._id.toString() } satisfies IOid;
});

GenericItemSchema.set("toJSON", {
    virtuals: true,
    transform(_document, returnedObject) {
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

//  "Mailbox": { "LastInboxId": { "$oid": "123456780000000000000000" } }
const MailboxSchema = new Schema<IMailbox>(
    {
        LastInboxId: {
            type: Schema.Types.ObjectId,
            set: (v: IMailbox["LastInboxId"]) => v.$oid.toString()
        }
    },
    { id: false, _id: false }
);

MailboxSchema.set("toJSON", {
    transform(_document, returnedObject) {
        delete returnedObject.__v;
        //TODO: there is a lot of any here
        returnedObject.LastInboxId = toOid(returnedObject.LastInboxId as Types.ObjectId);
    }
});

const DuviriInfoSchema = new Schema<IDuviriInfo>(
    {
        Seed: Number,
        NumCompletions: Number
    },
    {
        _id: false,
        id: false
    }
);

DuviriInfoSchema.set("toJSON", {
    transform(_document, returnedObject) {
        delete returnedObject.__v;
    }
});

const TypeXPItemSchema = new Schema<ITypeXPItem>(
    {
        ItemType: String,
        XP: Number
    },
    { _id: false }
);

const challengeProgressSchema = new Schema<IChallengeProgress>(
    {
        Progress: Number,
        Name: String,
        Completed: [String]
    },
    { _id: false }
);

const notePacksSchema = new Schema<INotePacks>(
    {
        MELODY: String,
        BASS: String,
        PERCUSSION: String
    },
    { _id: false }
);

const StepSequencersSchema = new Schema<IStepSequencer>(
    {
        NotePacks: notePacksSchema,
        FingerPrint: String,
        Name: String
    },
    { id: false }
);

StepSequencersSchema.virtual("ItemId").get(function () {
    return { $oid: this._id.toString() } satisfies IOid;
});

StepSequencersSchema.set("toJSON", {
    virtuals: true,
    transform(_document, returnedObject) {
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const affiliationsSchema = new Schema<IAffiliation>(
    {
        Initiated: Boolean,
        Standing: Number,
        Title: String,
        FreeFavorsEarned: [Number],
        FreeFavorsUsed: [Number],
        Tag: String
    },
    { _id: false }
);

const completedJobChainsSchema = new Schema<ICompletedJobChain>(
    {
        LocationTag: String,
        Jobs: [String]
    },
    { _id: false }
);

const seasonChallengeHistorySchema = new Schema<ISeasonChallengeHistory>(
    {
        challenge: String,
        id: String
    },
    { _id: false }
);

//TODO: check whether this is complete
const playerSkillsSchema = new Schema<IPlayerSkills>(
    {
        LPP_SPACE: Number,
        LPP_DRIFTER: Number,
        LPS_NONE: Number,
        LPS_PILOTING: Number,
        LPS_GUNNERY: Number,
        LPS_TACTICAL: Number,
        LPS_ENGINEERING: Number,
        LPS_COMMAND: Number,
        LPS_DRIFT_COMBAT: Number,
        LPS_DRIFT_RIDING: Number,
        LPS_DRIFT_OPPORTUNITY: Number,
        LPS_DRIFT_ENDURANCE: Number
    },
    { _id: false }
);

const settingsSchema = new Schema<ISettings>({
    FriendInvRestriction: String,
    GiftMode: String,
    GuildInvRestriction: String,
    ShowFriendInvNotifications: Boolean,
    TradingRulesConfirmed: Boolean
});

const consumedSchuitsSchema = new Schema<IConsumedSuit>({
    s: String,
    c: colorSchema
});

const infestedFoundrySchema = new Schema<IInfestedFoundry>({
    Name: String,
    Resources: [typeCountSchema],
    Slots: Number,
    XP: Number,
    ConsumedSuits: [consumedSchuitsSchema],
    InvigorationIndex: Number,
    InvigorationSuitOfferings: [String],
    InvigorationsApplied: Number
});

const questProgressSchema = new Schema<IQuestProgress>({
    c: Number,
    i: Boolean,
    m: Boolean,
    b: []
});

const questKeysSchema = new Schema<IQuestKeyDatabase>(
    {
        Progress: [questProgressSchema],
        unlock: Boolean,
        Completed: Boolean,
        //CustomData: Schema.Types.Mixed,
        CompletionDate: Date,
        ItemType: String
    },
    {
        _id: false
    }
);

questKeysSchema.set("toJSON", {
    transform(_doc, ret, _options) {
        const questKeysDatabase = ret as IQuestKeyDatabase;

        if (questKeysDatabase.CompletionDate) {
            (questKeysDatabase as IQuestKeyResponse).CompletionDate = toMongoDate(questKeysDatabase.CompletionDate);
        }
    }
});

const fusionTreasuresSchema = new Schema<IFusionTreasure>().add(typeCountSchema).add({ Sockets: Number });

const spectreLoadoutsSchema = new Schema<ISpectreLoadout>(
    {
        LongGuns: String,
        Melee: String,
        Pistols: String,
        PistolsFeatures: Number,
        PistolsModularParts: [String],
        Suits: String,
        ItemType: String
    },
    { _id: false }
);

const weaponSkinsSchema = new Schema<IWeaponSkin>(
    {
        ItemType: String
    },
    { id: false }
);

weaponSkinsSchema.virtual("ItemId").get(function () {
    return { $oid: this._id.toString() };
});

weaponSkinsSchema.set("toJSON", { virtuals: true });

const tauntHistorySchema = new Schema<ITauntHistory>(
    {
        node: String,
        state: String
    },
    { _id: false }
);

const periodicMissionCompletionsSchema = new Schema<IPeriodicMissionCompletionDatabase>(
    {
        date: Date,
        tag: String,
        count: Number
    },
    { _id: false }
);

periodicMissionCompletionsSchema.set("toJSON", {
    transform(_doc, ret, _options) {
        const periodicMissionCompletionDatabase = ret as IPeriodicMissionCompletionDatabase;

        (periodicMissionCompletionDatabase as unknown as IPeriodicMissionCompletionResponse).date = toMongoDate(
            periodicMissionCompletionDatabase.date
        );
    }
});

const loreFragmentScansSchema = new Schema<ILoreFragmentScan>(
    {
        Progress: Number,
        Region: String,
        ItemType: String
    },
    { _id: false }
);

const inventorySchema = new Schema<IInventoryDatabase, InventoryDocumentProps>(
    {
        accountOwnerId: Schema.Types.ObjectId,
        SubscribedToEmails: Number,
        Created: Date,
        RewardSeed: Number,

        //Credit
        RegularCredits: Number,
        //Platinum
        PremiumCredits: Number,
        //Gift Platinum(Non trade)
        PremiumCreditsFree: Number,
        //Endo
        FusionPoints: Number,

        //Slots
        SuitBin: slotsBinSchema,
        WeaponBin: slotsBinSchema,
        SentinelBin: slotsBinSchema,
        SpaceSuitBin: slotsBinSchema,
        SpaceWeaponBin: slotsBinSchema,
        PvpBonusLoadoutBin: slotsBinSchema,
        PveBonusLoadoutBin: slotsBinSchema,
        RandomModBin: slotsBinSchema,
        OperatorAmpBin: slotsBinSchema,
        CrewShipSalvageBin: slotsBinSchema,
        MechBin: slotsBinSchema,
        CrewMemberBin: slotsBinSchema,

        //How many trades do you have left
        TradesRemaining: Number,
        //How many Gift do you have left*(gift spends the trade)
        GiftsRemaining: Number,
        //Curent trade info Giving or Getting items
        PendingTrades: [Schema.Types.Mixed],

        //Syndicate currently being pledged to.
        SupportedSyndicate: String,
        //Curent Syndicates rank\exp
        Affiliations: [affiliationsSchema],
        //Syndicates Missions complate(Navigation->Syndicate)
        CompletedSyndicates: [String],
        //Daily Syndicates Exp
        DailyAffiliation: Number,
        DailyAffiliationPvp: Number,
        DailyAffiliationLibrary: Number,
        DailyAffiliationCetus: Number,
        DailyAffiliationQuills: Number,
        DailyAffiliationSolaris: Number,
        DailyAffiliationVentkids: Number,
        DailyAffiliationVox: Number,
        DailyAffiliationEntrati: Number,
        DailyAffiliationNecraloid: Number,
        DailyAffiliationZariman: Number,
        DailyAffiliationKahl: Number,

        //Daily Focus limit
        DailyFocus: Number,
        //Focus XP per School
        FocusXP: focusXPSchema,
        //Curent active like Active school focuses is = "Zenurik"
        FocusAbility: String,
        //The treeways of the Focus school.(Active and passive Ability)
        FocusUpgrades: [focusUpgradesSchema],

        //Achievement
        ChallengeProgress: [challengeProgressSchema],

        //Account Item like Ferrite,Form,Kuva etc
        MiscItems: [typeCountSchema],

        //Non Upgrade Mods Example:I have 999 item WeaponElectricityDamageMod (only "ItemCount"+"ItemType")
        RawUpgrades: [RawUpgrades],
        //Upgrade Mods\Riven\Arcane Example:"UpgradeFingerprint"+"ItemType"+""
        Upgrades: [upgrqadesSchema],

        //Warframe
        Suits: [suitSchema],
        //Primary    Weapon
        LongGuns: [WeaponSchema],
        //Secondary  Weapon
        Pistols: [WeaponSchema],
        //Melee      Weapon
        Melee: [WeaponSchema],
        //Ability Weapon like Ultimate Mech\Excalibur\Ivara etc
        SpecialItems: [GenericItemSchema],
        //The Mandachord(Octavia) is a step sequencer
        StepSequencers: [StepSequencersSchema],

        //Sentinel(like Helios or modular)
        Sentinels: [Schema.Types.Mixed],
        //Any /Sentinels/SentinelWeapons/ (like warframe weapon)
        SentinelWeapons: [Schema.Types.Mixed],
        //Modular Pets
        MoaPets: [Schema.Types.Mixed],

        KubrowPetEggs: [Schema.Types.Mixed],
        //Like PowerSuit Cat\Kubrow or etc Pets
        KubrowPets: [Schema.Types.Mixed],
        //Prints   Cat(3 Prints)\Kubrow(2 Prints) Pets
        KubrowPetPrints: [Schema.Types.Mixed],

        //Item for EquippedGear example:Scaner,LoadoutTechSummon etc
        Consumables: [typeCountSchema],
        //Weel Emotes+Gear
        EquippedEmotes: [String],
        EquippedGear: [String],
        //Equipped Shawzin
        EquippedInstrument: String,
        ReceivedStartingGear: Boolean,

        //to use add SummonItem to Consumables+EquippedGear
        //Archwing need Suits+Melee+Guns
        SpaceSuits: [GenericItemSchema],
        SpaceMelee: [GenericItemSchema],
        SpaceGuns: [Schema.Types.Mixed],
        ArchwingEnabled: Boolean,
        //Mech need Suits+SpaceGuns+SpecialItem
        MechSuits: [suitSchema],
        ///Restoratives/HoverboardSummon (like Suit)
        Hoverboards: [Schema.Types.Mixed],

        //Use Operator\Drifter
        UseAdultOperatorLoadout: Boolean,
        //Operator\Drifter Weapon
        OperatorAmps: [Schema.Types.Mixed],
        //Operator
        OperatorLoadOuts: [operatorConfigSchema],
        //Drifter
        AdultOperatorLoadOuts: [operatorConfigSchema],
        DrifterMelee: [GenericItemSchema],
        DrifterGuns: [GenericItemSchema],
        //ErsatzHorsePowerSuit
        Horses: [GenericItemSchema],

        //LandingCraft like Liset
        Ships: { type: [Schema.Types.ObjectId], ref: "Ships" },
        // /Lotus/Types/Items/ShipDecos/
        ShipDecorations: [typeCountSchema],

        //RailJack Setting(Mods,Skin,Weapon,etc)
        CrewShipHarnesses: [Schema.Types.Mixed],
        //Railjack/Components(https://warframe.fandom.com/wiki/Railjack/Components)
        CrewShipRawSalvage: [Schema.Types.Mixed],

        //Default RailJack
        CrewShips: [Schema.Types.Mixed],
        CrewShipAmmo: [typeCountSchema],
        CrewShipWeapons: [Schema.Types.Mixed],
        CrewShipWeaponSkins: [Schema.Types.Mixed],

        //NPC Crew and weapon
        CrewMembers: [Schema.Types.Mixed],
        CrewShipSalvagedWeaponSkins: [Schema.Types.Mixed],
        CrewShipSalvagedWeapons: [Schema.Types.Mixed],

        //Complete Mission\Quests
        Missions: [Schema.Types.Mixed],
        QuestKeys: [questKeysSchema],
        //item like DojoKey or Boss missions key
        LevelKeys: [Schema.Types.Mixed],
        //Active quests
        Quests: [Schema.Types.Mixed],

        //Cosmetics like profile glyphs\Kavasa Prime Kubrow Collar\Game Theme etc
        FlavourItems: [FlavourItemSchema],

        //Lunaro Weapon
        Scoops: [GenericItemSchema],

        //Mastery Rank*(Need item XPInfo to rank up)
        PlayerLevel: Number,
        //Item Mastery Rank exp
        XPInfo: [TypeXPItemSchema],
        //Mastery Rank next availability
        TrainingDate: Date,
        //Retries rank up(3 time)
        TrainingRetriesLeft: Number,

        //you saw last played Region when you opened the star map
        LastRegionPlayed: String,

        //Blueprints for Foundry
        Recipes: [typeCountSchema],
        //Crafting Blueprint(Item Name + CompletionDate)
        PendingRecipes: [pendingRecipeSchema],

        //Skins for Suits, Weapons etc.
        WeaponSkins: [weaponSkinsSchema],

        //Ayatan Item
        FusionTreasures: [fusionTreasuresSchema],
        //"node": "TreasureTutorial", "state": "TS_COMPLETED"
        TauntHistory: [tauntHistorySchema],

        //noShow2FA,VisitPrimeVault etc
        WebFlags: Schema.Types.Mixed,
        //Id CompletedAlerts
        CompletedAlerts: [String],

        //Warframe\Duviri
        StoryModeChoice: String,

        //Alert->Kuva Siphon
        PeriodicMissionCompletions: [periodicMissionCompletionsSchema],

        //Codex->LoreFragment
        LoreFragmentScans: [loreFragmentScansSchema],

        //Resource,Credit,Affinity etc or Bless any boosters
        Boosters: [boosterSchema],
        BlessingCooldown: Date, // Date convert to IMongoDate

        //the color your clan requests like Items/Research/DojoColors/DojoColorPlainsB
        ActiveDojoColorResearch: String,

        SentientSpawnChanceBoosters: Schema.Types.Mixed,

        QualifyingInvasions: [Schema.Types.Mixed],
        FactionScores: [Number],

        //Have only Suit+Pistols+LongGuns+Melee+ItemType(BronzeSpectre,GoldSpectre,PlatinumSpectreArmy,SilverSpectreArmy)
        //"/Lotus/Types/Game/SpectreArmies/BronzeSpectreArmy": "Vapor Specter Regiment",
        SpectreLoadouts: [spectreLoadoutsSchema],
        //If you want change Spectre Gear id
        PendingSpectreLoadouts: [Schema.Types.Mixed],

        //New Quest Email
        EmailItems: [TypeXPItemSchema],

        //Profile->Wishlist
        Wishlist: [String],

        //https://warframe.fandom.com/wiki/Alignment
        //like "Alignment": { "Wisdom": 9, "Alignment": 1 },
        Alignment: Schema.Types.Mixed,
        AlignmentReplay: Schema.Types.Mixed,

        //https://warframe.fandom.com/wiki/Sortie
        CompletedSorties: [String],
        LastSortieReward: [Schema.Types.Mixed],

        //Resource_Drone[Uselees stuff]
        Drones: [Schema.Types.Mixed],

        //Active profile ico
        ActiveAvatarImageType: String,

        // open location store like EidolonPlainsDiscoverable or OrbVallisCaveDiscoverable
        DiscoveredMarkers: [Schema.Types.Mixed],
        //Open location mission like "JobId" + "StageCompletions"
        CompletedJobs: [Schema.Types.Mixed],

        //Game mission\ivent score example  "Tag": "WaterFight", "Best": 170, "Count": 1258,
        PersonalGoalProgress: [Schema.Types.Mixed],

        //Setting interface Style
        ThemeStyle: String,
        ThemeBackground: String,
        ThemeSounds: String,

        //Daily LoginRewards
        LoginMilestoneRewards: [String],

        //You first Dialog with NPC or use new Item
        NodeIntrosCompleted: [String],

        //Current guild id, if applicable.
        GuildId: { type: Schema.Types.ObjectId, ref: "Guild" },

        //https://warframe.fandom.com/wiki/Heist
        //ProfitTaker(1-4) Example:"LocationTag": "EudicoHeists", "Jobs":Mission name
        CompletedJobChains: [completedJobChainsSchema],
        //Night Wave Challenge
        SeasonChallengeHistory: [seasonChallengeHistorySchema],

        //Cephalon Simaris Entries Example:"TargetType"+"Scans"(1-10)+"Completed": true|false
        LibraryPersonalProgress: [Schema.Types.Mixed],
        //Cephalon Simaris Daily Task
        LibraryAvailableDailyTaskInfo: Schema.Types.Mixed,

        //https://warframe.fandom.com/wiki/Invasion
        InvasionChainProgress: [Schema.Types.Mixed],

        //https://warframe.fandom.com/wiki/Parazon
        DataKnives: [GenericItemSchema],

        //CorpusLich or GrineerLich
        NemesisAbandonedRewards: [String],
        //CorpusLich\KuvaLich
        NemesisHistory: [Schema.Types.Mixed],
        LastNemesisAllySpawnTime: Schema.Types.Mixed,

        //TradingRulesConfirmed,ShowFriendInvNotifications(Option->Social)
        Settings: settingsSchema,

        //Railjack craft
        //https://warframe.fandom.com/wiki/Rising_Tide
        PersonalTechProjects: [Schema.Types.Mixed],

        //Modulars lvl and exp(Railjack|Duviri)
        //https://warframe.fandom.com/wiki/Intrinsics
        PlayerSkills: playerSkillsSchema,

        //TradeBannedUntil data
        TradeBannedUntil: Schema.Types.Mixed,

        //https://warframe.fandom.com/wiki/Helminth
        InfestedFoundry: infestedFoundrySchema,

        NextRefill: Schema.Types.Mixed, // Date, convert to IMongoDate

        //Purchase this new permanent skin from the Lotus customization options in Personal Quarters located in your Orbiter.
        //https://warframe.fandom.com/wiki/Lotus#The_New_War
        LotusCustomization: Schema.Types.Mixed,

        //Progress+Rank+ItemType(ZarimanPumpShotgun)
        //https://warframe.fandom.com/wiki/Incarnon
        EvolutionProgress: [Schema.Types.Mixed],

        //Unknown and system
        DuviriInfo: DuviriInfoSchema,
        Mailbox: MailboxSchema,
        KahlLoadOuts: [Schema.Types.Mixed],
        HandlerPoints: Number,
        ChallengesFixVersion: Number,
        PlayedParkourTutorial: Boolean,
        SubscribedToEmailsPersonalized: Number,
        LastInventorySync: Schema.Types.Mixed,
        ActiveLandscapeTraps: [Schema.Types.Mixed],
        RepVotes: [Schema.Types.Mixed],
        LeagueTickets: [Schema.Types.Mixed],
        HasContributedToDojo: Boolean,
        HWIDProtectEnabled: Boolean,
        LoadOutPresets: { type: Schema.Types.ObjectId, ref: "Loadout" },
        CurrentLoadOutIds: [Schema.Types.Mixed],
        RandomUpgradesIdentified: Number,
        BountyScore: Number,
        ChallengeInstanceStates: [Schema.Types.Mixed],
        RecentVendorPurchases: [Schema.Types.Mixed],
        Robotics: [Schema.Types.Mixed],
        UsedDailyDeals: [Schema.Types.Mixed],
        CollectibleSeries: [Schema.Types.Mixed],
        HasResetAccount: Boolean,

        //Discount Coupon
        PendingCoupon: Schema.Types.Mixed,
        //Like BossAladV,BossCaptainVor come for you on missions % chance
        DeathMarks: [String],
        //Zanuka
        Harvestable: Boolean,
        //Grustag three
        DeathSquadable: Boolean
    },
    { timestamps: { createdAt: "Created", updatedAt: "LastInventorySync" } }
);

inventorySchema.set("toJSON", {
    transform(_document, returnedObject) {
        delete returnedObject._id;
        delete returnedObject.__v;

        const inventoryDatabase = returnedObject as IInventoryDatabase;
        const inventoryResponse = returnedObject as IInventoryResponse;

        inventoryResponse.TrainingDate = toMongoDate(inventoryDatabase.TrainingDate);
        inventoryResponse.Created = toMongoDate(inventoryDatabase.Created);
        if (inventoryDatabase.GuildId) {
            inventoryResponse.GuildId = toOid(inventoryDatabase.GuildId);
        }
        if (inventoryResponse.BlessingCooldown) {
            inventoryResponse.BlessingCooldown = toMongoDate(inventoryDatabase.BlessingCooldown);
        }
    }
});

// type overwrites for subdocuments/subdocument arrays
type InventoryDocumentProps = {
    Suits: Types.DocumentArray<ISuitDatabase>;
    LongGuns: Types.DocumentArray<IWeaponDatabase>;
    Pistols: Types.DocumentArray<IWeaponDatabase>;
    Melee: Types.DocumentArray<IWeaponDatabase>;
    FlavourItems: Types.DocumentArray<IFlavourItem>;
    RawUpgrades: Types.DocumentArray<IRawUpgrade>;
    Upgrades: Types.DocumentArray<ICrewShipSalvagedWeaponSkin>;
    MiscItems: Types.DocumentArray<IMiscItem>;
    Boosters: Types.DocumentArray<IBooster>;
    OperatorLoadOuts: Types.DocumentArray<IOperatorConfigClient>;
    SpecialItems: Types.DocumentArray<IGenericItem>;
    AdultOperatorLoadOuts: Types.DocumentArray<IOperatorConfigClient>; //TODO: this should still contain _id
    MechSuits: Types.DocumentArray<ISuitDatabase>;
    Scoops: Types.DocumentArray<IGenericItem>;
    DataKnives: Types.DocumentArray<IGenericItem>;
    DrifterMelee: Types.DocumentArray<IGenericItem>;
    Sentinels: Types.DocumentArray<IWeaponDatabase>;
    Horses: Types.DocumentArray<IGenericItem>;
    PendingRecipes: Types.DocumentArray<IPendingRecipeDatabase>;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type InventoryModelType = Model<IInventoryDatabase, {}, InventoryDocumentProps>;

export const Inventory = model<IInventoryDatabase, InventoryModelType>("Inventory", inventorySchema);
