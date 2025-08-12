import app from "../app.js";
import supertest from "supertest";

const request = supertest(app);

describe("POST /weather", () => {
  // it("Quick test", () => {
  //   expect(1).toBe(1);
  // });

    it('should return 400 if cityName is missing', async () => {
    const response = await request.post('/weather').send({});
    expect(response.status).toBe(400);
    expect(response.text).toBe('City name is required');
  });

  it('should return "City is not found!" if cityName is invalid', async () => {
    const response = await request.post('/weather').send({ cityName: 'asldkfjalksdjf' });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ weatherText: "City is not found!" });
  });

  it('should return city name and temperature if cityName is valid', async () => {
    const cityName = 'London';
    const response = await request.post('/weather').send({ cityName });
    expect(response.status).toBe(200);
    expect(response.body.weatherText).toContain(cityName);
    expect(response.body.weatherText).toMatch(/temperature/i); 
  });

});

