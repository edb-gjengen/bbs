module.exports = {
  env: {
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  extends: [
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "no-console": "off",
    "prefer-destructuring": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: ["**/*.test.js", "**/*.spec.js", "**/__tests__/**"],
      },
    ],
    "import/prefer-default-export": "off",
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
        "newlines-between": "always",
        alphabetize: { order: "asc" },
      },
    ],
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "error",
    "react/button-has-type": "error",
    "react/jsx-filename-extension": ["warn", { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
    "react/jsx-uses-react": "off",
    "react/prefer-stateless-function": "warn",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/sort-comp": "off",
  },
  plugins: ["prettier", "react", "react-hooks"],
  settings: {
    react: {
      version: "detect",
    },
  },
};
