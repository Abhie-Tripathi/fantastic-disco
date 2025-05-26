"use client";
import React,{useEffect} from 'react'
import styles from "./page.style.module.css";
import Image from 'next/image';
import userOne from '/public/userOne.svg'
import Filters from "@/app/components/internal/trackers/Filters"
const Page = () => {
  useEffect(() => {
   
    //  if(document.body.classList.contains(styles.bodyOverflowHidden))
    //   document.body.classList.remove(styles.bodyOverflowHidden);
     if(document.body.style.height==='100vh'){
      document.body.style.height="";
     }
  
  }, []);
  
  return (
    <div className="flex flex-col gap-6 items-center mb-6 w-full">
      
      <Filters/>
      {/* Lorem ipsum dolor sit amet consectetur, adipisicing elit. Architecto rerum tempore cumque a, cum, qui omnis totam beatae esse laboriosam nisi aut fugit officia quasi dolore sed cupiditate obcaecati nulla.
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eligendi, blanditiis. Quidem voluptatum, nihil voluptate porro repudiandae adipisci, esse ad saepe ipsam ipsa incidunt dolorem doloribus sunt non quibusdam unde explicabo. Distinctio quibusdam nihil ea dolore earum culpa cumque cum non magni iusto recusandae quae vero nisi neque accusamus quidem, perspiciatis exercitationem. Debitis quaerat doloremque architecto quo nisi minus voluptatibus est velit ut fugit corrupti perspiciatis natus recusandae officiis asperiores, aperiam nostrum eum necessitatibus, quibusdam modi accusantium tempora, maiores in nulla! Eaque delectus aut nam adipisci tempora esse corporis laudantium dicta nihil, enim quas suscipit voluptates molestias maiores accusamus facere culpa autem omnis accusantium reprehenderit beatae obcaecati vel perferendis officia. Esse iste voluptatum veritatis aliquid velit sapiente culpa deleniti quod tenetur ratione corrupti, repellendus itaque porro debitis, eaque ad, tempora saepe facere corporis aperiam. Natus, a. Aspernatur, quia labore. Aspernatur blanditiis eum quis, voluptatibus, voluptatem explicabo perferendis ut natus quam recusandae repellendus asperiores. Officia veritatis provident sapiente excepturi cumque ipsa, a exercitationem. Vel saepe optio ipsum eaque eveniet nemo eius illo similique, doloremque animi officiis laudantium inventore quis accusantium, sapiente cum beatae quo error nihil accusamus temporibus provident unde sint dolor? Blanditiis quasi saepe nam expedita laudantium suscipit non atque quae. */}
    </div>
  )
}

export default Page

