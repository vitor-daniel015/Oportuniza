import React, { useId } from 'react';

type StarsProps = {
    value: number;
    size?: number;
    color?: string;
    emptyColor?: string;
    borderColor?: string;
};

export const Stars: React.FC<StarsProps> = ({
    value,
    size = 24,
    color = '#184671',
    emptyColor = 'transparent',
    borderColor = '#184671',
}) => {
    const uniqueId = useId();

    const estrelas = [];

    for (let index = 0; index < 5; index++) {
        const diff = value - index;
        let fillPercent = 0;

        if (diff >= 1) {
            fillPercent = 100;
        } else if (diff > 0) {
            fillPercent = diff * 100; 
        }

        const gradientId = `${uniqueId}-star-${index}`;

        estrelas.push(
            <svg
                key={index}
                width={size}
                height={size}
                viewBox="0 0 24 24"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ display: 'block', overflow: 'visible' }}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset={`${fillPercent}%`} stopColor={color} />
                        <stop offset={`${fillPercent}%`} stopColor={emptyColor} />
                    </linearGradient>
                </defs>

                <path
                    d="M12 2l2.9 6.26 6.86.82-5.06 4.7 1.34 6.82L12 17.27l-6.04 3.33 1.34-6.82-5.06-4.7 6.86-.82z"
                    fill={`url(#${gradientId})`}
                    stroke={borderColor}
                    strokeWidth={1.8}
                />
            </svg>
        );
    }

    return (
        <div className="inline-flex items-center gap-1">            
            {estrelas}
        </div>
    );
};
