import LockRestriction from "/public/lock_restriction.svg";
import Image from "next/image";
import clsx from "clsx";

const Restriction = ({ className = "" }) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-center p-2 border border-[var(--neutral-light-color)] rounded-md bg-white shadow-md w-8 h-8 aspect-square",
        className
      )}
    >
      <Image src={LockRestriction} alt="Lock" />
    </div>
  );
};
export default Restriction;