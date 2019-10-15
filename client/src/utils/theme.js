const themes = [
  {
    name: "Open Air",
    "--primary": "hsl(203.9, 85.8%, 52%)",
    "--primary-darker": "hsl(203.9, 85.8%, 48%)",
    "--gradient-top": "#d4effa",
    "--gradient-bottom": "#ecfaff"
  },
  {
    name: "Clean Slate",
    "--primary": "hsl(38.4, 85.8%, 48%)",
    "--primary-darker": "hsl(38.4, 85.8%, 44%)",
    "--gradient-top": "#dfe9f3",
    "--gradient-bottom": "#fafafa"
  },
  {
    name: "Mint",
    "--primary": "hsl(143.9, 85.7%, 41%)",
    "--primary-darker": "hsl(143.9, 85.7%, 37%)",
    "--gradient-top": "#80ffa1",
    "--gradient-bottom": "#80ff97"
  },
  {
    name: "Flamingo",
    "--primary": "hsl(322.1, 100%, 74%)",
    "--primary-darker": "hsl(322.1, 100%, 70%)",
    "--gradient-top": "#e14fad",
    "--gradient-bottom": "#f9d423"
  },
  {
    name: "Cafe Nouveau",
    "--primary": "hsl(25, 30%, 55%)",
    "--primary-darker": "hsl(25, 30%, 51%)",
    "--gradient-top": "#bcc5ce",
    "--gradient-bottom": "#7a8f99"
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
    "--primary": "hsl(360 52% 44%)",
    "--primary-darker": "hsl(360, 52%, 40%)",
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
