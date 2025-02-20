// import { Button } from "@/components/ui/button";
// import Text from "@/components/new-ui/Text";
// import { Tickets } from "@/types/events/events";
// import Link from "next/link";
// interface Props {
//   tickets: Tickets[];
// }
// const TicketDetails = ({ tickets }: Props) => {
//   return (
//     <ul className="flex flex-col gap-4 h-[200px]">
//       {tickets.map((ticket: Tickets) => {
//         const { currency, id, name, price, ticketUrl, type } = ticket;
//         return (
//           <li
//             key={id}
//             className="bg-[#FAFAFA] border border-[var(--neutral-light-color)] rounded-sm flex px-6 py-3 justify-between"
//           >
//             <div className="flex flex-col gap-2">
//               <Text size="large" fontWeight="medium" color="primary">
//                 {name}
//               </Text>
//               <p className="text-lg font-semibold text-[var(--primary-color)]">
//                 {price} USD
//               </p>
//               {/* <Text
//                 size="normal"
//                 fontWeight="medium"
//                 color="secondary"
//                 className="w-fit"
//               >
//                 {description}
//               </Text> */}
//             </div>
//             <Button className="p-4">
//               <Link href={ticketUrl ?? ""}>Buy Now</Link>
//             </Button>
//           </li>
//         );
//       })}
//     </ul>
//   );
// };
// export default TicketDetails;
