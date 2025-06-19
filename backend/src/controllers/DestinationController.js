import Destination from "../models/DestinationModel.js";

// Helper function untuk format date time
const formatDateTime = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const getDestinations = async(req, res) => {
    try {
        const destinations = await Destination.findAll();

        // Transform response to include base64 image
        const destinationsWithImages = destinations.map(dest => {
            const destData = {
                ...dest.toJSON(),
                currentDateTime: formatDateTime(new Date()),
                currentUser: 'Nzmk2'
            };

            // Convert Buffer to base64 string if image exists
            if (destData.image) {
                destData.image = Buffer.from(destData.image).toString('base64');
            }

            return destData;
        });

        res.status(200).json(destinationsWithImages);
    } catch (error) {
        console.error('Get destinations error:', error);
        res.status(500).json({ msg: error.message });
    }
};

export const getPopularDestinations = async(req, res) => {
    try {
        const popularDestinations = await Destination.findAll({
            where: { isPopular: true },
            attributes: [
                'destinationID', 'name', 'country', 'city', 'description',
                'image', 'imageType', 'rating', 'reviewCount', 'isPopular'
            ],
            order: [
                ['rating', 'DESC'],
                ['reviewCount', 'DESC']
            ],
            limit: 6
        });

        const formattedDestinations = popularDestinations.map(destination => {
            const destData = {
                ...destination.toJSON(),
                currentDateTime: formatDateTime(new Date()),
                currentUser: 'Nzmk2'
            };
            
            if (destData.image) {
                destData.image = Buffer.from(destData.image).toString('base64');
            }
            
            destData.rating = Number(destData.rating).toFixed(1);

            return {
                ...destData,
                ratingInfo: {
                    score: destData.rating,
                    maxScore: 5,
                    reviewCount: destData.reviewCount
                }
            };
        });

        res.status(200).json({
            status: 'success',
            timestamp: formatDateTime(new Date()),
            currentUser: 'Nzmk2',
            count: formattedDestinations.length,
            data: formattedDestinations
        });
    } catch (error) {
        console.error('Get popular destinations error:', error);
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

        const destData = {
            ...destination.toJSON(),
            currentDateTime: formatDateTime(new Date()),
            currentUser: 'Nzmk2'
        };

        if (destData.image) {
            destData.image = Buffer.from(destData.image).toString('base64');
        }

        res.json(destData);
    } catch (error) {
        console.error('Get destination by ID error:', error);
        res.status(500).json({ msg: error.message });
    }
};

export const createDestination = async(req, res) => {
    try {
        console.log('Create destination request received');
        console.log('Timestamp:', formatDateTime(new Date()));
        console.log('Current User: Nzmk2');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        const { name, country, city, description, isPopular } = req.body;
        
        // Validate input
        if (!name || !country || !city || !description) {
            return res.status(400).json({
                msg: "Please fill in all required fields (name, country, city, description)",
                timestamp: formatDateTime(new Date()),
                currentUser: 'Nzmk2'
            });
        }

        const destinationData = {
            name: name.trim(),
            country: country.trim(),
            city: city.trim(),
            description: description.trim(),
            isPopular: isPopular === 'true' || isPopular === true,
            rating: 0,
            reviewCount: 0
        };

        // Handle image if uploaded
        if (req.file) {
            destinationData.image = req.file.buffer;
            destinationData.imageType = req.file.mimetype;
        }

        const destination = await Destination.create(destinationData);

        const responseData = {
            destinationID: destination.destinationID,
            name: destination.name,
            country: destination.country,
            city: destination.city,
            description: destination.description,
            isPopular: destination.isPopular,
            rating: destination.rating,
            reviewCount: destination.reviewCount,
            currentDateTime: formatDateTime(new Date()),
            currentUser: 'Nzmk2'
        };

        if (req.file) {
            responseData.image = req.file.buffer.toString('base64');
            responseData.imageType = req.file.mimetype;
        }

        res.status(201).json({
            msg: "Destination created successfully",
            timestamp: formatDateTime(new Date()),
            currentUser: 'Nzmk2',
            destination: responseData
        });

    } catch (error) {
        console.error('Create destination error:', error);
        res.status(500).json({ 
            msg: "Failed to create destination: " + error.message,
            timestamp: formatDateTime(new Date()),
            currentUser: 'Nzmk2'
        });
    }
};

export const updateDestination = async(req, res) => {
    try {
        console.log('Update request received');
        console.log('Timestamp:', formatDateTime(new Date()));
        console.log('Current User: Nzmk2');
        
        const destination = await Destination.findOne({
            where: { destinationID: req.params.id }
        });

        if (!destination) {
            return res.status(404).json({
                msg: "Destination not found",
                timestamp: formatDateTime(new Date()),
                currentUser: 'Nzmk2'
            });
        }

        const updateData = {
            name: req.body.name?.trim() || destination.name,
            country: req.body.country?.trim() || destination.country,
            city: req.body.city?.trim() || destination.city,
            description: req.body.description?.trim() || destination.description,
            isPopular: req.body.isPopular === 'true' || req.body.isPopular === true
        };

        if (req.file) {
            updateData.image = req.file.buffer;
            updateData.imageType = req.file.mimetype;
        }

        await destination.update(updateData);

        res.json({
            msg: "Destination updated successfully",
            timestamp: formatDateTime(new Date()),
            currentUser: 'Nzmk2'
        });
    } catch (error) {
        console.error('Update destination error:', error);
        res.status(500).json({
            msg: error.message,
            timestamp: formatDateTime(new Date()),
            currentUser: 'Nzmk2'
        });
    }
};

export const deleteDestination = async(req, res) => {
    try {
        console.log('Delete request received');
        console.log('Timestamp:', formatDateTime(new Date()));
        console.log('Current User: Nzmk2');

        const destination = await Destination.findOne({
            where: { destinationID: req.params.id }
        });

        if (!destination) {
            return res.status(404).json({
                msg: "Destination not found",
                timestamp: formatDateTime(new Date()),
                currentUser: 'Nzmk2'
            });
        }

        await destination.destroy();
        
        res.json({
            msg: "Destination deleted successfully",
            timestamp: formatDateTime(new Date()),
            currentUser: 'Nzmk2'
        });
    } catch (error) {
        console.error('Delete destination error:', error);
        res.status(500).json({
            msg: error.message,
            timestamp: formatDateTime(new Date()),
            currentUser: 'Nzmk2'
        });
    }
};