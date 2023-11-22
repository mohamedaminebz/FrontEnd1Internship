import React, {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "react-query";
import {createTask, deleteTask, getAllTasks, updateTask} from "../../Service/task.service";
import {GetAllDepartment} from "../../Service/department.service";
import {GetAllDeveloper, GetAllPerson, GetAllResponsible} from "../../Service/person.service";
import toast, {Toaster} from "react-hot-toast";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import moment from "moment/moment";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dropdown} from "primereact/dropdown";
import {Dialog} from "primereact/dialog";
import {getAllProjects} from "../../Service/project.service";
import {ProgressSpinner} from "primereact/progressspinner";

function ListTasks(props) {
    const [selectedTask, setSelectedTask] = useState(null);
    const [addTaskDialogVisible, setAddTaskDialogVisible] = useState(false);
    const [deleteTaskDialog, setDeleteTaskDialog] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setdescriptionError] = useState(false);
    const [startDateError, setstartDateError] = useState(false);
    const [endDateError, setendDateError] = useState(false);
    const [projectError, setprojectError] = useState(false);
    const [assignToError, setassignToError] = useState(false);
    const queryClient = useQueryClient();
    const [date1, setDate1] = useState(null);
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
    const {data: Tasks,isLoading} = useQuery('Tasks', getAllTasks, {

        retry: false, refetchOnWindowFocus: false

    });


    const {data: projects} = useQuery('projects', getAllProjects, {
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
    const updateTaskMutation = useMutation((Task) => {
        return updateTask(Task);
    }, {
        onSuccess: () => {
            toast.success('Task Updated Successfully')
            queryClient.invalidateQueries('Tasks');
        }
    }, {
        onError: (error) => {
            console.log(error);
        }
    });


    const deleteTaskMutation = useMutation((TaskId) => {
        return deleteTask(TaskId);
    }, {
        onSuccess: () => {
            toast.success('Task Deleted Successfully')
            // Invalidate the 'students' query to refetch the latest data
            queryClient.invalidateQueries('Tasks');
            setDeleteTaskDialog(false);
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

        } else if (options.field === 'endDate' || options.field === 'startDate') {
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
        <Button label="Add Task" onClick={() => {
            setAddTaskDialogVisible(true)
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
         e.newData.startDate = moment(e.newData.startDate).format('YYYY-MM-DD');
         e.newData.endDate = moment(e.newData.endDate).format('YYYY-MM-DD');
         e.newData.realEndDate = checkIfContainDate(moment(date1).format('YYYY-MM-DD'))

        updateTaskMutation.mutate(e.newData);
    };

    const handleSubmit = (event) => {
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

    const deleteTaskDialogFooter = (<>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text"
                onClick={() => setDeleteTaskDialog(false)}/>
        <Button label="Delete" icon="pi pi-trash" className="p-button-text"
                onClick={() => deleteTaskMutation.mutate(selectedTask.id)}/>
    </>);


    const actionBodyTemplate = (rowData) => {
        return (<>
            <Button icon="pi pi-trash" rounded outlined severity="danger"
                    onClick={() => confirmDeleteTask(rowData)}/>
        </>);
    };
    const confirmDeleteTask = (Task) => {
        setSelectedTask(Task);
        setDeleteTaskDialog(true);
    };
    return (<div>
        <Toaster/>
        <div className="datatable-container">
            <DataTable value={Tasks} editMode="row" header={header}
                       onRowEditComplete={onRowEditComplete} dataKey="id" selection={selectedTask}
                       onSelectionChange={(e) => setSelectedTask(e.value)}
                       paginator={true}
                       rows={5}
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown">
                <Column header="#" headerStyle={{width: '3rem'}}
                        body={(data, options) => options.rowIndex + 1}></Column>
                <Column field="title" header="Title" editor={(options) => textEditor(options)}
                        style={{width: '20%'}} ></Column>

                <Column field="startDate" header="Start Date" editor={(options) => textEditor(options)}
                        style={{width: '20%'}}    body={(rowData) => {
                    if (rowData.startDate === null) {
                        return <span></span>;
                    }
                    else {
                        const formattedDate = moment(rowData.startDate).format('YYYY-MM-DD');
                        return <span>{formattedDate}</span>;
                    }

                }}></Column>
                <Column field="endDate" header="Expected End Date" editor={(options) => textEditor(options)}
                        style={{width: '20%'}} body={(rowData) => {
                    if (rowData.endDate === null) {
                        return <span></span>;
                    }
                    else {
                        const formattedDate = moment(rowData.endDate).format('YYYY-MM-DD');
                        return <span>{formattedDate}</span>;
                    }

                }}></Column>
                <Column field="realEndDate" header="Real End Date" editor={(options) => textEditor(options)}
                        style={{width: '20%'}} body={(rowData) => {
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
                    field="project.title"
                    header="Project"

                    editor={(options) => (<Dropdown
                        options={projects.map((project) => {

                            return {label: project.title, value: project.title}
                        })}
                        value={options.value}
                        onChange={(selectedOption) => options.editorCallback(selectedOption.value)}
                        placeholder="Select a Project"
                    />)}
                    style={{width: '20%'}}
                />
                <Column
                    field="assignTo.name"
                    header="Assign To"
                    editor={(options) => (<Dropdown
                        options={developers.map((developer) => {
                            return {label: developer.firstName+" "+developer.lastName, value: developer.firstName+" "+developer.lastName}
                        })}
                        value={options.value}
                        onChange={(selectedOption) => options.editorCallback(selectedOption.value)}
                        placeholder="Select a Developer"
                    />)}
                    style={{width: '20%'}}
                />
                <Column className="mr-2" rowEditor body={rowEditorTemplate}></Column>
                <Column body={actionBodyTemplate}></Column>
            </DataTable>
        </div>
        <Dialog visible={deleteTaskDialog} header="Confirmation" modal style={{width: '350px'}}
                footer={deleteTaskDialogFooter} onHide={() => setDeleteTaskDialog(false)}>
            <div className="p-d-flex p-ai-center">
                <i className="pi pi-exclamation-triangle p-mr-3" style={{fontSize: '2rem'}}/>
                <span>Are you sure you want to delete this Task?</span>
            </div>
        </Dialog>
        <Dialog header="Add Task" visible={addTaskDialogVisible}
                onHide={() => setAddTaskDialogVisible(false)} style={{width: "50%"}}>
            <form onSubmit={handleSubmit}>
                <div className="p-fluid">

                    <div className="p-field-wrapper">
                        <div className="p-field">
                            <label htmlFor="Title">Title</label>
                            <InputText
                                id="Title"
                                type="text"
                                value={newTask.title}
                                className={titleError && !newTask.title ? 'p-invalid' : ''}
                                error={titleError}
                                helperText={titleError ? 'Please enter a Title' : ''}
                                onBlur={() => {
                                    if (!newTask.title) {
                                        setTitleError(true);
                                    }
                                }}
                                onChange={(e) => {
                                    setnewTask({...newTask, title: e.target.value});
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
                                value={newTask.description}
                                className={descriptionError && !newTask.description ? 'p-invalid' : ''}
                                error={descriptionError}
                                helperText={descriptionError ? 'Please enter a description*' : ''}
                                onBlur={() => {
                                    if (!newTask.description) {
                                        setdescriptionError(true);
                                    }
                                }}
                                onChange={(e) => {
                                    setnewTask({...newTask, description: e.target.value});
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
                                options={projects?.map((project) => ({
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

export default ListTasks;