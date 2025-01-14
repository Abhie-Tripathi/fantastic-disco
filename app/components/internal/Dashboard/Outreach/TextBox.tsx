import React from 'react'

interface Props {
    user: string;
    text: string | undefined;
}

const TextBox = ({ user, text }: Props) => {
    return (
        <div className={`
            ${user === "they" ?
                "bg-[var(--primary-foreground)] rounded-tl-lg rounded-tr-lg rounded-br-lg" :
                "bg-[var(--accent-color)] rounded-tl-lg rounded-tr-lg rounded-bl-lg"}
                p-2 w-[80%]
        `}>
            <div className={`text-[10px] ${user === "they" ? "text-[var(--primary-text-color)]" : "text-[var(--secondary-text-color)]"}`}>{text}</div>
        </div>
    )
}

export default TextBox