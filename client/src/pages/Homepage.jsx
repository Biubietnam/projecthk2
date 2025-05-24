import React from "react";
// Icon components
const PawPrintIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="4" r="2" />
    <circle cx="18" cy="8" r="2" />
    <circle cx="20" cy="16" r="2" />
    <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const ShoppingBagIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const ArrowRightIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl  tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Caring for your pets like family
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Professional veterinary care, pet adoption services, and a complete pet shop - all in one place.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <a
                  href="/appointments"
                  className="inline-flex items-center justify-center rounded-md bg-[#6D7AB5] px-4 py-2 text-sm font-medium text-white hover:bg-[#5A678F] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Book Appointment <ArrowRightIcon className="h-4 w-4 ml-1" />
                </a>
                <a
                  href="/pets"
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  View Our Pets
                </a>
              </div>
            </div>
            <img
              src="/img/holder.jpg?width=550&height=550"
              alt="Happy pets"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl  tracking-tighter sm:text-5xl">Our Services</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Comprehensive care for all your pet's needs
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {/* Service Card 1 */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="p-6">
                <div className="flex flex-row items-center gap-4">
                  <div className="bg-[#6D7AB5] p-2 rounded-full">
                    <PawPrintIcon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Veterinary Care</h3>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-gray-500">
                    Professional medical care for your pets, including check-ups, vaccinations, and treatments.
                  </p>
                </div>
              </div>
            </div>

            {/* Service Card 2 */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="p-6">
                <div className="flex flex-row items-center gap-4">
                  <div className="bg-[#6D7AB5] p-2 rounded-full">
                    <CalendarIcon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Appointments</h3>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-gray-500">Easy online scheduling for all your pet's healthcare needs.</p>
                </div>
              </div>
            </div>

            {/* Service Card 3 */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="p-6">
                <div className="flex flex-row items-center gap-4">
                  <div className="bg-[#6D7AB5] p-2 rounded-full">
                    <ShoppingBagIcon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Pet Shop</h3>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-gray-500">Quality food, toys, and accessories for all types of pets.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl  tracking-tighter sm:text-5xl">Featured Pets</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Meet some of our adorable pets looking for a forever home
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="p-0">
                  <img
                    src={`/placeholder.svg?height=200&width=400&text=Pet+${i}`}
                    alt={`Pet ${i}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Buddy {i}</h3>
                  <p className="text-sm text-gray-500">2 years old • Golden Retriever</p>
                </div>
                <div className="p-4 pt-0">
                  <a href={`/pets/${i}`} className="w-full">
                    <button className="w-full inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      View Details
                    </button>
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <a href="/pets">
              <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                View All Pets
              </button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
