import Booking from "../models/BookingModel.js";
import Flight from "../models/FlightModel.js";
import User from "../models/UserModel.js";
import Airline from "../models/AirlineModel.js";
import Airport from "../models/AirportModel.js";

export const getBookings = async(req, res) => {
    try {
        const response = await Booking.findAll({
            include: [
                { model: User },
                { 
                    model: Flight,
                    include: [
                        { model: Airline },
                        { model: Airport, as: 'DepartureAirport' },
                        { model: Airport, as: 'DestinationAirport' }
                    ]
                }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getBookingById = async(req, res) => {
    try {
        const response = await Booking.findOne({
            where: {
                bookingID: req.params.id
            },
            include: [
                { model: User },
                { 
                    model: Flight,
                    include: [
                        { model: Airline },
                        { model: Airport, as: 'DepartureAirport' },
                        { model: Airport, as: 'DestinationAirport' }
                    ]
                }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const createBooking = async(req, res) => {
    try {
        const { flightID, totalPrice } = req.body;
        const userID = req.user.userId; // Assuming user data is in request after authentication

        // Check if flight exists and has available seats
        const flight = await Flight.findByPk(flightID);
        if (!flight) {
            return res.status(404).json({ msg: "Flight not found" });
        }
        if (flight.availableSeats < 1) {
            return res.status(400).json({ msg: "No seats available" });
        }

        // Create booking
        const booking = await Booking.create({
            userID: userID,
            flightID: flightID,
            totalPrice: totalPrice,
            status: 'pending'
        });

        // Update available seats
        await Flight.update(
            { availableSeats: flight.availableSeats - 1 },
            { where: { flightID: flightID } }
        );

        res.status(201).json({
            msg: "Booking Created Successfully",
            bookingID: booking.bookingID
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const updateBooking = async(req, res) => {
    try {
        const booking = await Booking.findOne({
            where: {
                bookingID: req.params.id
            }
        });
        if(!booking) return res.status(404).json({ msg: "Booking not found" });
        
        const { status } = req.body;
        await Booking.update({ status }, {
            where: {
                bookingID: req.params.id
            }
        });
        res.status(200).json({ msg: "Booking Updated Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const deleteBooking = async(req, res) => {
    try {
        const booking = await Booking.findOne({
            where: {
                bookingID: req.params.id
            }
        });
        if(!booking) return res.status(404).json({ msg: "Booking not found" });
        
        // Return the seat to available seats if booking is cancelled
        if (booking.status !== 'cancelled') {
            const flight = await Flight.findByPk(booking.flightID);
            await Flight.update(
                { availableSeats: flight.availableSeats + 1 },
                { where: { flightID: booking.flightID } }
            );
        }

        await Booking.destroy({
            where: {
                bookingID: req.params.id
            }
        });
        res.status(200).json({ msg: "Booking Deleted Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getUserBookings = async(req, res) => {
    try {
        const userID = req.user.userId; // Assuming user data is in request after authentication
        const bookings = await Booking.findAll({
            where: { userID },
            include: [
                { 
                    model: Flight,
                    include: [
                        { model: Airline },
                        { model: Airport, as: 'DepartureAirport' },
                        { model: Airport, as: 'DestinationAirport' }
                    ]
                }
            ]
        });
        res.status(200).json(bookings);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};