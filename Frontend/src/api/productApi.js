import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

export const getAllProducts = () => axios.get(`${API_URL}/all`);

export const addProduct = (formData) =>
  axios.post(`${API_URL}/add`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProduct = (id) =>
  axios.delete(`${API_URL}/delete/${id}`);

export const updateProduct = (id, formData) =>
  axios.put(`${API_URL}/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
