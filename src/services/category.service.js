import api from "@/api/axios.base";

export async function getAllCategoriesRequest() {
  return api.get("/categories");
}

export async function getManagedCategoriesRequest() {
  return api.get("/categories/manage");
}
