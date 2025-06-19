import { Op } from "sequelize";
import Flight from "../models/FlightModel.js";
import Airline from "../models/AirlineModel.js";
import Airport from "../models/AirportModel.js";

// Export semua fungsi dalam satu statement export
export {
    getFlights,
    getFlightById,
    createFlight,
    updateFlight,
    deleteFlight
};

// Definisi fungsi-fungsi
// Definisi fungsi-fungsi
const getFlights = async (req, res) => {
  try {
    const flights = await Flight.findAll({
      include: [
        {
          model: Airline,
          attributes: ['airlineID', 'name', 'code', 'logo', 'logoType']
        },
        {
          model: Airport,
          as: 'DepartureAirport',
          attributes: ['code', 'name', 'city']
        },
        {
          model: Airport,
          as: 'DestinationAirport',
          attributes: ['code', 'name', 'city']
        }
      ],
      order: [['departureTime', 'ASC']]
    });

    // Transform data
    const transformedFlights = flights.map(flight => {
      const data = flight.toJSON();
      
      // Convert airline logo to base64 if exists
      if (data.Airline?.logo) {
        data.Airline.logo = data.Airline.logo.toString('base64');
      }

      return data;
    });

    res.json(transformedFlights);
  } catch (error) {
    console.error('Error in getFlights:', error);
    res.status(500).json({ msg: error.message });
  }
};

const getFlightById = async(req, res) => {
    try {
        const flight = await Flight.findOne({
            where: {
                flightID: req.params.id
            },
            include: [
                { 
                    model: Airline,
                    attributes: ['airlineID', 'name', 'code']
                },
                { 
                    model: Airport, 
                    as: 'DepartureAirport',
                    attributes: ['airportID', 'code', 'name']
                },
                { 
                    model: Airport, 
                    as: 'DestinationAirport',
                    attributes: ['airportID', 'code', 'name']
                }
            ]
        });

        if(!flight) return res.status(404).json({ msg: "Flight not found" });

        res.json(flight);
    } catch (error) {
        console.error('Error in getFlightById:', error);
        res.status(500).json({ msg: error.message });
    }
};

const createFlight = async(req, res) => {
    const { 
        flightNumber, 
        airlineId, 
        departureAirportId, 
        arrivalAirportId,
        departureTime,
        arrivalTime,
        price,
        capacity
    } = req.body;

    try {
        // Get departure airport code
        const departureAirport = await Airport.findByPk(departureAirportId);
        if (!departureAirport) {
            return res.status(400).json({ msg: "Departure airport not found" });
        }

        // Get arrival airport code
        const arrivalAirport = await Airport.findByPk(arrivalAirportId);
        if (!arrivalAirport) {
            return res.status(400).json({ msg: "Arrival airport not found" });
        }

        // Create flight with converted data
        await Flight.create({
            flightNumber: flightNumber,
            airlineID: airlineId, // Match the model's column name
            departureAirportCode: departureAirport.code, // Use airport code instead of ID
            destinationAirportCode: arrivalAirport.code, // Use airport code instead of ID
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            price: price,
            availableSeats: capacity // Match the model's column name
        });

        res.json({ msg: "Flight Created Successfully" });
    } catch (error) {
        console.error('Error creating flight:', error);
        res.status(500).json({ msg: error.message });
    }
};

const updateFlight = async(req, res) => {
    try {
        const flight = await Flight.findOne({
            where: {
                flightID: req.params.id
            }
        });
        if(!flight) return res.status(404).json({ msg: "Flight not found" });
        
        const { 
            flightNumber, 
            airlineId, 
            departureAirportId, 
            arrivalAirportId,
            departureTime,
            arrivalTime,
            price,
            capacity
        } = req.body;

        // Get departure airport code
        const departureAirport = await Airport.findByPk(departureAirportId);
        if (!departureAirport) {
            return res.status(400).json({ msg: "Departure airport not found" });
        }

        // Get arrival airport code
        const arrivalAirport = await Airport.findByPk(arrivalAirportId);
        if (!arrivalAirport) {
            return res.status(400).json({ msg: "Arrival airport not found" });
        }

        await Flight.update({
            flightNumber: flightNumber,
            airlineID: airlineId, // Match the model's column name
            departureAirportCode: departureAirport.code, // Use airport code instead of ID
            destinationAirportCode: arrivalAirport.code, // Use airport code instead of ID
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            price: price,
            availableSeats: capacity // Match the model's column name
        }, {
            where: {
                flightID: req.params.id
            }
        });
        res.json({ msg: "Flight Updated Successfully" });
    } catch (error) {
        console.error('Error updating flight:', error);
        res.status(500).json({ msg: error.message });
    }
};

const deleteFlight = async(req, res) => {
    try {
        const flight = await Flight.findOne({
            where: {
                flightID: req.params.id
            }
        });
        
        if(!flight) {
            return res.status(404).json({ msg: "Flight not found" });
        }
        
        await Flight.destroy({
            where: {
                flightID: req.params.id
            }
        });
        
        res.json({ msg: "Flight Deleted Successfully" });
    } catch (error) {
        console.error('Error deleting flight:', error);
        res.status(500).json({ msg: error.message });
    }
};