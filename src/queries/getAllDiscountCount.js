export default async function getAllDiscountCount(context, shopId) {
  const { collections } = context;
  const { Orders } = collections;

  try {
    const orders = await Orders.find({}).toArray();

    const discountTotal = orders.reduce((total, order) => {
      const discountAmount = order.shipping[0]?.invoice?.discounts || 0;

      if (order.workflow?.status !== "canceled") {
        return total + discountAmount;
      }

      return total; // Exclude cancelled orders from the total
    }, 0);

    const totalOrdersWithDiscount = orders.filter((order) => {
      const discountAmount = order.shipping[0]?.invoice?.discounts || 0;
      return discountAmount > 0 && order.workflow?.status !== "canceled";
    }).length;

    console.log("Total discount amount:", discountTotal.toFixed(2));
    console.log("Total orders with discount:", totalOrdersWithDiscount);

    return {
      totalAmount: discountTotal.toFixed(2),
      totalAccounts: totalOrdersWithDiscount,
    };
  } catch (error) {
    console.log("Error querying MongoDB:", error);
  }

  // const { collections } = context;
  // const { Orders } = collections;
  // try {
  //   const orders = await Orders.find({}).toArray();

  //   const discountTotal = orders.reduce((total, order) => {
  //     const discountAmount = order.shipping[0]?.invoice?.discounts || 0;
  //     return total + discountAmount;
  //   }, 0);
  //   const totalOrdersWithDiscount = orders.filter((order) => {
  //     const discountAmount = order.shipping[0]?.invoice?.discounts || 0;
  //     return discountAmount > 0;
  //   }).length;

  //   console.log("Total discount amount:", discountTotal.toFixed(2));
  //   console.log("Total orders with discount:", totalOrdersWithDiscount);
  //   return {
  //     totalAmount: discountTotal.toFixed(2),
  //     totalAccounts: totalOrdersWithDiscount,
  //   };
  // } catch (error) {
  //   console.log("Error querying MongoDB:", error);
  // }
}
