const request = require("supertest");
const app = require("./app");
const server = app.listen(1265)

describe("Test the root path", () => {
  test("It should response the GET method", (done) => {
    request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
    });
    test("It should response the GET method", (done) => {
      request(app)
        .get("/index")
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });
    test("It should response the GET method", (done) => {
      request(app)
        .get("/directchat")
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });
    test("It should response the GET method", (done) => {
      request(app)
        .get("/groupchat")
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });
});

server.close();