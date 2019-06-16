module.exports = function setup(api) {
  const isTest = api.env('test');

  let presets;
  if (isTest) {
    presets = [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
      '@babel/preset-typescript'
    ];
  } else {
    presets = ['@babel/preset-env', '@babel/preset-react'];
  }
  const plugins = [
    'babel-plugin-styled-components',
    '@babel/plugin-proposal-class-properties',
  ];

  return {
    presets,
    plugins,
  };
};
