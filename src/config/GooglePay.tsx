/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { shippingOptionParameters } from './ShippingOptions';

/**The [Google Pay payment request](https://developers.google.com/pay/api/web/guides/tutorial)
 *
 * The `stripe:publishableKey` value is a [sample API key provided by Stripe](https://stripe.com/docs/payments/accept-a-payment).
 */
export const paymentRequest: google.payments.api.PaymentDataRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA']
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          'gateway': 'stripe',
          'stripe:version': '2018-10-31',
          'stripe:publishableKey': 'pk_test_MNKMwKAvgdo2yKOhIeCOE6MZ00yS3mWShu'
        }
      }
    }
  ],
  merchantInfo: {
    merchantId: '17613812255336763067', // Test merchant ID provided by Google
    merchantName: 'Demo Only (you will not be charged)'
  },
  transactionInfo: {
    totalPriceStatus: 'FINAL',
    totalPriceLabel: 'Total',
    totalPrice: '0', // Force this to be zero for the sample app
    currencyCode: 'USD',
    countryCode: 'US'
  },
  shippingAddressRequired: true,
  shippingOptionParameters: shippingOptionParameters,
  shippingOptionRequired: true,
  callbackIntents: ['SHIPPING_ADDRESS', 'SHIPPING_OPTION']
};
