import getPaginatedResponse from "@reactioncommerce/api-utils/graphql/getPaginatedResponse.js";
import wasFieldRequested from "@reactioncommerce/api-utils/graphql/wasFieldRequested.js";
import { decodeShopOpaqueId } from "../../xforms/id.js";
import ReactionError from "@reactioncommerce/reaction-error";

export default async function getAllAllowedDomains(_, args, context, info) {
  const { shopId: opaqueShopId, ...connectionArgs } = args;
  if (context.user === undefined || context.user === null) {
    throw new ReactionError("access-denied", "Please login first");
  }
  const shopId = decodeShopOpaqueId(opaqueShopId);

  const query = await context.queries.getAllAllowedDomains(context, shopId);

  return getPaginatedResponse(query, connectionArgs, {
    includeHasNextPage: wasFieldRequested("pageInfo.hasNextPage", info),
    includeHasPreviousPage: wasFieldRequested("pageInfo.hasPreviousPage", info),
    includeTotalCount: wasFieldRequested("totalCount", info),
  });
}
