import api from "@/api/axios.base";

export const getAllBrandsRequest = () => api.get("/brands");
export const getManagedBrandsRequest = () => api.get("/brands/manage");
export const getBrandRequest = (slug) => api.get(`/brands/${encodeURIComponent(slug)}`);
export const getBrandProductsRequest = (slug) => api.get("/products", {
  params: { brandSlug: slug, limit: 100 },
});
