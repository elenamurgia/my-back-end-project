// const app = require("./app.js");
// const { PORT = 9090 } = process.env;

// app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

const app = require("./app.js");
const port = 9090 = process.env.PORT || 9090;

app.listen(port, () => console.log(`Listening on ${port}...`));
