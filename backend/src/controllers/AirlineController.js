import Airline from "../models/AirlineModel.js";

export const getAirlines = async (req, res) => {
    try {
        const response = await Airline.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getAirlineById = async (req, res) => {
    try {
        const response = await Airline.findOne({
            where: {
                airlineID: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const createAirline = async (req, res) => {
    const { airlineName, contactNumber, operatingRegion } = req.body; // Dapatkan data dari body

    try {
        // 1. Cari airline dengan airlineID terbesar untuk menentukan angka berikutnya
        const lastAirline = await Airline.findOne({
            order: [
                ['airlineID', 'DESC'] // Urutkan secara descending untuk mendapatkan yang terbesar
            ],
            attributes: ['airlineID'] // Hanya ambil kolom airlineID
        });

        let nextNumber = 1; // Default jika belum ada airline

        if (lastAirline && lastAirline.airlineID) {
            // Ekstrak angka dari airlineID terakhir (contoh: "AR-001" -> 1)
            const lastCodeMatch = lastAirline.airlineID.match(/^AR-(\d+)$/);
            if (lastCodeMatch && lastCodeMatch[1]) {
                const lastNumericPart = parseInt(lastCodeMatch[1], 10);
                nextNumber = lastNumericPart + 1;
            }
        }

        // 2. Format angka dengan leading zeros (contoh: 1 -> "001", 15 -> "015")
        // Sesuaikan padding jika Anda membutuhkan lebih dari 3 digit
        const formattedNumber = String(nextNumber).padStart(3, '0');
        const generatedAirlineID = `AR-${formattedNumber}`; // Gabungkan dengan prefix

        // 3. Buat record airline baru dengan airlineID yang digenerate
        await Airline.create({
            airlineID: generatedAirlineID, // Gunakan ID yang digenerate
            airlineName,
            contactNumber,
            operatingRegion
        });
        res.status(201).json({ msg: "Airline created successfully!", airlineID: generatedAirlineID });
    } catch (error) {
        console.error("Error creating airline:", error.message);
        res.status(500).json({ msg: error.message || "Failed to create airline." });
    }
};


export const updateAirline = async (req, res) => {
    try {
        await Airline.update(req.body, {
            where: {
                airlineID: req.params.id
            }
        });
        res.status(200).json({ msg: "Airline updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const deleteAirline = async (req, res) => {
    try {
        await Airline.destroy({
            where: {
                airlineID: req.params.id
            }
        });
        res.status(200).json({ msg: "Airline deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};