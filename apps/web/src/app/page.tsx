import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import SignOutButton from "@/components/auth/SignOutButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="text-white text-xl font-bold">
            CineVerse
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-green-400">
                  Bienvenue, {session.user?.name || session.user?.email}
                </span>
                <SignOutButton />
              </div>
            ) : (
              <>
                <Link href="/auth/signin" className="hover:text-gray-300">
                  Connexion
                </Link>
                <Link href="/auth/register" className="hover:text-gray-300">
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Search Bar Placeholder */}
          <div>
            {/* <input type="text" placeholder="Rechercher..." className="p-1 rounded text-gray-900" /> */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-96 bg-cover bg-center" style={{ backgroundImage: 'url("https://via.placeholder.com/1920x1080")' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Bienvenue sur CineVerse</h2>
            <p className="text-lg text-gray-200">Découvrez les derniers films et séries TV.</p>
            {!session && (
              <div className="mt-6">
                <Link
                  href="/auth/register"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Commencer l'aventure
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area - Movie Sections */}
      <main className="container mx-auto p-4">
        {/* Section Placeholder: Trending Movies */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Tendances Actuelles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Movie Card Placeholders */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="h-40 bg-gray-700 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Affiche</span>
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium">Titre du Film</h3>
                  <p className="text-xs text-gray-400">Année</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section Placeholder: Popular Movies */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Populaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Movie Card Placeholders */}
             {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="h-40 bg-gray-700 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Affiche</span>
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium">Titre du Film</h3>
                  <p className="text-xs text-gray-400">Année</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add more sections for genres, etc. */}
      </main>

      {/* Footer */}
      <footer className="p-4 bg-gray-800 text-center text-sm text-gray-400 mt-8">
        <p>© 2025 CineVerse. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
