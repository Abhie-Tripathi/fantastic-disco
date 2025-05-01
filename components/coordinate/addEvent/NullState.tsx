import fetchIcon from "@/public/internal/fetch_icon.svg";
import Image from "next/image";
import NullImage from "@/public/addEventNullState.svg";

const NullState = () => {
  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="my-2">
        <div className="flex gap-1 mb-1">
          <Image src={fetchIcon} height={18} width={18} alt="loading" />
          <span className="font-medium text-base">
            Fetching Unsuccessful, But No Worries!
          </span>
        </div>
        <div className="text-sm text-[var(--secondary-text-color)]">
          You can review your file/link and try again, or manually add your
          event to get started.
        </div>
      </div>
      <div className="flex flex-col gap-6 items-center my-8">
        <Image src={NullImage} alt="no events found" />
        <div className="text-[var(--tertiary-text-color)] text-sm font-semibold">
          Couldn&apos;t fetch the Events
        </div>
      </div>
    </div>
  );
};

export default NullState;
