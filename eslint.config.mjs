import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "**/scripts/**/*.js",
      "**/*.config.js", 
      "node_modules", 
      ".next", 
      "out", 
      "public",
      "dist",
      "scripts/*.js",
      "changelog-config/*.js"
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
    },
  }
];

export default eslintConfig;
