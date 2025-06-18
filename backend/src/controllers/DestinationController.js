import Destination from "../models/DestinationModel.js";

export const getDestinations = async(req, res) => {
    try {
        const destinations = await Destination.findAll();

        // Transform response to include base64 image
        const destinationsWithImages = destinations.map(dest => {
            const destData = dest.toJSON();
            if (destData.image) {
                destData.imageUrl = `data:${destData.imageType};base64,${destData.image.toString('base64')}`;
            }
            delete destData.image;
            delete destData.imageType;
            return destData;
        });

        res.status(200).json(destinationsWithImages);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getDestinationById = async(req, res) => {
    try {
        const destination = await Destination.findOne({
            where: { destinationID: req.params.id }
        });

        if (!destination) {
            return res.status(404).json({ msg: "Destination not found" });
        }

        const destData = destination.toJSON();
        if (destData.image) {
            destData.imageUrl = `data:${destData.imageType};base64,${destData.image.toString('base64')}`;
        }
        delete destData.image;
        delete destData.imageType;

        res.status(200).json(destData);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createDestination = async(req, res) => {
    try {
        const { name, country, city, description, isPopular } = req.body;
        let image = null;
        let imageType = null;

        if (req.file) {
            image = req.file.buffer;
            imageType = req.file.mimetype;
        }

        const destination = await Destination.create({
            name,
            country,
            city,
            description,
            image,
            imageType,
            isPopular: isPopular || false
        });

        res.status(201).json({
            msg: "Destination Created Successfully",
            destination: {
                ...destination.toJSON(),
                imageUrl: image ? `data:${imageType};base64,${image.toString('base64')}` : null
            }
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updateDestination = async(req, res) => {
    try {
        const { name, country, city, description, isPopular } = req.body;
        const updateData = {
            name,
            country,
            city,
            description,
            isPopular
        };

        if (req.file) {
            updateData.image = req.file.buffer;
            updateData.imageType = req.file.mimetype;
        }

        const updated = await Destination.update(updateData, {
            where: { destinationID: req.params.id }
        });

        if (updated[0] === 0) {
            return res.status(404).json({ msg: "Destination not found" });
        }
        res.status(200).json({ msg: "Destination Updated Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteDestination = async(req, res) => {
    try {
        const deleted = await Destination.destroy({
            where: { destinationID: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ msg: "Destination not found" });
        }
        res.status(200).json({ msg: "Destination Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};