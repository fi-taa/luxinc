"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePublicSite() {
  revalidatePath("/");
  revalidatePath("/journal", "layout");
  revalidatePath("/architects", "layout");
}
