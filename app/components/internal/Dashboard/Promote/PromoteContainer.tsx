import React from 'react'
import PromoteOne from './PromoteOne';
import PromoteTwo from './PromoteTwo';

interface Props {
    width: string;
    theme: string | null
}

const PromoteContainer = ({ width, theme }: Props) => {
    const values = [
        { name: "Widgets", value: 0 },
        { name: "Drafts", value: 0 },
        { name: "Events", value: 0 },
    ]
    return (
        <div className='border border-[var(--border-color)] rounded-xl w-full overflow-hidden'>
            {width === "small" ? <PromoteOne theme={theme} values={values}/> : <PromoteTwo values={values}/>}
        </div>
    )
}

export default PromoteContainer