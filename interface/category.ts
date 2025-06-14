export interface Category {
    id: string,
    name: string,
}

export interface CategoryResponse {
  id: string;
  name: string;
  parentId: string | null;
  children: CategoryResponse[];
}