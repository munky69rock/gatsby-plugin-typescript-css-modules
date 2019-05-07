import { WatchIgnorePlugin } from "webpack";

describe("gatsby-plugin-typescript-css-modules", () => {
  const { onCreateWebpackConfig } = require("../gatsby-node");
  const defaults = require("../defaults").default;

  const targetStages = ["develop", "develop-html", "build-javascript"];
  const loader = "typings-for-css-modules-loader";

  const getConfig = () => ({
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.module\.css$/,
              use: [
                {
                  loader: "/css-loader/",
                  options: {},
                },
              ],
            },
          ],
        },
      ],
    },
  });

  describe("without option", () => {
    targetStages.forEach(stage => {
      describe(`stage: ${stage}`, () => {
        const actions = {
          replaceWebpackConfig(newConfig) {
            expect(newConfig.module.rules[0].oneOf[0].use[0]).toEqual({
              loader,
              options: {
                ...defaults,
              },
            });
          },
          setWebpackConfig(newConfig) {
            const [plugin] = newConfig.plugins;
            const [ignorePath] = plugin.paths;

            expect(plugin).toBeInstanceOf(WatchIgnorePlugin);
            expect(ignorePath).toEqual(/css\.d\.ts$/);
          },
        };

        test("config should be replaced", () => {
          onCreateWebpackConfig({ stage, getConfig, actions }, {});
        });
      });
    });
  });

  describe("with option", () => {
    const options = {
      silent: true,
    };
    targetStages.forEach(stage => {
      describe(`stage: ${stage}`, () => {
        const actions = {
          replaceWebpackConfig(newConfig) {
            expect(newConfig.module.rules[0].oneOf[0].use[0]).toEqual({
              loader,
              options: {
                ...defaults,
                ...options,
              },
            });
          },
          setWebpackConfig(newConfig) {
            const [plugin] = newConfig.plugins;
            const [ignorePath] = plugin.paths;

            expect(plugin).toBeInstanceOf(WatchIgnorePlugin);
            expect(ignorePath).toEqual(/css\.d\.ts$/);
          },
        };

        test("config should be replaced", () => {
          onCreateWebpackConfig({ stage, getConfig, actions }, options);
        });
      });
    });
  });

  describe("do not modified", () => {
    const stage = "build-html";
    const actions = {
      replaceWebpackConfig(newConfig) {
        throw new Error("Do not called");
      },
      setWebpackConfig(newConfig) {
        throw new Error("Do not called");
      },
    };

    test("config should not be replaced", () => {
      onCreateWebpackConfig({ stage, getConfig, actions }, {});
    });
  });
});
