import Airline from "../models/AirlineModel.js";

export const getAirlines = async(req, res) => {
    try {
        const airlines = await Airline.findAll({
            attributes: ['airlineID', 'name', 'code', 'logoURL']
        });
        res.json(airlines);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getAirlineById = async(req, res) => {
    try {
        const airline = await Airline.findOne({
            where: {
                airlineID: req.params.id
            }
        });
        if(!airline) return res.status(404).json({ msg: "Airline not found" });
        res.json(airline);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createAirline = async(req, res) => {
    const { name, code, logoURL } = req.body;
    try {
        await Airline.create({
            name: name,
            code: code,
            logoURL: logoURL
        });
        res.json({ msg: "Airline Created Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateAirline = async(req, res) => {
    try {
        const airline = await Airline.findOne({
            where: {
                airlineID: req.params.id
            }
        });
        if(!airline) return res.status(404).json({ msg: "Airline not found" });
        
        const { name, code, logoURL } = req.body;
        await Airline.update({
            name: name,
            code: code,
            logoURL: logoURL
        }, {
            where: {
                airlineID: req.params.id
            }
        });
        res.json({ msg: "Airline Updated Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteAirline = async(req, res) => {
    try {
        const airline = await Airline.findOne({
            where: {
                airlineID: req.params.id
            }
        });
        if(!airline) return res.status(404).json({ msg: "Airline not found" });
        
        await Airline.destroy({
            where: {
                airlineID: req.params.id
            }
        });
        res.json({ msg: "Airline Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};