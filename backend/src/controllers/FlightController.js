// controllers/FlightController.js
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
    // Destructure properties from req.body
    // ✅ Tambahkan departureDate dan arrivalDate di sini
    const { airlineID, departureAirportCode, destinationAirportCode, departureDate, departureTime, arrivalDate, arrivalTime, availableSeats } = req.body;

    try {
        // Find the flight with the highest flightNumber to determine the next sequential number
        const lastFlight = await Flight.findOne({
            order: [
                ['flightID', 'DESC']
            ],
            attributes: ['flightNumber']
        });

        let nextNumber = 1;

        if (lastFlight && lastFlight.flightNumber) {
            const lastCodeMatch = lastFlight.flightNumber.match(/^FLIGHT-(\d+)$/);
            if (lastCodeMatch && lastCodeMatch[1]) {
                const lastNumericPart = parseInt(lastCodeMatch[1], 10);
                nextNumber = lastNumericPart + 1;
            }
        }

        const formattedNumber = String(nextNumber).padStart(3, '0');
        const generatedFlightNumber = `FLIGHT-${formattedNumber}`;

        const parsedAvailableSeats = parseInt(availableSeats, 10);
        if (isNaN(parsedAvailableSeats)) {
            return res.status(400).json({ msg: "Available Seats must be a valid number." });
        }

        // ✅ Gabungkan tanggal dan waktu dari frontend
        const fullDepartureDateTime = `${departureDate}T${departureTime}:00`;
        const fullArrivalDateTime = `${arrivalDate}T${arrivalTime}:00`;

        // Create the new flight record with the generated flightNumber
        const newFlight = await Flight.create({
            flightNumber: generatedFlightNumber,
            airlineID,
            departureAirportCode,
            destinationAirportCode,
            departureTime: fullDepartureDateTime, // Gunakan full timestamp
            arrivalTime: fullArrivalDateTime,     // Gunakan full timestamp
            availableSeats: parsedAvailableSeats
        });

        res.status(201).json({ msg: "Flight created successfully!", flightID: newFlight.flightID, flightNumber: newFlight.flightNumber });
    } catch (error) {
        console.error("Error creating flight:", error.message);
        res.status(500).json({ msg: error.message || "Failed to create flight." });
    }
};

export const updateFlight = async (req, res) => {
    // Jika Anda ingin mengizinkan update tanggal/waktu, Anda juga perlu menangani penggabungan di sini.
    // Untuk kesederhanaan, asumsikan req.body sudah berisi nilai tanggal-waktu penuh yang valid
    // jika ingin diupdate. Atau, tambahkan logika penggabungan yang sama seperti createFlight.
    try {
        const { departureDate, departureTime, arrivalDate, arrivalTime, ...otherFields } = req.body;
        let updateFields = { ...otherFields };

        if (departureDate && departureTime) {
            updateFields.departureTime = `${departureDate}T${departureTime}:00`;
        }
        if (arrivalDate && arrivalTime) {
            updateFields.arrivalTime = `${arrivalDate}T${arrivalTime}:00`;
        }

        await Flight.update(updateFields, {
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

export const getFlightCount = async (req, res) => {
    try {
        const count = await Flight.count();
        res.status(200).json({ count });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};