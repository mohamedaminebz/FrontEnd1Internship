import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getTasksByUser, updateTask } from '../../Service/task.service';
import React, { useState } from 'react';
import { getAllProjects } from '../../Service/project.service';
import { GetAllPerson } from '../../Service/person.service';
import toast, { Toaster } from 'react-hot-toast';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import moment from 'moment';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';

function Worker() {
    const [selectedTask, setSelectedTask] = useState(null);
    const queryClient = useQueryClient();
    const [date1, setDate1] = useState(null);
    const { data: Tasks, isLoading } = useQuery('Tasks', getTasksByUser, {
        retry: false,
        refetchOnWindowFocus: false
    });

    const { data: projects } = useQuery('projects', getAllProjects, {
        retry: false,
        refetchOnWindowFocus: false
    });

    const { data: developers } = useQuery('developers', GetAllPerson, {
        retry: false,
        refetchOnWindowFocus: false
    });

    const updateTaskMutation = useMutation(
        (Task) => {
            return updateTask(Task);
        },
        {
            onSuccess: () => {
                toast.success('Task Updated Successfully');
                queryClient.invalidateQueries('Tasks');
            }
        },
        {
            onError: (error) => {
                console.log(error);
            }
        }
    );

    if (isLoading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh' // Adjust as needed
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
            return <Calendar value={date1} dateFormat="dd/mm/yy" onChange={(e) => setDate1(e.value)} />;
        } else if (options.field === 'endDate' || options.field === 'startDate') {
            return (
                <Calendar value={new Date(options.value)} dateFormat="dd/mm/yy" onChange={(e) => options.editorCallback(e.target.value)} />
            );
        } else {
            return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
        }
    };

    function rowEditorTemplate(rowData, props) {
        const rowEditor = props.rowEditor;
        if (rowEditor.editing) {
            return rowEditor.element; // default element
        } else {
            // custom init element
            return (
                <React.Fragment>
                    <Button icon="pi pi-pencil" rounded outlined onClick={rowEditor.onInitClick} />
                </React.Fragment>
            );
        }
    }

    const checkIfContainDate = (value) => {
        if (value === 'Invalid date') {
            return null;
        } else {
            return value;
        }
    };
    const onRowEditComplete = (e) => {
        e.newData.startDate = moment(e.newData.startDate).format('YYYY-MM-DD');
        e.newData.endDate = moment(e.newData.endDate).format('YYYY-MM-DD');
        e.newData.realEndDate = checkIfContainDate(moment(date1).format('YYYY-MM-DD'));

        updateTaskMutation.mutate(e.newData);
    };

    return (
        <div>
            <Toaster />
            <div className="datatable-container">
                <DataTable
                    value={Tasks}
                    editMode="row"
                    onRowEditComplete={onRowEditComplete}
                    dataKey="id"
                    selection={selectedTask}
                    onSelectionChange={(e) => setSelectedTask(e.value)}
                    paginator={true}
                    rows={5}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                >
                    <Column header="#" headerStyle={{ width: '3rem' }} body={(data, options) => options.rowIndex + 1}></Column>
                    <Column field="title" header="Title" style={{ width: '20%' }}></Column>

                    <Column
                        field="creationDate"
                        header="Creation Date"
                        style={{ width: '20%' }}
                        body={(rowData) => {
                            if (rowData.creationDate === null) {
                                return <span></span>;
                            } else {
                                const formattedStartDate = moment(rowData.creationDate).format('YYYY-MM-DD');
                                return <span>{formattedStartDate}</span>;
                            }
                        }}
                    />

                    <Column
                        field="startDate"
                        header="Start Date"
                        editor={(options) => textEditor(options)}
                        style={{ width: '20%' }}
                        body={(rowData) => {
                            if (rowData.startDate === null) {
                                return <span></span>;
                            } else {
                                const formattedStartDate = moment(rowData.startDate).format('YYYY-MM-DD');
                                return <span>{formattedStartDate}</span>;
                            }
                        }}
                    />

                    <Column
                        field="endDate"
                        header="Expected End Date"
                        style={{ width: '20%' }}
                        body={(rowData) => {
                            if (rowData.endDate === null) {
                                return <span></span>;
                            } else {
                                const formattedEndDate = moment(rowData.endDate).format('YYYY-MM-DD');
                                return <span>{formattedEndDate}</span>;
                            }
                        }}
                    />

                    <Column
                        field="realEndDate"
                        header="Real End Date"
                        editor={(options) => textEditor(options)}
                        style={{ width: '20%' }}
                        body={(rowData) => {
                            if (rowData.realEndDate === null) {
                                return <span></span>;
                            } else {
                                const formattedRealEndDate = moment(rowData.realEndDate).format('YYYY-MM-DD');
                                return <span>{formattedRealEndDate}</span>;
                            }
                        }}
                    />

                    <Column
                        field="status"
                        header="Status"
                        editor={(options) => (
                            <Dropdown
                                options={['new', 'in_progress', 'completed']}
                                value={options.value}
                                onChange={(selectedOption) => options.editorCallback(selectedOption.value)}
                                placeholder="Select a status"
                            />
                        )}
                        style={{ width: '20%' }}
                    />

                    <Column field="project.title" header="Project" style={{ width: '20%' }} />
                    <Column field="assignTo.name" header="Assign To" style={{ width: '20%' }} />
                    <Column className="mr-2" rowEditor body={rowEditorTemplate}></Column>
                </DataTable>
            </div>
        </div>
    );
}

export default Worker;
