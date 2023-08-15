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
  let cartOwnerDetail = await Accounts.findOne({
    _id: cart.accountId,
  });
  let AllowedDomainsResp = await AllowedDomains.findOne({});
  console.log("AllowedDomainsResp ", AllowedDomainsResp);
  let customerEmail;
  if (cartOwnerDetail) {
    customerEmail = cartOwnerDetail?.emails[0]?.address;
  }
  let customerDomain = customerEmail.split("@")[1];
  let discount = 0;
  let dealDiscount;
  let itemDiscount;
  let discountDomains;
  if (AllowedDomainsResp) {
    dealDiscount = Number(AllowedDomainsResp?.DealDiscount);
    itemDiscount = Number(AllowedDomainsResp?.ItemDiscount);
    discountDomains = AllowedDomainsResp?.domains;
  }
  for (const item of cart.items) {
    if (discountDomains?.includes(customerDomain)) {
      if (item.isDeal === true) {
        console.log("true");
        discount += (item.subtotal.amount * dealDiscount) / 100;
      } else if (item.isDeal === false) {
        console.log("Not true");
        discount += (item.subtotal.amount * itemDiscount) / 100;
      }
    }
  }
  return discount;
}
