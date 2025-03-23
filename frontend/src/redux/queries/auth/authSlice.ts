import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { User } from "@/definitions";

interface AuthState {
  accessToken: string;
  user: User | null;
  tokenExpiry: number | null;
  loading: boolean; 
  error: string | null;
}
interface DecodedToken extends User {
  exp: number;
  iat?: number;
}
const initialState: AuthState = {
  accessToken: "",
  user: null,
  tokenExpiry: null,
  loading: false, 
  error: null,
};

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers:{
      userLoading: (state) => {
        state.loading = true;
        state.error = null;  
      },
  
      userLoggedIn: (
        state,
        action: PayloadAction<{
          accessToken: string;
          user: User;
        }>
      ) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        
        const decodedToken: DecodedToken = jwtDecode(action.payload.accessToken);
        state.tokenExpiry = decodedToken.exp * 1000; 
  
        state.loading = false; 
      },
  
      userLoggedOut: (state) => {
        state.accessToken = "";
        state.user = null;
        state.tokenExpiry = null;
        state.loading = false;
        Cookies.remove("accessToken");
      },
  
      userLoginFailed: (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;  
      },
      loadUser: (state) => {
        state.loading = true;
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
          try {
            const decodedToken: DecodedToken = jwtDecode(accessToken);
            
            // Check if token is expired
            if (decodedToken.exp * 1000 < Date.now()) {
              // Token expired
              state.accessToken = "";
              state.user = null;
              state.tokenExpiry = null;
              Cookies.remove("accessToken");
            } else {
              // Token valid
              state.accessToken = accessToken;
              state.user = decodedToken;  
              console.log("user", decodedToken);
              // We'll set user data from API response instead of decoded token
              state.tokenExpiry = decodedToken.exp * 1000;
            }
          } catch (error) {
            console.log("error", error);  
            // Invalid token
            state.accessToken = "";
            state.user = null;
            state.tokenExpiry = null;
            Cookies.remove("accessToken");
          }
        } else {
          state.accessToken = "";
          state.user = null;
          state.tokenExpiry = null;
        }
        state.loading = false;
      },
    }
})

export const  {userLoggedIn,userLoggedOut,userLoginFailed, loadUser, userLoading} = authSlice.actions;
export default authSlice.reducer;