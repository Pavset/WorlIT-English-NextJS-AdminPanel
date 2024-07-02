import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link'
export default function Home() {
  
  function handleSubmit() {
    
  }


  return (


  <div class="flex w-full bg-orange-600 h-30 justify-around">
    <p class="font-medium text-xl text-white">Головна</p>
    <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/courses`}>Курси</Link>
    <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/staff`}>Вчителя</Link>
    <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/users`}>Учені</Link>
    <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/modules`}>Модулі</Link>
    <Link class="font-normal text-xl text-white underline hover:no-underline" href={`/worldLists`}>Список слів</Link>
</div>

  );
}
