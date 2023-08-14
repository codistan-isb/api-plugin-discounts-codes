import ReactionError from "@reactioncommerce/reaction-error";
/**
 * @name discounts/codes/discount
 * @method
 * @memberof Discounts/Codes/Methods
 * @summary calculates percentage off discount rates
 * @param {String} cartId cartId
 * @param {String} discountId discountId
 * @param {Object} collections Map of MongoDB collections
 * @returns {Number} returns discount total
 */
export default async function getPercentageOffDiscount(
  cartId,
  discountId,
  collections
) {
  const { Cart, Discounts, Accounts, AllowedDomains } = collections;
  let discountDomains = [
    "codistan.org",
    "rancherscafe.com",
    "bizb.store",
    "movingstonedigital.com",
    "paklogics.com",
    "renome.pk",
  ];
  const discountMethod = await Discounts.findOne({ _id: discountId });
  if (!discountMethod)
    throw new ReactionError("not-found", "Discount not found");

  // For "discount" type discount, the `discount` string is expected to parse as a float, a percent
  const discountAmount = Number(discountMethod.discount);
  if (isNaN(discountAmount))
    throw new ReactionError(
      "invalid",
      `"${discountMethod.discount}" is not a number`
    );

  const cart = await Cart.findOne({ _id: cartId });
  if (!cart) throw new ReactionError("not-found", "Cart not found");
  // console.log("Full cart ", cart);
  let certOwnerDetail = await Accounts.findOne({
    _id: cart.accountId,
  });

  // console.log("certOwnerDetail ", certOwnerDetail?.emails[0]?.address);
  let AllowedDomainsResp = await AllowedDomains.findOne({});
  // console.log("AllowedDomainsResp ", AllowedDomainsResp);
  let customerEmail;
  if (certOwnerDetail) {
    customerEmail = certOwnerDetail?.emails[0]?.address;
  }
  let customerDomain = customerEmail.split("@")[1];
  // console.log("customerDomain ", customerDomain);

  let discount = 0;
  // console.log("discountAmount ", discountAmount);
  // console.log("item.subtotal.amount ", item.subtotal.amount);

  for (const item of cart.items) {
    // console.log("item ", item);
    console.log("item discount ", item.isDeal);
    if (discountDomains.includes(customerDomain)) {
      // if (item.isDeal === true) {
      //   console.log("true");
      //   discount += (item.subtotal.amount * 20) / 100;
      // } else
      if (item.isDeal === false) {
        console.log("Not true");
        discount += (item.subtotal.amount * 30) / 100;
      }
    }
  }
  // console.log("Discount ", discount);
  return discount;
}
