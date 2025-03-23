import { PageLoadingSpinner } from "@/components/commons/Spinner";
import CustomerDetails from "@/components/employee/customers/CustomerDetail";
import { Suspense } from "react";


const CustomerDetailsPage    = async({ params}:{params: Promise<{id: string}>} )=>{
  const id = (await params).id
  

    return(
        <>
       <Suspense fallback={<PageLoadingSpinner />}>
       
        <CustomerDetails customer_id={id} />
       </Suspense>
        </>
    )
}
export default CustomerDetailsPage