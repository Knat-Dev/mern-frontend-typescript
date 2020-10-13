import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Textarea,
} from '@chakra-ui/core';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
    variant?: 'input' | 'textarea';
};

const InputField: React.FC<Props> = (props) => {
    const [field, { error }] = useField(props.name);

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
            {props.variant === 'textarea' ? (
                <Textarea {...field} type={props.type} id={field.name} />
            ) : (
                <Input {...field} type={props.type} id={field.name} />
            )}
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>
    );
};

export default InputField;
