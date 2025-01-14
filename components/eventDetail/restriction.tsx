import LockRestriction from "/public/lock_restriction.svg";
import Image from "next/image";

const Restriction = () => {
  return (
    <div className="">
      <Image src={LockRestriction} className="w-4 h-4 aspect-square" alt="Lock"/>
    </div>
  );
};
export default Restriction;
