var School = require('../models/school');

const { body, validationResult } = require('express-validator');

exports.list = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, sort = 'name', sortOrder = 'asc' } = req.query;
        const sortParams = {};
        sortParams[sort] = sortOrder;
        const filterParams = {};
        if (req.query.name) {
            filterParams.name = {'$regex': req.query.name, '$options': 'i'};
        }
        if (req.query.address && typeof(req.query.address) === 'object') {
            ["street", "suburb", "state"].forEach((field) => {
                if (req.query.address[field]) {
                    filterParams[`address.${field}`] = {'$regex': req.query.address[field], '$options': 'i'};
                }
            });
            if (req.query.address.postcode) {
                filterParams['address.postcode'] = req.query.address.postcode;
            }
        }
        const schoolList = await School.find(filterParams)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(sortParams)
            .exec();

        const count = await School.countDocuments(filterParams);
        res.json({
            meta: {
                totalCount: count,
            },
            payload: schoolList
        });
    } catch (err) {
        next(err)
    }
};

exports.create = [
    body('name').isString().notEmpty().trim(),
    body('address.street').isString().trim(),
    body('address.suburb').isString().trim(),
    body('address.state').isString().trim(),
    body('address.postcode').isPostalCode('any').optional({checkFalsy: true}),
    body('studentCount').isNumeric().optional({checkFalsy: true}),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        School.create({
            name: req.body.name,
            studentCount: req.body.studentCount,
            address: {
                street: req.body.address.street,
                suburb: req.body.address.suburb,
                state: req.body.address.state,
                postcode: req.body.address.postcode
            }
        }).then(school => res.status(201).json(school));
    }
];