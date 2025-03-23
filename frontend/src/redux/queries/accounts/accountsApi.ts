import { apiSlice } from "../../api/apiSlice";

interface getAccountsInterface {

  accountType?: string;
}

interface getCustomersInterface {
  first_name?: string;
}



export const accountsApis = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTotalBalance: builder.query({
      query: () => {
        return {
          url: `account/balance/`,
          method: "GET",
        };
      },
    }),
    // getAccounts: builder.query({
    //   query: () => {
    //     return {
    //       url: `account/user-bank-accounts/`,
    //       method: "GET",
    //     };
    //   },
    // }),
    getAccounts: builder.query({
      query: ({
        accountType
      }: getAccountsInterface = {}) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};

        if (accountType) queryParams.accountType = accountType;
        
        return {
          url: `account/user-bank-accounts/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
  
    getTransactions: builder.query({
      query: () => {
        return {
          url: `transaction/transactions/`,
          method: "GET",
        };
      },
    }),
    createAccount: builder.mutation({
      query: (data) => {
        return {
          url: `account/create-bank-account/`,
          method: "POST",
          body: data,
        };
      },
    }),
    
    deposit: builder.mutation({
      query: (data) => {
        return {
          url: `account/deposit/`,
          method: "POST",
          body: data,
        };
      },
    }),
    transfer: builder.mutation({
      query: (data) => {
        return {
          url: `account/transfer/`,
          method: "POST",
          body: data,
        };
      },
    }),
    withdraw: builder.mutation({
      query: (data) => {
        return {
          url: `account/withdraw/`,
          method: "POST",
          body: data,
        };
      },
    }),

//    Profile and update profile
    getProfile: builder.query({
      query: () => {
        return {
          url: `auth/profile/`,
          method: "GET",
        };
      },    
    }),
    updateProfile: builder.mutation({
      query: (data) => {
        return {
          url: `auth/update-profile/`,
          method: "PUT",
          body: data,
        };
      },
    }),
    
    deleteAccount: builder.mutation({
      query: (id) => {
        return {
          url: `account/delete-bank-account/${id}/`,
          method: "DELETE",
        };
      },
    }),
    calculateInterest: builder.mutation({
      query: (data) => {
        return {
          url: `account/calculate-interest/`,
          method: "POST",
          body: data,
        };
      },
    }),
    applyInterest: builder.mutation({
      query: (data) => {
        return {
          url: `account/apply-interest/`,
          method: "POST",
          body: data,
        };
      },
    }),
    //get all customers by an employee
    getCustomers: builder.query({
      query: ({
        first_name
      }: getCustomersInterface = {}) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};

        if (first_name) queryParams.first_name = first_name;
        
        return {
          url: `auth/customers/`,
          method: "GET",
          params: queryParams,
        };  
      },
    }),
    getCustomerDetails: builder.query({
      query: (id: string) => ({
        url: `auth/customer/${id}/`,
        method: "GET",
      }),
    }),
    getCustomerAccountsById: builder.query({
      query: ({
        id,
        accountType
      }: { id: string } & getAccountsInterface) => {
        const queryParams: Record<string, string | number | boolean | undefined> = {};

        if (accountType) queryParams.accountType = accountType;
        
        return {
          url: `/account/customer/${id}/accounts`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    updateCustomerProfile: builder.mutation({
      query: ({id, data}) => {
        return {
          url: `auth/update-customer-info/${id}/`,
          method: "PUT",
          body: data,
        };
      },
    }),
    createCustomerAccount: builder.mutation({
      query: (data) => {
        return {
          url: `account/employee-create-customer-bank-account/`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useGetTotalBalanceQuery,
  useGetAccountsQuery,
  useCreateAccountMutation,
  useDepositMutation,
  useTransferMutation,
  useWithdrawMutation,
  useGetTransactionsQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
  useCalculateInterestMutation,
  useApplyInterestMutation,
  useGetCustomersQuery,
  useGetCustomerDetailsQuery,
  useGetCustomerAccountsByIdQuery,
  useUpdateCustomerProfileMutation,
  useCreateCustomerAccountMutation,
} = accountsApis;
