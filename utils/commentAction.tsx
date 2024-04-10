"use server";
import { revalidatePath } from "next/cache";
export const revalidateComment = async (id: string, searchParams?: string) => {
  revalidatePath(`/product/${id}${searchParams ? `?tab=${searchParams}` : ""}`);
};