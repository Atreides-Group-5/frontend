import axios from 'axios';

export const fetchBookings = async (status) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(
      `http://localhost:3000/api/bookings/${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.bookings) {
      return response.data.bookings;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        if (error.response.status === 401) {
          console.error(
            'Authentication failed. Token may be invalid or expired.'
          );
          // ทำการ logout หรือ refresh token ที่นี่
          // ตัวอย่าง: await refreshToken();
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

// เพิ่มฟังก์ชันสำหรับ refresh token (ตัวอย่าง)
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await axios.post(
      'http://localhost:3000/api/auth/refresh',
      { refreshToken }
    );
    const newToken = response.data.token;

    localStorage.setItem('authToken', newToken);
    return newToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // อาจจะต้องทำการ logout ที่นี่
    throw error;
  }
};
