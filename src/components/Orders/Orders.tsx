import React, {useEffect, useState} from 'react';
import "./Orders.css";
import OrdersTable from "../OrdersTable/OrdersTable";
import {AppDispatch} from "../../store/store";
import {fetchOrders, setSearchCriteria} from "../../slices/orders.slice";
import {useDispatch} from 'react-redux';
import {useDebounce} from '../../hooks/custom.hooks';
// @ts-ignore
import reset from "../../assets/1.png";
// @ts-ignore
import exel from "../../assets/2.png";
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

    const dispatch = useDispatch<AppDispatch>();
    const [isRotated, setIsRotated] = useState(false);

    const handleRotate = () => {
        setIsRotated(!isRotated);
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
            end_date: debouncedSearchEndDate
        };
        dispatch(setSearchCriteria(searchCriteria));
        dispatch(fetchOrders({
            page: 1,
            sortBy: 'defaultField',
            sortOrder: 'asc',
            searchCriteria
        }));
    }, [debouncedSearchName, debouncedSearchSurname, debouncedSearchEmail,
        debouncedSearchPhone, debouncedSearchAge, debouncedSearchCourse,
        debouncedSearchFormat, debouncedSearchType, debouncedSearchStatus, debouncedSearchGroup,
        debouncedSearchStartDate, debouncedSearchEndDate, dispatch]);

    return (
        <div className="orders">
            <div className="search-fields-wrapper">
                <div className="search-fields">
                    <div className="search-field">
                        <input type="text" placeholder="Name" value={searchName}
                               onChange={(e) => setSearchName(e.target.value)}/>
                    </div>
                    <div className="search-field">
                        <input type="text" placeholder="Surname" value={searchSurname}
                               onChange={(e) => setSearchSurname(e.target.value)}/>
                    </div>
                    <div className="search-field">
                        <input type="text" placeholder="Email" value={searchEmail}
                               onChange={(e) => setSearchEmail(e.target.value)}/>
                    </div>
                    <div className="search-field">
                        <input type="text" placeholder="Phone" value={searchPhone}
                               onChange={(e) => setSearchPhone(e.target.value)}/>
                    </div>
                    <div className="search-field">
                        <input type="text" placeholder="Age" value={searchAge}
                               onChange={(e) => setSearchAge(e.target.value)}/>
                    </div>
                    <div className="search-field">
                        <input type="text" placeholder="Course" value={searchCourse}
                               onChange={(e) => setSearchCourse(e.target.value)}/>
                    </div>
                    <div className="search-field">
                        <input type="text" placeholder="Format" value={searchFormat}
                               onChange={(e) => setSearchFormat(e.target.value)}/>
                    </div>
                    <div className="search-field">
                        <input type="text" placeholder="Type" value={searchType}
                               onChange={(e) => setSearchType(e.target.value)}/>
                    </div>
                    <div className="search-field">
                        <input type="text" placeholder="Satus" value={searchStatus}
                               onChange={(e) => setSearchStatus(e.target.value)}/>
                    </div>
                    <div className="search-field">
                        <input type="text" placeholder="Group" value={searchGroup}
                               onChange={(e) => setSearchGroup(e.target.value)}/>
                    </div>
                    <div className="search-field">
                        <input type="text" placeholder="Start date" value={searchStartDate}
                               onChange={(e) => setSearchStartDate(e.target.value)}/>
                    </div>
                    <div className="search-field">
                        <input type="text" placeholder="End date" value={searchEndDate}
                               onChange={(e) => setSearchEndDate(e.target.value)}/>
                    </div>
                </div>
                <div className="extra-filter">
                    <>
                    <input type="checkbox" id="my-orders"/>
                    <label htmlFor="my-orders">My</label>
                    </>
                    <div className="reset" onClick={handleRotate}>
                        <img src={reset} alt="reset" className={isRotated ? "rotateBack" : "rotate"} onAnimationEnd={() => setIsRotated(false)} />
                    </div>
                    <div className="exel">
                        <img src={exel} alt="exel"/>
                    </div>
                </div>
            </div>
            <OrdersTable/>
        </div>
    );
};

export default Orders;