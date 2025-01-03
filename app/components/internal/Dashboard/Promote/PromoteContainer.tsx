import React from 'react'
import PromoteOne from './PromoteOne';
import PromoteTwo from './PromoteTwo';

interface Props {
    width: string;
    theme: string | null
    promoteData : { name: string, value: number }[]
}

const PromoteContainer = ({ width, theme, promoteData }: Props) => {
    // const values = [
    //     { name: "Widgets", value: 0 },
    //     { name: "Drafts", value: 1 },
    //     { name: "Events", value: 0 },
    // ]
    return (
        <div className='border border-[var(--border-color)] rounded-xl w-full overflow-hidden'>
            {width === "small" ? <PromoteOne theme={theme} values={promoteData}/> : <PromoteTwo values={promoteData}/>}
        </div>
    )
}

export default PromoteContainer