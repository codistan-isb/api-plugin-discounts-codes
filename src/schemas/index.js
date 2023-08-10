import importAsString from "@reactioncommerce/api-utils/importAsString.js";

const schema = importAsString("./schema.graphql");
const allowedDomains = importAsString("./allowedDomains.graphql");

export default [schema, allowedDomains];
