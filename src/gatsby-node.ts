import { WatchIgnorePlugin } from "webpack";
import defaults from "./defaults";

const cssLoader = "typings-for-css-modules-loader";

exports.onCreateWebpackConfig = (
  { stage, actions, getConfig },
  pluginOptions,
) => {
  const config = getConfig();
  const options = {
    ...defaults,
    ...pluginOptions,
  };

  const useCssLoader = u => /\/css-loader\//.test(u.loader);
  const isCssLoaderRule = rule =>
    rule.oneOf && rule.oneOf.some(r => r.use.some(useCssLoader));

  if (!["develop", "develop-html", "build-javascript"].includes(stage)) {
    return;
  }

  config.module.rules = config.module.rules.map(rule => {
    if (!isCssLoaderRule(rule)) {
      return rule;
    }
    rule.oneOf = rule.oneOf.map(r => {
      r.use = r.use.map(u => {
        if (useCssLoader(u)) {
          u.loader = cssLoader;
          u.options = {
            ...u.options,
            ...options,
          };
        }
        return u;
      });
      return r;
    });
    return rule;
  });

  actions.replaceWebpackConfig(config);
  actions.setWebpackConfig({
    plugins: [new WatchIgnorePlugin([/css\.d\.ts$/])],
  });
};
