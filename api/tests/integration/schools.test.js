process.env.MONGO_DATABASE = "schoolbagtest";
const db = require("../../db");
const request = require("supertest");
const app = require("../../app");

beforeAll(async () => {
    await db.createCollection('schools');
});

beforeEach(async () => {
    // seed with some data
    await db.collection('schools').insertMany([
        {
            "name": "ADAM ROAD PRIMARY SCHOOL",
            "address": {
                "street": "HOTCHIN STREET",
                "suburb": "SOUTH BUNBURY",
                "state": "WA",
                "postcode": "6230"
            },
            "schoolCount": 474
        },
        {
            "name": "ALBANY COMMUNITY KINDERGARTEN",
            "address": {
                "street": "136 SERPENTINE ROAD",
                "suburb": "ALBANY",
                "state": "WA",
                "postcode": "6330"
            },
            "schoolCount": 40
        }
    ]);
});

afterEach(async () => {
    await db.collection('schools').deleteMany({});
});

afterAll(async () => {
    await db.dropCollection('schools');
    await db.close();
});


describe("GET /api/schools", () => {
    test("It responds with an array of schools as the payload", async () => {
        const response = await request(app).get("/api/schools");
        expect(response.body).toHaveProperty("payload");
        expect(response.body).toHaveProperty("meta");
        expect(response.body.payload.length).toBe(2);
        expect(response.body.meta.totalCount).toBe(2);
        expect(response.body.payload[0]).toHaveProperty("_id");
        expect(response.body.payload[0]).toHaveProperty("name");
        expect(response.statusCode).toBe(200);
    });
    
    test("It responds with requested pages", async () => {
        const response = await request(app).get("/api/schools").query({limit: 1, page: 2});
        expect(response.body).toHaveProperty("payload");
        expect(response.body).toHaveProperty("meta");
        expect(response.body.payload.length).toBe(1);
        expect(response.body.meta.totalCount).toBe(2);
        expect(response.body.payload[0]).toHaveProperty("_id");
        expect(response.body.payload[0]).toHaveProperty("name");
        expect(response.statusCode).toBe(200);
    });
    
    test("It responds with sorted data when requested", async () => {
        const response = await request(app).get("/api/schools").query({sort: 'address.street'});
        expect(response.statusCode).toBe(200);
        expect(response.body.payload.map((school) => school.name)).toEqual(['ALBANY COMMUNITY KINDERGARTEN', 'ADAM ROAD PRIMARY SCHOOL']);
    });
});

describe("POST /api/schools", () => {
    test("It responds with the newly created school", async () => {
        const newschool = await request(app)
            .post("/api/schools")
            .send({
                name: "New school"
            });

        // make sure we add it correctly
        expect(newschool.body).toHaveProperty("_id");
        expect(newschool.body.name).toBe("New school");
        expect(newschool.statusCode).toBe(201);

        // make sure we have 3 schools now
        const response = await request(app).get("/api/schools");
        expect(response.body.meta.totalCount).toBe(3);
    });

    test("It responds with errors when request is not correct", async () => {
        let errorResponse = await request(app)
            .post("/api/schools")
            .send({});

        // make sure we have an error
        expect(errorResponse.statusCode).toBe(400);
        expect(errorResponse.body).toHaveProperty("errors");
        expect(errorResponse.body.errors.length).toBe(2);
        expect(errorResponse.body.errors.map((err) => err.msg)).toEqual(['Name should be a text value', 'Name is required']);

        errorResponse = await request(app)
            .post("/api/schools")
            .send({name: 'Royal College', address: 'Colombo', studentCount: -124});

        // make sure we have an error
        expect(errorResponse.statusCode).toBe(400);
        expect(errorResponse.body).toHaveProperty("errors");
        expect(errorResponse.body.errors.length).toBe(2);
        expect(errorResponse.body.errors.map((err) => err.msg)).toEqual(['Address must be an object', 'studentCount should be positive number']);

        errorResponse = await request(app)
            .post("/api/schools")
            .send({name: 'Royal College', address: {street: 1, suburb:2, state: 3, postcode: -123}, studentCount: 124});

        // make sure we have an error
        expect(errorResponse.statusCode).toBe(400);
        expect(errorResponse.body).toHaveProperty("errors");
        expect(errorResponse.body.errors.length).toBe(4);
        expect(errorResponse.body.errors.map((err) => err.msg)).toEqual([
            'address.street should be a text value', 
            'address.suburb should be a text value',
            'address.state should be a text value', 
            'address.postcode should be valid'
        ]);

        // make sure we have not added schools
        const response = await request(app).get("/api/schools");
        expect(response.body.meta.totalCount).toBe(2);
    });
});
