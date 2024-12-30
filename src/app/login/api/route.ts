import axios from "axios";
type userType = {
    email: string,
    password: string
}
// TODO: tanstack needed
// login with email and password
export const handleLogin = async ({ email, password }: userType) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }

}
// create user with social account
export const createSocialAccount = async (user: object) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/social-account`, user);
        return response.data;
    } catch (error) {
        console.error("Error during social login:", error);
        throw error;
    }
}

// handle social login
export const handleSocialAccount = async (email: string) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/social-login`, { email });
        return response.data;
    } catch (error) {
        console.error("Error during social login:", error);
        throw error;
    }
}