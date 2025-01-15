import LockRestriction from "/public/lock_restriction.svg";
import Image from "next/image";

const Restriction = () => {
  return (
    <div className="z-100 absolute -top-3 right-0 p-2 shadow-md border border-[var(--neutral-light-color)] rounded-md bg-white">
      <Image
        src={LockRestriction}
        className="w-4 h-4 aspect-square "
        alt="Lock"
      />
    </div>
  );
};
export default Restriction;
