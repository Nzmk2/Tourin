import Flight from "../models/FlightModel.js";
import Airline from "../models/AirlineModel.js";
import Airport from "../models/AirportModel.js";

export const getFlights = async(req, res) => {
    try {
        const flights = await Flight.findAll({
            include: [
                { model: Airline },
                { model: Airport, as: 'DepartureAirport' },
                { model: Airport, as: 'DestinationAirport' }
            ]
        });
        res.json(flights);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getFlightById = async(req, res) => {
    try {
        const flight = await Flight.findOne({
            where: {
                flightID: req.params.id
            },
            include: [
                { model: Airline },
                { model: Airport, as: 'DepartureAirport' },
                { model: Airport, as: 'DestinationAirport' }
            ]
        });
        if(!flight) return res.status(404).json({ msg: "Flight not found" });
        res.json(flight);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createFlight = async(req, res) => {
    const { 
        flightNumber, 
        airlineID, 
        departureAirportCode, 
        destinationAirportCode,
        departureTime,
        arrivalTime,
        price,
        availableSeats
    } = req.body;

    try {
        await Flight.create({
            flightNumber: flightNumber,
            airlineID: airlineID,
            departureAirportCode: departureAirportCode,
            destinationAirportCode: destinationAirportCode,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            price: price,
            availableSeats: availableSeats
        });
        res.json({ msg: "Flight Created Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateFlight = async(req, res) => {
    try {
        const flight = await Flight.findOne({
            where: {
                flightID: req.params.id
            }
        });
        if(!flight) return res.status(404).json({ msg: "Flight not found" });
        
        const { 
            flightNumber, 
            airlineID, 
            departureAirportCode, 
            destinationAirportCode,
            departureTime,
            arrivalTime,
            price,
            availableSeats
        } = req.body;

        await Flight.update({
            flightNumber: flightNumber,
            airlineID: airlineID,
            departureAirportCode: departureAirportCode,
            destinationAirportCode: destinationAirportCode,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            price: price,
            availableSeats: availableSeats
        }, {
            where: {
                flightID: req.params.id
            }
        });
        res.json({ msg: "Flight Updated Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteFlight = async(req, res) => {
    try {
        const flight = await Flight.findOne({
            where: {
                flightID: req.params.id
            }
        });
        if(!flight) return res.status(404).json({ msg: "Flight not found" });
        
        await Flight.destroy({
            where: {
                flightID: req.params.id
            }
        });
        res.json({ msg: "Flight Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};