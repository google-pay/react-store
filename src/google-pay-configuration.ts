/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const shippingOptions = [
  {
    id: 'free',
    label: 'Free shipping',
    description: 'Arrives in 5 to 7 days',
    price: 0,
  },
  {
    id: 'express',
    label: 'Express shipping',
    description: '$5.00 - Arrives in 1 to 3 days',
    price: 5,
  },
];

const shippingOptionParameters: google.payments.api.ShippingOptionParameters = {
  defaultSelectedOptionId: 'free',
  shippingOptions: shippingOptions.map(o => ({
    id: o.id,
    label: o.label,
    description: o.description,
  })),
};

const paymentRequest: google.payments.api.PaymentDataRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA'],
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          'gateway': 'stripe',
          'stripe:version': '2018-10-31',
          'stripe:publishableKey': 'pk_test_MNKMwKAvgdo2yKOhIeCOE6MZ00yS3mWShu',
        },
      },
    },
  ],
  merchantInfo: {
    merchantId: '17613812255336763067',
    merchantName: 'Demo Only (you will not be charged)',
  },
  transactionInfo: {
    totalPriceStatus: 'FINAL',
    totalPriceLabel: 'Total',
    totalPrice: '0',
    currencyCode: 'USD',
    countryCode: 'US',
  },
  shippingAddressRequired: true,
  shippingOptionParameters,
  shippingOptionRequired: true,
  callbackIntents: ['SHIPPING_ADDRESS', 'SHIPPING_OPTION'],
};

function calculateTotalPrice(displayItems: google.payments.api.DisplayItem[]) {
  return displayItems.reduce((total, item) => total + Number(item.price), 0);
}

function buildPaymentRequest(displayItems: google.payments.api.DisplayItem[]): google.payments.api.PaymentDataRequest {
  return {
    ...paymentRequest,
    transactionInfo: {
      ...paymentRequest.transactionInfo,
      displayItems: [...displayItems],
      totalPrice: calculateTotalPrice(displayItems).toFixed(2),
    },
  };
}

function getUpdatedPaymentData(
  paymentRequest: google.payments.api.PaymentDataRequest,
  paymentData: google.payments.api.IntermediatePaymentData,
): google.payments.api.PaymentDataRequestUpdate {
  if (paymentData.shippingOptionData?.id) {
    const shippingOption = shippingOptions.find(option => option.id === paymentData.shippingOptionData!.id);
    if (shippingOption) {
      const displayItems: google.payments.api.DisplayItem[] = [
        ...(paymentRequest.transactionInfo.displayItems || []),
        {
          label: shippingOption.label,
          price: shippingOption.price.toFixed(2),
          type: 'SHIPPING_OPTION',
        },
      ];

      return {
        newTransactionInfo: {
          ...paymentRequest.transactionInfo,
          totalPrice: calculateTotalPrice(displayItems).toFixed(2),
          displayItems,
        },
      };
    }
  }
  return {};
}

export { buildPaymentRequest, getUpdatedPaymentData };
