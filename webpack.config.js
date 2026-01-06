const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "mf",
    projectName: "form-builder",
    webpackConfigEnv,
    argv
  });

  return merge(defaultConfig, {
    devServer: {
      port: 8082,
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    },
    output: {
      publicPath: "http://localhost:8082/"
    },
    externals: {
      react: "react",
      "react-dom": "react-dom"
    }
  });
};
