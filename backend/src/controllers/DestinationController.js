import Destination from "../models/DestinationModel.js";

export const getDestinations = async(req, res) => {
    try {
        const destinations = await Destination.findAll();
        res.status(200).json(destinations);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getPopularDestinations = async(req, res) => {
    try {
        const destinations = await Destination.findAll({
            where: { isPopular: true },
            limit: 6
        });
        res.status(200).json(destinations);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getDestinationById = async(req, res) => {
    try {
        const destination = await Destination.findOne({
            where: { destinationID: req.params.id }
        });
        if (!destination) {
            return res.status(404).json({ msg: "Destination not found" });
        }
        res.status(200).json(destination);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createDestination = async(req, res) => {
    try {
        const destination = await Destination.create(req.body);
        res.status(201).json({
            msg: "Destination Created Successfully",
            destination: destination
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateDestination = async(req, res) => {
    try {
        const updated = await Destination.update(req.body, {
            where: { destinationID: req.params.id }
        });
        if (updated[0] === 0) {
            return res.status(404).json({ msg: "Destination not found" });
        }
        res.status(200).json({ msg: "Destination Updated Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteDestination = async(req, res) => {
    try {
        const deleted = await Destination.destroy({
            where: { destinationID: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ msg: "Destination not found" });
        }
        res.status(200).json({ msg: "Destination Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};