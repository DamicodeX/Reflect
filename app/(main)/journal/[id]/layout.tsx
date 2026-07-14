import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense } from 'react'
import {BarLoader} from "react-spinners";
const JournalLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div>
                <Link
                    href="/dashboard"
                    className="text-sm text-orange-600 hover:text-orange-700 cursor-pointer flex items-center mb-4"
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />   Back to Dashboard
                </Link>
            </div>
            <Suspense fallback={<BarLoader color="orange" width={"100%"} />}>{children}</Suspense>
        </div>
    )
}

export default JournalLayout