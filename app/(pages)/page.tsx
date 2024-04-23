import Image from "next/image";
import styles from "./page.module.css";
import EmployeePage from "./employee/page";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main>  
      <EmployeePage/>
    </main>
  );
}
