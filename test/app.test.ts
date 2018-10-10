import request from "supertest";
import { App, default as app } from "../src/app";
import { Routes } from "../src/routes/Routes";

describe("GET /random-url", () => {
  it("should return 404", (done) => {
    request(app).get("/reset")
      .expect(404, done);
  });

  it("should be successful for returning all cards", (done) => {
    const application = new App(new Routes());
    request(application.app).get("/card").expect(200, done);
  });

  [
    "1234123412341234",
    undefined,
    "",
    "alphanumeric"
  ].forEach( wrongAccountNumber => {
      it(`should not store with invalid credit number: ${wrongAccountNumber}`, (done) => {
          const requestBody = {
            name: new Date().toDateString(),
            accountNumber: wrongAccountNumber,
          };
          const application = new App(new Routes());
          request(application.app).post("/card").send(requestBody).expect(400, done);
      });
  });

  it("should store cards successfully", (done) => {

    /* Given an instantiated application with an empty store */

    const requestBody = {
      name: "kostas",
      accountNumber: "4111111111111111"
    };

    request(app).get("/card")
    .expect(200)
    .then((res) => {
      expect(res.body.length).toBe(0);
      /* When I post a valid card */
      request(app).post("/card").send(requestBody).expect(201).then((res) => {
         /* Then the account should be opened successfully */
         expect(res.body.message).toBe("Account opening was successful!");
         request(app).get("/card").expect(200)
         .then((res) => {
           /* And the account should be returned when requesting all card data */
           const accounts = res.body;
           expect(accounts.length).toBe(1);
           expect(accounts[0].name).toBe(requestBody.name);
           expect(accounts[0].creditCardNumber).toBe(requestBody.accountNumber);
           expect(accounts[0].limit).toBe(10000);
           expect(accounts[0].balance).toBe("£0.00");
           done();
         });
      });
    });

  });

  it("should not allow the creation of a credit card account if it already exists", (done) => {
    const requestBody = {
      name: "not_so_unique",
      accountNumber: "4111111111111111",
    };
    const application = new App(new Routes());
    request(application.app).post("/card").send(requestBody).expect(201).then(result => {
          request(application.app).post("/card").send(requestBody).expect(409, done);
    });
  });

  it("should credit and charge an account", (done) => {
    const create = {
      name: "Kostas",
      accountNumber: "4111111111111111",
    };

    const credit = {
       "type": "CREDIT",
       "accountName": "Kostas",
       "amount": "£1,000.00",
     };

     const charge = {
       "type": "CHARGE",
       "accountName": "Kostas",
       "amount": "£1,000.00"
     };

     const application = new App(new Routes());
      request(application.app)
            .post("/card")
            .send(create)
            .expect(201)
            .then(result => {
              request(application.app)
                .put("/card")
                .send(charge)
                .expect(200)
                .then(result => {
                   expect(result.body.balance).toBe("£1000.00");
                   request(application.app)
                     .put("/card")
                     .send(credit)
                     .expect(200)
                     .then(result => {
                       expect(result.body.balance).toBe("£0.00");
                       done();
                     });
                });
            });

  });

  it("should fail to credit or charge for wrongly formated amount", (done) => {
    const create = {
      name: "Another",
      accountNumber: "4111111111111111",
    };

    const charge = {
       "type": "CHARGE",
       "accountName": "Another",
       "amount": "1000.00",
     };

     const application = new App(new Routes());

     request(application.app)
            .post("/card")
            .send(create)
            .expect(201)
            .then(_ => {
              request(application.app)
                .put("/card")
                .send(charge)
                .expect(500, done);
            });

  });


  it("should fail for unknown operation name", (done) => {
    const create = {
      name: "Existing",
      accountNumber: "4111111111111111",
    };

    const multiply = {
       "type": "MULTIPLY",
       "accountName": "Existing",
       "amount": "£1,000.00",
     };

     const application = new App(new Routes());

     request(application.app)
            .post("/card")
            .send(create)
            .expect(201)
            .then(_ => {
              request(application.app)
                .put("/card")
                .send(multiply)
                .expect(500, done);
            });

  });

  it("should fail to credit or charge an unknown account name", (done) => {
    const charge = {
      "type": "CHARGE",
      "accountName": "Unknown",
      "amount": "£1,000.00",
    };

    const application = new App(new Routes());

    request(application.app)
    .put("/card")
    .send(charge)
    .expect(404, done);
  });


});
