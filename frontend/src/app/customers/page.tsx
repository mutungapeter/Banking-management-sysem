import { PageLoadingSpinner } from "@/components/commons/Spinner";
import Customers from "@/components/employee/customers";
import { Suspense } from "react";
const CustomersPage = () => {
    return (
        <Suspense fallback={<PageLoadingSpinner />}>
        <Customers />
        </Suspense>
    )
}

export default CustomersPage;