import { format } from "url";

const baseUrl =
  process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_BASEURL : "";

export const fetcher = async (...args) => {
  const url = args[0].includes("https://", "http://")
    ? args[0]
    : `${baseUrl || ""}${format(args[0])}`;

  const res = await fetch(url);
  const result = await res.json();
  if (res.status !== 200) {
    throw new Error(result.error);
  }
  return result;
};
