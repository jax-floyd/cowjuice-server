/*
    Function calculates the proper tax rate for a given address.
*/
const calculateTax = ( amount, address_1, address_2, city, state, zip_code, country ) => {
    let rate;
    if (amount > 11000) { // <-- In NY state, clothing is only taxed if the item is over $110.00
        rate = 0.0875;
    } else {
        rate = 0;
    }

    return {
        amount: Math.round(amount * rate),
        rate: rate,
    };
};

module.exports = calculateTax;