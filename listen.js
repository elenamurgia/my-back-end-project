const app = require("./app.js");
const { PORT = 10000 } = process.env;

console.log(`PORT environment variable: ${PORT}`);

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

// const app = require("./app.js");
// const port = process.env.PORT || 9090;

// app.listen(port, () => console.log(`Listening on ${port}...`));
