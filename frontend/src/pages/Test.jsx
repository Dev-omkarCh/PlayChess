import React, { useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const initialTasks = [
    { id: 1, text: 'Learn React DnD', status: 'TODO' },
    { id: 2, text: 'Build a Project', status: 'TODO' },
    { id: 3, text: 'Help', status: 'TODO' },
    { id: 4, text: 'Me', status: 'TODO' },
    { id: 5, text: 'Build', status: 'TODO' },
    { id: 6, text: 'This', status: 'TODO' },
    { id: 7, text: 'Project', status: 'TODO' },
    { id: 8, text: 'Please', status: 'TODO' },
];


const Test = () => {

    const [tasks, setTasks] = useState(initialTasks);

    // This function moves a task to a new column
    const moveTask = (id, newStatus) => {
        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
    };

    const Column = ({ status, tasks, moveTask }) => {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: 'TASK',
            drop: (item) => moveTask(item.id, status), // item.id comes from useDrag
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }));

        return (
            <div ref={drop} style={{
                background: isOver ? '#e2e2e2' : '#f4f4f4',
                padding: '10px', minWidth: '200px', minHeight: '300px'
            }}>
                <h3>{status}</h3>
                {tasks
                    .filter((t) => t.status === status)
                    .map((t) => <Task key={t.id} id={t.id} text={t.text} />)}
            </div>
        );
    };

    function Task({ id, text }) {
        const [{ isDragging }, drag] = useDrag(() => ({
            type: 'TASK',
            item: { id }, // This is the data we pass to the Drop Target
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }));

        return (
            <div ref={drag} style={{
                opacity: isDragging ? 0.5 : 1,
                padding: '8px', margin: '4px', backgroundColor: 'white', border: '1px solid black'
            }}>
                {text}
            </div>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ display: 'flex', gap: '20px' }}>
                <Column status="TODO" tasks={tasks} moveTask={moveTask} />
                <Column status="DONE" tasks={tasks} moveTask={moveTask} />
            </div>
        </DndProvider>
    )
}

export default Test;
