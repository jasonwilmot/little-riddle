
import stripe from 'stripe'

export default defineEventHandler(async (event) => {


  const body = await readBody(event)

  console.log(body.protocol)

  var stripeObj

  if ( body.protocol === 'http:') {

    console.log('local-----------')

    stripeObj = new stripe('sk_test_51PhhMRAf1FjVNxtqU5Q4JQSpptKeUKQGgtby41DXghdTDnOn3Qg8Ggnne2HKNC7seyZ2zyFSLRf3sun2Qgkc2Xe200nNZVA9im');


  } else {

    console.log('cloud-------------')

    stripeObj = new stripe('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');


  }
    
  

  //

   

const paymentIntent = await stripeObj.paymentIntents.create({
  //payment_method_types: 'CARD',
  amount: 500,
  currency: 'usd',
  automatic_payment_methods: {
    enabled: true,
  },
  metadata: {
    user_text: body.note
}
});

return paymentIntent
    


})