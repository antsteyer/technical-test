import axios from "axios";

export const API = axios.create({
  baseURL: `https://app-booking-christ.herokuapp.com/api/`
});
