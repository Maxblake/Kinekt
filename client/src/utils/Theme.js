const themes = [
  {
    name: "Open Air",
    "--primary": "hsl(203.9, 85.8%, 52%)",
    "--primary-darker": "hsl(203.9, 85.8%, 48%)",
    "--gradient-top": "#ace0f9",
    "--gradient-bottom": "#fff1eb"
  },
  {
    name: "Clean Slate",
    "--primary": "hsl(38.4, 85.8%, 52%)",
    "--primary-darker": "hsl(38.4, 85.8%, 48%)",
    "--gradient-top": "#dfe9f3",
    "--gradient-bottom": "#fafafa"
  },
  {
    name: "Mint",
    "--primary": "hsl(143.9, 85.7%, 41%)",
    "--primary-darker": "hsl(143.9, 85.7%, 37%)",
    "--gradient-top": "#9cfbc4",
    "--gradient-bottom": "#0ba360"
  },
  {
    name: "Flamingo",
    "--primary": "hsl(322.1, 100%, 74%)",
    "--primary-darker": "hsl(322.1, 100%, 70%)",
    "--gradient-top": "#e2d1c3",
    "--gradient-bottom": "#fa709a"
  },
  {
    name: "Deep Sea",
    "--primary": "hsl(211.7,16.2%,44%)",
    "--primary-darker": "hsl(211.7,16.2%,40%)",
    "--gradient-top": "#537895",
    "--gradient-bottom": "#09203f"
  }
];

export const updateTheme = themeName => {
  const newTheme = themes.find(theme => theme.name === themeName);
  if (!newTheme) return;

  const html = document.getElementsByTagName("html")[0];

  Object.keys(newTheme).forEach(key => {
    if (key === "name") return;
    html.style.setProperty(key, newTheme[key]);
  });
};
