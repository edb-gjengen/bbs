module.exports = {
  extends: ["stylelint-config-recommended", "stylelint-prettier/recommended", "stylelint-config-idiomatic-order"],
  plugins: ["stylelint-order"],
  rules: {
    // Useful?
    "no-descending-specificity": null,
  },
  ignoreFiles: ["**/*.md", "**/*.svg", "**/*.jpg", "**/*.graphql", "**/*.tsx", "**/*.ts"],
};
