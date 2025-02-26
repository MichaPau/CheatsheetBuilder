import { Tag } from "../types";
import { snippets, tags } from "./mock-invokers/mockData";

export async function test_static_await(): Promise<string> {
  return new Promise((resolve, _reject) => {

      resolve("test wait resolve!");

    });

}

export async function searchTags(pattern: string): Promise<Array<Tag>> {

  let search_tags_result: Array<Tag> = tags.filter((tag) => tag.title.toLowerCase().includes(pattern.toLowerCase()));
  console.log("mock search:", search_tags_result);
  return search_tags_result;
}
