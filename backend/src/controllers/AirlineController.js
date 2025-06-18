import Airline from "../models/AirlineModel.js";

export const getAirlines = async(req, res) => {
    try {
        const airlines = await Airline.findAll({
            attributes: ['airlineID', 'name', 'code', 'logo', 'logoType']
        });

        // Transform response to include base64 image
        const airlinesWithImages = airlines.map(airline => {
            const airlineData = airline.toJSON();
            if (airlineData.logo) {
                airlineData.logoUrl = `data:${airlineData.logoType};base64,${airlineData.logo.toString('base64')}`;
            }
            delete airlineData.logo; // Remove binary data
            delete airlineData.logoType; // Remove mime type
            return airlineData;
        });

        res.json(airlinesWithImages);
    } catch (error) {
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
        const { name, code } = req.body;
        let logo = null;
        let logoType = null;

        // Handle image upload if exists
        if (req.file) {
            logo = req.file.buffer;
            logoType = req.file.mimetype;
        }

        await Airline.create({
            name: name,
            code: code,
            logo: logo,
            logoType: logoType
        });

        res.json({ msg: "Airline Created Successfully" });
    } catch (error) {
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