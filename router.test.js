process.env.NODE_ENV = "test";

const request = require('supertest');
const app = require('./app');

const pickles = {'name': 'pickles', 'price': 5.00};

beforeEach(function(){
    items.push(pickles);
});

afterEach(function(){
    items.length = 0;
});

describe('GET /items', () => {
    test('get all items', async () => {
        const resp = await request(app).get('/items');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual([pickles]);
    });
});

describe('POST /items', () => {
    test('add a new item', async() => {
        const resp = await request(app).post('/items').send({'name': 'tuna', 'price': 1.50});
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({'added': {'name': 'tuna', 'price': 1.50}});
    });
    test('it should respond 400 if name is missing', async() => {
        const resp = await request(app).post('/items').send({'name': '', 'price': 1.50});
        expect(resp.statusCode).toBe(400);
        debugger;
        console.log(resp);
        expect(resp.body).toEqual('Name is required');
    });
    test('it should respond 400 if price is missing', async() =>{
        const resp = await request(app).post('/items').send({'name': 'tuna', 'price': ''});
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual('Price is required');
    });
});

describe('GET /items/:name', () => {
    test('get a single item', async() => {
        const resp = await request(app).get('/items/pickles');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(pickles);
    });
    test('should return 404 if item not found', async () => {
        const resp = await request(app).get('/items/icecream');
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual('Item not found');
    });
});

describe('PATCH /items/:name', () => {
    test('update a single item', async() => {
        const resp = await request(app).patch('/items/pickles').send({'name': 'pickles', 'price': 3.00});
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({'updated': {'name': 'pickles', 'price': 3.00}});
    });
    test('should return 404 if item not found', async () => {
        const resp = await request(app).patch('/items/icecream').send({'name': 'icecream', 'price': 1.50});
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual('Item not found');
    });
    test('should return 400 if name is missing', async () => {
        const resp = await request(app).patch('/items/pickles').send({'name': '', 'price': 3.00});
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual('Name is required');
    });
    test('should return 400 if price is missing', async () => {
        const resp = await request(app).patch('/items/pickles').send({'name': 'pickles', 'price': ''});
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual('Price is required');
    });
});

describe('DELETE /items/:name', () => {
    test('delete a single item', async () => {
        const resp = await request(app).delete('/items/pickles');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({"message": "Deleted"});
    });
    test('should return 404 if item not found', async () => {
        const resp = await request(app).delete('/items/icecream');
        expect(resp.statusCode).toBe(404);
        expect(resp.body).toEqual('Item not found');
    });
});
