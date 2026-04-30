import axios from "axios";

export default class ApiService {


    static BASE_URL = "http://localhost:8082/api";

    static saveToken(token) {
        localStorage.setItem("token", token);
    }

    static getToken() {
        return localStorage.getItem("token");
    }

    //save role
    static saveRole(roles) {
        localStorage.setItem("roles", JSON.stringify(roles));
    }

    // Get the roles from local storage
    static getRoles() {
        const roles = localStorage.getItem('roles');
        return roles ? JSON.parse(roles) : null;
    }

    // Check if the user has a specific role
    static hasRole(role) {
        const roles = this.getRoles();
        return roles ? roles.includes(role) : false;
    }

    // Check if the user is an admin
    static isAdmin() {
        return this.hasRole('ADMIN');
    }

    static isCustomer() {
        return this.hasRole('CUSTOMER');
    }

    static isPilot() {
        return this.hasRole('PILOT');
    }

    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
    }

    static isAthenticated() {
        const token = this.getToken();
        return !!token;
    }

    static getHeader() {
        const token = this.getToken();
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }









    // REGISTER USER
    static async registerUser(body) {
        const resp = await axios.post(`${this.BASE_URL}/auth/register`, body);
        return resp.data;
    }



    static async loginUser(body) {
        const resp = await axios.post(`${this.BASE_URL}/auth/login`, body);
        return resp.data;
    }








    /**USERS PROFILE MANAGEMENT SESSION */
    static async getAccountDetails() {
        const resp = await axios.get(`${this.BASE_URL}/users/me`, {
            headers: this.getHeader()
        })
        return resp.data;
    }


    static async updateMyAccount(body) {
        const resp = await axios.put(`${this.BASE_URL}/users`, body, {
            headers: this.getHeader()
        });
        return resp.data;
    }



    static async getAllPilots() {
        const resp = await axios.get(`${this.BASE_URL}/users/pilots`, {
            headers: this.getHeader()
        })
        return resp.data;
    }








    /** AIRPORT API METHODS */
    static async createAirport(body) {
        const resp = await axios.post(`${this.BASE_URL}/airports`, body, {
            headers: this.getHeader()
        });
        return resp.data;
    }

    static async updateAirport(body) {
        const resp = await axios.put(`${this.BASE_URL}/airports`, body, { // Assuming body contains id
            headers: this.getHeader()
        });
        return resp.data;
    }

    static async getAllAirports() {
        const resp = await axios.get(`${this.BASE_URL}/airports`);
        return resp.data;
    }

    static async getAirportById(id) {
        const resp = await axios.get(`${this.BASE_URL}/airports/${id}`);
        return resp.data;
    }







    /** BOOKING API METHODS */
    static async createBooking(body) {
        const resp = await axios.post(`${this.BASE_URL}/bookings`, body, {
            headers: this.getHeader()
        });
        return resp.data;
    }

    static async getBookingById(id) {
        const resp = await axios.get(`${this.BASE_URL}/bookings/${id}`, {
            headers: this.getHeader()
        });
        return resp.data;
    }

    static async getAllBookings() {
        const resp = await axios.get(`${this.BASE_URL}/bookings`, {
            headers: this.getHeader()
        });
        return resp.data;
    }

    static async getCurrentUserBookings() {
        const resp = await axios.get(`${this.BASE_URL}/bookings/me`, {
            headers: this.getHeader()
        });
        return resp.data;
    }

    static async updateBookingStatus(id, status) {
        const resp = await axios.put(`${this.BASE_URL}/bookings/${id}`, status, {
            headers: this.getHeader()
        });
        return resp.data;
    }








    /** FLIGHT API METHODS */
    static async createFlight(body) {
        const resp = await axios.post(`${this.BASE_URL}/flights`, body, {
            headers: this.getHeader()
        });
        return resp.data;
    }

    static async getFlightById(id) {
        const resp = await axios.get(`${this.BASE_URL}/flights/${id}`);
        return resp.data;
    }

    static async getAllFlights() {
        const resp = await axios.get(`${this.BASE_URL}/flights`);
        return resp.data;
    }

    static async updateFlight(body) {
        const resp = await axios.put(`${this.BASE_URL}/flights`, body, {
            headers: this.getHeader()
        });
        return resp.data;
    }


    static async searchFlights(departureIataCode, arrivalIataCode, departureDate) {

        const params = {
            departureIataCode: departureIataCode,
            arrivalIataCode: arrivalIataCode,
            departureDate:departureDate
        };

        const resp = await axios.get(`${this.BASE_URL}/flights/search`, {
            params: params,
        });
        return resp.data;
    }


    static async getAllCities() {
        const resp = await axios.get(`${this.BASE_URL}/flights/cities`);
        return resp.data;
    }

    static async getAllCountries() {
        const resp = await axios.get(`${this.BASE_URL}/flights/countries`);
        return resp.data;
    }

}