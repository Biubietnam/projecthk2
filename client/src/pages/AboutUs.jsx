// Icon components matching the homepage style
const HeartIcon = ({ className }) => (
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
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </svg>
)

const CheckCircleIcon = ({ className }) => (
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
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3L22 4" />
    </svg>
)

const UsersIcon = ({ className }) => (
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
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
)

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
)

const BookOpenIcon = ({ className }) => (
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
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
)

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
)

export default function AboutUs() {
    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="space-y-2">
                                <h1 className="text-3xl tracking-tighter sm:text-5xl xl:text-6xl/none">About PawPals Pet Care</h1>
                                <p className="max-w-[600px] text-gray-500 md:text-xl">
                                    Your trusted companion in pet care for over 15 years. We're passionate about creating lasting bonds
                                    between pets and their families.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <a
                                    href="/appointments"
                                    className="inline-flex items-center justify-center rounded-md bg-[#6D7AB5] px-4 py-2 text-sm font-medium text-white hover:bg-[#5A678F] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Visit Our Store
                                </a>
                                <a
                                    href="/services"
                                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Our Services
                                </a>
                            </div>
                        </div>
                        <img
                            src="/placeholder.svg?height=550&width=550"
                            alt="Pet shop founders with pets"
                            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                        />
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl tracking-tighter sm:text-5xl">Our Story</h2>
                            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Founded with love, built with care
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto max-w-4xl py-12">
                        <div className="space-y-6 text-center">
                            <p className="text-lg text-gray-600">
                                Founded in 2008 by Sarah and Mike Johnson, PawPals began as a small neighborhood pet store with a big
                                dream: to create a place where every pet could find everything they need to live their happiest,
                                healthiest life.
                            </p>
                            <p className="text-lg text-gray-600">
                                What started as a 500-square-foot shop has grown into a comprehensive pet care destination, but our core
                                values remain the same - treating every pet like family and providing personalized care that makes a
                                difference.
                            </p>
                            <p className="text-lg text-gray-600">
                                Today, we're proud to serve thousands of pet families in our community, offering everything from premium
                                nutrition to professional grooming services.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl tracking-tighter sm:text-5xl">Our Values</h2>
                            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                What drives us every day
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                        {/* Value Card 1 */}
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="p-6">
                                <div className="flex flex-row items-center gap-4">
                                    <div className="bg-[#6D7AB5] p-2 rounded-full">
                                        <HeartIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Compassionate Care</h3>
                                </div>
                                <div className="pt-4">
                                    <p className="text-sm text-gray-500">
                                        Every pet receives individual attention and care tailored to their unique needs and personality.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Value Card 2 */}
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="p-6">
                                <div className="flex flex-row items-center gap-4">
                                    <div className="bg-[#6D7AB5] p-2 rounded-full">
                                        <CheckCircleIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Quality Products</h3>
                                </div>
                                <div className="pt-4">
                                    <p className="text-sm text-gray-500">
                                        We carefully select only the highest quality products from trusted brands that we use for our own
                                        pets.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Value Card 3 */}
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="p-6">
                                <div className="flex flex-row items-center gap-4">
                                    <div className="bg-[#6D7AB5] p-2 rounded-full">
                                        <UsersIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Expert Guidance</h3>
                                </div>
                                <div className="pt-4">
                                    <p className="text-sm text-gray-500">
                                        Our knowledgeable team provides expert advice to help you make the best decisions for your pet's
                                        health.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section>
                <div className="mx-auto max-w-5xl py-12">
                    <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                name: "Văn Quang Quốc Đạt",
                                role: "Team Leader",
                                description: "Project management and technical leadership",
                            },
                            {
                                name: "Nguyễn Minh Thức",
                                role: "Full-stack Developer",
                                description: "Admin Page Design, Main Database, Data structure",
                            },
                            {
                                name: "Nguyễn Phạm Minh Đăng",
                                role: "Full-Stack Developer",
                                description: "Checkout Handling, Shipping Handler, Deploy Project",
                            },
                            {
                                name: "Đỗ Hoàng Đức Minh",
                                role: "Full-stack Developer",
                                description: "Cart Handler and user interface development",
                            },
                        ].map((member, i) => (
                            <div
                                key={i}
                                className="flex flex-col h-full rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden"
                            >
                                {/* fixed‐height image */}
                                <div className="h-48 w-full overflow-hidden">
                                    <img
                                        src={`/placeholder.svg?height=200&width=200&text=${member.name.split(" ")[0]
                                            }`}
                                        alt={member.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>


                                <div className="flex-1 p-4 flex flex-col">
                                    <h3
                                        className=" leading-tight 
                         text-base md:text-lg 
                         truncate"
                                        title={member.name}
                                    >
                                        {member.name}
                                    </h3>

                                    <p className="mt-1 text-sm md:text-base text-[#6D7AB5] font-medium truncate">
                                        {member.role}
                                    </p>

                                    <p className="mt-2 flex-1 text-sm md:text-base text-gray-500
                          overflow-hidden
                          line-clamp-3">
                                        {member.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Services Section */}
            <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl tracking-tighter sm:text-5xl">What We Offer</h2>
                            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Comprehensive pet care services under one roof
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                        {/* Service Card 1 */}
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="p-6">
                                <div className="flex flex-row items-center gap-4">
                                    <div className="bg-[#6D7AB5] p-2 rounded-full">
                                        <ShoppingBagIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Premium Pet Food</h3>
                                </div>
                                <div className="pt-4">
                                    <p className="text-sm text-gray-500">
                                        High-quality nutrition for dogs, cats, birds, fish, and exotic pets from trusted brands.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Service Card 2 */}
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="p-6">
                                <div className="flex flex-row items-center gap-4">
                                    <div className="bg-[#6D7AB5] p-2 rounded-full">
                                        <HeartIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Professional Grooming</h3>
                                </div>
                                <div className="pt-4">
                                    <p className="text-sm text-gray-500">
                                        Full-service grooming including baths, cuts, nail trims, and specialized treatments.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Service Card 3 */}
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="p-6">
                                <div className="flex flex-row items-center gap-4">
                                    <div className="bg-[#6D7AB5] p-2 rounded-full">
                                        <BookOpenIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Training Classes</h3>
                                </div>
                                <div className="pt-4">
                                    <p className="text-sm text-gray-500">
                                        Puppy training, obedience classes, and behavioral consultation services.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Service Card 4 */}
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="p-6">
                                <div className="flex flex-row items-center gap-4">
                                    <div className="bg-[#6D7AB5] p-2 rounded-full">
                                        <HeartIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Pet Adoption</h3>
                                </div>
                                <div className="pt-4">
                                    <p className="text-sm text-gray-500">
                                        Partner with local shelters to help pets find their forever homes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Service Card 5 */}
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="p-6">
                                <div className="flex flex-row items-center gap-4">
                                    <div className="bg-[#6D7AB5] p-2 rounded-full">
                                        <CalendarIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Boarding Services</h3>
                                </div>
                                <div className="pt-4">
                                    <p className="text-sm text-gray-500">Safe and comfortable boarding for when you're away from home.</p>
                                </div>
                            </div>
                        </div>

                        {/* Service Card 6 */}
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                            <div className="p-6">
                                <div className="flex flex-row items-center gap-4">
                                    <div className="bg-[#6D7AB5] p-2 rounded-full">
                                        <UsersIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Pet Supplies</h3>
                                </div>
                                <div className="pt-4">
                                    <p className="text-sm text-gray-500">
                                        Everything your pet needs including toys, beds, carriers, and health products.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <h2 className="text-3xl tracking-tighter sm:text-5xl">Our Impact</h2>
                            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Numbers that reflect our commitment to the pet community
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { number: "5,000+", label: "Happy Customers" },
                            { number: "500+", label: "Pets Adopted" },
                            { number: "15", label: "Years of Service" },
                            { number: "24/7", label: "Emergency Support" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl font-bold text-[#6D7AB5] mb-2">{stat.number}</div>
                                <div className="text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}
