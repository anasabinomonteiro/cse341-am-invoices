const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const asyncHandler = require('../utils/asyncHandler');

router.get('/',
    /* #swagger.summary = 'Get All invoices'
       #swagger.path = '/api/invoices'
       #swagger.tags = ['Invoices'] 
    */
    asyncHandler(invoiceController.getAllInvoices)
);


router.get('/:id',
    /* #swagger.summary = 'Get invoice by Id'
       #swagger.path = '/api/invoices/{id}'
       #swagger.tags = ['Invoices']
       #swagger.parammeters['id'] = { description: 'Invoice Id' } 
    */
    asyncHandler(invoiceController.getInvoiceById)
);


router.post('/',
    /* #swagger.summary = 'Create a new invoice'
       #swagger.path = '/api/invoices'
       #swagger.tags = ['Invoices']
       #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                invoice: '123456',
                date: '2023-10-01',
                client: 'Client Name',
                carrier: 'Carrier Name',
                destination: 'Destination Name',
                status: 'Pending',
                amount: 1000
            }
        }
     */
    asyncHandler(invoiceController.createInvoice)
);


router.put('/:id',
    /* #swagger.summary = 'Update invoice by Id'
       #swagger.path = '/api/invoices/{id}'
       #swagger.tags = ['Invoices']
       #swagger.parameters['id'] = {
        in: 'path',
        description: 'Invoice Id',
        required: true,
        type: 'string'
        }
         #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                 invoice: '123456',
                 date: '2023-10-01',
                 client: 'Client Name',
                 carrier: 'Carrier Name',
                 destination: 'Destination Name',
                 status: 'Pending',
                 amount: 1000
                }
          }
    */
    asyncHandler(invoiceController.updateInvoice)
);


router.delete('/:id',
    /* #swagger.summary = 'Delete invoice by Id'
       #swagger.path = '/api/invoices/{id}'
       #swagger.tags = ['Invoices']
       #swagger.parammeters['id'] = { description: 'Invoice Id' } 
    */
    asyncHandler(invoiceController.deleteInvoice)
);

module.exports = router;