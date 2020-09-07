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
    body('name').isString().withMessage('Name should be a text value')
        .notEmpty().withMessage('Name is required')
        .trim(),
    body('address').custom((address) => {
        if (typeof(address) !== 'object' && address) {
            throw new Error('Address must be an object');
        }
        return true;
    }),
    body('address.street').isString().withMessage('address.street should be a text value').trim().optional({checkFalsy: true}),
    body('address.suburb').isString().withMessage('address.suburb should be a text value').trim().optional({checkFalsy: true}),
    body('address.state').isString().withMessage('address.state should be a text value').trim().optional({checkFalsy: true}),
    body('address.postcode').isPostalCode('any').withMessage('address.postcode should be valid').optional({checkFalsy: true}),
    body('studentCount').isNumeric({no_symbols: true}).withMessage('studentCount should be positive number').optional({checkFalsy: true}),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        School.create({
            name: req.body.name,
            studentCount: req.body.studentCount,
            address: {
                street: req.body.address ? req.body.address.street : '',
                suburb: req.body.address ? req.body.address.suburb : '',
                state: req.body.address ? req.body.address.state : '',
                postcode: req.body.address ? req.body.address.postcode : ''
            }
        }).then(school => res.status(201).json(school));
    }
];