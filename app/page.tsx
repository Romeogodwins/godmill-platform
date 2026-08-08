import Image from "next/image";
import Link from "next/link";

const rooms = [
  {
    name: "Executive Room",
    price: "From R850 per night",
    description:
      "A spacious premium room designed for comfort, privacy and a relaxing stay.",
    image: "/Room 1.jpeg",
  },
  {
    name: "Standard Room",
    price: "From R500 per night",
    description:
      "Clean, comfortable accommodation with everything needed for a pleasant visit.",
    image: "/Room 2.jpeg",
  },
  {
    name: "Family Room",
    price: "Contact us for rates",
    description:
      "A practical and welcoming room option for families and travelling groups.",
    image: "/Room 3.jpeg",
  },
];

const amenities = [
  "Swimming pool",
  "Free WiFi",
  "Secure parking",
  "Comfortable rooms",
  "Private bathrooms",
  "Friendly service",
];

const testimonials = [
  {
    name: "Guest Review",
    text: "A peaceful and comfortable place to stay. The rooms were clean and the service was welcoming.",
  },
  {
    name: "Business Traveller",
    text: "Convenient, secure and ideal for an overnight business trip in Taung.",
  },
  {
    name: "Family Guest",
    text: "We enjoyed the space, swimming pool and warm hospitality throughout our stay.",
  },
];

const packages = [
  {
    name: "Standard Stay",
    price: "R500",
    period: "per night",
    features: [
      "Standard non-air-conditioned room",
      "Free WiFi",
      "Secure parking",
      "Private bathroom",
    ],
  },
  {
    name: "Executive Stay",
    price: "R850",
    period: "per night",
    popular: true,
    features: [
      "Executive room",
      "Premium comfort",
      "Free WiFi",
      "Secure parking",
      "Access to guesthouse amenities",
    ],
  },
  {
    name: "Bed & Breakfast",
    price: "R850",
    period: "per night",
    features: [
      "Comfortable accommodation",
      "Breakfast included",
      "Free WiFi",
      "Secure parking",
    ],
  },
];

const faqs = [
  {
    question: "Where is Godmill City Guesthouse located?",
    answer:
      "Godmill City Guesthouse is located in Taung on Cokonyane Road, near Boemma Waters.",
  },
  {
    question: "Is secure parking available?",
    answer:
      "Yes. Secure parking is available for guests staying at the property.",
  },
  {
    question: "Does the guesthouse have WiFi?",
    answer:
      "Yes. Guests have access to free WiFi during their stay.",
  },
  {
    question: "Is there a swimming pool?",
    answer:
      "Yes. The property has a swimming pool available to registered guests, subject to guesthouse rules.",
  },
  {
    question: "How can I make a booking?",
    answer:
      "You can contact Godmill City Guesthouse directly by telephone or WhatsApp to confirm availability and make a reservation.",
  },
];

