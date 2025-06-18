import Package from "../models/PackageModel.js";
import Destination from "../models/DestinationModel.js";

export const getPackages = async(req, res) => {
    try {
        const packages = await Package.findAll({
            include: [{ model: Destination }]
        });
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getPopularPackages = async(req, res) => {
    try {
        const packages = await Package.findAll({
            include: [{ model: Destination }],
            order: [['reviewCount', 'DESC']],
            limit: 6
        });
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getPackageById = async(req, res) => {
    try {
        const tourPackage = await Package.findOne({
            where: { packageID: req.params.id },
            include: [{ model: Destination }]
        });
        if (!tourPackage) {
            return res.status(404).json({ msg: "Package not found" });
        }
        res.status(200).json(tourPackage);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createPackage = async(req, res) => {
    try {
        const newPackage = await Package.create(req.body);
        res.status(201).json({
            msg: "Package Created Successfully",
            package: newPackage
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updatePackage = async(req, res) => {
    try {
        const updated = await Package.update(req.body, {
            where: { packageID: req.params.id }
        });
        if (updated[0] === 0) {
            return res.status(404).json({ msg: "Package not found" });
        }
        res.status(200).json({ msg: "Package Updated Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deletePackage = async(req, res) => {
    try {
        const deleted = await Package.destroy({
            where: { packageID: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ msg: "Package not found" });
        }
        res.status(200).json({ msg: "Package Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};