const secretMiddleware = method => {
  return async function $secretMiddleware(req, res) {
    if (req.headers["x-secret"] !== "mysecret") {
      console.log("bad secret");
      await wait(Math.random() * 3000 + 2000);
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({ message: "ok" }));
    } else {
      await method(req, res);
    }
  };
};

export const errorMiddleware = method =>
  async function $errorMiddleware(req, res) {
    try {
      await method(req, res);
    } catch (e) {
      console.error(e);
      res.writeHead(e.status || 500, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({ message: e.message }));
    }
  };

const streamToBuffer = stream =>
  new Promise((resolve, reject) => {
    const bufs = [];
    const onData = d => {
      bufs.push(d);
    };
    const onEnd = () => {
      cleanup();
      resolve(Buffer.concat(bufs));
    };
    const onError = e => {
      cleanup();
      reject(e);
    };
    function cleanup() {
      stream.removeListener("data", onData);
      stream.removeListener("error", onError);
      stream.removeListener("end", onEnd);
    }
    stream.on("data", onData);
    stream.on("end", onEnd);
    stream.on("error", onError);
  });

const getBody = stream =>
  streamToBuffer(stream).then(buf => JSON.parse(buf.toString()));
const wait = t => new Promise(r => setTimeout(r, t));

export { getBody, wait, streamToBuffer, secretMiddleware };