export default function Home() {
  return (
    <main className="bg-[#080808] text-white">
      <section id="home" className="relative min-h-screen overflow-hidden">
        <Image
          src="/hero.jpeg"
          alt="Godmill City Guesthouse"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/65" />

        <nav className="absolute top-0 z-20 flex w-full items-center justify-between px-6 py-6 md:px-12 lg:px-16">
          <Image
            src="/logo.png"
            alt="Godmill City Guesthouse"
            width={220}
            height={75}
            className="h-auto w-40 md:w-52"
          />

          <div className="hidden gap-8 text-sm font-medium md:flex lg:text-base">
            <a className="transition hover:text-[#d4b16f]" href="#home">
              Home
            </a>
            <a className="transition hover:text-[#d4b16f]" href="#rooms">
              Rooms
            </a>
            <a className="transition hover:text-[#d4b16f]" href="#amenities">
              Amenities
            </a>
            <a className="transition hover:text-[#d4b16f]" href="#reviews">
              Reviews
            </a>
            <a className="transition hover:text-[#d4b16f]" href="#contact">
              Contact
            </a>
          </div>
        </nav>

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 pt-24 md:px-12 lg:px-16">
            <p className="mb-5 text-sm font-semibold tracking-[0.35em] text-[#d4b16f] md:text-lg md:tracking-[0.5em]">
              PREMIUM ACCOMMODATION
            </p>

            <h1 className="max-w-5xl text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Experience
              <br />
              Godmill City
              <br />
              Guesthouse
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-200 md:text-2xl">
              Executive • Standard • Family Rooms
              <br />
              Swimming Pool • Free WiFi • Secure Parking
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/booking"
                className="rounded-full bg-[#d4b16f] px-9 py-4 text-center text-lg font-bold text-black transition hover:bg-[#e2c486]"
              >
                Book Now
              </Link>

              <a
                href="#rooms"
                className="rounded-full border border-white px-9 py-4 text-center text-lg font-semibold transition hover:bg-white hover:text-black"
              >
                View Rooms
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="rooms" className="px-6 py-24 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold tracking-[0.3em] text-[#d4b16f]">
              OUR ROOMS
            </p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Comfortable accommodation for every stay
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-400">
              Choose from executive, standard and family accommodation designed
              for business travellers, couples and families visiting Taung.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {rooms.map((room) => (
              <article
                key={room.name}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
              >
                <div className="relative h-64">
                  <Image src={room.image} alt={room.name} fill className="object-cover" />
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-bold">{room.name}</h3>
                  <p className="mt-2 font-semibold text-[#d4b16f]">{room.price}</p>
                  <p className="mt-4 leading-7 text-gray-400">{room.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="amenities"
        className="border-y border-white/10 bg-[#111111] px-6 py-24 md:px-12 lg:px-16"
      >
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold tracking-[0.3em] text-[#d4b16f]">
              GUEST COMFORT
            </p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Everything you need for a comfortable stay
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
              Godmill City Guesthouse offers practical amenities, welcoming
              service and a peaceful setting for short or extended visits.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d4b16f] font-bold text-black">
                  ✓
                </span>
                <span className="font-semibold">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="px-6 py-24 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold tracking-[0.3em] text-[#d4b16f]">
              GUEST EXPERIENCES
            </p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              What guests appreciate about their stay
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-3xl border border-white/10 bg-white/5 p-8"
              >
                <p className="text-sm font-bold uppercase tracking-widest text-[#d4b16f]">
                  Sample review
                </p>
                <p className="mt-5 text-lg leading-8 text-gray-300">“{testimonial.text}”</p>
                <p className="mt-7 font-bold">{testimonial.name}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="border-y border-white/10 bg-[#111111] px-6 py-24 md:px-12 lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold tracking-[0.3em] text-[#d4b16f]">
              ROOM RATES
            </p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Choose the stay that suits you
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-400">
              Rates may vary according to room availability, number of guests and selected services.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {packages.map((item) => (
              <article
                key={item.name}
                className={`relative rounded-3xl border p-8 ${
                  item.popular
                    ? "border-[#d4b16f] bg-[#d4b16f]/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {item.popular && (
                  <span className="absolute right-6 top-6 rounded-full bg-[#d4b16f] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black">
                    Popular
                  </span>
                )}

                <h3 className="text-2xl font-bold">{item.name}</h3>

                <div className="mt-7 flex items-end gap-2">
                  <span className="text-5xl font-bold text-[#d4b16f]">{item.price}</span>
                  <span className="pb-1 text-gray-400">{item.period}</span>
                </div>

                <ul className="mt-8 space-y-4">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-gray-300">
                      <span className="font-bold text-[#d4b16f]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="tel:0790582637"
                  className={`mt-10 block rounded-full px-7 py-4 text-center font-bold transition ${
                    item.popular
                      ? "bg-[#d4b16f] text-black hover:bg-[#e2c486]"
                      : "border border-white hover:bg-white hover:text-black"
                  }`}
                >
                  Check Availability
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="px-6 py-24 md:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-bold tracking-[0.3em] text-[#d4b16f]">
              FREQUENTLY ASKED QUESTIONS
            </p>
            <h2 className="mt-4 text-4xl font-bold md:text-5xl">Before you book</h2>
          </div>

          <div className="mt-14 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <summary className="cursor-pointer list-none pr-8 text-lg font-bold">
                  {faq.question}
                </summary>
                <p className="mt-4 leading-7 text-gray-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 pb-24 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#d4b16f] px-8 py-16 text-center text-black md:px-16">
          <p className="text-sm font-bold tracking-[0.3em]">GODMILL CITY GUESTHOUSE</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold md:text-5xl">
            Ready to reserve your room?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-black/75">
            Contact us today to confirm room availability and secure your stay at Godmill City Guesthouse.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="tel:0790582637"
              className="rounded-full bg-black px-9 py-4 font-bold text-white transition hover:bg-black/80"
            >
              Call 079 058 2637
            </a>

            <Link
              href="/booking"
              className="rounded-full border border-black px-9 py-4 font-bold transition hover:bg-black hover:text-white"
            >
              Book online
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-500">
        © 2026 Godmill City Guesthouse. All rights reserved.
      </footer>
    </main>
  );
}