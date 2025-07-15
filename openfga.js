import { OpenFgaClient } from "@openfga/sdk";

export const fgaClient = new OpenFgaClient({
  apiUrl: "http://localhost:8080", // required
  storeId: "01K066MMXVMWQ00PCCKQ0FAY7N", // not needed when calling `CreateStore` or `ListStores`
  authorizationModelId: "01K066WR0J65Z6AG1188KQNKYV", // Optional, can be overridden per request
});
