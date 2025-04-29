const stripe = require('../../configs/stripe.js'); // Import Stripe configuration

const setupCreateCustomer = (router) => {
  router.post('/create-customer', async (req, res) => {
    console.log("'/create-customer' endpoint was reached.");
    try {
      const {
        cowjuiceId,
        email,
        name: { first, last },
        shipping: { address1, address2, city, state, postalCode, country, phone },
      } = req.body;

      // Step 1: Search for an existing customer by email using Stripe's search API
      const existingCustomerByEmail = await stripe.customers.search({
        query: `email:'${email}'`,
        limit: 1,
      });

      console.log("Stripe response from search:", existingCustomerByEmail);

      if (existingCustomerByEmail.data.length > 0) {
        // If a customer exists with this email, log and notify the user
        console.log('There is a customer under that email:');
        console.log(existingCustomerByEmail.data[0]);

        // Log the response structure and customer data before returning
        const existingCustomer = existingCustomerByEmail.data[0];
        console.log("Existing Customer to be sent back:", existingCustomer);

        // Ensure the response is sent only once
        return res.status(400).json({
          message: 'A customer with this email already exists. Please log in or use a different email.',
          customer: existingCustomer, // <-- Send back the existing customer object
        });
      }

      // Step 2: If no customer exists with this email, create a new customer in Stripe with shipping address
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

      // Log the newly created customer object before sending
      console.log("Newly Created Customer:", customer);

      // Respond with success and the newly created customer details
      return res.status(200).json({
        status: 'success',
        customerId: customer.id, // Return the customer ID for the front-end
        customer, // Return the full customer object including shipping info
      });
    } catch (error) {
      console.error('Error creating customer:', error);

      // Send an error response with a detailed message
      return res.status(500).json({
        error: 'Failed to create customer',
        message: error.message || 'Unknown error occurred',
      });
    }
  });
};

module.exports = setupCreateCustomer;