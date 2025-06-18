import Airport from "../models/AirportModel.js";

export const getAirports = async(req, res) => {
    try {
        const airports = await Airport.findAll({
            attributes: ['airportID', 'code', 'name', 'city', 'country']
        });
        res.json(airports);
    } catch (error) {
        console.error('Error in getAirports:', error); // Tambahkan logging
        res.status(500).json({ msg: error.message });
    }
};

export const getAirportById = async(req, res) => {
    try {
        const airport = await Airport.findOne({
            where: {
                airportID: req.params.id
            }
        });
        if(!airport) return res.status(404).json({ msg: "Airport not found" });
        res.json(airport);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createAirport = async(req, res) => {
    const { code, name, city, country } = req.body;
    try {
        await Airport.create({
            code: code,
            name: name,
            city: city,
            country: country
        });
        res.json({ msg: "Airport Created Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateAirport = async(req, res) => {
    try {
        const airport = await Airport.findOne({
            where: {
                airportID: req.params.id
            }
        });
        if(!airport) return res.status(404).json({ msg: "Airport not found" });
        
        const { code, name, city, country } = req.body;
        await Airport.update({
            code: code,
            name: name,
            city: city,
            country: country
        }, {
            where: {
                airportID: req.params.id
            }
        });
        res.json({ msg: "Airport Updated Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteAirport = async(req, res) => {
    try {
        const airport = await Airport.findOne({
            where: {
                airportID: req.params.id
            }
        });
        if(!airport) return res.status(404).json({ msg: "Airport not found" });
        
        await Airport.destroy({
            where: {
                airportID: req.params.id
            }
        });
        res.json({ msg: "Airport Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};