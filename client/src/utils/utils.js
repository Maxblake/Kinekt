export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

export const copyToClipboard = text => {
  var tempInputEl = document.createElement("input");
  document.body.appendChild(tempInputEl);
  tempInputEl.setAttribute("value", text);
  tempInputEl.select();
  document.execCommand("copy");
  document.body.removeChild(tempInputEl);
};
