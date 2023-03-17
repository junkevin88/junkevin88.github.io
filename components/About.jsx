import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AboutImg from '../public/assets/about.jpeg';

const About = () => {
  return (
    <div id='about' className='w-full md:h-screen p-2 flex items-center py-16'>
      <div className='max-w-[1240px] m-auto md:grid grid-cols-3 gap-8'>
        <div className='col-span-2'>
          <p className='uppercase text-xl tracking-widest text-[#ff69b4]'>
            About
          </p>
          <h2 className='py-4'>Who I Am</h2>
          <p className='py-2 text-gray-300 text-justify'>
          Jun Kevin is a recent accounting graduate with a deep understanding of accounting, finance, and taxation. He is skilled in Java (Spring Boot), PHP (Laravel), and JavaScript (React.js, Next.js, Node.js), with experience in Enterprise Resource Planning and FAT (Finance, Accounting and Tax).
          </p>
          <p className='py-2 text-gray-300 text-justify'>
          He is passionate about programming and interested in pursuing a career in IT roles. With strong problem-solving abilities and a willingness to learn, he is a valuable asset to any technical team. Currently, he is seeking opportunities to combine his programming skills and accounting knowledge to excel in a career as a programmer, analyst, or consultant.
          </p>
          <Link href='/#projects' scroll = {false}>
            <p className='py-2 text-gray-300 underline cursor-pointer'>
              Check out some of my latest projects.
            </p>
          </Link>
        </div>
        <div className='w-full h-auto m-auto shadow-xl shadow-gray-300 rounded-xl flex items-center justify-center p-4 hover:scale-105 ease-in duration-300'>
          <Image src={AboutImg} className='rounded-xl' alt='/' />
        </div>
      </div>
    </div>
  );
};

export default About;
