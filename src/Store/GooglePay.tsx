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

import { paymentRequest } from '../config/GooglePay';
import { shippingOptions } from '../config/ShippingOptions';

/**Calculate and return the total price
 *
 * @param {google.payments.api.DisplayItem[]} displayItems The items in the user's cart
 * @returns {number} The total price
 */
function calculateTotalPrice(displayItems: google.payments.api.DisplayItem[]): number {
  return displayItems.reduce((total, item) => total + Number(item.price), 0);
}

/**Build the Google Pay payment request
 *
 * @param {google.payments.api.DisplayItem[]} displayItems The items in the user's cart
 * @returns {google.payments.api.PaymentDataRequest} The payment data request
 */
function buildPaymentRequest(displayItems: google.payments.api.DisplayItem[]): google.payments.api.PaymentDataRequest {
  return {
    ...paymentRequest,
    transactionInfo: {
      ...paymentRequest.transactionInfo,
      displayItems: [...displayItems],
      totalPrice: calculateTotalPrice(displayItems).toFixed(2)
    }
  };
}

/**Get the updated payment data from the payment request
 *
 * @param {google.payments.api.PaymentDataRequest} paymentRequest The original payment request
 * @param {google.payments.api.IntermediatePaymentData} paymentData The new intermediate payment data
 * @returns {google.payments.api.PaymentDataRequestUpdate} The updated payment request
 */
function getUpdatedPaymentData(
  paymentRequest: google.payments.api.PaymentDataRequest,
  paymentData: google.payments.api.IntermediatePaymentData
): google.payments.api.PaymentDataRequestUpdate {
  // Check if a shipping option was chosen
  if (paymentData.shippingOptionData?.id) {
    // Get the shipping option from the available choices
    const shippingOption = shippingOptions.find(option => option.id === paymentData.shippingOptionData!.id);

    if (shippingOption) {
      // Update the shopping cart with the chosen shipping option
      const displayItems: google.payments.api.DisplayItem[] = [
        ...(paymentRequest.transactionInfo.displayItems || []),
        {
          label: shippingOption.label,
          price: shippingOption.price.toFixed(2),
          type: 'SHIPPING_OPTION'
        }
      ];

      // Return the updated transaction info and display items
      return {
        newTransactionInfo: {
          ...paymentRequest.transactionInfo,
          totalPrice: calculateTotalPrice(displayItems).toFixed(2),
          displayItems
        }
      };
    }
  }

  // The shipping option didn't change...return no changes
  // In a real-world scenario, this should also check for shopping cart updates,
  //   promotion codes being added, and other use-cases
  return {};
}

export { buildPaymentRequest, getUpdatedPaymentData };
