export const generateTemplate = ({ clientJs }): string =>
  `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Home automation</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="${clientJs}"></script>
  </body>
</html>
`;
