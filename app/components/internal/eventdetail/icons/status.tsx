interface Prop {
    fillColor: string,
    borderColor: string
}
export default function StatusIcon({fillColor, borderColor}: Prop) {
    return (
        <svg
            width="100%"
            height="51"
            viewBox="0 0 360 51"
            fill={fillColor}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0.5 19.9966C0.5 15.2684 0.501062 11.7726 0.861658 9.09049C1.22032 6.42279 1.9264 4.63515 3.28249 3.27907C4.63857 1.92299 6.42621 1.2169 9.09391 0.85824C11.776 0.497644 15.2718 0.496582 20 0.496582H341.301L356.161 20.6362C356.997 21.7691 357.599 22.5854 357.997 23.2786C358.389 23.9606 358.558 24.4795 358.563 25.0101C358.568 25.5406 358.409 26.0626 358.03 26.7518C357.644 27.4524 357.058 28.2798 356.244 29.4282L341.295 50.5037L19.9996 50.497C15.2715 50.4969 11.7757 50.4958 9.09371 50.1351C6.42607 49.7764 4.63846 49.0703 3.28242 47.7142C1.92637 46.3582 1.2203 44.5705 0.861649 41.9029C0.501062 39.2209 0.5 35.7251 0.5 30.997V19.9966Z"
                fill={fillColor}
                stroke={borderColor}
                stroke-width="1px"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_254_3527"
                    x1="-11.3058"
                    y1="25.4966"
                    x2="368.331"
                    y2="25.4966"
                    gradientUnits="userSpaceOnUse"
                >
                </linearGradient>
            </defs>
        </svg>
    );
}