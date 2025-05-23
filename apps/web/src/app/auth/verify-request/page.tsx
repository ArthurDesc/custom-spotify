export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900">
          Vérifiez votre email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Un lien de connexion a été envoyé à votre adresse email.
          <br />
          Cliquez sur ce lien pour vous connecter.
        </p>
      </div>
    </div>
  );
} 