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

import { CartItemDetails } from './store-data';

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
  {
    id: 'international',
    label: 'International shipping',
    description: '$25.00 - Arrives in 10 to 15 days',
    price: 25,
  },
];

/** Mock Store Services */
export class StoreService {
  /** Mock service to retrieve a list of shipping options based on shipping address */
  getShippingOptionParameters(address?: google.payments.api.Address): google.payments.api.ShippingOptionParameters {
    if (address?.countryCode === 'US') {
      return {
        defaultSelectedOptionId: 'free',
        shippingOptions: shippingOptions
          .filter(o => o.id !== 'international')
          .map(o => ({
            id: o.id,
            label: o.label,
            description: o.description,
          })),
      };
    }

    return {
      defaultSelectedOptionId: 'international',
      shippingOptions: shippingOptions
        .filter(o => o.id === 'international')
        .map(o => ({
          id: o.id,
          label: o.label,
          description: o.description,
        })),
    };
  }

  /** Mock service to calculate new transaction info */
  getTransactionInfo(
    cart: CartItemDetails[],
    address?: google.payments.api.Address,
    shippingOptionData?: google.payments.api.SelectionOptionData,
  ): google.payments.api.TransactionInfo {
    const displayItems: google.payments.api.DisplayItem[] = cart.map(item => ({
      label: `${item.item.title} (${item.size}) x ${item.quantity}`,
      price: (item.item.price * item.quantity).toFixed(2),
      type: 'LINE_ITEM',
    }));

    const subtotal = cart.reduce((total, item) => total + item.item.price * item.quantity, 0);

    const shippingOption = shippingOptions.find(option => option.id === shippingOptionData?.id);
    const shipping = shippingOption?.price ?? 0;

    const tax = subtotal * (address?.countryCode === 'US' ? 0.1 : 0);
    const total = subtotal + shipping + tax;

    displayItems.push({
      label: 'Sub total',
      price: subtotal.toFixed(2),
      type: 'SUBTOTAL',
    });

    displayItems.push({
      label: shippingOption?.label ?? 'Shipping',
      price: shipping.toFixed(2),
      type: 'SHIPPING_OPTION',
    });

    if (tax > 0) {
      displayItems.push({
        label: 'Tax',
        price: tax.toFixed(2),
        type: 'TAX',
      });
    }

    return {
      displayItems,
      totalPrice: total.toFixed(2),
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      currencyCode: 'USD',
      countryCode: 'US',
    };
  }

  /** Mock service to process order */
  processOrder(cart: CartItemDetails[], paymentData: google.payments.api.PaymentData) {
    console.log(
      'TODO: send order to server',
      paymentData.shippingAddress,
      paymentData.shippingOptionData?.id,
      paymentData.paymentMethodData,
    );

    return Promise.resolve({
      orderId: Date.now().toString(),
    });
  }
}
