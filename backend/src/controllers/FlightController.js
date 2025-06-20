import { Op } from "sequelize";
import Flight from "../models/FlightModel.js";
import Airline from "../models/AirlineModel.js";
import Airport from "../models/AirportModel.js";

const getFlights = async (req, res) => {
  try {
    const { departureCode, destinationCode, departureDate } = req.query;

    // Build where clause based on search parameters
    const whereClause = {};
    
    // Add airport codes if provided
    if (departureCode && destinationCode) {
      whereClause.departureAirportCode = departureCode;
      whereClause.destinationAirportCode = destinationCode;
    }

    // Add date filtering if provided
    if (departureDate) {
      const startDate = new Date(departureDate);
      const endDate = new Date(departureDate);
      endDate.setDate(endDate.getDate() + 1);

      whereClause.departureTime = {
        [Op.gte]: startDate,
        [Op.lt]: endDate
      };
    }

    const flights = await Flight.findAll({
      where: whereClause,
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
      order: [
        ['departureTime', 'ASC'],
        ['price', 'ASC']
      ]
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

const getFlightById = async (req, res) => {
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

    if (!flight) return res.status(404).json({ msg: "Flight not found" });

    res.json(flight);
  } catch (error) {
    console.error('Error in getFlightById:', error);
    res.status(500).json({ msg: error.message });
  }
};

const createFlight = async (req, res) => {
  try {
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

    // Debug log
    console.log('Received request body:', req.body);

    // Validate required fields
    if (!flightNumber || !airlineId || !departureAirportId || !arrivalAirportId || 
        !departureTime || !arrivalTime || !price || !capacity) {
      return res.status(400).json({ 
        msg: "All fields are required",
        missing: {
          flightNumber: !flightNumber,
          airlineId: !airlineId,
          departureAirportId: !departureAirportId,
          arrivalAirportId: !arrivalAirportId,
          departureTime: !departureTime,
          arrivalTime: !arrivalTime,
          price: !price,
          capacity: !capacity
        }
      });
    }

    // Validate airline exists
    const airline = await Airline.findByPk(airlineId);
    if (!airline) {
      return res.status(400).json({ msg: `Airline with ID ${airlineId} not found` });
    }

    // Get departure airport code
    const departureAirport = await Airport.findByPk(departureAirportId);
    if (!departureAirport) {
      return res.status(400).json({ msg: `Departure airport with ID ${departureAirportId} not found` });
    }

    // Get arrival airport code
    const arrivalAirport = await Airport.findByPk(arrivalAirportId);
    if (!arrivalAirport) {
      return res.status(400).json({ msg: `Arrival airport with ID ${arrivalAirportId} not found` });
    }

    // Validate times
    const dTime = new Date(departureTime);
    const aTime = new Date(arrivalTime);
    if (isNaN(dTime.getTime()) || isNaN(aTime.getTime())) {
      return res.status(400).json({ msg: "Invalid date format" });
    }

    if (dTime >= aTime) {
      return res.status(400).json({ msg: "Departure time must be before arrival time" });
    }

    // Validate price and capacity
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ msg: "Invalid price value" });
    }

    if (isNaN(capacity) || capacity <= 0) {
      return res.status(400).json({ msg: "Invalid capacity value" });
    }

    // Create flight with converted data
    const newFlight = await Flight.create({
      flightNumber: flightNumber,
      airlineID: airlineId,
      departureAirportCode: departureAirport.code,
      destinationAirportCode: arrivalAirport.code,
      departureTime: dTime,
      arrivalTime: aTime,
      price: parseFloat(price),
      availableSeats: parseInt(capacity)
    });

    console.log('Created flight:', newFlight);

    res.status(201).json({ 
      msg: "Flight Created Successfully",
      flight: newFlight
    });
  } catch (error) {
    console.error('Error creating flight:', error);
    res.status(500).json({ 
      msg: "Error creating flight",
      error: error.message,
      details: error.errors?.map(e => e.message)
    });
  }
};

const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findOne({
      where: {
        flightID: req.params.id
      }
    });
    
    if (!flight) return res.status(404).json({ msg: "Flight not found" });
    
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
      airlineID: airlineId,
      departureAirportCode: departureAirport.code,
      destinationAirportCode: arrivalAirport.code,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      price: price,
      availableSeats: capacity
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

const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findOne({
      where: {
        flightID: req.params.id
      }
    });
    
    if (!flight) {
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

export {
  getFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight
};

// Menambahkan fungsi untuk mendapatkan jumlah flight
export const getFlightsCount = async(req, res) => {
    try {
        const count = await Flight.count();
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error in getFlightsCount:', error);
        res.status(500).json({ msg: error.message });
    }
};