import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-[#071421] text-white">

      {/* HERO */}

      <section className="relative h-screen overflow-hidden">

        <Image
          src="/hero.jpg"
          alt="Godmill City Guesthouse"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <nav className="absolute top-0 z-20 flex w-full items-center justify-between px-16 py-8">

          <Image
            src="/logo.png"
            alt="Godmill"
            width={240}
            height={80}
          />

          <div className="flex gap-10 text-lg">

            <a href="#">Home</a>

            <a href="#">Rooms</a>

            <a href="#">Gallery</a>

            <a href="#">Pool</a>

            <a href="#">Contact</a>

          </div>

        </nav>

        <div className="absolute inset-0 flex items-center">

          <div className="mx-auto max-w-7xl px-16">

            <p className="mb-5 text-lg tracking-[0.5em] text-[#d4b16f]">
              PREMIUM ACCOMMODATION
            </p>

            <h1 className="max-w-5xl text-7xl font-bold leading-tight">

              Experience
              <br />

              Godmill City
              <br />

              Guesthouse

            </h1>

            <p className="mt-8 max-w-2xl text-2xl text-gray-200">

              Executive • Standard • Family Rooms

              <br />

              Swimming Pool • Free WiFi • Secure Parking

            </p>

            <div className="mt-12 flex gap-6">

              <button className="rounded-full bg-[#d4b16f] px-10 py-5 text-lg font-bold text-black">

                Book Now

              </button>

              <button className="rounded-full border border-white px-10 py-5">

                View Rooms

              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}