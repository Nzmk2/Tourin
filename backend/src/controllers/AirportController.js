import Airport from "../models/AirportModel.js";

export const getAirports = async (req, res) => {
    try {
        const response = await Airport.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getAirportById = async (req, res) => {
    try {
        const response = await Airport.findOne({
            where: {
                airportCode: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const createAirport = async (req, res) => {
    try {
        await Airport.create(req.body);
        res.status(201).json({ msg: "Airport created" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const updateAirport = async (req, res) => {
    try {
        await Airport.update(req.body, {
            where: {
                airportCode: req.params.id
            }
        });
        res.status(200).json({ msg: "Airport updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const deleteAirport = async (req, res) => {
    try {
        await Airport.destroy({
            where: {
                airportCode: req.params.id
            }
        });
        res.status(200).json({ msg: "Airport deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};