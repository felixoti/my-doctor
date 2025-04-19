import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers:{
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

// Example GET request
export const fetchData = async(endpoint, params = {}) => {
    try {
        const response = await apiClient.get(endpoint, { params });
        return response.data;
    } catch (error) {
        console.error('API GET ERROR:', error)
        throw error;
    }
}

// Example POST request
export const postData = async(endpoint, data) => {
    try {
        const response = await apiClient.post(endpoint, data);
        return response.data;
    } catch (error) {
        // console.error('API POST ERROR:', error)
        throw error;
    }
}

// Example PUT request
export const putData = async(endpoint, data) => {
    try {
        const response = await apiClient.put(endpoint, data);
        return response.data;
    } catch (error) {
        console.error('API PUT ERROR:', error)
        throw error;
    }
}

// Example DELETE request
export const deleteData = async(endpoint) => {
    try {
        const response = await apiClient.delete(endpoint);
        return response.data;
    } catch (error) {
        console.error('API DELETE ERROR:', error)
        throw error;
    }
};

export default apiClient;