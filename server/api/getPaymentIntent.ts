
import stripe from 'stripe'

export default defineEventHandler(async (event) => {

    
  const stripeObj = new stripe('sk_test_51PhhMRAf1FjVNxtqU5Q4JQSpptKeUKQGgtby41DXghdTDnOn3Qg8Ggnne2HKNC7seyZ2zyFSLRf3sun2Qgkc2Xe200nNZVA9im');

   

const paymentIntent = await stripeObj.paymentIntents.create({
  amount: 1099,
  currency: 'usd',
  automatic_payment_methods: {
    enabled: true,
  },
});

return paymentIntent
    


})