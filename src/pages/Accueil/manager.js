import {useMutation, useQuery, useQueryClient} from "react-query";
import {
    createProject,
    deleteProject,
    getAllProjects,
    getProjectbyUser,
    updateProject
} from "../../Service/project.service";
import React, {useEffect, useState} from "react";
import {GetAllDepartment, GetdepartmentIdforconnectedUser} from "../../Service/department.service";
import {GetAllPerson, GetAllResponsible} from "../../Service/person.service";
import toast, {Toaster} from "react-hot-toast";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import moment from "moment/moment";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dropdown} from "primereact/dropdown";
import {Dialog} from "primereact/dialog";
import {connectedUser} from "../../Service/auth.service";
import {createTask} from "../../Service/task.service";
import {ProgressSpinner} from "primereact/progressspinner";

function Manager() {

    const [addTaskDialogVisible, setAddTaskDialogVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [addProjectDialogVisible, setAddProjectDialogVisible] = useState(false);
    const [deleteProjectDialog, setDeleteProjectDialog] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setdescriptionError] = useState(false);
    const [creationDateError, setcreationDateError] = useState(false);
    const [expectedEndDateError, setexpectedEndDateError] = useState(false);
    const [titletaskError, setTitleTaskError] = useState(false);
    const [descriptiontaskError, setdescriptionTaskError] = useState(false);
    const [startDateError, setstartDateError] = useState(false);
    const [endDateError, setendDateError] = useState(false);
    const [projectError, setprojectError] = useState(false);
    const [assignToError, setassignToError] = useState(false);
    const queryClient = useQueryClient();
    const [date1, setDate1] = useState(null);
    const [newProject, setnewProject] = useState({
        title: '',
        description: '',
        creationDate: '',
        expectedEndDate: '',
        realEndDate: null,
        status: 'new',
    });
    const [newTask, setnewTask] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        realEndDate: null,
        status: 'new',
        project: '',
        assignTo: ''
    });
    useEffect(() => {
        GetdepartmentIdforconnectedUser().then((result) => {
            setnewProject({...newProject, department: result,   responsible: connectedUser()?._id});
        });
    }, [addProjectDialogVisible]);
    const {data: Projects,isLoading} = useQuery('Projects', getProjectbyUser, {
        retry: false, refetchOnWindowFocus: false
    });
    console.log(Projects)
    const {data: departments} = useQuery('departments', GetAllDepartment, {
        retry: false, refetchOnWindowFocus: false
    });

    const {data: responsibles} = useQuery('responsibles', GetAllResponsible, {
        retry: false, refetchOnWindowFocus: false
    });

    const {data: developers} = useQuery('developers', GetAllPerson, {
        retry: false, refetchOnWindowFocus: false
    });
    const createTaskMutation = useMutation((Task) => {
        return createTask(Task);
    }, {
        onSuccess: () => {
            toast.success('Task Created Successfully')
            setnewTask({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                realEndDate: null,
                status: 'new',
                project: '',
                assignTo: ''
            })
            queryClient.invalidateQueries('Tasks');
            setAddTaskDialogVisible(false);
        }
    }, {
        onError: (error) => {
            console.log(error);
        }
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
                responsible: connectedUser()?.id,
                department: GetdepartmentIdforconnectedUser()
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
        <Button label="Add Project" severity="success" outlined  onClick={() => {
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
    const handleSubmitTask = (event) => {
        event.preventDefault();

        let hasError  = false;
        if (!newTask.title) {
            setTitleError(true);
            hasError = true;
        }

        if (!newTask.description) {
            setdescriptionError(true);
            hasError = true;
        }
        if (!newTask.startDate) {
            setstartDateError(true);
            hasError = true;
        }
        if (!newTask.endDate) {
            setendDateError(true);
            hasError = true;
        }
        if (!newTask.project) {
            setprojectError(true);
            hasError = true;
        }
        if (!newTask.assignTo) {
            setassignToError(true);
            hasError = true;
        }


        if (!hasError) {
            newTask.startDate = moment(newTask.startDate).format('YYYY-MM-DD');
            newTask.endDate = moment(newTask.endDate).format('YYYY-MM-DD');
            createTaskMutation.mutate(newTask);

        }

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
                        style={{width: '20%'}}    body={(rowData) => {
                    if (rowData.creationDate === null) {
                        return <span></span>;
                    }
                    else {
                        const formattedDate = moment(rowData.creationDate).format('YYYY-MM-DD');
                        return <span>{formattedDate}</span>;
                    }

                }}></Column>
                <Column field="expectedEndDate" header="Expected End Date" editor={(options) => textEditor(options)}
                        style={{width: '20%'}}    body={(rowData) => {
                    if (rowData.expectedEndDate === null) {
                        return <span></span>;
                    }
                    else {
                        const formattedDate = moment(rowData.expectedEndDate).format('YYYY-MM-DD');
                        return <span>{formattedDate}</span>;
                    }

                }}></Column>
                <Column field="realEndDate" header="Real End Date" editor={(options) => textEditor(options)}
                        style={{width: '20%'}}    body={(rowData) => {
                    if (rowData.realEndDate === null) {
                        return <span></span>;
                    }
                    else {
                        const formattedDate = moment(rowData.realEndDate).format('YYYY-MM-DD');
                        return <span>{formattedDate}</span>;
                    }

                }}></Column>

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

                </div>

                <div className="p-d-flex p-jc-end buttons ">
                    <Button label="Cancel" className="p-mr-2" onClick={() => setAddProjectDialogVisible(false)}/>
                    <Button label="Add" type="submit"/>
                </div>
            </form>
        </Dialog>
        <Dialog header="Add Task" visible={addTaskDialogVisible}
                onHide={() => setAddTaskDialogVisible(false)} style={{width: "50%"}}>
            <form onSubmit={handleSubmitTask}>
                <div className="p-fluid">

                    <div className="p-field-wrapper">
                        <div className="p-field">
                            <label htmlFor="Title">Title</label>
                            <InputText
                                id="Title"
                                type="text"
                                value={newTask.title}
                                className={titletaskError && !newTask.title ? 'p-invalid' : ''}
                                error={titletaskError}
                                helperText={titletaskError ? 'Please enter a Title' : ''}
                                onBlur={() => {
                                    if (!newTask.title) {
                                        setTitleTaskError(true);
                                    }
                                }}
                                onChange={(e) => {
                                    setnewTask({...newTask, title: e.target.value});
                                    setTitleTaskError(false);
                                }}
                            />

                            <span className="error-message">
                                    {titletaskError && 'Please enter a Title'}
                                </span>
                        </div>
                        <div className="p-field">
                            <label htmlFor="description">Description</label>
                            <InputText
                                id="description"
                                type="text"
                                value={newTask.description}
                                className={descriptiontaskError && !newTask.description ? 'p-invalid' : ''}
                                error={descriptiontaskError}
                                helperText={descriptiontaskError ? 'Please enter a description*' : ''}
                                onBlur={() => {
                                    if (!newTask.description) {
                                        setdescriptionTaskError(true);
                                    }
                                }}
                                onChange={(e) => {
                                    setnewTask({...newTask, description: e.target.value});
                                    setdescriptionTaskError(false);
                                }}
                            />

                            <span className="error-message">
                                    {descriptiontaskError && 'Please enter a description*'} {/* show the error message */}
                                </span>
                        </div>
                    </div>
                    <div className="p-field-wrapper">
                        <div className="p-field">
                            <label htmlFor="startDate">Start Date</label>
                            <Calendar id="startDate"
                                      value={newTask.startDate}
                                      className={startDateError && !newTask.startDate ? 'p-invalid' : ''}
                                      error={startDateError}
                                      helperText={startDateError ? 'Please enter a Start Date*' : ''}
                                      onChange={(event) => {
                                          setnewTask({...newTask, startDate: event.value});
                                          setstartDateError(false);
                                      }}
                            />
                            <span className="error-message">
                                    {startDateError && 'Please enter a Start Date*'}
                                </span>
                        </div>
                        <div className="p-field">
                            <label htmlFor="endDate">Expected End Date</label>
                            <Calendar id="endDate"
                                      value={newTask.endDate}
                                      className={endDateError && !newTask.endDate ? 'p-invalid' : ''}
                                      error={endDateError}
                                      helperText={endDateError ? 'Please enter a Expected End Date *' : ''}
                                      onChange={(event) => {
                                          setnewTask({...newTask, endDate: event.value});
                                          setendDateError(false);
                                      }}
                            />
                            <span className="error-message">
                                    {endDateError && 'Please enter a Expected End Date*'}
                                </span>
                        </div>
                    </div>
                    <div className="p-field-wrapper">
                        <div className="p-field">
                            <label htmlFor="project">Project</label>
                            <Dropdown
                                id="project"
                                value={newTask.project}
                                options={Projects?.map((project) => ({
                                    label: project.title,
                                    value: project.id
                                }))}
                                className={projectError && !newTask.project ? 'p-invalid' : ''}
                                error={projectError}
                                helperText={projectError ? 'Please select a project' : ''}
                                onChange={(e) => {
                                    setnewTask({...newTask, project: e.value});
                                    setprojectError(false);
                                }}
                                placeholder="Select a project"
                            />
                            <span className="error-message">
    {projectError && 'Please select a Project*'}
  </span>
                        </div>
                        <div className="p-field">
                            <label htmlFor="assignTo">assign To</label>
                            <Dropdown
                                id="assignTo"
                                value={newTask.assignTo}
                                options={developers?.map((developer) => ({
                                    label: developer.firstName + " " + developer.lastName,
                                    value: developer.id
                                }))}
                                className={assignToError && !newTask.assignTo ? 'p-invalid' : ''}
                                error={assignToError}
                                helperText={assignToError ? 'Please select a Person' : ''}
                                onChange={(e) => {
                                    setnewTask({...newTask, assignTo: e.value});
                                    setassignToError(false);
                                }}
                                placeholder="Select a Responsible"
                            />
                            <span className="error-message">
    {assignToError && 'Please select a Person*'}
  </span>
                        </div>

                    </div>
                </div>

                <div className="p-d-flex p-jc-end buttons ">
                    <Button label="Cancel" className="p-mr-2" onClick={() => setAddTaskDialogVisible(false)}/>
                    <Button label="Add" type="submit"/>
                </div>
            </form>
        </Dialog>
    </div>);
}

export default Manager;