import { register, expandTypesMap } from "@tokens-studio/sd-transforms";
import {
  logBrokenReferenceLevels,
  logVerbosityLevels,
  logWarningLevels,
} from "style-dictionary/enums";
import StyleDictionary from "style-dictionary";

// will register them on StyleDictionary object
// that is installed as a dependency of this package.
register(StyleDictionary);

const sd = new StyleDictionary({
  // make sure to have source match your token files!
  // be careful about accidentally matching your package.json or similar files that are not tokens
  source: [
    "tokens/core.json",
    "tokens/coreColors.json",
    "tokens/dark/colors.json",
    "tokens/dark/componentColors.json",
  ],
  log: {
    warnings: logWarningLevels.warn, // 'warn' | 'error' | 'disabled'
    verbosity: logVerbosityLevels.verbose, // 'default' | 'silent' | 'verbose'
    errors: {
      brokenReferences: logBrokenReferenceLevels.console, // 'throw' | 'console'
    },
  },
  preprocessors: ["tokens-studio"],
  expand: {
    typesMap: expandTypesMap,
  }, // <-- since 0.16.0 this must be explicit
  platforms: {
    cssColor: {
      prefix: "color",
      transformGroup: "tokens-studio",
      transforms: ["name/kebab"],
      buildPath: "build/css/",
      files: [
        {
          destination: "color.css",
          format: "css/variables",
          filter: async (token, options) => {
            return token.filePath.match("tokens/dark/colors.json");
          },
        },
        {
          destination: "componentColor.css",
          format: "css/variables",
          filter: async (token, options) => {
            return token.filePath.match("tokens/dark/componentColors.json");
          },
        },
      ],
    },
    cssTypography: {
      transformGroup: "tokens-studio",
      transforms: ["name/kebab"],
      buildPath: "build/css/",
      files: [
        {
          destination: "typographyFontSize.css",
          format: "css/variables",
          filter: async (token, options) => {
            if (token.type === "fontSize") {
              return token;
            }
          },
        },
        {
          destination: "typographyLineHeight.css",
          format: "css/variables",
          filter: async (token, options) => {
            if (token.type === "lineHeight") {
              return token;
            }
          },
        },
        {
          destination: "typographyFontWeight.css",
          format: "css/variables",
          filter: async (token, options) => {
            if (token.type === "fontWeight") {
              return token;
            }
          },
        },
      ],
    },
  },
});

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
