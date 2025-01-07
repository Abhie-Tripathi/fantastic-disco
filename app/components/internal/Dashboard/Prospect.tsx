import React from 'react'
import Image from 'next/image';
import ProspectModule from '/public/internal/dashboard/ProspectModule.png'
import ProspectModuleDark from '/public/internal/dashboard/ProspectModuleDark.png'

interface Props{
    theme: string | null
}

const Prospect = ({theme} : Props) => {
    return (
        <div className="bg-[var(--background-secondary-color)] border border-[var(--border-color)] flex flex-col items-center justify-start w-full min-h-[271px] rounded-xl">
            <div className={`flex flex-col items-center justify-center p-4`}>
                <div className="text-[var(--primary-color)] font-semibold text-xs">
                    Personalized Prospecting
                </div>
                <div className="text-[var(--bold-border-color)] text-xs mt-2 text-center min-h-[50px] max-h-[50px] overflow-hidden text-ellipsis">
                    Say goodbye to generic outreach. Our platform utilizes cutting-edge AI to automate prospecting.
                </div>
                <button className='text-white text-[10px] rounded-lg bg-gradient-to-r from-[#8C67E2] via-[#946DF0] via-[#E87D83] via-[#F2AB7F] to-[#FFC899] px-3 py-2 mt-3'>Coming Soon</button>
            </div>
            <Image
                className={`min-w-[166px] min-h-[117px]`}
                src={theme === "dark" ? ProspectModuleDark :ProspectModule}
                alt="research"
                width={166}
                height={117}
                unoptimized
                // style={{ marginTop: 20 }}
            />
        </div>
    );
}

export default Prospect