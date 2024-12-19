import React, { ChangeEvent, Dispatch, SetStateAction } from 'react';

interface ColorInputProps {
    cor: string;
    setCor: Dispatch<SetStateAction<string>>;
    title: string;
}

function ColorInputx({ cor, setCor, title }: ColorInputProps) {
    const handleCorChange = (event: ChangeEvent<HTMLInputElement>) => {
        const novoValor = event.target.value;
        setCor(novoValor !== '' ? (novoValor.startsWith("#") ? novoValor : `#${novoValor}`) : '');
    };

    return (
        <div>
            <label htmlFor="corInput" style={{ fontFamily: 'Roboto', fontSize: '0.5rem', marginRight: '1rem', textTransform: 'uppercase'}}>
                {title}:
            </label>
            <br />
            <div style={{ display:'flex'}}>
                <input
                    style={{ height: '2rem', borderColor: '#8FE7D0', borderTopLeftRadius: '0.25rem', borderBottomLeftRadius: '0.25rem', width: '2rem' }}
                    type="color"
                    id="corInput"
                    value={cor}
                    onChange={handleCorChange}
                />
                <input
                    style={{width: '13rem', border: '1px solid #8FE7D0', height: '2rem', borderTopRightRadius: '0.25rem', paddingLeft:'0.5rem', borderBottomRightRadius: '0.25rem', fontFamily: 'Roboto', fontSize: '0.8rem' }}
                    type="text"
                    id="hexInput"
                    value={cor.replace("#", "")}
                    onChange={handleCorChange}
                />
            </div>
        </div>
    );
}

export default ColorInputx;
