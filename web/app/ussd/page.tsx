import USSDSimulator from "@/components/USSDSimulator";

export default function USSDPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">USSD Simulator</h1>
        <p className="mt-2 text-gray-600">
          Test the offline SMS/Phone capabilities of the Ogaal Platform.
        </p>
      </div>

      <div className="w-full max-w-4xl">
        <USSDSimulator />
      </div>
    </div>
  );
}
