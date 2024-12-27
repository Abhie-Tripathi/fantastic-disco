import React from 'react'
import PromoteOne from './PromoteOne';
import PromoteTwo from './PromoteTwo';

interface Props {
    width: string;
}

const PromoteContainer = ({ width }: Props) => {
    const values = [
        { name: "Widgets", value: 1 },
        { name: "Drafts", value: 0 },
        { name: "Events", value: 0 },
    ]
    return (
        <div className='bg-[var(--background-secondary-color)] border border-[var(--border-color)] rounded-xl w-fit'>
            {width === "small" ? <PromoteOne values={values}/> : <PromoteTwo values={values}/>}
        </div>
    )
}

export default PromoteContainer