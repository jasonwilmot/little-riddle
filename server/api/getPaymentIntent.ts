
import stripe from 'stripe'

export default defineEventHandler(async (event) => {


  const body = await readBody(event)

  console.log(body.protocol)

  var stripeObj
  let stripeKey:string = process.env.Stripe_Secret_Prod!
  //var stripeKey = process.env.Stripe_Secret_Prod

  console.log(stripeKey)

  if ( body.protocol === 'http:') {

    console.log('local-----------')

    stripeObj = new stripe(stripeKey);


  } else {

    console.log('cloud-------------')

    stripeObj = new stripe(stripeKey);


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