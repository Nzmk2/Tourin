import Payment from "../models/PaymentModel.js";
import Booking from "../models/BookingModel.js";

export const getPayments = async (req, res) => {
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

export const getPaymentById = async (req, res) => {
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

export const createPayment = async (req, res) => {
    try {
        await Payment.create(req.body);
        res.status(201).json({ msg: "Payment created" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const updatePayment = async (req, res) => {
    try {
        await Payment.update(req.body, {
            where: {
                paymentID: req.params.id
            }
        });
        res.status(200).json({ msg: "Payment updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const deletePayment = async (req, res) => {
    try {
        await Payment.destroy({
            where: {
                paymentID: req.params.id
            }
        });
        res.status(200).json({ msg: "Payment deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};