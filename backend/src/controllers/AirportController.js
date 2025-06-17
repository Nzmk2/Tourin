import Airport from "../models/AirportModel.js";

export const getAirports = async (req, res) => {
    try {
        const response = await Airport.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const getAirportById = async (req, res) => {
    try {
        const response = await Airport.findOne({
            where: {
                airportCode: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const createAirport = async (req, res) => {
    const { airportName, facilities, location } = req.body; // Destructure body

    try {
        // Find the last airport code to determine the next sequential number
        const lastAirport = await Airport.findOne({
            order: [
                ['airportCode', 'DESC'] // Order by airportCode descending to get the largest one
            ]
        });

        let nextNumber = 1; // Default starting number

        if (lastAirport && lastAirport.airportCode) {
            // Extract the number from the last airport code (e.g., "AP-001" -> 1)
            const lastCodeMatch = lastAirport.airportCode.match(/^AP-(\d+)$/);
            if (lastCodeMatch && lastCodeMatch[1]) {
                const lastNumber = parseInt(lastCodeMatch[1], 10);
                nextNumber = lastNumber + 1;
            }
        }

        // Format the next number with leading zeros (e.g., 1 -> 001, 15 -> 015)
        const formattedNumber = String(nextNumber).padStart(3, '0');
        const airportCode = `AP-${formattedNumber}`; // Construct the new airport code

        // Create the new airport record with the generated code
        await Airport.create({
            airportCode, // Use the generated code
            airportName,
            facilities,
            location
        });

        res.status(201).json({ msg: "Airport created successfully!", airportCode }); // Send back the generated code
    } catch (error) {
        console.error("Error creating airport:", error.message); // Use console.error for errors
        res.status(500).json({ msg: error.message || "Failed to create airport." });
    }
};

export const updateAirport = async (req, res) => {
    try {
        await Airport.update(req.body, {
            where: {
                airportCode: req.params.id
            }
        });
        res.status(200).json({ msg: "Airport updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};

export const deleteAirport = async (req, res) => {
    try {
        await Airport.destroy({
            where: {
                airportCode: req.params.id
            }
        });
        res.status(200).json({ msg: "Airport deleted" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: error.message });
    }
};