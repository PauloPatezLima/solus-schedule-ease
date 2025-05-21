import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviços de Autenticação
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
};

// Serviços de Salas
export const roomService = {
  getRooms: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },
  getRoom: async (id: number) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },
  getRoomReservations: async (params?: { date?: string; roomId?: string }) => {
    const response = await api.get('/room-reservations', { params });
    return response.data;
  },
  createRoomReservation: async (reservation: {
    roomId: string;
    date: string;
    startTime: string;
    endTime: string;
    userId: number;
  }) => {
    const response = await api.post('/room-reservations', reservation);
    return response.data;
  },
};

// Serviços de Carros
export const carService = {
  getCars: async () => {
    const response = await api.get('/cars');
    return response.data;
  },
  getCar: async (id: number) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },
  getCarReservations: async (params?: { date?: string; carId?: string; userId?: string }) => {
    const response = await api.get('/car-reservations', { params });
    return response.data;
  },
  createCarReservation: async (reservation: {
    carId: string;
    date: string;
    startTime: string;
    destination: string;
    purpose: string;
    initialOdometer?: number;
    userId: number;
  }) => {
    const response = await api.post('/car-reservations', reservation);
    return response.data;
  },
  returnCar: async (data: {
    reservationId: number;
    returnTime: string;
    endTime: string;
    fuelLevel: number;
    finalOdometer?: number;
    notes?: string;
  }) => {
    const response = await api.put('/car-return', data);
    return response.data;
  },
};

// Serviços de Usuários
export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  createUser: async (user: {
    name: string;
    email: string;
    password: string;
    isAdmin?: boolean;
    // Mantemos na API, mas sabemos que o backend vai ignorar estes campos
    driverLicense?: string;
    driverLicenseFile?: any;
  }) => {
    const response = await api.post('/users', user);
    return response.data;
  },
  updateUser: async (id: number, userData: any) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

export default api;
