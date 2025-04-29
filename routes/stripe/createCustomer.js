const stripe = require('../../configs/stripe.js'); // Import Stripe configuration

const setupCreateCustomer = (router) => {
  router.post('/create-customer', async (req, res) => {
    console.log("'/create-customer' endpoint was reached.");
    try {
      console.log(req.body)
      // Destructure data from the request body
      const {
        cowjuiceId,
        email,
        name: { 
          first, 
          last, 
        },
        shipping: {
          address1,
          address2,
          city,
          state,
          postalCode,
          country,
          phone,
        }
      } = req.body;

      // Create a new customer in Stripe with shipping address
      const customer = await stripe.customers.create({
        email: email, 
        name: `${first} ${last}`,
        metadata: {
          cowjuice_id: cowjuiceId, // Optional metadata field for identification
        },
        shipping: {
          name: `${first} ${last}`, // Full name for shipping
          address: {
            line1: address1,
            line2: address2 || '', // Optional address line 2
            city: city,
            state: state,
            postal_code: postalCode,
            country: country, // Ensure this is the two-letter country code if required
          },
          phone: phone || '', // Optional phone number for shipping
        }
      });

      // Respond with success and customer details
      res.status(200).json({
        status: 'success',
        customerId: customer.id, // Return the customer ID for the front-end
        customer, // Return the full customer object including the shipping info
      });
    } catch (error) {
      console.error('Error creating customer:', error);

      // Send an error response with a detailed message
      res.status(500).json({
        error: 'Failed to create customer',
        message: error.message || 'Unknown error occurred',
      });
    }
  });
};

module.exports = setupCreateCustomer;