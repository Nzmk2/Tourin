import Payment from "../models/PaymentModel.js";
import Booking from "../models/BookingModel.js";

export const getPayments = async(req, res) => {
    try {
        const response = await Payment.findAll({
            include: [{ model: Booking }]
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getPaymentById = async(req, res) => {
    try {
        const response = await Payment.findOne({
            where: {
                paymentID: req.params.id
            },
            include: [{ model: Booking }]
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const createPayment = async(req, res) => {
    const { bookingID, amount, paymentMethod } = req.body;
    try {
        // Check if booking exists
        const booking = await Booking.findByPk(bookingID);
        if (!booking) {
            return res.status(404).json({ msg: "Booking not found" });
        }

        // Create payment
        const payment = await Payment.create({
            bookingID: bookingID,
            amount: amount,
            paymentMethod: paymentMethod,
            paymentStatus: 'pending'
        });

        res.status(201).json({
            msg: "Payment Created Successfully",
            paymentID: payment.paymentID
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const updatePaymentStatus = async(req, res) => {
    try {
        const { paymentStatus } = req.body;
        const payment = await Payment.findByPk(req.params.id);
        
        if (!payment) {
            return res.status(404).json({ msg: "Payment not found" });
        }

        await Payment.update(
            { 
                paymentStatus: paymentStatus,
                paymentDate: paymentStatus === 'completed' ? new Date() : null
            },
            { where: { paymentID: req.params.id } }
        );

        // If payment is completed, update booking status
        if (paymentStatus === 'completed') {
            await Booking.update(
                { status: 'confirmed' },
                { where: { bookingID: payment.bookingID } }
            );
        }

        res.status(200).json({ msg: "Payment Status Updated Successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};