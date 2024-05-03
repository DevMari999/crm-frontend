import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {useDebouncedSearchFields, useDispatch} from "../../hooks"
import { OrdersTable } from '../';
import "./Orders.css";
import {
    setRowExpanded,
    setSearchCriteria,
    selectUserId,
    resetSort,
} from "../../store/slices";
import {
    fetchAllOrdersForExcel,
    fetchOrders,
} from '../../store/thunk';
import * as XLSX from 'xlsx';
import resetImg from "../../assets/1.png";
import exelImg from "../../assets/2.png";
import { RootState } from "../../store/store";
import {FieldDefinition} from "../../types";

const Orders = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();

    const [isRotated, setIsRotated] = useState(false);
    const [showMyOrders, setShowMyOrders] = useState(false);
    const [animateDownload, setAnimateDownload] = useState(false);
    const currentUserId = useSelector(selectUserId);
    const currentPage = useSelector((state: RootState) => state.orders.currentPage);
    const sortBy = useSelector((state: RootState) => state.orders.sortBy);
    const sortOrder = useSelector((state: RootState) => state.orders.sortOrder);
    const searchCriteria = useSelector((state: RootState) => state.orders.searchCriteria);

    const searchFields = {
        name: searchParams.get('name') || '',
        surname: searchParams.get('surname') || '',
        email: searchParams.get('email') || '',
        phone: searchParams.get('phone') || '',
        age: searchParams.get('age') || '',
        course: searchParams.get('course') || '',
        format: searchParams.get('format') || '',
        type: searchParams.get('type') || '',
        status: searchParams.get('status') || '',
        group: searchParams.get('group') || '',
        start_date: searchParams.get('start_date') || '',
        end_date: searchParams.get('end_date') || '',
    };
    const debouncedSearchFields = useDebouncedSearchFields(searchFields);

    const handleSearchChange = (key: string, value: string | undefined) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (value) {
            newSearchParams.set(key, value);
        } else {
            newSearchParams.delete(key);
        }
        newSearchParams.set('page', '1');
        setSearchParams(newSearchParams, { replace: true });

    };


    useEffect(() => {
        const searchCriteria: Record<string, any> = {
            ...debouncedSearchFields,
            ...(showMyOrders ? { manager: currentUserId } : {})
        };

        dispatch(setSearchCriteria(searchCriteria));
        dispatch(fetchOrders({
            page: currentPage,
            sortBy,
            sortOrder,
            searchCriteria
        }));
    }, [debouncedSearchFields, showMyOrders, currentPage, sortBy, sortOrder]);


    const handleRotate = () => {
        setIsRotated(!isRotated);
        setShowMyOrders(false);
        setSearchParams({}, { replace: true });
        dispatch(setRowExpanded(null));
        dispatch(resetSort());
    };

    const downloadExcel = async () => {
        setAnimateDownload(true);
        dispatch(fetchAllOrdersForExcel())
            .unwrap()
            .then((ordersArray) => {
                const worksheet = XLSX.utils.json_to_sheet(ordersArray);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const url = window.URL.createObjectURL(data);

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'AllOrders.xlsx');
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('Error downloading Excel file:', error);
            })
            .finally(() => {
                setAnimateDownload(false);
            });
    };
    const toggleShowMyOrders = (isChecked: boolean) => {
        setShowMyOrders(isChecked);

        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', '1');
        setSearchParams(newSearchParams, { replace: true });

        dispatch(setSearchCriteria({ ...searchCriteria, manager: isChecked ? currentUserId : undefined }));
        dispatch(fetchOrders({
            page: 1,
            sortBy,
            sortOrder,
            searchCriteria: { ...searchCriteria, manager: isChecked ? currentUserId : undefined }
        }));
    };

    const fieldDefinitions: FieldDefinition[] = [
        { label: "Name", param: 'name' },
        { label: "Surname", param: 'surname' },
        { label: "Email", param: 'email' },
        { label: "Phone", param: 'phone' },
        { label: "Age", param: 'age' },
        { label: "Course", param: 'course', options: ["", "QACX", "PCX", "JSCX", "JCX", "FS", "FE"] },
        { label: "Format", param: 'format', options: ["", "static", "online"] },
        { label: "Type", param: 'type', options: ["", "pro", "minimal", "vip", "incubator"] },
        { label: "Status", param: 'status', options: ["", "cancelled", "completed", "dubbing", "in work", "pending", "new"] },
        { label: "Group", param: 'group' }
    ];

    return (
        <div className="orders">
            <div className="search-fields-wrapper">
                <div className="search-fields">
                    {fieldDefinitions.map((field) => (
                        <div className="search-field" key={field.label}>
                            {field.options ? (
                                <select
                                    className="custom-select"
                                    value={searchFields[field.param]}
                                    onChange={(e) => handleSearchChange(field.param, e.target.value)}
                                >
                                    {field.options.map((option, index) => (
                                        <option key={index} value={option}>{option || field.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    placeholder={field.label}
                                    value={searchFields[field.param]}
                                    onChange={(e) => handleSearchChange(field.param, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                    <div className="search-field date-field">
                        <input
                            type="date"
                            value={searchFields.start_date}
                            onChange={(e) => handleSearchChange('start_date', e.target.value)}
                        />
                    </div>
                    <div className="search-field date-field">
                        <input
                            type="date"
                            value={searchFields.end_date}
                            onChange={(e) => handleSearchChange('end_date', e.target.value)}
                        />
                    </div>
                </div>
                <div className="extra-filter">
                    <input
                        type="checkbox"
                        id="my-orders"
                        checked={showMyOrders}
                        onChange={(e) => toggleShowMyOrders(e.target.checked)}
                    />
                    <label htmlFor="my-orders">My</label>
                    <div className="reset" onClick={handleRotate}>
                        <img src={resetImg} alt="reset" className={isRotated ? "rotateBack" : "rotate"}
                             onAnimationEnd={() => setIsRotated(false)}
                        />
                    </div>
                    <div className="exel" onClick={downloadExcel}>
                        <img src={exelImg} alt="exel" className={animateDownload ? 'jump' : ''}/>
                    </div>
                </div>
            </div>
            <OrdersTable/>
        </div>
    );


};

export default Orders;
