import Package from "../models/PackageModel.js";
import Destination from "../models/DestinationModel.js";

export const getPackages = async(req, res) => {
    try {
        const packages = await Package.findAll({
            include: [{ 
                model: Destination,
                attributes: ['destinationID', 'name', 'country', 'city', 'description', 'image', 'imageType']
            }]
        });

        // Transform response untuk menangani BLOB image
        const transformedPackages = packages.map(pkg => {
            const packageData = pkg.toJSON();
            
            // Handle package image
            if (packageData.image) {
                packageData.imageUrl = 
                    `data:${packageData.imageType};base64,${packageData.image.toString('base64')}`;
                delete packageData.image;
                delete packageData.imageType;
            }
            
            // Handle destination image
            if (packageData.Destination?.image) {
                packageData.Destination.imageUrl = 
                    `data:${packageData.Destination.imageType};base64,${packageData.Destination.image.toString('base64')}`;
                delete packageData.Destination.image;
                delete packageData.Destination.imageType;
            }
            
            return packageData;
        });

        res.status(200).json(transformedPackages);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getPopularPackages = async(req, res) => {
    try {
        const packages = await Package.findAll({
            include: [{ 
                model: Destination,
                attributes: ['destinationID', 'name', 'country', 'city', 'description', 'image', 'imageType']
            }],
            order: [['reviewCount', 'DESC']],
            limit: 6
        });

        // Transform response untuk menangani BLOB image
        const transformedPackages = packages.map(pkg => {
            const packageData = pkg.toJSON();
            
            // Handle package image
            if (packageData.image) {
                packageData.imageUrl = 
                    `data:${packageData.imageType};base64,${packageData.image.toString('base64')}`;
                delete packageData.image;
                delete packageData.imageType;
            }
            
            // Handle destination image
            if (packageData.Destination?.image) {
                packageData.Destination.imageUrl = 
                    `data:${packageData.Destination.imageType};base64,${packageData.Destination.image.toString('base64')}`;
                delete packageData.Destination.image;
                delete packageData.Destination.imageType;
            }
            
            return packageData;
        });

        res.status(200).json(transformedPackages);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getPackageById = async(req, res) => {
    try {
        const tourPackage = await Package.findOne({
            where: { packageID: req.params.id },
            include: [{ 
                model: Destination,
                attributes: ['destinationID', 'name', 'country', 'city', 'description', 'image', 'imageType']
            }]
        });

        if (!tourPackage) {
            return res.status(404).json({ msg: "Package not found" });
        }

        const packageData = tourPackage.toJSON();
        // Handle package image
        if (packageData.image) {
            packageData.imageUrl = 
                `data:${packageData.imageType};base64,${packageData.image.toString('base64')}`;
            delete packageData.image;
            delete packageData.imageType;
        }
        
        // Handle destination image
        if (packageData.Destination?.image) {
            packageData.Destination.imageUrl = 
                `data:${packageData.Destination.imageType};base64,${packageData.Destination.image.toString('base64')}`;
            delete packageData.Destination.image;
            delete packageData.Destination.imageType;
        }

        res.status(200).json(packageData);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createPackage = async(req, res) => {
    try {
        const { title, description, price, duration, maxPax, location, destinationID } = req.body;
        let image = null;
        let imageType = null;

        if (req.file) {
            image = req.file.buffer;
            imageType = req.file.mimetype;
        }

        const newPackage = await Package.create({
            title,
            description,
            price,
            duration,
            maxPax,
            location,
            destinationID,
            image,
            imageType
        });

        const packageData = newPackage.toJSON();
        if (image) {
            packageData.imageUrl = `data:${imageType};base64,${image.toString('base64')}`;
            delete packageData.image;
            delete packageData.imageType;
        }

        res.status(201).json({
            msg: "Package Created Successfully",
            package: packageData
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const updatePackage = async(req, res) => {
    try {
        const { title, description, price, duration, maxPax, location, destinationID } = req.body;
        const updateData = {
            title,
            description,
            price,
            duration,
            maxPax,
            location,
            destinationID
        };

        if (req.file) {
            updateData.image = req.file.buffer;
            updateData.imageType = req.file.mimetype;
        }

        const updated = await Package.update(updateData, {
            where: { packageID: req.params.id }
        });

        if (updated[0] === 0) {
            return res.status(404).json({ msg: "Package not found" });
        }
        res.status(200).json({ msg: "Package Updated Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deletePackage = async(req, res) => {
    try {
        const deleted = await Package.destroy({
            where: { packageID: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ msg: "Package not found" });
        }
        res.status(200).json({ msg: "Package Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};