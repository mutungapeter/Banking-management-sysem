import { apiSlice } from "@/redux/api/apiSlice";
import Cookies from "js-cookie";
import { userLoading, userLoggedIn, userLoggedOut } from "./authSlice";


export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation({
      query: ({ email, password }) => ({
        url: `auth/login/`,
        method: "POST",
        body: {
        email,
        password,
        },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoading());
          const result = await queryFulfilled;
          console.log("Login successful:", result);
          Cookies.set("accessToken", result.data.accessToken);
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error: unknown) {
          console.log(error);
        }
      },
    }),
    
    register: builder.mutation({
      query: ({ first_name, last_name, email, phone, password }) => ({
        url: `auth/register/`,
        method: "POST",
        body: {
          first_name,
          last_name,
          email,
          phone,
          password,
        },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          console.log("Registration successful:", result);
        } catch (error) {
          console.error("Registration error:", error);
        }
      },
    }),
    getCurrentUser: builder.query({
        query: () => ({
          url: `auth/current-user/`,
          method: "GET",
        }),
        async onQueryStarted(arg, { queryFulfilled, dispatch }) {
          try {
            const result = await queryFulfilled;
            dispatch(
              userLoggedIn({
                accessToken: Cookies.get("accessToken") || "",
                user: result.data,
              })
            );
          } catch (error) {
            console.error("Failed to fetch current user:", error);
            dispatch(userLoggedOut());
          }
        },
      }),
  
      
    
  }),
});
export const {
    useGetCurrentUserQuery,
  useLoginMutation,
  useRegisterMutation,

} = authApi;