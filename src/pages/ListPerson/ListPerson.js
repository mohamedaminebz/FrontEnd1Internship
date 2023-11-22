import {useMutation, useQuery, useQueryClient} from "react-query";
import {CreatePerson, DeletePerson, GetAllPerson, UpdatePerson} from "../../Service/person.service";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import React, {useState} from 'react';
import {Dialog} from "primereact/dialog";
import {Dropdown} from "primereact/dropdown";
import {GetAllDepartment} from "../../Service/department.service";
import toast, {Toaster} from "react-hot-toast";
import {ProgressSpinner} from "primereact/progressspinner";
function ListPerson() {
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [addPersonDialogVisible, setAddPersonDialogVisible] = useState(false);
    const [deletePersonDialog, setDeletePersonDialog] = useState(false);
    const [lastnameError, setLastnameError] = useState(false);
    const [firstnameError, setFirstnameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [departmentError, setDepartmentError] = useState(false);
    const [typeError, setTypeError] = useState(false);
    const queryClient = useQueryClient();
    const [newPerson, setnewPerson] = useState({
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        login: '',
        password: '',
        department: '',
        type: ''
    });
    const {data: persons,isLoading} = useQuery('persons', GetAllPerson, {
        retry: false, refetchOnWindowFocus: false
    });

    const {data: departments} = useQuery('departments', GetAllDepartment, {
        retry: false, refetchOnWindowFocus: false
    });

    const createPersonMutation = useMutation((person) => {
        return CreatePerson(person);
    }, {
        onSuccess: () => {
            toast.success('Person Created Successfully')
            setnewPerson({
                lastName: '',
                firstName: '',
                email: '',
                phone: '',
                login: '',
                password: '',
                department: '',
                type: ''
            })
            queryClient.invalidateQueries('persons');
            setAddPersonDialogVisible(false);
        }
    }, {
        onError: (error) => {
            console.log(error);
        }
    });
    const updatePersonMutation = useMutation((person) => {
        return UpdatePerson(person);
    }, {
        onSuccess: () => {
             toast.success('Person Updated Successfully')
            queryClient.invalidateQueries('persons');
        }
    }, {
        onError: (error) => {
            console.log(error);
        }
    });
    const deletePersonMutation = useMutation((personId) => {
        return DeletePerson(personId);
    }, {
        onSuccess: () => {
             toast.success('Person Deleted Successfully')
            // Invalidate the 'students' query to refetch the latest data
            queryClient.invalidateQueries('persons');
            setDeletePersonDialog(false);
        }
    });
    if (isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh', // Adjust as needed
                }}
            >
                <ProgressSpinner
                    style={{ width: '50px', height: '50px' }}
                    strokeWidth="8"
                    fill="var(--surface-ground)"
                    animationDuration=".5s"
                />
            </div>
        );
    }

    const textEditor = (options) => {

        return <InputText type="text" value={options.value}
                          onChange={(e) => options.editorCallback(e.target.value)}/>;


    }
    const header = (<div className="flex flex-wrap align-items-center justify-content-between gap-2"
                         style={{display: "flex", justifyContent: 'flex-end'}}>
        <Button label="Add Person" onClick={() => {
            setAddPersonDialogVisible(true)
        }}/>
    </div>);


    function rowEditorTemplate(rowData, props) {
        const rowEditor = props.rowEditor;
        if (rowEditor.editing) {
            return rowEditor.element; // default element
        } else {
            // custom init element
            return (<React.Fragment>
                    <Button icon="pi pi-pencil" rounded outlined onClick={rowEditor.onInitClick}/>
                </React.Fragment>

            )
        }
    }

    const getDepartmentIdFromName = (name) => {
        const department = departments.find((dept) => dept.name === name);
        return department ? department.id : null;
    }
    const onRowEditComplete = (e) => {
               updatePersonMutation.mutate(e.newData);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
//     newPerson.role = "STUDENT";
        let hasError  = false;
        if (!newPerson.lastName) {
            setLastnameError(true);
            hasError = true;
        }

        if (!newPerson.firstName) {
            setFirstnameError(true);
            hasError = true;
        }
        if (!newPerson.email) {
            setEmailError(true);
            hasError = true;
        }
        if (!newPerson.login) {
            setLoginError(true);
            hasError = true;
        }
        if (!newPerson.password) {
            setPasswordError(true);
            hasError = true;
        }
        if (!newPerson.phone) {
            setPhoneError(true);
            hasError = true;
        }
       /* if (!newPerson.department) {
            setDepartmentError(true);
            hasError = true;
        }*/
        if (!newPerson.type) {
            setTypeError(true);
            hasError = true;
        }

                if (!hasError) {
                    newPerson.department = getDepartmentIdFromName(newPerson.department);
                    createPersonMutation.mutate(newPerson);

                }

    };

    const deletePersonDialogFooter = (<>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text"
                onClick={() => setDeletePersonDialog(false)}/>
        <Button label="Delete" icon="pi pi-trash" className="p-button-text"
                onClick={() => deletePersonMutation.mutate(selectedPerson.id)}/>
    </>);
    function dateTemplate(rowData, column) {
        const date = new Date(rowData.dob);
        return date.toLocaleDateString();
    }
    const actionBodyTemplate = (rowData) => {
        return (<>
            <Button icon="pi pi-trash" rounded outlined severity="danger"
                    onClick={() => confirmDeletePerson(rowData)}/>
        </>);
    };
    const confirmDeletePerson = (person) => {
        setSelectedPerson(person);
        setDeletePersonDialog(true);
    };

    return (<div>
        <Toaster/>
        <div className="datatable-container">
            <DataTable value={persons} editMode="row" header={header}
                       onRowEditComplete={onRowEditComplete} dataKey="id" selection={selectedPerson}
                       onSelectionChange={(e) => setSelectedPerson(e.value)}
                       paginator={true}
                       rows={5}
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <Column header="#" headerStyle={{width: '3rem'}}
                        body={(data, options) => options.rowIndex + 1}></Column>
                <Column field="lastName" header="Last Name" editor={(options) => textEditor(options)}
                        style={{width: '20%'}}></Column>
                <Column field="firstName" header="First Name" editor={(options) => textEditor(options)}
                        style={{width: '20%'}}></Column>
                <Column field="email" header="Email" editor={(options) => textEditor(options)}
                        style={{width: '20%'}}></Column>
                <Column field="login" header="Login" editor={(options) => textEditor(options)}
                        style={{width: '20%'}}></Column>
                <Column field="phone" header="Phone" editor={(options) => textEditor(options)}
                        style={{width: '20%'}}></Column>
                <Column
                    field="department.name"
                    header="Departement"

                    editor={(options) => (<Dropdown
                        options={departments.map((department) => {

                            return {label: department.name, value: department.name}
                        })}
                        value={options.value}
                        onChange={(selectedOption) => options.editorCallback(selectedOption.value)}
                        placeholder="Select a Department"
                    />)}
                    style={{width: '20%'}}
                />
                <Column
                    field="type"
                    header="Type"
                    editor={(options) => (<Dropdown
                        options={["worker", "admin", "manager"]}
                        value={options.value}
                        onChange={(selectedOption) => options.editorCallback(selectedOption.value)}
                        placeholder="Select a type"
                    />)}
                    style={{width: '20%'}}
                />
                <Column className="mr-2" rowEditor body={rowEditorTemplate}></Column>
                <Column body={actionBodyTemplate}></Column>
            </DataTable>
        </div>
        <Dialog visible={deletePersonDialog} header="Confirmation" modal style={{width: '350px'}}
                footer={deletePersonDialogFooter} onHide={() => setDeletePersonDialog(false)}>
            <div className="p-d-flex p-ai-center">
                <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                <span>Are you sure you want to delete this Person?</span>
            </div>
        </Dialog>
        <Dialog header="Add Person" visible={addPersonDialogVisible}
                onHide={() => setAddPersonDialogVisible(false)} style={{width: "50%"}}>
            <form onSubmit={handleSubmit}>
                <div className="p-fluid">

                    <div className="p-field-wrapper">
                        <div className="p-field">
                            <label htmlFor="lastname">Last Name</label>
                            <InputText
                                id="lastname"
                                type="text"
                                value={newPerson.lastName}
                                className={lastnameError && !newPerson.lastName ? 'p-invalid' : ''}
                                error={lastnameError}
                                helperText={lastnameError ? 'Please enter a lastname' : ''}
                                onBlur={() => {
                                    if (!newPerson.lastName) {
                                        setLastnameError(true);
                                    }
                                }}
                                onChange={(e) => {
                                    setnewPerson({...newPerson, lastName: e.target.value});
                                    setLastnameError(false);
                                }}
                            />

                            <span className="error-message">
                                    {lastnameError && 'Please enter a lastname'}
                                </span>
                        </div>
                        <div className="p-field">
                            <label htmlFor="firstname">First Name</label>
                            <InputText
                                id="firstname"
                                type="text"
                                value={newPerson.firstName}
                                className={firstnameError && !newPerson.firstName ? 'p-invalid' : ''}
                                error={firstnameError}
                                helperText={firstnameError ? 'Please enter a Firstname*' : ''}
                                onBlur={() => {
                                    if (!newPerson.firstName) {
                                        setFirstnameError(true);
                                    }
                                }}
                                onChange={(e) => {
                                    setnewPerson({...newPerson, firstName: e.target.value});
                                    setFirstnameError(false);
                                }}
                            />

                            <span className="error-message">
                                    {firstnameError && 'Please enter a Firstname*'} {/* show the error message */}
                                </span>
                        </div>
                    </div>
                    <div className="p-field-wrapper">
                        <div className="p-field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                type="email"
                                value={newPerson.email}
                                className={emailError && !newPerson.email ? 'p-invalid' : ''}
                                error={emailError}
                                helperText={emailError ? 'Please enter a Email*' : ''}
                                onBlur={() => {
                                    if (!newPerson.email) {
                                        setEmailError(true);
                                    }
                                }}
                                onChange={(e) => {
                                    setnewPerson({...newPerson, email: e.target.value});
                                    setEmailError(false);
                                }}
                            />

                            <span className="error-message">
                                    {emailError && 'Please enter a Email*'}
                                </span>
                        </div>
                        <div className="p-field">
                            <label htmlFor="login">Login</label>
                            <InputText id="login"
                                       type="text"
                                       value={newPerson.login}
                                       className={loginError && !newPerson.login ? 'p-invalid' : ''}
                                       error={loginError}
                                       helperText={loginError ? 'Please enter a Login*' : ''}
                                       onBlur={() => {
                                           if (!newPerson.login) {
                                               setLoginError(true);
                                           }
                                       }}
                                       onChange={(event) => {
                                           setnewPerson({...newPerson, login: event.target.value});
                                           setLoginError(false);
                                       }}/>
                            <span className="error-message">
                                    {loginError && 'Please enter a Login*'}
                                </span>
                        </div>
                    </div>
                    <div className="p-field-wrapper">
                        <div className="p-field">
                            <label htmlFor="password">Password</label>
                            <InputText id="password"
                                       type="password"
                                       value={newPerson.password}
                                       className={passwordError && !newPerson.password ? 'p-invalid' : ''}
                                       error={passwordError}
                                       helperText={passwordError ? 'Please enter a Password*' : ''}
                                       onBlur={() => {
                                           if (!newPerson.password) {
                                               setPasswordError(true);
                                           }
                                       }}
                                       onChange={(event) => {
                                           setnewPerson({...newPerson, password: event.target.value});
                                           setPasswordError(false);
                                       }}/>
                            <span className="error-message">
                                    {passwordError && 'Please enter a Password*'}
                                </span>
                        </div>
                        <div className="p-field">
                            <label htmlFor="phone">Phone</label>
                            <InputText id="phone"
                                       type="text"
                                       value={newPerson.phone}
                                       className={phoneError && !newPerson.phone ? 'p-invalid' : ''}
                                       error={phoneError}
                                       helperText={phoneError ? 'Please enter a Phone*' : ''}
                                       onBlur={() => {
                                           if (!newPerson.phone) {
                                               setPhoneError(true);
                                           }
                                       }}
                                       onChange={(event) => {
                                           setnewPerson({...newPerson, phone: event.target.value});
                                           setPhoneError(false);
                                       }}


                            />
                            <span className="error-message">
                                    {phoneError && 'Please enter a Phone*'}
                                </span>
                        </div>
                    </div>
                    <div className="p-field-wrapper">
                        <div className="p-field">
                            <label htmlFor="department">Department</label>
                            <Dropdown
                                id="department"
                                value={newPerson.department}
                                options={departments?.map((department) => (department.name))}
                               // className={departmentError && !newPerson.department ? 'p-invalid' : ''}
                                onChange={(event) => {
                                    setnewPerson({...newPerson, department: event.value});
                                   // setDepartmentError(false);
                                }}
                                placeholder="Select a department"
                            />
                          
                        </div>



                    <div className="p-field">
                        <label htmlFor="type">Type</label>
                        <Dropdown
                            id="type"
                            value={newPerson.type}
                            options={["worker", "admin", "manager"]}
                            className={typeError && !newPerson.type ? 'p-invalid' : ''}
                            onChange={(event) => {
                                setnewPerson({...newPerson, type: event.value});
                                setTypeError(false);
                            }}
                            placeholder="Select a Type"
                        />
                        <span className="error-message">
    {typeError && 'Please select a Type*'}
  </span>
                    </div>
                    </div>
                </div>

                <div className="p-d-flex p-jc-end buttons ">
                    <Button label="Cancel" className="p-mr-2" onClick={() => setAddPersonDialogVisible(false)}/>
                    <Button label="Add" type="submit"/>
                </div>
            </form>
        </Dialog>
    </div>);
}

export default ListPerson;