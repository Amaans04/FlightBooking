function dynamicPricing(basePrice, seatsAvailable) {
    if (seatsAvailable < 20) {
      return basePrice * 1.2;
    }
    return basePrice;
  }
  
  module.exports = dynamicPricing;