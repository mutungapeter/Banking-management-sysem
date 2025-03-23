import Dashboard from "@/components/dashboard";
import { Suspense } from "react";
import { PageLoadingSpinner } from "@/components/commons/Spinner";
const DashboardPage = () => {
    return (
        <Suspense fallback={<PageLoadingSpinner />}>
        <Dashboard />
        </Suspense>
    )
}

export default DashboardPage;