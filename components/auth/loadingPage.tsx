import Loading from "@/components/ui/Loading";

export function LoadingPage() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col">
      <Loading />
    </div>
  );
}
