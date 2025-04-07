import Loading from "@/components/ui/Loading";

export function LoadingPage() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col">
      <Loading />
      <p className="text-2xl text-center text-[var(--primary-text-color)]">
        Redirecting to ...
      </p>
    </div>
  );
}
