import Image from 'next/image';
import React from 'react';
import kosankuImg from '../public/assets/projects/kosanku.png';
import { RiRadioButtonFill } from 'react-icons/ri';
import Link from 'next/link';

const property = () => {
  return (
    <div className='w-full'>
      <div className='w-screen h-[50vh] relative'>
        <div className='absolute top-0 left-0 w-full h-[50vh] bg-black/70 z-10' />
        <Image
          className='absolute z-1'
          layout='fill'
          objectFit='cover'
          src={kosankuImg}
          alt='/'
        />
        <div className='absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2'>
          <h2 className='py-2'>Kosanku</h2>
          <h3>Java Spring Boot | Spring Security | Cloudinary | Heroku | Railway</h3>
        </div>
      </div>

      <div className='max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 py-8'>
        <div className='col-span-4'>
          <p>Project</p>
          <h2>Overview</h2>
          <p>
          This project is a backend development using the Java programming language and Spring-boot framework. It is final project for SYNRGY ACADEMY, where We were assigned to develop this app from start to finish.
          </p>
          
          <ul>Feature:</ul>
            <li>Feature A (Authentication): Provides list of authentication API (including oauth) using Spring Security and Thymeleaf</li>
<li>Feature B (Product): Provide search, filter and sorting product (kost), add favorite feature</li>
<li>Feature C (Transaction): Provides notification service, scheduler for deadline payment and report using Jasper Report</li>
          <a
            href='https://github.com/synrgy-final-project-team-a'
            target='_blank'
            rel='noreferrer'
          >
            <button className='px-8 py-2 mt-4 mr-8'>Code</button>
          </a>
          <a
            href='https://frontend-fsw.vercel.app/'
            target='_blank'
            rel='noreferrer'
          >
            <button className='px-8 py-2 mt-4'>Demo</button>
          </a>

          <a
            href='https://drive.google.com/drive/folders/1AhdiW-G7azeW6rQzyizf67gBMdM2d1W1'
            target='_blank'
            rel='noreferrer'
          >
            <button className='px-8 py-2 mt-4 ml-8'>Presentation</button>
          </a>
        </div>
        <div className='col-span-4 md:col-span-1 shadow-xl shadow-gray-100 rounded-xl py-4'>
          <div className='p-2'>
            <p className='text-center font-bold pb-2'>Technologies</p>
            <div className='grid grid-cols-3 md:grid-cols-1'>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Java
              </p>
                            <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Spring Boot
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Spring Security
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Cloudinary
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Hibernate
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Thymeleaf
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> PostgreSQL
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Heroku
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Railway
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Google API
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Jasper Report
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

export default property;
