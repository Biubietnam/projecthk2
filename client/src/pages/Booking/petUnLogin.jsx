//function to get the pet join if the user is not logged in

function PetUnLogin() {
  return (
    <div
      className={`min-h-screen w-full max-w-[1280px] px-4 py-20 sm:px-6 md:px-8 lg:px-16 xl:px-24 mx-auto`}
    >
      <div className="row">
        <div className="col-md-12">
          <h1>Pet UnLogin</h1>
          <p>Please login to join the pet.</p>
        </div>
      </div>
    </div>
  );
}
export default PetUnLogin;
