export default async function getAllDiscountCount(_, args, context, info) {
  const query = await context.queries.getAllDiscountCount(context);
  return query;
}
