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

import { CartItemDetails } from '../interfaces/CartItemDetails';
import { shippingOptions } from '../config/ShippingOptions';

/**Mock store services */
export class StoreService {
  /**Retrieve the list of shipping options
   * @returns {google.payments.api.ShippingOptionParameters} The available shipping options
   */
  public getShippingOptionParameters(): google.payments.api.ShippingOptionParameters {
    // Default to free shipping
    return {
      defaultSelectedOptionId: 'free',
      shippingOptions: shippingOptions.map(o => ({
        id: o.id,
        label: o.label,
        description: o.description
      }))
    };
  }

  /**Calculate transaction info
   * @param {CartItemDetails[]} cart The user's shopping cart items
   * @param {google.payments.api.Address?} address The user's shipping address
   * @param {google.payments.api.SelectionOptionData?} shippingOptionData The shipping option chosen by the user
   * @returns {google.payments.api.TransactionInfo} The updated transaction information
   */
  public getTransactionInfo(
    cart: CartItemDetails[],
    address?: google.payments.api.Address,
    shippingOptionData?: google.payments.api.SelectionOptionData
  ): google.payments.api.TransactionInfo {
    // The items to display on the shopping cart screen
    const displayItems: google.payments.api.DisplayItem[] = cart.map(item => ({
      label: `${item.item.title} (${item.size}) x ${item.quantity}`,
      price: (item.item.price * item.quantity).toFixed(2),
      type: 'LINE_ITEM'
    }));

    // The subtotal (before tax, shipping, etc.)
    const subtotal = cart.reduce((total, item) => total + item.item.price * item.quantity, 0);

    // Get the shipping option chosen by the user
    const shippingOption = shippingOptions.find(option => option.id === shippingOptionData?.id);

    // Get the price of that shipping option
    const shipping = shippingOption?.price ?? 0;

    // Calculate tax
    const tax = this.getTaxRate(address) * subtotal;

    // Add subtotal, tax, and shipping for total cost
    const total = subtotal + shipping + tax;

    // Include the subtotal on the display
    displayItems.push({
      label: 'Sub total',
      price: subtotal.toFixed(2),
      type: 'SUBTOTAL'
    });

    // Include the chosen shipping option
    displayItems.push({
      label: shippingOption?.label ?? 'Shipping',
      price: shipping.toFixed(2),
      type: 'SHIPPING_OPTION'
    });

    // Include the tax
    if (tax > 0) {
      displayItems.push({
        label: 'Tax',
        price: tax.toFixed(2),
        type: 'TAX'
      });
    }

    // Return the items to display, the total, and currency
    return {
      displayItems,
      totalPrice: total.toFixed(2),
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      currencyCode: 'USD',
      countryCode: 'US'
    };
  }

  /**Get the tax rate (percentage)
   * @param {google.payments.api.Address?} address The purchase address
   * @returns {number} The tax rate
   */
  public getTaxRate(address?: google.payments.api.Address): number {
    return address?.countryCode === 'US' ? 0.1 : 0.11;
  }

  /**Processes the order
   *
   * @param {CartItemDetails[]} cart The user's shopping cart
   * @param {google.payments.api.PaymentData} paymentData The payment data from Google Pay
   * @returns {Object} A mock order ID (today's date)
   */
  public processOrder(cart: CartItemDetails[], paymentData: google.payments.api.PaymentData): Object {
    // In a real-world scenario, this would be sent to same backend server to
    //   process the payment.
    console.log(
      'TODO: send order to server',
      paymentData.shippingAddress,
      paymentData.shippingOptionData?.id,
      paymentData.paymentMethodData
    );

    // Return a mock order ID (today's date)
    return Promise.resolve({
      orderId: Date.now().toString()
    });
  }
}
