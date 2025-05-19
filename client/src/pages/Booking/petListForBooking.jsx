// if user logged in, show the pet list
//if user dont have pet, show the message
//if user have pet, show the pet list

function PetListForBooking() {
  return (
    <div
      className={`min-h-screen w-full max-w-[1280px] px-4 py-20 sm:px-6 md:px-8 lg:px-16 xl:px-24 mx-auto`}
    >
      <div className="row">
        <div className="col-md-12">
          <h1>Pet List for Booking</h1>
          <p>Please select a pet to book.</p>
        </div>
      </div>
    </div>
  );
}
export default PetListForBooking;
