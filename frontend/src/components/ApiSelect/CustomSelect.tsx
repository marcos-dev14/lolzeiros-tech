import React, { useState, useRef } from 'react';
import Select, { components } from 'react-select';
import { api } from '@/src/services/api';
import { TableActionButton } from '@/src/styles/components/tables';
import { ReactComponent as SearchIcon } from '~assets/right_arrow.svg';

interface OptionType {
    value: string;
    label: string;
}

interface CustomSelectProps {
    route: string;
    newKey: string;
    custom?: string;
    label: string;
    id?: string;
    onChange: (selectedOption: OptionType | null) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ newKey, label, route, onChange, custom, id }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [options, setOptions] = useState<OptionType[]>([]);
    const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
    const selectRef = useRef<any>(null);

    const fetchData = async () => {
        try {
            const paramsObject: { [key: string]: string } = {};

            if (inputValue) {
                paramsObject[newKey] = inputValue;
            }

            if (custom && id) {
                paramsObject[custom] = id;
            }

            const response = await api.get(`${route}`, {
                params:  paramsObject
            });
            let data = response.data.data;

            if (custom || label === 'Razão Social' || label === 'Grupo') {
                data = response.data.data.data;
            }

            const formattedOptions: OptionType[] = data.map((item: any) => ({
                value: item.id,
                label: (
                    <div>
                        {item.name || item.title || item.company_name}
                        {item.company_name && (
                            <>
                                <br />
                                {item.document}
                            </>
                        )}
                    </div>
                )
            }));

            setOptions(formattedOptions);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    const handleInputChange = (value: string) => {
        setInputValue(value);
    };

    const handleMenuOpen = () => {
        setIsSelectOpen(true);
    };

    const handleMenuCloseAfterSelect = () => {
        setIsSelectOpen(false);
        fetchData();
    };

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            width: '15rem',
            borderColor: '#DBDFEB',
            fontSize: '0.75rem',
            color: '#b5b7bf',
        })
    };

    const CustomMenu = (props: any) => {
        const { innerRef, innerProps } = props;
        return (
            <components.Menu {...props}>
                <div ref={innerRef} {...innerProps}>
                    {props.children}
                    <TableActionButton onClick={handleMenuCloseAfterSelect}>
                            <SearchIcon style={{background: '#157fba'}}/>
                    </TableActionButton>
                </div>
            </components.Menu>
        );
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem'
        }}>
            <label style={{
                fontSize: '0.5rem',
                textTransform: 'uppercase',
                fontFamily: 'Roboto',
                fontWeight: 'bold'
            }}>{label}</label>
            <Select
                ref={selectRef}
                options={options}
                onInputChange={handleInputChange}
                inputValue={inputValue}
                placeholder="Digite algo..."
                onMenuOpen={handleMenuOpen}
                components={{ Menu: CustomMenu }}
                styles={customStyles}
                onChange={onChange}
            />
        </div>
    );
};

export default CustomSelect;
