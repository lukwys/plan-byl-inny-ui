import { STRAPI_URL } from "@/config/strapi";
import { requestData } from "@/lib/http/requestData";
import { CategoryModel } from "@/types/category";

export async function getCategories(): Promise<CategoryModel[]> {
  const qs = new URLSearchParams();

  qs.set("sort", "name:asc");
  qs.set("pagination[pageSize]", "100");

  qs.set("fields[0]", "documentId");
  qs.set("fields[1]", "name");
  qs.set("fields[2]", "slug");

  qs.set("populate[image][fields][0]", "url");
  qs.set("populate[image][fields][1]", "alternativeText");

  return requestData<CategoryModel[]>(
    `${STRAPI_URL}/api/categories?${qs.toString()}`,
  );
}
