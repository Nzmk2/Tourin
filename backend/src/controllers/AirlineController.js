import Airline from "../models/AirlineModel.js";

export const getAirlines = async(req, res) => {
    try {
        const airlines = await Airline.findAll({
            attributes: ['airlineID', 'name', 'code', 'logo', 'logoType']
        });

        // logo harus diubah ke base64 string jika ada
        const result = airlines.map(airline => {
            const data = airline.toJSON();
            if (data.logo) data.logo = data.logo.toString('base64');
            return data;
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error in getAirlines:', error);
        res.status(500).json({ msg: error.message });
    }
};

export const getAirlineById = async(req, res) => {
    try {
        const airline = await Airline.findOne({
            where: {
                airlineID: req.params.id
            }
        });
        if(!airline) return res.status(404).json({ msg: "Airline not found" });

        const airlineData = airline.toJSON();
        if (airlineData.logo) {
            airlineData.logoUrl = `data:${airlineData.logoType};base64,${airlineData.logo.toString('base64')}`;
        }
        delete airlineData.logo;
        delete airlineData.logoType;

        res.json(airlineData);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createAirline = async(req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        const { name, code } = req.body;
        
        if (!name || !code) {
            return res.status(400).json({ 
                msg: "Name and code are required fields" 
            });
        }

        const airlineData = {
            name: name,
            code: code
        };

        // Handle logo if uploaded
        if (req.file) {
            airlineData.logo = req.file.buffer;
            airlineData.logoType = req.file.mimetype;
        }

        const airline = await Airline.create(airlineData);
        
        res.status(201).json({
            msg: "Airline Created Successfully",
            airline: {
                airlineID: airline.airlineID,
                name: airline.name,
                code: airline.code
            }
        });
    } catch (error) {
        console.error('Error in createAirline:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                msg: "Airline code must be unique"
            });
        }
        res.status(500).json({ msg: error.message });
    }
};

export const updateAirline = async(req, res) => {
    try {
        const airline = await Airline.findOne({
            where: {
                airlineID: req.params.id
            }
        });
        if(!airline) return res.status(404).json({ msg: "Airline not found" });
        
        const { name, code } = req.body;
        const updateData = {
            name: name,
            code: code
        };

        // Update image only if new file is uploaded
        if (req.file) {
            updateData.logo = req.file.buffer;
            updateData.logoType = req.file.mimetype;
        }

        await Airline.update(updateData, {
            where: {
                airlineID: req.params.id
            }
        });
        res.json({ msg: "Airline Updated Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteAirline = async(req, res) => {
    try {
        const airline = await Airline.findOne({
            where: {
                airlineID: req.params.id
            }
        });
        if(!airline) return res.status(404).json({ msg: "Airline not found" });
        
        await Airline.destroy({
            where: {
                airlineID: req.params.id
            }
        });
        res.json({ msg: "Airline Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};