const express = require('express');
const router = express.Router();
const carrierController = require('../controllers/carrierController');
const asyncHandler = require('../utils/asyncHandler');

// Get All Carriers
router.get('/',
    /* #swagger.tags = ['Carriers']
       #swagger.path = '/api/carriers'
       #swagger.summary = 'Get all carriers'
       #swagger.responses[200] = {
            description: 'List of carriers',
            schema: [
                {
                    name: 'Carrier Name',
                    contact: 'Carrier Contact Information',
                    phone: '123-456-7890',
                    email: 'logistics@carrier.com',
                    address: '123 Carrier St, City, Country'
                }
            ]
        }
    */
    asyncHandler(carrierController.getAllCarriers)
);

// Get Carrier by ID
router.get('/:id',
    /* #swagger.tags = ['Carriers']
       #swagger.path = '/api/carriers/{id}'
       #swagger.summary = 'Get carrier by ID' 
       #swagger.parameters['id'] = {
           in: 'path',
           description: 'Carrier ID',
           required: true,
           type: 'string'
       }
       #swagger.responses[200] = {
            description: 'Carrier data',
            schema: {
                name: 'Carrier Name',
                contact: 'Carrier Contact Information',
                phone: '123-456-7890',
                email: 'logistics@carrier.com',
                address: '123 Carrier St, City, Country'
            }
       }
    */
    asyncHandler(carrierController.getCarrierById)
);

// Create New Carrier
router.post('/',
    /* 
       #swagger.tags = ['Carriers']
       #swagger.path = '/api/carriers'
       #swagger.summary = 'Create a new carrier'
       #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                name: 'Carrier Name',
                contact: 'Carrier Contact Information',
                phone: '123-456-7890',
                email: 'logistics@carrier.com',
                address: '123 Carrier St, City, Country'
            }
       }
       #swagger.responses[201] = {
            description: 'Carrier created successfully',
            schema: {
                name: 'Carrier Name',
                contact: 'Carrier Contact Information',
                phone: '123-456-7890',
                email: 'logistics@carrier.com',
                address: '123 Carrier St, City, Country'
            }
       }
    */
    asyncHandler(carrierController.createCarrier)
);

// Update Carrier by ID
router.put('/:id',
    /* 
      #swagger.tags = ['Carriers']
      #swagger.path = '/api/carriers/{id}'
      #swagger.summary = 'Update a carrier'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'Carrier ID',
        required: true,
        type: 'string'
      }
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          name: 'Updated Name',
          contact: 'Updated Contact',
          phone: '987-654-3210',
          email: 'updated@carrier.com',
          address: 'Updated Address'
        }
      }
      #swagger.responses[200] = {
          description: 'Carrier updated successfully'
      }
    */
    asyncHandler(carrierController.updateCarrier)
);

// Delete Carrier by ID
router.delete('/:id',
    /* #swagger.tags = ['Carriers']
       #swagger.path = '/api/carriers/{id}'
       #swagger.summary = 'Delete a carrier'
       #swagger.parameters['id'] = { 
           in: 'path',
           description: 'Carrier ID',
           required: true,
           type: 'string'
       }
       #swagger.responses[200] = {
           description: 'Carrier deleted successfully'
       }
    */
    asyncHandler(carrierController.deleteCarrier)
);

module.exports = router;