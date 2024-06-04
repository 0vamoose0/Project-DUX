module.exports = {
  root: true,
  env: { es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "frontend", "server/generated"],
  parser: "@typescript-eslint/parser",
  rules: {
    "prettier/prettier": "error",
  },
};
