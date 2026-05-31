import axios from 'axios'

const apiService = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL_INVENTORY}/api`,
    headers: {
        "ngrok-skip-browser-warning": "true"
    }
});

export default apiService;