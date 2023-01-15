import React, { useMemo, useRef, useState } from 'react';
import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd/es/select';
import debounce from 'lodash/debounce';
import axios from 'axios';

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    route: string,
    debounceTimeout?: number;
    setValue: any
}

interface SelectValue {
    label: string;
    value: string;
}

export function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ setValue,route, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const fetchRef = useRef(0);

    function fetchUserList(searchValue: string): Promise<SelectValue[]> {

        return axios.post(route + '/list', { type: 'select', search: searchValue.trim() })
            .then((result) =>
                result.data
            );
    }

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {

            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);

            fetchUserList(value).then((newOptions: any) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchUserList, debounceTimeout]);

    return (
        <Select
            style={{ width: '100%' }}
            labelInValue
            onChange={setValue}
            filterOption={false}
            showSearch={true}
            onSearch={debounceFetcher}
            onFocus={(e) => debounceFetcher('')}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            options={options}
        />
    );
}

