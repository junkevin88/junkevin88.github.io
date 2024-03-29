import Image from 'next/image';
import React from 'react';
import auditcampImg from '../public/assets/projects/auditcamp.png';
import { RiRadioButtonFill } from 'react-icons/ri';
import Link from 'next/link';

const auditcamp = () => {
  return (
    <div className='w-full'>
      <div className='w-screen h-[50vh] relative'>
        <div className='absolute top-0 left-0 w-full h-[50vh] bg-black/70 z-10' />
        <Image
          className='absolute z-1'
          layout='fill'
          objectFit='cover'
          src={auditcampImg}
          alt='/'
        />
        <div className='absolute top-[70%] max-w-[1240px] w-full left-[50%] right-[50%] translate-x-[-50%] translate-y-[-50%] text-white z-10 p-2'>
          <h2 className='py-2'>Auditcamp</h2>
          <h3>Laravel | Midtrans | Heroku</h3>
        </div>
      </div>

      <div className='max-w-[1240px] mx-auto p-2 grid md:grid-cols-5 gap-8 py-8'>
        <div className='col-span-4'>
          <p>Project</p>
          <h2>Overview</h2>
          <p className='text-justify'>
            This appplication was built using laravel and is styled with
            Tailwind CSS. The application will be hosted using Heroku.
            This is a bootcamp website for student who wanna learn much more about finance, accounting and tax. Users need to be
            authenticated with google account. A few features to note with this project are payment gateway using xendit, search discovery using eloquent (ORM), and all of the project is using laravel blade template.
          </p>
          <a
            href='https://github.com/junkevin88/AuditCamp'
            target='_blank'
            rel='noreferrer'
          >
            <button className='px-8 py-2 mt-4'>Code</button>
          </a>

        </div>
        <div className='col-span-4 md:col-span-1 shadow-xl shadow-gray-100 rounded-xl py-4'>
          <div className='p-2'>
            <p className='text-center font-bold pb-2'>Technologies</p>
            <div className='grid grid-cols-3 md:grid-cols-1'>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> PHP
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Laravel
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Tailwind
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Blade Template
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Laravel Breeze
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Laravel Socialite
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Midtrans
              </p>
              <p className='text-gray-100 py-2 flex items-center'>
                <RiRadioButtonFill className='pr-1' /> Heroku
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

export default auditcamp;
