import Image from 'next/image';
import React from 'react';
import aeonImg from '../public/assets/projects/aeon.png';
import { RiRadioButtonFill } from 'react-icons/ri';
import Link from 'next/link';

const aeon = () => {
  return (
    <div className='w-full'>
      <div className='w-screen h-[50vh] relative'>
        <div className='absolute top-0 left-0 w-full h-[50vh] bg-black/70 z-10' />
        <Image
          className='absolute z-1'
          layout='fill'
          objectFit='cover'
          src={aeonImg}
          alt='/'
        />
        <div className='absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2'>
          <h2 className='py-2'>Virtual Internship Experience (AEON Credit Service)</h2>
          <h3>Java Spring Boot | REST API | Spring Security</h3>
        </div>
      </div>

      <div className='max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 py-8'>
        <div className='col-span-4'>
          <p>Project</p>
          <h2>Overview</h2>
          <p className='text-justify'>
            This is a final project of one month virtual internship provided by AEON Credit Services and Rakamin Academy. Build a REST API for HRIS using java spring boot and many other technologies. The project is divided into 3 phases, each phase has a different task. The first phase is to build a REST API for HRIS, the second phase is to build a REST API for the company’s internal system, and the third phase is to build a REST API for the company’s internal system and integrate it with the first phase.   
          </p>
          <a
            href='https://github.com/junkevin88/AEON-Backend-Java'
            target='_blank'
            rel='noreferrer'
          >
            <button className='px-8 py-2 mt-4 mr-8'>Code</button>
          </a>

        </div>
        <div className='col-span-4 md:col-span-1 shadow-xl shadow-gray-100 rounded-xl py-4'>
          <div className='p-2'>
            <p className='text-center font-bold pb-2'>Technologies</p>
            <div className='grid grid-cols-3 md:grid-cols-1 '>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Java
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Spring Boot
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Postman
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Hibernate
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Spring Security
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> REST API
              </p>
            </div>
          </div>
        </div>
        <Link href='/#projects'>
          <p className='underline cursor-pointer'>Back</p>
        </Link>
      </div>
    </div>
  );
};

export default aeon;
