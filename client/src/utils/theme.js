const themes = [
  {
    name: "Open Air",
    "--primary": "hsl(203.9, 85.8%, 52%)",
    "--primary-darker": "hsl(203.9, 85.8%, 48%)",
    "--gradient-top": "#e6f5ff",
    "--gradient-bottom": "#d4effa"
  },
  {
    name: "Clean Slate",
    "--primary": "hsl(0, 45%, 52%)",
    "--primary-darker": "hsl(0, 45%, 48%)",
    "--gradient-top": "#f0ebeb",
    "--gradient-bottom": "#f0ebeb"
  },
  {
    name: "Mint",
    "--primary": "hsl(153, 94%, 42%)",
    "--primary-darker": "hsl(153, 94%, 38%)",
    "--gradient-top": "#c7ffe6",
    "--gradient-bottom": "#c7ffe6"
  },
  {
    name: "Flamingo",
    "--primary": "hsl(322.1, 100%, 71%)",
    "--primary-darker": "hsl(322.1, 100%, 67%)",
    "--gradient-top": "#ff9ed8",
    "--gradient-bottom": "#ff9ed8"
  },
  {
    name: "Cafe Verde",
    "--primary": "hsl(109, 14%, 45%)",
    "--primary-darker": "hsl(109,14%, 41%)",
    "--gradient-top": "#b5b5b5",
    "--gradient-bottom": "#b5b5b5"
  },
  {
    name: "Deep Sea",
    "--primary": "hsl(211.7,16.2%,44%)",
    "--primary-darker": "hsl(211.7,16.2%,40%)",
    "--gradient-top": "#34495f",
    "--gradient-bottom": "#22303f"
  },
  {
    name: "Deep Earth",
    "--primary": "hsl(26,26%, 51%)",
    "--primary-darker": "hsl(26,26%, 49%)",
    "--gradient-top": "#334622",
    "--gradient-bottom": "#334622"
  }
];

export const updateTheme = (themeName = "Open Air") => {
  const newTheme = themes.find(theme => theme.name === themeName);
  if (!newTheme) return;

  const html = document.getElementsByTagName("html")[0];

  Object.keys(newTheme).forEach(key => {
    if (key === "name") return;
    html.style.setProperty(key, newTheme[key]);
  });
};
