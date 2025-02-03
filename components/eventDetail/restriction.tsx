import LockRestriction from "/public/lock_restriction.svg";
import Image from "next/image";

const Restriction = () => {
  return (
    <div className="flex items-center justify-center p-2 border border-[var(--neutral-light-color)] rounded-md bg-white shadow-md w-8 h-8 aspect-square">
      <Image src={LockRestriction} alt="Lock" />
    </div>
  );
};
export default Restriction;
