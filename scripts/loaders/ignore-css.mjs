// Lets Node scripts import modules that import .css files (e.g. @puckeditor/core).
import { register } from "node:module";

register("data:text/javascript," + encodeURIComponent(`
export async function load(url, context, next) {
  if (url.endsWith(".css")) return { format: "module", source: "", shortCircuit: true };
  return next(url, context);
}`));
