const classesObj = (c) => {
  return Object.entries(c)
    .filter(([undefined, val]) => Boolean(val))
    .map(([key]) => key)
    .join(" ");
};

const classes = (...c) => {
  if (typeof c[0] === "object") return classesObj(c[0]);
  return c.filter((val) => Boolean(val)).join(" ");
};

export default classes;
