import React from 'react'
import PromoteOne from './PromoteOne';
import PromoteTwo from './PromoteTwo';

interface Props {
    width: string;
}

const PromoteContainer = ({ width }: Props) => {
    const values = [
        { name: "Widgets", value: 0 },
        { name: "Drafts", value: 1 },
        { name: "Events", value: 0 },
    ]
    return (
        <div className='border border-[var(--border-color)] rounded-xl w-full'>
            {width === "small" ? <PromoteOne values={values}/> : <PromoteTwo values={values}/>}
        </div>
    )
}

export default PromoteContainer