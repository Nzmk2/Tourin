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
                        { model: Airline, attributes: ['airlineID', 'name', 'code', 'logo', 'logoType'] },
                        { model: Airport, as: 'DepartureAirport' },
                        { model: Airport, as: 'DestinationAirport' }
                    ]
                }
            ]
        });

        const transformedResponse = response.map(booking => {
            const bookingData = booking.toJSON();
            if (bookingData.Flight?.Airline?.logo) {
                bookingData.Flight.Airline.logoUrl =
                    `data:${bookingData.Flight.Airline.logoType};base64,${bookingData.Flight.Airline.logo.toString('base64')}`;
                delete bookingData.Flight.Airline.logo;
                delete bookingData.Flight.Airline.logoType;
            }
            return bookingData;
        });

        res.status(200).json(transformedResponse);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getBookingById = async(req, res) => {
    try {
        const response = await Booking.findOne({
            where: { bookingID: req.params.id },
            include: [
                { model: User },
                { 
                    model: Flight,
                    include: [
                        { model: Airline, attributes: ['airlineID', 'name', 'code', 'logo', 'logoType'] },
                        { model: Airport, as: 'DepartureAirport' },
                        { model: Airport, as: 'DestinationAirport' }
                    ]
                }
            ]
        });

        if (!response) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        const bookingData = response.toJSON();
        if (bookingData.Flight?.Airline?.logo) {
            bookingData.Flight.Airline.logoUrl =
                `data:${bookingData.Flight.Airline.logoType};base64,${bookingData.Flight.Airline.logo.toString('base64')}`;
            delete bookingData.Flight.Airline.logo;
            delete bookingData.Flight.Airline.logoType;
        }

        res.status(200).json(bookingData);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const createBooking = async(req, res) => {
    try {
        // FIXED: userID dari body (admin) atau dari JWT (user)
        const userID = req.body.userID || (req.user && req.user.userId);
        if (!userID) return res.status(400).json({ msg: "User ID is required" });
        const { flightID, totalPrice, status } = req.body;

        const flight = await Flight.findByPk(flightID);
        if (!flight) {
            return res.status(404).json({ msg: "Flight not found" });
        }
        if (flight.availableSeats < 1) {
            return res.status(400).json({ msg: "No seats available" });
        }

        const booking = await Booking.create({
            userID: userID,
            flightID: flightID,
            totalPrice: totalPrice,
            status: status || 'booked'
        });

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
            where: { bookingID: req.params.id }
        });
        if(!booking) return res.status(404).json({ msg: "Booking not found" });

        const { userID, flightID, status, totalPrice } = req.body;
        await Booking.update(
            {
                ...(userID && { userID }),
                ...(flightID && { flightID }),
                ...(status && { status }),
                ...(totalPrice && { totalPrice }),
            }, {
                where: { bookingID: req.params.id }
            }
        );
        res.status(200).json({ msg: "Booking Updated Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const deleteBooking = async(req, res) => {
    try {
        const booking = await Booking.findOne({
            where: { bookingID: req.params.id }
        });
        if(!booking) return res.status(404).json({ msg: "Booking not found" });

        if (booking.status !== 'cancelled') {
            const flight = await Flight.findByPk(booking.flightID);
            await Flight.update(
                { availableSeats: flight.availableSeats + 1 },
                { where: { flightID: booking.flightID } }
            );
        }

        await Booking.destroy({ where: { bookingID: req.params.id } });
        res.status(200).json({ msg: "Booking Deleted Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getUserBookings = async(req, res) => {
    try {
        const userID = req.user.userId;
        const bookings = await Booking.findAll({
            where: { userID },
            include: [
                { 
                    model: Flight,
                    include: [
                        { model: Airline, attributes: ['airlineID', 'name', 'code', 'logo', 'logoType'] },
                        { model: Airport, as: 'DepartureAirport' },
                        { model: Airport, as: 'DestinationAirport' }
                    ]
                }
            ]
        });

        const transformedBookings = bookings.map(booking => {
            const bookingData = booking.toJSON();
            if (bookingData.Flight?.Airline?.logo) {
                bookingData.Flight.Airline.logoUrl =
                    `data:${bookingData.Flight.Airline.logoType};base64,${bookingData.Flight.Airline.logo.toString('base64')}`;
                delete bookingData.Flight.Airline.logo;
                delete bookingData.Flight.Airline.logoType;
            }
            return bookingData;
        });

        res.status(200).json(transformedBookings);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getBookingsCount = async(req, res) => {
    try {
        const count = await Booking.count();
        res.status(200).json({ count });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getRecentBookings = async(req, res) => {
    try {
        const response = await Booking.findAll({
            limit: 7,
            order: [['createdAt', 'DESC']],
            include: [
                { 
                    model: User,
                    attributes: ['firstName', 'lastName', 'email']
                },
                { 
                    model: Flight,
                    include: [
                        { 
                            model: Airport, 
                            as: 'DepartureAirport',
                            attributes: ['name', 'code']
                        },
                        { 
                            model: Airport, 
                            as: 'DestinationAirport',
                            attributes: ['name', 'code']
                        }
                    ]
                }
            ]
        });

        // Transform data setelah mendapatkan response
        const formattedBookings = response.map(booking => {
            const data = booking.get({ plain: true }); // Gunakan get({ plain: true }) untuk mendapatkan plain object
            
            return {
                bookingID: data.bookingID,
                bookerName: data.user ? `${data.user.firstName} ${data.user.lastName}` : 'Unknown',
                bookerEmail: data.user?.email || 'Unknown',
                bookingDate: data.bookingDate || data.createdAt,
                departureAirport: data.flight?.DepartureAirport 
                    ? `${data.flight.DepartureAirport.name} (${data.flight.DepartureAirport.code})`
                    : 'Unknown',
                destinationAirport: data.flight?.DestinationAirport
                    ? `${data.flight.DestinationAirport.name} (${data.flight.DestinationAirport.code})`
                    : 'Unknown',
                status: data.status || 'pending'
            };
        });

        res.status(200).json(formattedBookings);
    } catch (error) {
        console.log("Error in getRecentBookings:", error);
        res.status(500).json({ msg: error.message });
    }
};