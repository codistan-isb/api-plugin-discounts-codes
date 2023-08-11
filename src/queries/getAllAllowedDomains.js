export default async function getAllAllowedDomains(context, shopId) {
  const { collections } = context;
  const { AllowedDomains } = collections;
  return AllowedDomains.find({});
}
