import React, {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";

import toast, {Toaster} from "react-hot-toast";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dropdown} from "primereact/dropdown";
import {Dialog} from "primereact/dialog";
import {CreateDepartment, DeleteDepartment, GetAllDepartment, UpdateDepartment} from "../../Service/department.service";
import {GetAllResponsible, GetPerson} from "../../Service/person.service";
import {ProgressSpinner} from "primereact/progressspinner";

function ListDepartment() {
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [addDepartmentDialogVisible, setAddDepartmentDialogVisible] = useState(false);
    const [deleteDepartmentDialog, setDeleteDepartmentDialog] = useState(false);
    const [nameError, setNameError] = useState(false);
    //const [responsibleError, setResponsibleError] = useState(false);
    const queryClient = useQueryClient();
    const [newDepartment, setnewDepartment] = useState({
        name: '',
        responsible: '',
    });

    const {data: departments,isLoading} = useQuery('departments', GetAllDepartment, {
        retry: false, refetchOnWindowFocus: false
    });
    const {data: responsibles} = useQuery('responsibles', GetAllResponsible, {
        retry: false, refetchOnWindowFocus: false
    });


    const createDepartmentMutation = useMutation((Department) => {
        return CreateDepartment(Department);
    }, {
        onSuccess: () => {
            toast.success('Department Created Successfully')
            setnewDepartment({
                name: '',
                responsible: '',
            })
            queryClient.invalidateQueries('departments');
            setAddDepartmentDialogVisible(false);
        }
    }, {
        onError: (error) => {
            console.log(error);
        }
    });
    const updateDepartmentMutation = useMutation((Department) => {
        return UpdateDepartment(Department);
    }, {
        onSuccess: () => {
            toast.success('Department Updated Successfully')
            queryClient.invalidateQueries('departments');
        }
    }, {
        onError: (error) => {
            console.log(error);
        }
    });
    const deleteDepartmentMutation = useMutation((DepartmentId) => {
        return DeleteDepartment(DepartmentId);
    }, {
        onSuccess: () => {
            toast.success('Department Deleted Successfully')
            // Invalidate the 'students' query to refetch the latest data
            queryClient.invalidateQueries('departments');
            setDeleteDepartmentDialog(false);
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
        <Button label="Add Department" onClick={() => {
            setAddDepartmentDialogVisible(true)
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

    const onRowEditComplete = (e) => {
        //console.log(e.newData);


        updateDepartmentMutation.mutate(e.newData);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

            createDepartmentMutation.mutate(newDepartment);

      

    };

    const deleteDepartmentDialogFooter = (<>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text"
                onClick={() => setDeleteDepartmentDialog(false)}/>
        <Button label="Delete" icon="pi pi-trash" className="p-button-text"
                onClick={() => deleteDepartmentMutation.mutate(selectedDepartment.id)}/>
    </>);

    const actionBodyTemplate = (rowData) => {
        return (<>
            <Button icon="pi pi-trash" rounded outlined severity="danger"
                    onClick={() => confirmDeleteDepartment(rowData)}/>
        </>);
    };
    const confirmDeleteDepartment = (Department) => {
        setSelectedDepartment(Department);
        setDeleteDepartmentDialog(true);
    };
    return (<div>
        <Toaster/>
        <div className="datatable-container">
            <DataTable value={departments} editMode="row" header={header}
                       onRowEditComplete={onRowEditComplete} dataKey="id" selection={selectedDepartment}
                       onSelectionChange={(e) => setSelectedDepartment(e.value)}
                       paginator={true}
                       rows={5}
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <Column header="#" headerStyle={{width: '3rem'}}
                        body={(data, options) => options.rowIndex + 1}></Column>
                <Column field="name" header="Name" editor={(options) => textEditor(options)}
                        style={{width: '20%'}}></Column>

                <Column
                    field="responsible.name"
                    header="Responsible"
                    editor={(options) => (<Dropdown
                        options={responsibles.map((responsible) => {
                            console.log(responsible)
                            return {label: responsible.firstName+" "+responsible.lastName, value: responsible.firstName+" "+responsible.lastName}
                        })}
                        value={options.value}
                        onChange={(selectedOption) => options.editorCallback(selectedOption.value)}
                        placeholder="Select a type"
                    />)}
                    style={{width: '20%'}}
                />

                <Column className="mr-2 p-align-right" rowEditor body={rowEditorTemplate}></Column>
                <Column body={actionBodyTemplate}></Column>
            </DataTable>
        </div>
        <Dialog visible={deleteDepartmentDialog} header="Confirmation" modal style={{width: '350px'}}
                footer={deleteDepartmentDialogFooter} onHide={() => setDeleteDepartmentDialog(false)}>
            <div className="p-d-flex p-ai-center">
                <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                <span>Are you sure you want to delete this Department?</span>
            </div>
        </Dialog>
        <Dialog header="Add Department" visible={addDepartmentDialogVisible}
                onHide={() => setAddDepartmentDialogVisible(false)} style={{width: "50%"}}>
            <form onSubmit={handleSubmit}>
                <div className="p-fluid">

                    <div className="p-field-wrapper">
                        <div className="p-field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                type="text"
                                value={newDepartment.name}
                                className={nameError && !newDepartment.name ? 'p-invalid' : ''}
                                error={nameError}
                                helperText={nameError ? 'Please enter a name' : ''}
                                onBlur={() => {
                                    if (!newDepartment.name) {
                                        setNameError(true);
                                    }
                                }}
                                onChange={(e) => {
                                    setnewDepartment({...newDepartment, name: e.target.value});
                                    setNameError(false);
                                }}
                            />
                            <span className="error-message">
                                {nameError && 'Please enter a name*'}
                              </span>

                        </div>
                        <div className="p-field">
                            <label htmlFor="responsible">Responsible</label>
                            <Dropdown
                                id="responsible"
                                value={newDepartment.responsible}
                                options={responsibles?.map((responsible) => ({
                                    label: responsible.firstName + " " + responsible.lastName,
                                    value: responsible.id
                                }))}
                             //   className={responsibleError && !newDepartment.responsible ? 'p-invalid' : ''}
                             //   error={responsibleError}
                              //  helperText={responsibleError ? 'Please select a department' : ''}
                                onChange={(e) => {
                                    setnewDepartment({...newDepartment, responsible: e.value});
                                    //setResponsibleError(false);
                                }}
                                placeholder="Select a department"
                            />
      
                        </div>
                    </div>

                </div>

                <div className="p-d-flex p-jc-end buttons ">
                    <Button label="Cancel" className="p-mr-2" onClick={() => setAddDepartmentDialogVisible(false)}/>
                    <Button label="Add" type="submit"/>
                </div>
            </form>
        </Dialog>
    </div>);
}

export default ListDepartment;