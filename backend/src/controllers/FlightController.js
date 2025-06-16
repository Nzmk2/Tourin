import Flight from "../models/FlightModel.js";
import Airline from "../models/AirlineModel.js";
import Airport from "../models/AirportModel.js";

export const getFlights = async (req, res) => {
    try {
        const response = await Flight.findAll({
            include: [
                { model: Airline },
                { model: Airport, as: 'DepartureAirport' },
                { model: Airport, as: 'DestinationAirport' }
            ]
        });
        res.status(200).json(response);
    }
     catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getFlightById = async (req, res) => {
    try {
        const response = await Flight.findOne({
            where: {
                flightID: req.params.id
            },
            include: [
                { model: Airline },
                { model: Airport, as: 'DepartureAirport' },
                { model: Airport, as: 'DestinationAirport' }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const createFlight = async (req, res) => {
    try {
        await Flight.create(req.body);
        res.status(201).json({ msg: "Flight created" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const updateFlight = async (req, res) => {
    try {
        await Flight.update(req.body, {
            where: {
                flightID: req.params.id
            }
        });
        res.status(200).json({ msg: "Flight updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const deleteFlight = async (req, res) => {
    try {
        await Flight.destroy({
            where: {
                flightID: req.params.id
            }
        });
        res.status(200).json({ msg: "Flight deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

// --- FUNGSI BARU UNTUK MENGHITUNG JUMLAH FLIGHT ---
export const getFlightCount = async (req, res) => {
    try {
        const count = await Flight.count(); // Menggunakan Sequelize's .count() method
        res.status(200).json({ count });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};