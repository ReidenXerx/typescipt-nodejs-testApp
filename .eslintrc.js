module.exports = {
    extends: ['airbnb-typescript'],
    parserOptions: {
        project: './tsconfig.json',
    },
    globals: {
        "JQuery": true,
        "$": true,
        "_": true
    },
    rules: {
        "@typescript-eslint/indent": ["error", 4],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "max-len": ["error", 140],
        "linebreak-style": "off",
        "jsx-a11y/control-has-associated-label": "off",
        "jsx-a11y/label-has-associated-control": [
            "error",
            {
              "labelComponents": [],
              "labelAttributes": [],
              "controlComponents": [],
              "assert": "htmlFor",
              "depth": 25
            }
          ],
        "no-underscore-dangle": ["error", { "allowAfterThis": true }],
    }
};