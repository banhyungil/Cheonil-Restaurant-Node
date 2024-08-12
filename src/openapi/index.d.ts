export type IOpenApiReqBody<T> = T extends { requestBody: { content: { 'application/json': infer R } } } ? R : never
export type IOpenApiResBody<T> = T extends { responses: { 200: { content: { ['application/json']: infer R } } } } ? R : never
