import Booking from "../models/BookingModel.js";
import User from "../models/UserModel.js"; // Changed from Passenger
import Flight from "../models/FlightModel.js";

export const getBookings = async (req, res) => {
    try {
        const response = await Booking.findAll({
            include: [
                { model: User }, // Changed from Passenger
                { model: Flight }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const response = await Booking.findOne({
            where: {
                bookingID: req.params.id
            },
            include: [
                { model: User }, // Changed from Passenger
                { model: Flight }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const createBooking = async (req, res) => {
    try {
        // When creating a booking, ensure req.body contains 'userID' and 'flightID'
        await Booking.create(req.body);
        res.status(201).json({ msg: "Booking created" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const updateBooking = async (req, res) => {
    try {
        await Booking.update(req.body, {
            where: {
                bookingID: req.params.id
            }
        });
        res.status(200).json({ msg: "Booking updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        await Booking.destroy({
            where: {
                bookingID: req.params.id
            }
        });
        res.status(200).json({ msg: "Booking deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};