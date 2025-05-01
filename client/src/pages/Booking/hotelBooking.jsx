function HotelBooking() {
  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-[1280px] mx-auto text-gray-700 py-20 ">
      <div class="container mx-auto px-4 py-12">
        <h2 class="text-3xl font-bold text-center text-rose-600 mb-10">
          Book a Stay at Pet Zone Hotel
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white shadow-lg rounded-xl p-6">
            <h3 class="text-2xl font-semibold text-rose-600 mb-4">
              Booking Form
            </h3>
            <form class="space-y-4">
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="0123 456 789"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Pet Name
                </label>
                <input
                  type="text"
                  class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="Biscuit"
                />
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Stay Duration
                </label>
                <select class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400">
                  <option value="1">1 night</option>
                  <option value="3">3 nights</option>
                  <option value="7">1 week</option>
                  <option value="14">2 weeks</option>
                </select>
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-1">
                  Additional Notes
                </label>
                <textarea
                  class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  rows="3"
                  placeholder="Allergies, preferred food, etc."
                ></textarea>
              </div>
              <button
                type="submit"
                class="w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition"
              >
                Book Now
              </button>
            </form>
          </div>

          <div class="bg-white shadow-lg rounded-xl p-6">
            <h3 class="text-2xl font-semibold text-rose-600 mb-4">
              Hotel Pricing
            </h3>
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-rose-100 text-rose-700">
                  <th class="py-2 px-4 border-b">Room Type</th>
                  <th class="py-2 px-4 border-b">Price per Night</th>
                </tr>
              </thead>
              <tbody class="text-gray-700">
                <tr>
                  <td class="py-2 px-4 border-b">Standard Kennel</td>
                  <td class="py-2 px-4 border-b">$15</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="py-2 px-4 border-b">Deluxe Suite</td>
                  <td class="py-2 px-4 border-b">$25</td>
                </tr>
                <tr>
                  <td class="py-2 px-4 border-b">
                    VIP Room (with daily massage)
                  </td>
                  <td class="py-2 px-4 border-b">$40</td>
                </tr>
                <tr class="bg-gray-50">
                  <td class="py-2 px-4 border-b">Cat Condo</td>
                  <td class="py-2 px-4 border-b">$18</td>
                </tr>
              </tbody>
            </table>

            <p class="mt-4 text-sm text-gray-600">
              * Weekly stays include 1 free bath & grooming session.
              <br />* Prices may vary during peak holidays.
            </p>
          </div>
        </div>
      </div>

      {/* Add your booking form and logic here */}
    </div>
  );
}
export default HotelBooking;
