import React from 'react';

interface HighlightProps {
    text: string;
    searchTerm: string;
}

const HighlightedText: React.FC<HighlightProps> = ({ text, searchTerm }) => {
    if (!searchTerm) return <>{text}</>;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return (
    <span>
        {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={index} style={{ color: 'red', fontWeight: 'bold' }}>
            {part}
            </span>
        ) : (
            <span key={index}>{part}</span>
        )
        )}
    </span>
    );
};

export default HighlightedText;
