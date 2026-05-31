import axios from 'axios'

const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // headers: {
  //   'Accept': 'application/json',
  //   'X-Requested-With': 'XMLHttpRequest',
  //   'bypass-tunnel-reminder': true
  // }
});

export default apiService;