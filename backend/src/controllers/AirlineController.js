import Airline from "../models/AirlineModel.js";

export const getAirlines = async (req, res) => {
    try {
        const response = await Airline.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getAirlineById = async (req, res) => {
    try {
        const response = await Airline.findOne({
            where: {
                airlineID: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const createAirline = async (req, res) => {
    try {
        await Airline.create(req.body);
        res.status(201).json({ msg: "Airline created" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const updateAirline = async (req, res) => {
    try {
        await Airline.update(req.body, {
            where: {
                airlineID: req.params.id
            }
        });
        res.status(200).json({ msg: "Airline updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const deleteAirline = async (req, res) => {
    try {
        await Airline.destroy({
            where: {
                airlineID: req.params.id
            }
        });
        res.status(200).json({ msg: "Airline deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};