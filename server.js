const http = require("http");
const app = require("./app");
const debug =  require("debug")("app:startup");

const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if(isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
};

const onError = error => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
};

const onListening = () => {
    const addr  = server.address();
    // console.log(server.address());
    // console.log(typeof addr);
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    // console.log(bind);
    debug("Listening on: " + bind);
    // console.log("Listening on: " + bind);
};

const port = normalizePort(process.env.PORT || 3000);
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);