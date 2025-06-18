import Destination from "../models/DestinationModel.js";

export const getDestinations = async(req, res) => {
    try {
        const destinations = await Destination.findAll();

        // Transform response to include base64 image
        const destinationsWithImages = destinations.map(dest => {
            const destData = dest.toJSON();
            if (destData.image && destData.image.length > 0) {
                destData.imageUrl = `data:${destData.imageType};base64,${destData.image.toString('base64')}`;
            }
            delete destData.image;
            delete destData.imageType;
            return destData;
        });

        res.status(200).json({
            status: 'success',
            data: destinationsWithImages
        });
    } catch (error) {
        console.error('Get destinations error:', error);
        res.status(500).json({ 
            status: 'error',
            msg: error.message 
        });
    }
};

export const getPopularDestinations = async(req, res) => {
    try {
        const popularDestinations = await Destination.findAll({
            where: {
                isPopular: true
            },
            attributes: [
                'destinationID',
                'name',
                'country',
                'city',
                'description',
                'image',
                'imageType',
                'rating',
                'reviewCount',
                'isPopular'
            ],
            order: [
                ['rating', 'DESC'],
                ['reviewCount', 'DESC']
            ],
            limit: 6
        });

        const formattedDestinations = popularDestinations.map(destination => {
            const destData = destination.toJSON();
            
            if (destData.image && destData.image.length > 0) {
                destData.imageUrl = `data:${destData.imageType};base64,${destData.image.toString('base64')}`;
            }
            
            delete destData.image;
            delete destData.imageType;

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
            timestamp: new Date().toISOString(),
            count: formattedDestinations.length,
            data: formattedDestinations
        });

    } catch (error) {
        console.error('Get popular destinations error:', error);
        res.status(500).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            message: error.message
        });
    }
};

export const getDestinationById = async(req, res) => {
    try {
        const destination = await Destination.findOne({
            where: { destinationID: req.params.id }
        });

        if (!destination) {
            return res.status(404).json({ 
                status: 'error',
                msg: "Destination not found" 
            });
        }

        const destData = destination.toJSON();
        if (destData.image && destData.image.length > 0) {
            destData.imageUrl = `data:${destData.imageType};base64,${destData.image.toString('base64')}`;
        }
        delete destData.image;
        delete destData.imageType;

        res.status(200).json({
            status: 'success',
            data: destData
        });
    } catch (error) {
        console.error('Get destination by ID error:', error);
        res.status(500).json({ 
            status: 'error',
            msg: error.message 
        });
    }
};

export const createDestination = async(req, res) => {
    try {
        console.log('Create destination request received');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file ? 'File present' : 'No file');

        const { name, country, city, description, isPopular } = req.body;
        
        // Validasi input yang diperlukan
        if (!name || !country || !city || !description) {
            return res.status(400).json({
                status: 'error',
                msg: "Please fill in all required fields (name, country, city, description)"
            });
        }

        let image = null;
        let imageType = null;

        if (req.file) {
            console.log('Processing uploaded file:', req.file.originalname);
            image = req.file.buffer;
            imageType = req.file.mimetype;
        }

        const destinationData = {
            name: name.trim(),
            country: country.trim(),
            city: city.trim(),
            description: description.trim(),
            image,
            imageType,
            isPopular: isPopular === 'true' || isPopular === true,
            rating: 0,
            reviewCount: 0
        };

        console.log('Creating destination with data:', {
            ...destinationData,
            image: image ? 'Image buffer present' : 'No image',
            imageType
        });

        const destination = await Destination.create(destinationData);

        console.log('Destination created successfully:', destination.destinationID);

        // Prepare response data
        const responseData = destination.toJSON();
        if (image) {
            responseData.imageUrl = `data:${imageType};base64,${image.toString('base64')}`;
        }
        delete responseData.image;
        delete responseData.imageType;

        res.status(201).json({
            status: 'success',
            msg: "Destination created successfully",
            data: responseData
        });

    } catch (error) {
        console.error('Create destination error:', error);
        
        // Handle specific Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => err.message);
            return res.status(400).json({
                status: 'error',
                msg: "Validation error",
                errors: validationErrors
            });
        }

        // Handle unique constraint errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                status: 'error',
                msg: "A destination with this name already exists"
            });
        }

        res.status(500).json({ 
            status: 'error',
            msg: "Failed to create destination: " + error.message 
        });
    }
};

export const updateDestination = async(req, res) => {
    try {
        const { name, country, city, description, isPopular } = req.body;
        
        const updateData = {
            name: name?.trim(),
            country: country?.trim(),
            city: city?.trim(),
            description: description?.trim(),
            isPopular: isPopular === 'true' || isPopular === true
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        if (req.file) {
            updateData.image = req.file.buffer;
            updateData.imageType = req.file.mimetype;
        }

        const [updated] = await Destination.update(updateData, {
            where: { destinationID: req.params.id }
        });

        if (updated === 0) {
            return res.status(404).json({ 
                status: 'error',
                msg: "Destination not found" 
            });
        }

        res.status(200).json({ 
            status: 'success',
            msg: "Destination updated successfully" 
        });
        
    } catch (error) {
        console.error('Update destination error:', error);
        res.status(500).json({ 
            status: 'error',
            msg: error.message 
        });
    }
};

export const deleteDestination = async(req, res) => {
    try {
        const deleted = await Destination.destroy({
            where: { destinationID: req.params.id }
        });
        
        if (!deleted) {
            return res.status(404).json({ 
                status: 'error',
                msg: "Destination not found" 
            });
        }
        
        res.status(200).json({ 
            status: 'success',
            msg: "Destination deleted successfully" 
        });
        
    } catch (error) {
        console.error('Delete destination error:', error);
        res.status(500).json({ 
            status: 'error',
            msg: error.message 
        });
    }
};