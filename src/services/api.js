// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://projet-individuel-tache-21.onrender.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Injecter automatiquement le token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL: "https://projet-individuel-tache-21.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
