const stripe = require('../../configs/stripe.js'); // Import Stripe configuration

const setupCreateCustomer = (router) => {
  router.post('/create-customer', async (req, res) => {
    console.log("'/create-customer' endpoint was reached.");
    try {
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

      // Step 1: Search for an existing customer by email using Stripe's search API
      const existingCustomerByEmail = await stripe.customers.search({
        query: `email:'${email}'`,
        limit: 1,
      });

      if (existingCustomerByEmail.data.length > 0) {
        // If a customer exists with this email, notify the user
        console.log('there is a customer under that email:')
        console.log(existingCustomerByEmail.data[0]);
        return res.json({
          message: 'A customer with this email already exists. Please log in or use a different email.',
          customer: existingCustomerByEmail.data[0], // <-- We return the existing customer to be able to display to end user and check if it's them.
        });
      }

      // Step 2. If new email, create a new customer in Stripe with shipping address
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