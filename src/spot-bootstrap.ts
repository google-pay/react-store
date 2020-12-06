import { loadScript } from './load-script';
import { waitFor } from './wait';

async function bootstrapSpot() {
  await loadScript('https://microapps.google.com/apis/v1alpha/microapps.js');
  await waitFor(() => 'google' in window);

  google.payments.api.PaymentsClient.prototype.isReadyToPay = () =>
    Promise.resolve({
      result: true,
    });

  google.payments.api.PaymentsClient.prototype.loadPaymentData = (async (
    request: google.payments.api.PaymentDataRequest,
  ) => {
    function parseDisplayItem(item: google.payments.api.DisplayItem, currencyCode: string) {
      const match = /^(.+)\s+x\s+(\d+)$/.exec(item.label);
      return {
        title: match ? match[1] : item.label,
        quantity: match ? Number(match[2]) : 1,
        price: {
          currency: currencyCode,
          value: item.price,
        },
      };
    }

    try {
      const response = await microapps.requestPayment(request);
      const orderRequest: any = {
        title: 'Online order',
        total: {
          currency: request.transactionInfo.currencyCode,
          value: request.transactionInfo.totalPrice,
        },
        status: {
          type: 'CONFIRMED',
          label: 'Order received.',
        },
      };

      if (request.transactionInfo.displayItems) {
        orderRequest.items = request.transactionInfo.displayItems.map(item =>
          parseDisplayItem(item, request.transactionInfo.currencyCode),
        );
      }

      await microapps.createOrder(orderRequest);

      return response;
    } catch (error) {
      alert(error.toString());
      throw error;
    }
  }) as any;
}

if (window.navigator.userAgent.indexOf('GPay-Microapps') !== -1) {
  bootstrapSpot();
}
