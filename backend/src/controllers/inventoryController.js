import InventoryModel from "../models/InventoryModel.js";
import LogModel from "../models/LogModel.js";
import BloodBankModel from "../models/BloodBankModel.js";
import ApiError from "../utils/ApiError.js";

export const getBankInventory = async (req, res, next) => {
  try {
    const bankId = req.params.bankId
      ? Number(req.params.bankId)
      : (await BloodBankModel.findByUserId(req.user.id))?.id;

    if (!bankId) {
      throw new ApiError(404, "Blood bank profile not found");
    }

    const inventory = await InventoryModel.listByBank(bankId);
    res.json({ data: inventory });
  } catch (error) {
    next(error);
  }
};

export const updateInventory = async (req, res, next) => {
  try {
    const bank =
      req.user.role === "blood_bank"
        ? await BloodBankModel.findByUserId(req.user.id)
        : { id: req.body.bankId };

    if (!bank?.id) {
      throw new ApiError(404, "Blood bank profile not found");
    }

    const record = await InventoryModel.upsert({
      ...req.body,
      bankId: bank.id,
      reservedUnits: req.body.reservedUnits ?? 0
    });

    await LogModel.create({
      actorUserId: req.user.id,
      actionType: "inventory_updated",
      status: "available",
      details: `${req.body.bloodGroup} ${req.body.componentType} updated to ${req.body.unitsAvailable} units`
    });

    req.app.get("io").emit("inventory:updated", record);
    res.json({ data: record });
  } catch (error) {
    next(error);
  }
};
