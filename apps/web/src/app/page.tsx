export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          🎵 Custom Spotify
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Votre application Spotify personnalisée est maintenant en ligne !
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-4">
            ✅ Déploiement réussi !
          </h2>
          <p className="text-gray-300">
            L&apos;application est maintenant hébergée sur Vercel. 
            Nous pouvons maintenant ajouter l&apos;authentification Spotify !
          </p>
        </div>
          </div>
    </div>
  );
}
