import Booking from "../models/BookingModel.js";
import User from "../models/UserModel.js";
import Flight from "../models/FlightModel.js";
import Airport from "../models/AirportModel.js";
import Payment from "../models/PaymentModel.js"; // <<<--- TAMBAHKAN INI

export const getBookings = async (req, res) => {
    try {
        const response = await Booking.findAll({
            include: [
                { model: User },
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
                { model: User },
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

export const getBookingCount = async (req, res) => {
    try {
        const count = await Booking.count();
        res.status(200).json({ count });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

// --- FUNGSI BARU UNTUK MENGAMBIL RECENT BOOKINGS (DENGAN STATUS PEMBAYARAN) ---
export const getRecentBookings = async (req, res) => {
    try {
        const response = await Booking.findAll({
            order: [['createdAt', 'DESC']],
            limit: 7,
            include: [
                {
                    model: User,
                    attributes: ['firstName', 'lastName', 'email']
                },
                {
                    model: Flight,
                    attributes: ['departureTime', 'arrivalTime'],
                    include: [
                        {
                            model: Airport,
                            as: 'DepartureAirport',
                            attributes: ['airportName']
                        },
                        {
                            model: Airport,
                            as: 'DestinationAirport',
                            attributes: ['airportName']
                        }
                    ]
                },
                {
                    model: Payment, // <<<--- INCLUDE MODEL PAYMENT
                    attributes: ['paymentStatus'], // Ambil paymentStatus dari PaymentModel
                    required: false // Gunakan 'required: false' (LEFT JOIN) agar booking tetap tampil meskipun belum ada payment
                }
            ]
        });

        const formattedBookings = response.map(booking => ({
            bookingID: booking.bookingID,
            bookerName: booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'N/A',
            bookerEmail: booking.user ? booking.user.email : 'N/A',
            bookingDate: booking.createdAt,
            departureTime: booking.flight ? booking.flight.departureTime : 'N/A',
            arrivalTime: booking.flight ? booking.flight.arrivalTime : 'N/A',
            departureAirport: booking.flight && booking.flight.DepartureAirport ? booking.flight.DepartureAirport.airportName : 'N/A',
            destinationAirport: booking.flight && booking.flight.DestinationAirport ? booking.flight.DestinationAirport.airportName : 'N/A',
            // Ambil paymentStatus dari objek payment, default ke 'Pending' jika tidak ada payment
            paymentStatus: booking.payment ? booking.payment.paymentStatus : 'Pending' 
        }));

        res.status(200).json(formattedBookings);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Error fetching recent bookings: " + error.message });
    }
};