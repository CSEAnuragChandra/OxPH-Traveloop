export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-orange-200" />
          <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-orange-50 flex items-center justify-center">
            <span className="text-orange-500 text-sm">✈</span>
          </div>
        </div>
        <p className="text-sm font-medium text-gray-400 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
