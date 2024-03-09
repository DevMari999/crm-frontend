import React, {useEffect, useState} from 'react';
import "./Orders.css";
import OrdersTable from "../OrdersTable/OrdersTable";
import {fetchAllOrdersForExcel, fetchOrders, setRowExpanded, setSearchCriteria} from "../../slices/orders.slice";
import { useSelector} from 'react-redux';
import {useDispatch} from "../../hooks/custom.hooks";
import {useDebounce} from '../../hooks/custom.hooks';
import * as XLSX from 'xlsx';
import reset from "../../assets/1.png";
import exel from "../../assets/2.png";
import { selectUserId } from "../../slices/auth.slice";
const Orders = () => {
    const [searchName, setSearchName] = useState('');
    const [searchSurname, setSearchSurname] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchPhone, setSearchPhone] = useState('');
    const [searchAge, setSearchAge] = useState('');
    const [searchCourse, setSearchCourse] = useState('');
    const [searchFormat, setSearchFormat] = useState('');
    const [searchType, setSearchType] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [searchGroup, setSearchGroup] = useState('');
    const [searchStartDate, setSearchStartDate] = useState('');
    const [searchEndDate, setSearchEndDate] = useState('');

    const debouncedSearchName = useDebounce(searchName, 500);
    const debouncedSearchSurname = useDebounce(searchSurname, 500);
    const debouncedSearchEmail = useDebounce(searchEmail, 500);
    const debouncedSearchPhone = useDebounce(searchPhone, 500);
    const debouncedSearchAge = useDebounce(searchAge, 500);
    const debouncedSearchCourse = useDebounce(searchCourse, 500);
    const debouncedSearchFormat = useDebounce(searchFormat, 500);
    const debouncedSearchType = useDebounce(searchType, 500);
    const debouncedSearchStatus = useDebounce(searchStatus, 500);
    const debouncedSearchGroup = useDebounce(searchGroup, 500);
    const debouncedSearchStartDate = useDebounce(searchStartDate, 500);
    const debouncedSearchEndDate = useDebounce(searchEndDate, 500);

    const dispatch = useDispatch();
    const currentUserId = useSelector(selectUserId);
    const [isRotated, setIsRotated] = useState(false);
    const [showMyOrders, setShowMyOrders] = useState(false);
    const [animateDownload, setAnimateDownload] = useState(false);

    const handleMyOrdersChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setShowMyOrders(isChecked);

    };

    const handleRotate = () => {
        setIsRotated(!isRotated);

        setSearchName('');
        setSearchSurname('');
        setSearchEmail('');
        setSearchPhone('');
        setSearchAge('');
        setSearchCourse('');
        setSearchFormat('');
        setSearchType('');
        setSearchStatus('');
        setSearchGroup('');
        setSearchStartDate('');
        setSearchEndDate('');
        setShowMyOrders(false);

        const searchCriteria = {
            name: '',
            surname: '',
            email: '',
            phone: '',
            age: '',
            course: '',
            format: '',
            type: '',
            status: '',
            group: '',
            start_date: '',
            end_date: ''
        };
        dispatch(setSearchCriteria(searchCriteria));
        dispatch(setRowExpanded(null));
        dispatch(fetchOrders({
            page: 1,
            sortBy: 'defaultField',
            sortOrder: 'asc',
            searchCriteria
        }));
    };

    useEffect(() => {
        const searchCriteria = {
            name: debouncedSearchName,
            surname: debouncedSearchSurname,
            email: debouncedSearchEmail,
            phone: debouncedSearchPhone,
            age: debouncedSearchAge,
            course: debouncedSearchCourse,
            format: debouncedSearchFormat,
            type: debouncedSearchType,
            status: debouncedSearchStatus,
            group: debouncedSearchGroup,
            start_date: debouncedSearchStartDate,
            end_date: debouncedSearchEndDate,
            ...(showMyOrders ? { manager: currentUserId } : {}),
        };
        dispatch(setSearchCriteria(searchCriteria));
        dispatch(fetchOrders({
            page: 1,
            sortBy: 'created_at',
            sortOrder: 'desc',
            searchCriteria
        }));
    }, [debouncedSearchName, debouncedSearchSurname, debouncedSearchEmail,
        debouncedSearchPhone, debouncedSearchAge, debouncedSearchCourse,
        debouncedSearchFormat, debouncedSearchType, debouncedSearchStatus, debouncedSearchGroup,
        debouncedSearchStartDate, debouncedSearchEndDate, showMyOrders, dispatch]);

    const downloadExcel = async () => {
        setAnimateDownload(true);
        dispatch(fetchAllOrdersForExcel())
            .unwrap()
            .then((ordersArray) => {
                console.log("Orders Array:", ordersArray);
                const worksheet = XLSX.utils.json_to_sheet(ordersArray);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

                const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
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
            });
        setTimeout(() => setAnimateDownload(false), 500);
    };

    return (
        <div className="orders">
            <div className="search-fields-wrapper">
                <div className="search-fields">
                    {[
                        { label: "Name", value: searchName, onChange: setSearchName },
                        { label: "Surname", value: searchSurname, onChange: setSearchSurname },
                        { label: "Email", value: searchEmail, onChange: setSearchEmail },
                        { label: "Phone", value: searchPhone, onChange: setSearchPhone },
                        { label: "Age", value: searchAge, onChange: setSearchAge }
                    ].map((field, index) => (
                        <div className="search-field" key={index}>
                            <input type="text" placeholder={field.label} value={field.value} onChange={(e) => field.onChange(e.target.value)} />
                        </div>
                    ))}
                    {[
                        { label: "Course", state: searchCourse, setState: setSearchCourse, options: ["", "QACX", "PCX", "JSCX", "JCX", "FS", "FE"] },
                        { label: "Format", state: searchFormat, setState: setSearchFormat, options: ["", "static", "online"] },
                        { label: "Type", state: searchType, setState: setSearchType, options: ["", "pro", "minimal", "vip", "incubator"] },
                        { label: "Status", state: searchStatus, setState: setSearchStatus, options: ["", "cancelled", "completed", "dubbing", "in work", "pending"] },
                        { label: "Group", value: searchGroup, onChange: setSearchGroup }
                    ].map((field, index) => (
                        <div className="search-field" key={index}>
                            {field.options ? (
                                <select className="custom-select" value={field.state} onChange={(e) => field.setState(e.target.value)}>
                                    {field.options.map((option, index) => (
                                        <option key={index} value={option}>{option || field.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <input type="text" placeholder={field.label} value={field.value} onChange={(e) => field.onChange(e.target.value)} />
                            )}
                        </div>
                    ))}
                    <div className="search-field">
                        <input type="date"  value={searchStartDate} onChange={(e) => setSearchStartDate(e.target.value)} />
                    </div>
                    <div className="search-field">
                        <input type="date"  value={searchEndDate} onChange={(e) => setSearchEndDate(e.target.value)} />
                    </div>
                </div>
                <div className="extra-filter">
                    <input type="checkbox" id="my-orders" checked={showMyOrders} onChange={handleMyOrdersChange} />
                    <label htmlFor="my-orders">My</label>
                    <div className="reset" onClick={handleRotate}>
                        <img src={reset} alt="reset" className={isRotated ? "rotateBack" : "rotate"} onAnimationEnd={() => setIsRotated(false)} />
                    </div>
                    <div className="exel" onClick={downloadExcel}>
                        <img src={exel} alt="exel" className={animateDownload ? 'jump' : ''} />
                    </div>
                </div>
            </div>
            <OrdersTable />
        </div>
    );

};

export default Orders;
