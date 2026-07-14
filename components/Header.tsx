import Image from 'next/image'
import Link from 'next/link'
import { Show } from '@clerk/nextjs'
import { Button } from './ui/button'
import UserMenu from './UserMenu'
import React from 'react'
import { FolderOpen, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'

const Header = async() => {

    await checkUser(); // Ensure the user is authenticated before rendering the header

    return (
        <header className='container mx-auto'>
            <nav className='py-6 px-4 flex justify-between items-center'>
                <Link href={"/"}>
                    <Image src={"/logo.png"}
                        alt='Reflect Logo'
                        width={200}
                        height={60}
                        className='h-10 w-auto object-center'
                    />
                </Link>
                <div className="flex items-center gap-4">
                    {/** Login and other Ctas */}
                    <Show when="signed-in">
                        <Link href="/dashboard#collections">
                        <Button variant="outline" className='cursor-pointer'>
                            <FolderOpen className='flex items-center gap-2' />
                            <span className='hidden md:inline'>Collections</span>
                        </Button>
                    </Link>
                        {/* <UserButton /> */}
                    </Show>

                    <Link href="/journal/write">
                        <Button variant="journal" className='cursor-pointer'>
                            <PenBox className='flex items-center gap-2' />
                            <span className='hidden md:inline cursor-pointer'>Write New</span>
                        </Button>
                    </Link>


                    <Show when="signed-out">
                        <Button asChild variant="outline">
                            <Link href="/sign-in">Login</Link>
                        </Button>
                    </Show>

                    <Show when="signed-in">
                        <UserMenu/>
                    </Show>

                </div>
            </nav>
        </header>
    )
}

export default Header