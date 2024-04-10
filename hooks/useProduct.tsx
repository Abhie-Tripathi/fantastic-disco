// "use client";
// import {Comment} from '../types/comment';
// import {ProductSuggestion} from '../types/product';
// import {ProductResponse} from '../types/product';
// import { baseUrl } from "../api";
// import { productEndpoints } from "../context";
// import { myFetch } from "@/utils/myFetch";
// type productContextType = {
//     getProducts: (searchLimit?: number) => Promise<ProductResponse[]>;
//     getProductById: (id: string) => Promise<ProductResponse | null>;
//     upvote: (productId: string) => Promise<any>;
//     getProductsBySearchQuery: (
//         query: string,
//         searchLimit?: number
//     ) => Promise<ProductResponse[]>;
//     getAllUnpublishedProductIds: () => Promise<{ id: string }[]>;
//     commentOnProduct: (productId: string, text: string) => Promise<any>;
//     replyToComment: (
//         productId: string,
//         commentId: string,
//         text: string
//     ) => Promise<any>;
//     getCommentsByProducId: (productId: string) => Promise<Comment[] | null>;
//     createReview: (
//         productId: string,
//         rating: number,
//         text: string
//     ) => Promise<any>;
//     getReviewsByProductId: (productId: string) => Promise<any>;
//     getProductSuggestions: (productId: string) => Promise<ProductSuggestion[]>;
// };
// const productContextDefaultValues: productContextType = {
//     getProducts: () => Promise.resolve([]),
//     getProductById: () => Promise.resolve(null),
//     upvote: () => Promise.resolve(null),
//     getProductsBySearchQuery: () => Promise.resolve([]),
//     getAllUnpublishedProductIds: () => Promise.resolve([]),
//     commentOnProduct: () => Promise.resolve(null),
//     replyToComment: () => Promise.resolve(null),
//     getCommentsByProducId: () => Promise.resolve(null),
//     createReview: () => Promise.resolve(null),
//     getReviewsByProductId: () => Promise.resolve(null),
//     getProductSuggestions: () => Promise.resolve([]),
// };
// export const useProduct = () => {
//     // const { myFetch } = myFetch();
//     async function getProducts(searchLimit?: number): Promise<ProductResponse[]> {
//         try {
//             const { data, error } = await myFetch(
//                 baseUrl +
//                 productEndpoints.getProducts +
//                 `${searchLimit ? `?limit=${searchLimit}` : ""}`
//             );
//             if (error) {
//                 console.log(error);
//             }
//             return data;
//         } catch (e) {
//             console.log(e);
//             return [];
//         }
//     }
//     async function getCommentsByProducId(
//         productId: string
//     ): Promise<Comment[] | null> {
//         try {
//             const { data, error } = await myFetch(
//                 baseUrl + productEndpoints.getCommentsByProducId + productId
//             );
//             if (error) {
//                 console.log(error);
//             }
//             return data;
//         } catch (e) {
//             console.log(e);
//             return null;
//         }
//     }
//     async function commentOnProduct(
//         productId: string,
//         text: string
//     ): Promise<any> {
//         try {
//             const { data, error } = await myFetch(
//                 baseUrl + productEndpoints.comment,
//                 {
//                     method: "POST",
//                     body: JSON.stringify({ productId, text }),
//                 },
//                 true
//             );
//             if (error) {
//                 console.log(error);
//             }
//             return data;
//         } catch (e) {
//             console.log(e);
//             return null;
//         }
//     }
//     async function replyToComment(
//         productId: string,
//         commentId: string,
//         text: string
//     ): Promise<any> {
//         try {
//             const { data, error } = await myFetch(
//                 baseUrl + productEndpoints.reply,
//                 {
//                     method: "POST",
//                     body: JSON.stringify({ productId, commentId, text }),
//                 },
//                 true
//             );
//             if (error) {
//                 console.log(error);
//             }
//             return data;
//         } catch (e) {
//             console.log(e);
//             return null;
//         }
//     }
//     async function getProductById(id: string): Promise<ProductResponse | null> {
//         try {
//             const { data, error } = await myFetch(
//                 baseUrl + productEndpoints.getProductById + id
//             );
//             if (error) {
//                 console.log(error);
//             }
//             return data;
//         } catch (e) {
//             console.log(e);
//             return null;
//         }
//     }
//     async function upvote(productId: string) {
//         try {
//             const { data, error } = await myFetch(
//                 baseUrl + productEndpoints.upvote,
//                 {
//                     method: "POST",
//                     body: JSON.stringify({ productId }),
//                 },
//                 true
//             );
//             if (error) {
//                 console.log(error);
//             }
//             return data;
//         } catch (e) {
//             console.log(e);
//             return null;
//         }
//     }
//     async function getProductsBySearchQuery(
//         query: string,
//         searchLimit?: number
//     ): Promise<ProductResponse[]> {
//         try {
//             const { data, error } = await myFetch(
//                 baseUrl +
//                 `/product/search?query=${query}` +
//                 `${searchLimit ? `&limit=${searchLimit}` : ""}`
//             );
//             if (error) {
//                 console.log(error);
//             }
//             return data;
//         } catch (e) {
//             console.log(e);
//             return [];
//         }
//     }
//     async function getAllUnpublishedProductIds(): Promise<{ id: string }[]> {
//         try {
//             const { data, error } = await myFetch(
//                 baseUrl + productEndpoints.getAllUnpublishedProductIds
//             );
//             if (error) {
//                 console.log(error);
//             }
//             return data;
//         } catch (e) {
//             console.log(e);
//             return [];
//         }
//     }
//     async function createReview(
//         productId: string,
//         rating: number,
//         text: string
//     ): Promise<any> {
//         try {
//             const { data, error } = await myFetch(
//                 baseUrl + productEndpoints.review,
//                 {
//                     method: "POST",
//                     body: JSON.stringify({ productId, rating, text }),
//                 },
//                 true
//             );
//             if (error) {
//                 console.log(error);
//             }
//             return data;
//         } catch (e) {
//             console.log(e);
//             return null;
//         }
//     }
//     async function getReviewsByProductId(productId: string): Promise<any> {
//         try {
//             const { data, error } = await myFetch(
//                 baseUrl + productEndpoints.getReviewsByProductId + productId
//             );
//             if (error) {
//                 console.log(error);
//             }
//             return data;
//         } catch (e) {
//             console.log(e);
//             return null;
//         }
//     }
//     async function getProductSuggestions(
//         productId: string
//     ): Promise<ProductSuggestion[]> {
//         try {
//             const { data, error } = await myFetch(
//                 baseUrl + productEndpoints.productSuggestions + productId
//             );
//             if (error) {
//                 console.log(error);
//             }
//             return data;
//         } catch (e) {
//             console.log(e);
//             return [];
//         }
//     }
//     async function IUseProduct(productId: string, useAs: string) {
//         try {
//             const { data, error } = await myFetch(
//                 baseUrl + productEndpoints.createUsedBy, {
//                 method: "POST",
//                 body: JSON.stringify({ productId, useAs }),
//             }
//             );
//             if (error) {
//                 console.log(error);
//             }
//         } catch (e) {
//             console.log(e);
//         }
//     }
//     return {
//         getCommentsByProducId: getCommentsByProducId,
//         getProducts: getProducts,
//         getProductById: getProductById,
//         upvote: upvote,
//         getProductsBySearchQuery: getProductsBySearchQuery,
//         getAllUnpublishedProductIds: getAllUnpublishedProductIds,
//         commentOnProduct: commentOnProduct,
//         replyToComment: replyToComment,
//         createReview: createReview,
//         getReviewsByProductId: getReviewsByProductId,
//         getProductSuggestions: getProductSuggestions,
//         IUseProduct: IUseProduct,
//     }
// };