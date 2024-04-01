import {useState, useEffect, useRef} from 'react';
import {useDispatch as reduxUseDispatch} from 'react-redux';
import type {AppDispatch} from '../store/store';
import {SearchFields} from "../types";

export function useDebouncedSearchFields(searchFields: SearchFields): SearchFields {
    const [debouncedFields, setDebouncedFields] = useState<SearchFields>(searchFields);
    const prevFieldsRef = useRef<SearchFields>(searchFields);

    useEffect(() => {
        const fieldsChanged = Object.keys(searchFields).some(key => {
            const fieldKey = key as keyof SearchFields;
            return searchFields[fieldKey] !== prevFieldsRef.current[fieldKey];
        });

        if (fieldsChanged) {
            const handler = setTimeout(() => {
                setDebouncedFields(searchFields);
                prevFieldsRef.current = searchFields;
            }, 500);

            return () => clearTimeout(handler);
        }
    }, [searchFields]);

    return debouncedFields;
}

export const useDispatch = () => reduxUseDispatch<AppDispatch>();
