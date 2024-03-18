// import React, {useEffect, useState} from 'react';
// import "./Orders.css";
// import OrdersTable from "../OrdersTable/OrdersTable";
// import {fetchAllOrdersForExcel, fetchOrders, setRowExpanded, setSearchCriteria} from "../../slices/orders.slice";
// import {useSelector} from 'react-redux';
// import {useDispatch, useDebounce} from "../../hooks";
// import * as XLSX from 'xlsx';
// import reset from "../../assets/1.png";
// import exel from "../../assets/2.png";
// import {selectUserId} from "../../slices";
// import {RootState} from "../../store/store";
// import {useLocation, useNavigate} from "react-router-dom";
//
// const Orders = () => {
//     const [searchName, setSearchName] = useState('');
//     const [searchSurname, setSearchSurname] = useState('');
//     const [searchEmail, setSearchEmail] = useState('');
//     const [searchPhone, setSearchPhone] = useState('');
//     const [searchAge, setSearchAge] = useState('');
//     const [searchCourse, setSearchCourse] = useState('');
//     const [searchFormat, setSearchFormat] = useState('');
//     const [searchType, setSearchType] = useState('');
//     const [searchStatus, setSearchStatus] = useState('');
//     const [searchGroup, setSearchGroup] = useState('');
//     const [searchStartDate, setSearchStartDate] = useState('');
//     const [searchEndDate, setSearchEndDate] = useState('');
//
//     const debouncedSearchName = useDebounce(searchName, 500);
//     const debouncedSearchSurname = useDebounce(searchSurname, 500);
//     const debouncedSearchEmail = useDebounce(searchEmail, 500);
//     const debouncedSearchPhone = useDebounce(searchPhone, 500);
//     const debouncedSearchAge = useDebounce(searchAge, 500);
//     const debouncedSearchCourse = useDebounce(searchCourse, 500);
//     const debouncedSearchFormat = useDebounce(searchFormat, 500);
//     const debouncedSearchType = useDebounce(searchType, 500);
//     const debouncedSearchStatus = useDebounce(searchStatus, 500);
//     const debouncedSearchGroup = useDebounce(searchGroup, 500);
//     const debouncedSearchStartDate = useDebounce(searchStartDate, 500);
//     const debouncedSearchEndDate = useDebounce(searchEndDate, 500);
//
//     const dispatch = useDispatch();
//     const currentUserId = useSelector(selectUserId);
//     const [isRotated, setIsRotated] = useState(false);
//     const [showMyOrders, setShowMyOrders] = useState(false);
//     const [animateDownload, setAnimateDownload] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const currentPage = useSelector((state: RootState) => state.orders.currentPage);
//     const sortBy = useSelector((state: RootState) => state.orders.sortBy);
//     const sortOrder = useSelector((state: RootState) => state.orders.sortOrder);
//
//
//     const handleMyOrdersChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const isChecked = e.target.checked;
//         setShowMyOrders(isChecked);
//         dispatch(setRowExpanded(null));
//     };
//
//     function updateSearchCriteriaFromURL() {
//         const searchParams = new URLSearchParams(location.search);
//         return {
//             name: searchParams.get('name') || '',
//             surname: searchParams.get('surname') || '',
//             email: searchParams.get('email') || '',
//             phone: searchParams.get('phone') || '',
//             age: searchParams.get('age') || '',
//             course: searchParams.get('course') || '',
//             format: searchParams.get('format') || '',
//             type: searchParams.get('type') || '',
//             status: searchParams.get('status') || '',
//             group: searchParams.get('group') || '',
//             start_date: searchParams.get('start_date') || '',
//             end_date: searchParams.get('end_date') || '',
//         };
//     }
//
//     useEffect(() => {
//         const searchCriteriaURL = updateSearchCriteriaFromURL();
//         setSearchName(searchCriteriaURL.name);
//         setSearchSurname(searchCriteriaURL.surname);
//         setSearchEmail(searchCriteriaURL.email);
//         setSearchPhone(searchCriteriaURL.phone);
//         setSearchAge(searchCriteriaURL.age);
//         setSearchCourse(searchCriteriaURL.course);
//         setSearchFormat(searchCriteriaURL.format);
//         setSearchType(searchCriteriaURL.type);
//         setSearchStatus(searchCriteriaURL.status);
//         setSearchGroup(searchCriteriaURL.group);
//         setSearchStartDate(searchCriteriaURL.start_date);
//         setSearchEndDate(searchCriteriaURL.end_date);
//     }, []);
//
//     const handleRotate = () => {
//         setIsRotated(!isRotated);
//
//         setSearchName('');
//         setSearchSurname('');
//         setSearchEmail('');
//         setSearchPhone('');
//         setSearchAge('');
//         setSearchCourse('');
//         setSearchFormat('');
//         setSearchType('');
//         setSearchStatus('');
//         setSearchGroup('');
//         setSearchStartDate('');
//         setSearchEndDate('');
//         setShowMyOrders(false);
//
//         const searchCriteria = {
//             name: '',
//             surname: '',
//             email: '',
//             phone: '',
//             age: '',
//             course: '',
//             format: '',
//             type: '',
//             status: '',
//             group: '',
//             start_date: '',
//             end_date: '',
//             manager: ''
//         };
//         dispatch(setSearchCriteria(searchCriteria));
//         dispatch(setRowExpanded(null));
//         dispatch(fetchOrders({
//             page: currentPage,
//             sortBy: "created_at",
//             sortOrder: "desc",
//             searchCriteria
//         }));
//
//         const queryParams = new URLSearchParams(location.search);
//         ['name', 'surname', 'email', 'phone', 'age', 'course', 'format', 'type', 'status', 'group', 'start_date', 'end_date', 'manager'].forEach(param => {
//             queryParams.delete(param);
//         });
//         navigate({
//             pathname: location.pathname,
//             search: `?${queryParams.toString()}`,
//         }, {replace: true});
//     };
//
//
//     useEffect(() => {
//         console.log("useEffect triggered");
//
//         const searchCriteriaURL = updateSearchCriteriaFromURL();
//
//         const searchCriteria = {
//             name: debouncedSearchName,
//             surname: debouncedSearchSurname,
//             email: debouncedSearchEmail,
//             phone: debouncedSearchPhone,
//             age: debouncedSearchAge,
//             course: debouncedSearchCourse,
//             format: debouncedSearchFormat,
//             type: debouncedSearchType,
//             status: debouncedSearchStatus,
//             group: debouncedSearchGroup,
//             start_date: debouncedSearchStartDate,
//             end_date: debouncedSearchEndDate,
//             ...(showMyOrders && currentUserId ? { manager: currentUserId } : {}),
//         };
//
//         console.log("Search Criteria:", searchCriteria);
//
//         const queryParams = new URLSearchParams(location.search);
//         queryParams.set('page', currentPage.toString());
//         queryParams.set('sortBy', sortBy);
//         queryParams.set('sortOrder', sortOrder);
//
//         console.log("Query Parameters:", queryParams.toString());
//
//
//         Object.entries(searchCriteria).forEach(([key, value]) => {
//             if (value !== null && value !== undefined && value.trim() !== '' && key !== 'manager') {
//                 queryParams.set(key, value);
//             } else {
//                 queryParams.delete(key);
//             }
//         });
//
//         navigate({
//             pathname: location.pathname,
//             search: `?${queryParams.toString()}`,
//         }, {replace: true});
//
//         dispatch(setSearchCriteria(searchCriteria));
//         dispatch(fetchOrders({
//             page: currentPage,
//             sortBy: "created_at",
//             sortOrder: "desc",
//             searchCriteria
//         }));
//
//         dispatch(setSearchCriteria(searchCriteriaURL));
//         dispatch(fetchOrders({
//             page: currentPage,
//             sortBy: "created_at",
//             sortOrder: "desc",
//             searchCriteria: searchCriteriaURL
//         }));
//     }, [debouncedSearchName, currentUserId, debouncedSearchSurname, debouncedSearchEmail,
//         debouncedSearchPhone, debouncedSearchAge, debouncedSearchCourse,
//         debouncedSearchFormat, debouncedSearchType, debouncedSearchStatus, debouncedSearchGroup,
//         debouncedSearchStartDate, debouncedSearchEndDate, showMyOrders, currentPage, sortBy, sortOrder, navigate, location.search, location.pathname, dispatch]);
//
//
//     const downloadExcel = async () => {
//         setAnimateDownload(true);
//         dispatch(fetchAllOrdersForExcel())
//             .unwrap()
//             .then((ordersArray) => {
//                 console.log("Orders Array:", ordersArray);
//                 const worksheet = XLSX.utils.json_to_sheet(ordersArray);
//                 const workbook = XLSX.utils.book_new();
//                 XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
//
//                 const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
//                 const data = new Blob([excelBuffer], {
//                     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//                 });
//                 const url = window.URL.createObjectURL(data);
//
//                 const link = document.createElement('a');
//                 link.href = url;
//                 link.setAttribute('download', 'AllOrders.xlsx');
//                 document.body.appendChild(link);
//                 link.click();
//
//                 document.body.removeChild(link);
//                 window.URL.revokeObjectURL(url);
//             })
//             .catch((error) => {
//                 console.error('Error downloading Excel file:', error);
//             });
//         setTimeout(() => setAnimateDownload(false), 500);
//     };
//
//     return (
//         <div className="orders">
//             <div className="search-fields-wrapper">
//                 <div className="search-fields">
//                     {[
//                         {label: "Name", value: searchName, onChange: setSearchName},
//                         {label: "Surname", value: searchSurname, onChange: setSearchSurname},
//                         {label: "Email", value: searchEmail, onChange: setSearchEmail},
//                         {label: "Phone", value: searchPhone, onChange: setSearchPhone},
//                         {label: "Age", value: searchAge, onChange: setSearchAge}
//                     ].map((field, index) => (
//                         <div className="search-field" key={index}>
//                             <input type="text" placeholder={field.label} value={field.value}
//                                    onChange={(e) => field.onChange(e.target.value)}/>
//                         </div>
//                     ))}
//                     {[
//                         {label: "Course", state: searchCourse, setState: setSearchCourse, options: ["", "QACX", "PCX", "JSCX", "JCX", "FS", "FE"]},
//                         {label: "Format", state: searchFormat, setState: setSearchFormat, options: ["", "static", "online"]},
//                         {label: "Type", state: searchType, setState: setSearchType, options: ["", "pro", "minimal", "vip", "incubator"]},
//                         {label: "Status", state: searchStatus, setState: setSearchStatus, options: ["", "cancelled", "completed", "dubbing", "in work", "pending"]},
//                         {label: "Group", value: searchGroup, onChange: setSearchGroup}
//                     ].map((field, index) => (
//                         <div className="search-field" key={index}>
//                             {field.options ? (
//                                 <select className="custom-select" value={field.state}
//                                         onChange={(e) => field.setState(e.target.value)}>
//                                     {field.options.map((option, index) => (
//                                         <option key={index} value={option}>{option || field.label}</option>
//                                     ))}
//                                 </select>
//                             ) : (
//                                 <input type="text" placeholder={field.label} value={field.value}
//                                        onChange={(e) => field.onChange(e.target.value)}/>
//                             )}
//                         </div>
//                     ))}
//                     <div className="search-field">
//                         <input type="date" value={searchStartDate}
//                                onChange={(e) => setSearchStartDate(e.target.value)}/>
//                     </div>
//                     <div className="search-field">
//                         <input type="date" value={searchEndDate} onChange={(e) => setSearchEndDate(e.target.value)}/>
//                     </div>
//                 </div>
//                 <div className="extra-filter">
//                     <input type="checkbox" id="my-orders" checked={showMyOrders} onChange={handleMyOrdersChange}/>
//                     <label htmlFor="my-orders">My</label>
//                     <div className="reset" onClick={handleRotate}>
//                         <img src={reset} alt="reset" className={isRotated ? "rotateBack" : "rotate"}
//                              onAnimationEnd={() => setIsRotated(false)}/>
//                     </div>
//                     <div className="exel" onClick={downloadExcel}>
//                         <img src={exel} alt="exel" className={animateDownload ? 'jump' : ''}/>
//                     </div>
//                 </div>
//             </div>
//             <OrdersTable/>
//         </div>
//     );
//
// };
//
// export default Orders;

