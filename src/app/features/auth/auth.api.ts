import { baseApi } from "../../services/baseApi";
import type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RefreshTokenRequest,
  RegisterRequest,
  RegisterResponse,
  SocialAuthRequest,
  SocialAuthResponse,
  User,
  VerifyCodeRequest,
  VerifyCodeResponse,
  VerifyTokenRequest,
  VerifyTokenResponse,
} from "./auth.types";
import { clearTokens, logout, setTokens, setUser } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /users/verify-code/ - Verify code for login
    verifyCode: builder.mutation<VerifyCodeResponse, VerifyCodeRequest>({
      query: (body) => ({
        url: "/users/verify-code/",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setTokens({
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            }),
          );

          if (data.user) {
            dispatch(setUser(data.user));
          } else {
            // Fetch profile if user data is not included in verification response
            dispatch(authApi.endpoints.getProfile.initiate());
          }
        } catch {
          // Error handled by component
        }
      },
    }),

    // GET /users/profile/ - Get current user profile
    getProfile: builder.query<User, void>({
      query: () => ({
        url: "/users/profile/",
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          // Profile fetch failed, user might need to re-login
        }
      },
    }),

    // POST /users/register/ - Register new user
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: "/users/register/",
        method: "POST",
        body,
      }),
    }),

    // POST /users/login/ - Login user
    // ✅ SIMPLIFIED: Token handling is done in the Login component
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/users/login/",
        method: "POST",
        body: credentials,
      }),
      // Removed onQueryStarted - tokens are saved in component before navigation
    }),

    // POST /users/logout/ - Logout user
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/users/logout/",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
          dispatch(clearTokens());
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),

    // POST /users/token/verify/ - Verify token
    verifyToken: builder.mutation<VerifyTokenResponse, VerifyTokenRequest>({
      query: (body) => ({
        url: "/users/token/verify/",
        method: "POST",
        body,
      }),
    }),

    // POST /users/token/refresh/ - Refresh token
    refreshToken: builder.mutation<RefreshResponse, RefreshTokenRequest>({
      query: (body) => ({
        url: "/users/token/refresh/",
        method: "POST",
        body,
      }),
      // Token refresh is handled by baseApi's reauth logic
    }),

    // POST /users/auth/social - Social authentication (Google OAuth)
    socialAuth: builder.mutation<SocialAuthResponse, SocialAuthRequest>({
      query: (credentials) => ({
        url: "/users/auth/social",
        method: "POST",
        body: credentials,
      }),
      // Token handling is done in the Login component, similar to regular login
    }),

    // POST /users/resend-code/ - Resend verification code
    resendCode: builder.mutation<ResendCodeResponse, ResendCodeRequest>({
      query: (body) => ({
        url: "/users/resend-code/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyTokenMutation,
  useRefreshTokenMutation,
  useSocialAuthMutation,
  useVerifyCodeMutation,
  useResendCodeMutation,
} = authApi;
