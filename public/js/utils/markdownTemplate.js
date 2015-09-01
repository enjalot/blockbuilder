var markdownTemplate = `
<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <style>
body {
  font-family: "Helvetica Neue", Helvetica, sans-serif;
  margin: 1em auto 4em auto;
  position: relative;
  tab-size: 2;
  width: 960px;
}

h1 {
  font-size: 64px;
  font-weight: 300;
  letter-spacing: -2px;
  margin: .3em 0 .1em 0;
}

h2 {
  margin-top: 2em;
}

h1, h2 {
  text-rendering: optimizeLegibility;
}

h2 a {
  color: #ccc;
  left: -20px;
  position: absolute;
  width: 740px;
}
p {
  line-height: 1.5em;
  width: 720px;
}
blockquote {
  width: 640px;
}
li {
  width: 680px;
}
a {
  color: steelblue;
}
a:not(:hover) {
  text-decoration: none;
}

pre, code, textarea {
  font-family: "Menlo", monospace;
  line-height: normal;
}

textarea {
  font-size: 100%;
}

pre {
  border-left: solid 2px #ccc;
  padding-left: 18px;
  margin: 2em 0 2em -20px;
  width: 960px;
  overflow-x: auto;
}
  </style>
</head>
`

export default markdownTemplate;