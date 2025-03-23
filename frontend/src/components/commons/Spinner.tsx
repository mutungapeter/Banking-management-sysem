
export const PageLoadingSpinner = () => {
    return (
      <div className="flex insert-0  h-screen items-center justify-center bg-white bg-opacity-50  z-999999  ">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
    );
  };
  
  export const ContentSpinner=()=>{
    return (
        <>
        
        <div className="flex items-center h-screen justify-center z-9999 ">
        <div className="h-12 w-12 border-4  border-primary  border-t-gray-400   rounded-full animate-spin " />
      </div>
        </>
    )
}