import React, {useEffect, useState} from 'react';
import {OrdersTable } from '../';
import "./Orders.css";
import {
    fetchAllOrdersForExcel,
    fetchOrders,
    setRowExpanded,
    setSearchCriteria,
    selectUserId,
    resetSort, setSortBy
} from "../../slices";
import { useSelector} from 'react-redux';
import {useDebounce, useDispatch} from '../../hooks';
import * as XLSX from 'xlsx';
import reset from "../../assets/1.png";
import exel from "../../assets/2.png";
import {RootState} from "../../store/store";
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
    const currentPage = useSelector((state: RootState) => state.orders.currentPage);
    const sortBy = useSelector((state: RootState) => state.orders.sortBy);
    const sortOrder = useSelector((state: RootState) => state.orders.sortOrder);
    const handleMyOrdersChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setShowMyOrders(isChecked);
        dispatch(setRowExpanded(null));
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
        dispatch(resetSort());
    };

    useEffect(() => {
        const handleSort = (field: string) => {
            const newSortOrder = field === sortBy && sortOrder === 'asc' ? 'desc' : 'asc';
            dispatch(setSortBy({ field, sortOrder: newSortOrder }));
        };
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
            page: currentPage,
            sortBy: sortBy,
            sortOrder: sortOrder,
            searchCriteria
        }));
    }, [debouncedSearchName, debouncedSearchSurname, debouncedSearchEmail,
        debouncedSearchPhone, debouncedSearchAge, debouncedSearchCourse,
        debouncedSearchFormat, debouncedSearchType, debouncedSearchStatus, debouncedSearchGroup,
        debouncedSearchStartDate, debouncedSearchEndDate, showMyOrders, currentPage, dispatch]);

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
                        { label: "Status", state: searchStatus, setState: setSearchStatus, options: ["", "cancelled", "completed", "dubbing", "in work", "pending", "new"] },
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
                    <div className="search-field date-field">
                        <input type="date"  value={searchStartDate} onChange={(e) => setSearchStartDate(e.target.value)} />
                    </div>
                    <div className="search-field date-field">
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
