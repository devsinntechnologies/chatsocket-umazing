"use client"
import { BASE_URL } from "@/lib/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const auth = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/auth/`,
    prepareHeaders: (headers, { getState, endpoint }) => {
      // Only add the token if the endpoint is not 'login' or 'signup'
      if (endpoint !== "login" && endpoint !== "signup") {
        const token = localStorage.getItem("token"); // Fetch token from localStorage
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginData) => ({
        url: "login",
        method: "POST",
        body: loginData,
      }),
    }),
    signup: builder.mutation({
      query: (signupData) => ({
        url: "register",
        method: "POST",
        body: signupData,
      }),
    }),
    // forgotPassword: builder.mutation({
    //   query: (forgotPasswordData) => ({
    //     url: "forgot-password",
    //     method: "POST",
    //     body: forgotPasswordData,
    //   }),
    // }),
    // checkOtp: builder.mutation({
    //   query: (otpData) => ({
    //     url: "/checkOtp",
    //     method: "POST",
    //     body: otpData,
    //   }),
    // }),
    // resetPassword: builder.mutation({
    //   query: (resetPasswordData) => ({
    //     url: "reset-password",
    //     method: "POST",
    //     body: resetPasswordData,
    //   }),
    // }),
    getAllUsers: builder.query({
      query: () => `getAllUsers`,
    }),
    getUserProfile: builder.query({
      query: () => `getUserProfile`,
    }),
    // updateProfile: builder.mutation({
    //   query: (updateData) => ({
    //     url: "update-profile",
    //     method: "POST",
    //     body: updateData,
    //   }),
    // }),
    // addUserAddress: builder.mutation({
    //   query: (addressData) => ({
    //     url: "addUserAddress",
    //     method: "POST",
    //     body: addressData,
    //   }),
    // }),

    // changePassword: builder.mutation({
    //   query: (passwordData) => ({
    //     url: `change-password`,
    //     method: "POST",
    //     body: passwordData,
    //   }),
    // }),
    // deleteAddressById: builder.mutation({
    //   query: (id) => ({
    //     url: `deleteAddressById/${id}`,
    //     method: "DELETE",
    //   }),
    // }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetAllUsersQuery,
  useGetUserProfileQuery,
  // useForgotPasswordMutation,
  // useCheckOtpMutation,
  // useResetPasswordMutation,
  // useUpdateProfileMutation,
  // useAddUserAddressMutation,
  // useChangePasswordMutation,
  // useDeleteAddressByIdMutation,
} = auth;
