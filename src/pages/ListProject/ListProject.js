import React, {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";

import {GetAllDepartment} from "../../Service/department.service";
import toast, {Toaster} from "react-hot-toast";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dropdown} from "primereact/dropdown";
import {Dialog} from "primereact/dialog";
import {createProject, deleteProject, getAllProjects, updateProject} from "../../Service/project.service";
import {Calendar} from "primereact/calendar";
import {GetAllResponsible} from "../../Service/person.service";
import moment from "moment";
import {ProgressSpinner} from "primereact/progressspinner";

function ListProject() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [addProjectDialogVisible, setAddProjectDialogVisible] = useState(false);
    const [deleteProjectDialog, setDeleteProjectDialog] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setdescriptionError] = useState(false);
    const [creationDateError, setcreationDateError] = useState(false);
    const [expectedEndDateError, setexpectedEndDateError] = useState(false);
    const [responsibleError, setresponsibleError] = useState(false);
    const [departmentError, setdepartmentError] = useState(false);
    const queryClient = useQueryClient();
    const [date1, setDate1] = useState(null);
    const [newProject, setnewProject] = useState({
        title: '',
        description: '',
        creationDate: '',
        expectedEndDate: '',
        realEndDate: null,
        status: 'new',
        responsible: '',
        department: ''
    });
    const {data: Projects,isLoading} = useQuery('Projects', getAllProjects, {
        retry: false, refetchOnWindowFocus: false
    });

    const {data: departments} = useQuery('departments', GetAllDepartment, {
        retry: false, refetchOnWindowFocus: false
    });

    const {data: responsibles} = useQuery('responsibles', GetAllResponsible, {
        retry: false, refetchOnWindowFocus: false
    });

    const createProjectMutation = useMutation((Project) => {
        return createProject(Project);
    }, {
        onSuccess: () => {
            toast.success('Project Created Successfully')
            setnewProject({
                title: '',
                description: '',
                creationDate: '',
                expectedEndDate: '',
                realEndDate: null,
                status: 'new',
                responsible: '',
                department: ''
            })
            queryClient.invalidateQueries('Projects');
            setAddProjectDialogVisible(false);
        }
    }, {
        onError: (error) => {
            console.log(error);
        }
    });
    const updateProjectMutation = useMutation((Project) => {
        return updateProject(Project);
    }, {
        onSuccess: () => {
            toast.success('Project Updated Successfully')
            queryClient.invalidateQueries('Projects');
        }
    }, {
        onError: (error) => {
            console.log(error);
        }
    });


    const deleteProjectMutation = useMutation((ProjectId) => {
        return deleteProject(ProjectId);
    }, {
        onSuccess: () => {
            toast.success('Project Deleted Successfully')
            // Invalidate the 'students' query to refetch the latest data
            queryClient.invalidateQueries('Projects');
            setDeleteProjectDialog(false);
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
        if (options.field === 'realEndDate') {

            return <Calendar value={date1} dateFormat="dd/mm/yy" onChange={(e) => setDate1(e.value)}/>

        } else if (options.field === 'expectedEndDate' || options.field === 'creationDate') {
            return <Calendar
                value={new Date(options.value)}
                dateFormat="dd/mm/yy"
                onChange={(e) => options.editorCallback(e.target.value)}
            />
        } else {

            return <InputText type="text" value={options.value}
                              onChange={(e) => options.editorCallback(e.target.value)}/>;
        }

    };
    const header = (<div className="flex flex-wrap align-items-center justify-content-between gap-2"
                         style={{display: "flex", justifyContent: 'flex-end'}}>
        <Button label="Add Project" onClick={() => {
            setAddProjectDialogVisible(true)
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

    const checkIfContainDate = (value) => {
        if (value === 'Invalid date') {
            return null;
        } else {
            return value;
        }
    }
    const onRowEditComplete = (e) => {
        e.newData.creationDate = moment(e.newData.creationDate).format('YYYY-MM-DD');
        e.newData.expectedEndDate = moment(e.newData.expectedEndDate).format('YYYY-MM-DD');
        e.newData.realEndDate = checkIfContainDate(moment(date1).format('YYYY-MM-DD'))

        updateProjectMutation.mutate(e.newData);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        let hasError  = false;
        if (!newProject.title) {
            setTitleError(true);
            hasError = true;
        }

        if (!newProject.description) {
            setdescriptionError(true);
            hasError = true;
        }
        if (!newProject.creationDate) {
            setcreationDateError(true);
            hasError = true;
        }
        if (!newProject.expectedEndDate) {
            setexpectedEndDateError(true);
            hasError = true;
        }
        if (!newProject.responsible) {
            setresponsibleError(true);
            hasError = true;
        }
        if (!newProject.department) {
            setdepartmentError(true);
            hasError = true;
        }


        if (!hasError) {
            newProject.creationDate = moment(newProject.creationDate).format('YYYY-MM-DD');
            newProject.expectedEndDate = moment(newProject.expectedEndDate).format('YYYY-MM-DD');
            createProjectMutation.mutate(newProject);

        }

    };

    const deleteProjectDialogFooter = (<>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text"
                onClick={() => setDeleteProjectDialog(false)}/>
        <Button label="Delete" icon="pi pi-trash" className="p-button-text"
                onClick={() => deleteProjectMutation.mutate(selectedProject.id)}/>
    </>);

    const actionBodyTemplate = (rowData) => {
        return (<>
            <Button icon="pi pi-trash" rounded outlined severity="danger"
                    onClick={() => confirmDeleteProject(rowData)}/>
        </>);
    };
    const confirmDeleteProject = (Project) => {
        setSelectedProject(Project);
        setDeleteProjectDialog(true);
    };
    return (<div>
        <Toaster/>
        <div className="datatable-container">
            <DataTable value={Projects} editMode="row" header={header}
                       onRowEditComplete={onRowEditComplete} dataKey="id" selection={selectedProject}
                       onSelectionChange={(e) => setSelectedProject(e.value)}
                       paginator={true}
                       rows={5}
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown">
                <Column header="#" headerStyle={{width: '3rem'}}
                        body={(data, options) => options.rowIndex + 1}></Column>
                <Column field="title" header="Title" editor={(options) => textEditor(options)}
                        style={{width: '20%'}}></Column>

                <Column field="creationDate" header="Creation Date" editor={(options) => textEditor(options)}
                        style={{width: '20%'}}></Column>
                <Column field="expectedEndDate" header="Expected End Date" editor={(options) => textEditor(options)}
                        style={{width: '20%'}}></Column>
                <Column field="realEndDate" header="Real End Date" editor={(options) => textEditor(options)}
                        style={{width: '20%'}}></Column>

                <Column
                    field="status"
                    header="Status"
                    editor={(options) => (<Dropdown
                        options={["new", "in_progress", "completed"]}
                        value={options.value}
                        onChange={(selectedOption) => options.editorCallback(selectedOption.value)}
                        placeholder="Select a status"
                    />)}
                    style={{width: '20%'}}
                />


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
                <Column className="mr-2" rowEditor body={rowEditorTemplate}></Column>
                <Column body={actionBodyTemplate}></Column>
            </DataTable>
        </div>
        <Dialog visible={deleteProjectDialog} header="Confirmation" modal style={{width: '350px'}}
                footer={deleteProjectDialogFooter} onHide={() => setDeleteProjectDialog(false)}>
            <div className="p-d-flex p-ai-center">
                <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                <span>Are you sure you want to delete this Project?</span>
            </div>
        </Dialog>
        <Dialog header="Add Project" visible={addProjectDialogVisible}
                onHide={() => setAddProjectDialogVisible(false)} style={{width: "50%"}}>
            <form onSubmit={handleSubmit}>
                <div className="p-fluid">

                    <div className="p-field-wrapper">
                        <div className="p-field">
                            <label htmlFor="Title">Title</label>
                            <InputText
                                id="Title"
                                type="text"
                                value={newProject.title}
                                className={titleError && !newProject.title ? 'p-invalid' : ''}
                                error={titleError}
                                helperText={titleError ? 'Please enter a Title' : ''}
                                onBlur={() => {
                                    if (!newProject.title) {
                                        setTitleError(true);
                                    }
                                }}
                                onChange={(e) => {
                                    setnewProject({...newProject, title: e.target.value});
                                    setTitleError(false);
                                }}
                            />

                            <span className="error-message">
                                    {titleError && 'Please enter a Title'}
                                </span>
                        </div>
                        <div className="p-field">
                            <label htmlFor="description">Description</label>
                            <InputText
                                id="description"
                                type="text"
                                value={newProject.description}
                                className={descriptionError && !newProject.description ? 'p-invalid' : ''}
                                error={descriptionError}
                                helperText={descriptionError ? 'Please enter a description*' : ''}
                                onBlur={() => {
                                    if (!newProject.description) {
                                        setdescriptionError(true);
                                    }
                                }}
                                onChange={(e) => {
                                    setnewProject({...newProject, description: e.target.value});
                                    setdescriptionError(false);
                                }}
                            />

                            <span className="error-message">
                                    {descriptionError && 'Please enter a description*'} {/* show the error message */}
                                </span>
                        </div>
                    </div>
                    <div className="p-field-wrapper">
                        <div className="p-field">
                            <label htmlFor="creationDate">Creation date</label>
                            <Calendar id="creationDate"
                                      value={newProject.creationDate}
                                      className={creationDateError && !newProject.creationDate ? 'p-invalid' : ''}
                                      error={creationDateError}
                                      helperText={creationDateError ? 'Please enter a Date of Creation*' : ''}
                                      onChange={(event) => {
                                          setnewProject({...newProject, creationDate: event.value});
                                          setcreationDateError(false);
                                      }}
                            />
                            <span className="error-message">
                                    {creationDateError && 'Please enter a Date of Creation*'}
                                </span>
                        </div>
                        <div className="p-field">
                            <label htmlFor="expectedEndDate">Expected End Date</label>
                            <Calendar id="expectedEndDate"
                                      value={newProject.expectedEndDate}
                                      className={expectedEndDateError && !newProject.expectedEndDate ? 'p-invalid' : ''}
                                      error={expectedEndDateError}
                                      helperText={expectedEndDateError ? 'Please enter a Expected End Date *' : ''}
                                      onChange={(event) => {
                                          setnewProject({...newProject, expectedEndDate: event.value});
                                          setexpectedEndDateError(false);
                                      }}
                            />
                            <span className="error-message">
                                    {expectedEndDateError && 'Please enter a Expected End Date*'}
                                </span>
                        </div>
                    </div>
                    <div className="p-field-wrapper">
                        <div className="p-field">
                            <label htmlFor="department">Department</label>
                            <Dropdown
                                id="department"
                                value={newProject.department}
                                options={departments?.map((department) => ({
                                    label: department.name,
                                    value: department.id
                                }))}
                                className={departmentError && !newProject.department ? 'p-invalid' : ''}
                                error={departmentError}
                                helperText={departmentError ? 'Please select a department' : ''}
                                onChange={(e) => {
                                    setnewProject({...newProject, department: e.value});
                                    setdepartmentError(false);
                                }}
                                placeholder="Select a department"
                            />
                            <span className="error-message">
    {departmentError && 'Please select a department*'}
  </span>
                        </div>
                        <div className="p-field">
                            <label htmlFor="responsible">Responsible</label>
                            <Dropdown
                                id="responsible"
                                value={newProject.responsible}
                                options={responsibles?.map((responsible) => ({
                                    label: responsible.firstName + " " + responsible.lastName,
                                    value: responsible.id
                                }))}
                                className={responsibleError && !newProject.responsible ? 'p-invalid' : ''}
                                error={responsibleError}
                                helperText={responsibleError ? 'Please select a Responsible' : ''}
                                onChange={(e) => {
                                    setnewProject({...newProject, responsible: e.value});
                                    setresponsibleError(false);
                                }}
                                placeholder="Select a Responsible"
                            />
                            <span className="error-message">
    {responsibleError && 'Please select a Responsible*'}
  </span>
                        </div>

                    </div>
                </div>

                <div className="p-d-flex p-jc-end buttons ">
                    <Button label="Cancel" className="p-mr-2" onClick={() => setAddProjectDialogVisible(false)}/>
                    <Button label="Add" type="submit"/>
                </div>
            </form>
        </Dialog>
    </div>);
}

export default ListProject;