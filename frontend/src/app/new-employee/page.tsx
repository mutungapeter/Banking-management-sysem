import NewEmployeeAccount from "@/components/employee/customers/newEmployeeAccount";
import { Suspense } from "react";
import { PageLoadingSpinner } from "@/components/commons/Spinner";
const NewEmployee = () => {
    return (
        <Suspense fallback={<PageLoadingSpinner />}>
        <NewEmployeeAccount />
        </Suspense>
    )
}

export default NewEmployee;
