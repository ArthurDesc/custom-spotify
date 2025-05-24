import SpotifySignInButton from "@/components/auth/SpotifySignInButton";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/"); // Redirect to homepage if already signed in
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900">
          🎵 Custom Spotify
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connectez-vous avec votre compte Spotify pour accéder à vos playlists et contrôler votre musique
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <SpotifySignInButton />
        </div>
      </div>
    </div>
  );
} 