import { type ClassValue, clsx } from 'clsx'


export function cn(...inputs: ClassValue[]) {
    // Since we aren't using Tailwind, twMerge might not be necessary but clsx is good.
    // Actually the user didn't want Tailwind, so twMerge is technically useless here 
    // unless I used it by habit. I'll just use clsx.
    return clsx(inputs)
}

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}
