import { HtmlBasePlugin } from "@11ty/eleventy";

const fonts = "node_modules/@fontsource-variable";

export default function (cfg) {
  // Makes every link work both on the temporary GitHub address and on the real domain.
  cfg.addPlugin(HtmlBasePlugin);

  cfg.addPassthroughCopy({ "src/assets": "assets" });
  cfg.addPassthroughCopy({
    [`${fonts}/oswald/files/oswald-latin-wght-normal.woff2`]: "assets/fonts/oswald.woff2",
    [`${fonts}/noto-serif/files/noto-serif-latin-wght-normal.woff2`]: "assets/fonts/noto-serif.woff2",
  });

  cfg.addFilter("pad2", (n) => String(n).padStart(2, "0"));

  cfg.addGlobalData("build", {
    year: new Date().getFullYear(),
    // Preview builds (temporary address) are hidden from search engines.
    preview: process.env.SITE_PREVIEW === "1",
  });

  return {
    dir: { input: "src", output: "_site" },
    pathPrefix: process.env.PATH_PREFIX || "/",
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
