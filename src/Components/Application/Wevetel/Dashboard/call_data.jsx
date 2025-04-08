
import React, { useState, useEffect } from 'react';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
// import { CustomerService } from './service/CustomerService';
import SocketComponent from '../../../../_helper/Socket/Function';
import tools from '../../../../_helper/Utils/index';
import { useSelector, useDispatch } from "react-redux";


export default function AdvancedFilterDemo() {
    // console.log(localStorage);

    const RetrieveCallHistory = async () => {

        const ws = JSON.parse(localStorage.ws);
        const WevoSocket = new SocketComponent({ url: ws });
        const CloudSocket = new SocketComponent({ url: process.env.REACT_APP_CLOUD_SOCKET });

        const callSocket = async (type, message) => {
            let response; // Declare response variable here

            try {
                if (type == "CloudSocket") {
                    response = await CloudSocket.sendMessage(message);
                } else if (type == "WevoSocket") {
                    response = await WevoSocket.sendMessage(message);
                }

                // console.log("asdas", response);

                let ReturnResult = tools.EncryptionUtility.encrypt_decrypt('decrypt', response);
                // let ReturnResult2 = tools.EncryptionUtility.decryptMessage(response);
                // console.log(ReturnResult);

                return ReturnResult;
            } catch (error) {
                console.error("Error sending message to Socket:", error);
                // return null; // Handle the error gracefully
            }
        };
        // console.log(JSON.parse(localStorage.login)[0].id);
        // console.log(JSON.parse(localStorage.login)[0].id);

        // const querytest = {
        //     // action: 'Query',
        //     // query: `SELECT * FROM users`,
        //     action: 'testing',
        // };

        // const encryptedQuerytest = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(querytest));
        // const callResulttest = await callSocket("WevoSocket", encryptedQuerytest);

        // console.log(callResulttest);



        const query = {
            // action: 'Query',
            // query: `SELECT * FROM users`,
            action: 'RetrieveCallHistory',
            data: JSON.parse(localStorage.device).ext,
        };

        const encryptedQuery = tools.EncryptionUtility.encrypt_decrypt('encrypt', JSON.stringify(query));
        const callResult = await callSocket("WevoSocket", encryptedQuery);
        // console.log(callResult);
        // console.log(callResult);
        // let callResult = null;
        if (callResult && callResult.status == "200") {
            const records = [];
            for (const item of callResult.data) {
                const record = {
                    CallDate: item.calldate,
                    cnam: item.cnam,
                    source: item.src,
                    destination: item.dst,
                    disposition: item.disposition,
                };
                records.push(record);
            }

            // console.log(records);
            setRecords(records);

        } else {
            // Handle the error case
            console.error("Socket call failed.");
        }
    };

    const [records, setRecords] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const getSeverity = (status) => {
        switch (status) {
            case 'incoming':
                return 'success';

            case 'outgoing':
                return 'warning';

        }
    };



    useEffect(() => {
        // CustomerService.then((data) => {
        // setCustomers(getCustomers(data));
        // setLoading(false);
        // });
        RetrieveCallHistory();
        initFilters();
    }, []);

    // const getCustomers = (data) => {
    //     return [...(data || [])].map((d) => {
    //         d.date = new Date(d.date);

    //         return d;
    //     });
    // };

    // const formatDate = (value) => {
    //     return value.toLocaleDateString('en-US', {
    //         day: '2-digit',
    //         month: '2-digit',
    //         year: 'numeric'
    //     });
    // };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue('');
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                {/* <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} /> */}
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search" />
                </span>
            </div>
        );
    };


    const dateHistory = (rowData) => {
        return rowData.date;
    };

    const timeHistory = (rowData) => {
        return rowData.time;
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const header = renderHeader();

    return (
        <DataTable value={records} paginator showGridlines rows={10} loading={loading}
            filters={filters} globalFilterFields={['CallDate', 'cnam', 'source', 'destination', 'disposition']} header={header}
            emptyMessage="No data found.">
            <Column field="CallDate" header="Call Date" style={{ minWidth: '12rem' }} />
            <Column field="cnam" header="Caller Number" style={{ minWidth: '12rem' }} />
            <Column field="source" header="Source" style={{ minWidth: '12rem' }} />
            <Column field="destination" header="Destination" style={{ minWidth: '12rem' }} />
            <Column field="disposition" header="Disposition" style={{ minWidth: '12rem' }} />
        </DataTable>
    );
}
