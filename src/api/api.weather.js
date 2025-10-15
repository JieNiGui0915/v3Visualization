import http from "./index.js";

export const getWeatherInfo = (cityCode) => {
  return http.get("/go-api/weather/live", { cityCode }, null)
}

export const getWeatherForecastInfo = (cityCode) => {
  return http.get("/go-api/weather/forecast", { cityCode }, null)
}
