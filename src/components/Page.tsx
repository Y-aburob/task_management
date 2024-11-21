import { useCallback, useEffect, useRef, useState } from 'react';
import '../assets/css/Page.css';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { AnimatePresence, motion } from 'framer-motion';
import plus from '../assets/icons8-plus.svg'
import closeSVG from '../assets/close.svg'
import threeArrowsRed from '../assets/threeArrowsRed.svg'
import threeArrowsOrange from '../assets/threeArrowsOrange.svg'
import threeArrowsGreen from '../assets/threeArrowsGreen.svg'
import threeArrowsBlack from '../assets/threeArrowsBlack.svg'
import reset from '../assets/icons8-reset-50.png'
import downArrow from '../assets/down-arrow.png'
import searchSVG from '../assets/search.svg'
import deleteSVG from '../assets/icons8-delete.svg'
import HighlightedText from '../components/HighlightedText'


export default function Page() {

    const [showAddColumn, setShowAddColumn] = useState(false);
    const [close, setclose] = useState(false);
    const [showTaskProiority, setShowTaskProiority] = useState(false);
    const [columnInputValue, setColumnInputValue] = useState('');
    const [priority, setPriority] = useState('task priority');
    const [arrow, setArrow] = useState(threeArrowsBlack)
    const [activeAddTaskColumn, setActiveAddTaskColumn] = useState(null);
    const inputt = useRef<any>(null);
    const labell = useRef<any>(null);
    const taskProiorityRef = useRef<any>(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [showFilter, setShowFilter] = useState(false)
    const [ticketId, setTicketId] = useState(0)
    const [filterTtitle, setFilterTtitle] = useState('')
    const [columns, setColumns] = useState<any>([]);
    const [resetColumn, setResetColumn] = useState<any>([])
    const [searchInput, setSearchInput] = useState('')
    const [showValidationMessage, setShowValidationMessage] = useState(false)
    const [showValidationMessageTask, setShowValidationMessageTask] = useState(false)
    const [taskId, setTaskId] = useState(0)
    const [columnButtonId, setColumnButtonId] = useState(0)
    const [columnId, setColumnId] = useState(0)
    
    useEffect(() => {
        if (showAddColumn && inputt.current) {
            inputt.current.focus();
        }
    }, [showAddColumn]);

    const handleColumnEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addingColumns();
        }
    };

    useEffect(() => {
        if (close) {
            inputt.current.focus();
        }
    }, [close]);
    
    const handleTaskEnter = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addingTasks(e);
        }
    };

    const addingTasks = (e: any) => {
        
        if (taskTitle.trim() === '') {
            labell.current.style.color = "rgb(255 131 131)";
            inputt.current.focus();
            inputt.current.style.border = "1px solid rgb(255 131 131)";
        }
        else if(priority === 'task priority') {
            taskProiorityRef.current.classList.add('animation')
        }
        else {
            const columnId = e.currentTarget.id;
            setActiveAddTaskColumn(null);
            setTicketId(ticketId+1)
            setColumns((prevColumns: any) => 
                prevColumns.map((column: any) => {
                    if (column.id === columnId) {
                        return {
                            ...column,
                            tasks: [...column.tasks, { title: taskTitle, priority: priority, arrowType: arrow, id: ticketId }],
                        };
                    }
                    return column;
                })
            );
            setTaskTitle('');
            setPriority('task priority');
        }
    };

    const showingaddingTask = (e: any) => {
        setclose(true)
        setTaskTitle('')
        setPriority('task priority')
        setArrow(threeArrowsBlack)
        setActiveAddTaskColumn(e.target.id)
    };

    const addingColumns = () => {
        if(columnInputValue.trim() === '') {
            inputt.current.style.border = "1px solid rgb(255 131 131)";
            labell.current.style.color = "rgb(255 131 131)";
            inputt.current.focus();
        } else {
            setShowAddColumn(false);
            const newColumn = {
                title: columnInputValue, 
                id: columns.length.toString(), 
                tasks: []
            };
            const updatedColumns = [...columns, newColumn];
            setColumns(updatedColumns);
            setResetColumn(updatedColumns);
            setColumnInputValue('');
        }
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const sourceColumnIndex = columns.findIndex((col: any) => col.id === source.droppableId);
        const destColumnIndex = columns.findIndex((col: any) => col.id === destination.droppableId);

        const sourceColumn = columns[sourceColumnIndex];
        const destColumn = columns[destColumnIndex];

        const sourceTasks = Array.from(sourceColumn.tasks);
        const destinationTasks = Array.from(destColumn.tasks);

        const [movedTask] = sourceTasks.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
            sourceTasks.splice(destination.index, 0, movedTask);
            const updatedColumns = columns.map((col: any, index: any) => {
                if (index === sourceColumnIndex) {
                    return { ...col, tasks: sourceTasks };
                }
                return col;
            });
            setColumns(updatedColumns);
        } else {
            destinationTasks.splice(destination.index, 0, movedTask);
            const updatedColumns = columns.map((col: any, index: any) => {
                if (index === sourceColumnIndex) {
                    return { ...col, tasks: sourceTasks };
                }
                if (index === destColumnIndex) {
                    return { ...col, tasks: destinationTasks };
                }
                return col;
            });
            setColumns(updatedColumns);
        }
    };

    useEffect(() => {
        if (!filterTtitle) {
            setResetColumn(columns);
        }
    }, [columns, filterTtitle]);
    
    const filterTasks = (priorityValue: string) => {
        resetFilter()
        setFilterTtitle(priorityValue);
        setShowFilter(false);
        
            const filteredColumns = columns.map((column: any) => ({
                ...column,
                tasks: column.tasks.filter((task: any) => task.priority === priorityValue),
            }));
            setColumns(filteredColumns);
    };

    const resetFilter = () => {
        setFilterTtitle('');
        setShowFilter(false);
        setColumns(resetColumn);
    };

    
    const debounce = (func: any, delay: any) => {
        let timer: number;
        return (...args: any) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    useEffect(() => {
        if (!searchInput) {
            setColumns(resetColumn);
        }
    }, [searchInput, resetColumn]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
        debouncedSearch(e.target.value);
    };

    const search = (value: any) => {
        if (value === '') {
            setColumns(resetColumn);
            setFilterTtitle('');
        } else {
            const filteredColumns = columns.map((column: any) => ({
                ...column,
                tasks: column.tasks.filter((task: any) => task.title.toLowerCase().includes(value.toLowerCase()))
            }));
            setColumns(filteredColumns);
        }
    };

    const debouncedSearch = useCallback(debounce(search, 500), [columns]);

    
    const deleteColumn = (columnId: any) => {
        
        setShowValidationMessage(false)
        setColumns((columns: any) => columns.filter((column: any) => column.id !== columnId));
    };


    const deleteTask = (columnId: any, taskId: any) => {
        setShowValidationMessageTask(false)
        setColumns((prevColumns: any) => 
            prevColumns.map((column: any) => {
                if (column.id === columnId) {
                    return { ...column, tasks: column.tasks.filter((task: any) => task.id !== taskId) };
                } else {
                    return column;
                }
            })
        );
    };

    return (
        <div className='mt-10'>
            
        <div className='flex gap-4 p-8 pb-0'>
            <div className='w-[170px] relative'>
                <div onClick={() => setShowFilter(!showFilter)} className={`flex justify-between h-[34px] transition-all duration-300 relative p-1 text-darkBlue border-[1px] border-border rounded-md cursor-pointer font-[500] hover:bg-columnsBackground items-center ${showFilter? 'bg-columnsBackground': ''}`}>
                    <motion.h1 className={`transition-all duration-200 absolute opacity-80 ${showFilter || filterTtitle !== ''? '-top-[1.1rem] text-[.8rem] opacity-100 font-[400]': 'top-1 left-2'}`}>Priority</motion.h1>
                    <h1 className='text-sm'>{filterTtitle}</h1>
                    <img className={`w-4 mt-[.12rem] ${showFilter? 'rotate-180': ''}`} src={downArrow} alt="downArrow" />
                </div>
                <AnimatePresence>
                    {showFilter&&(
                        <motion.div
                        className='absolute z-10 w-full rounded-md'
                        initial={{translateY: -10, opacity: 0}}
                        animate={{translateY: 5, opacity: 1}}
                        exit={{translateY: -10, opacity: 0}}
                        transition={{duration: .3}}
                        >
                            <ul className='w-full bg-white rounded-md box-shadow text-darkBlue'>
                                <li onClick={resetFilter} className='py-2 bg-white rounded-sm cursor-pointer mt-1 text-[.8rem] font-[600] hover:bg-columnsBackground flex justify-center items-center gap-[.17rem]'><img className='w-[.80rem] mt-[.12rem]' src={reset} alt="" /> Reset</li>
                                <li value='High' onClick={() => filterTasks('High')} className={`py-1 pb-2 rounded-sm cursor-pointer mt-1 text-[.8rem] font-[600] hover:bg-columnsBackground flex items-center ${(filterTtitle !== 'High' && filterTtitle !== '')? 'pointer-events-none hidden': 'pointer-events-auto bg-white'}`}><img className='w-4' src={threeArrowsRed} alt="" /> High</li>
                                <li value='Medium' onClick={() => filterTasks('Medium')} className={`py-1 pb-2 rounded-sm cursor-pointer mt-2 text-[.8rem] font-[600] hover:bg-columnsBackground flex items-center ${(filterTtitle !== 'Medium' && filterTtitle !== '')? 'pointer-events-none hidden': 'pointer-events-auto bg-white'}`}><img className='w-4' src={threeArrowsOrange} alt="" /> Medium</li>
                                <li value='Low' onClick={() => filterTasks('Low')} className={`py-1 pb-2 rounded-sm cursor-pointer mt-2 text-[.8rem] font-[600] hover:bg-columnsBackground flex items-center ${(filterTtitle !== 'Low' && filterTtitle !== '')? 'pointer-events-none hidden': 'pointer-events-auto bg-white'}`}><img className='w-4' src={threeArrowsGreen} alt="" /> Low</li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className='relative w-[170px]'>
                <input autoComplete='off' value={searchInput} onChange={(e) => handleSearchChange(e)} className={`h-[34px] rounded-md w-full p-2 text-sm transition-all duration-500 outline-none input1 text-darkBlue border-[1px] border-border border-solid `} type="text" name="search" id="search" />
                <label htmlFor="search" className={`flex gap-[.2rem] absolute label1 text-darkBlue cursor-text text-sm transition-all duration-200 left-1 top-[.50rem] label opacity-80 ${searchInput !== ''? '!top-[-20px] left-[-15px] cursor-default text-darkBlue font opacity-100': ''}`} ><img className={`transition-all duration-200 w-[.9rem] image ${searchInput !== ''? 'opacity-0': 'opacity-100'}`} src={searchSVG} alt="" />Search</label>
            </div>
        </div>
        
        <div className="h-[50vh] m-3 p-5 pb-0 overflow-auto box-shadow2 box-shadow3 scroller mt-6">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex h-full gap-4 pb-4 overflow-auto min-h-fit columns scroller">
                    {columns.map((column: any, index: any) => (
                        <Droppable droppableId={column.id} key={index}>
                            {(provided) => (
                                <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="relative flex flex-col min-h-full gap-4 px-4 pb-4 rounded-md h-fit w-60 text-darkBlue scroller bg-columnsBackground min-w-60 "
                                >

                                <AnimatePresence>
                                    {(showValidationMessage && columnId === parseInt(column.id))&&(
                                    <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale:1 }}
                                    exit={{ opacity: 0, scale:0 }}
                                    transition={{ duration: 0.1 }}
                                    className='absolute top-0 left-0 z-50 flex flex-col items-center w-full h-full gap-16 p-8 pt-16 text-center bg-columnsBackground'>
                                        <h1>Are you sure you want to delete this column?</h1>
                                        <div className='flex justify-center gap-5'>
                                            <button className='transition-all duration-200 opacity-80 hover:text-textGray hover:opacity-100' onClick={() => setShowValidationMessage(false)}>Cancel</button>
                                            <button className='flex items-center justify-center p-[.12rem] px-3 text-white duration-500 rounded-md tranistion-all w-fit bg-darkBlue hover:bg-textGray' onClick={() => deleteColumn(column.id)}>Yes</button>
                                        </div>
                                    </motion.div>
                                    )}
                                </AnimatePresence>
                                    

                                    <h1 className="sticky top-0 py-3 font-[700] text-textGray bg-columnsBackground ">
                                        {column.title} &nbsp; {column.tasks.length}/{resetColumn[index].tasks.length}
                                    </h1>
                                    <button id={`${column.id}`} onClick={(e) => {setShowValidationMessage(true); setColumnId(parseInt(e.currentTarget.id))}} className='absolute top-4 right-2'><img className='w-4 transition-all duration-200 opacity-60 hover:scale-125 hover:opacity-100' src={deleteSVG} alt="deleteSVG" /></button>
                                    
                                    {column.tasks.map((task: any, taskIndex: any) => (
                                        <Draggable key={`${column.id}-${taskIndex}`} draggableId={`${column.id}-${taskIndex}`} index={taskIndex}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="cursor-pointer tasksContainer"
                                                >
                                                    <div className="relative flex flex-col gap-4 p-4 bg-white border rounded-md">
                                                        <button id={`${task.id}`} onClick={(e) => {setShowValidationMessageTask(true); setTaskId(parseInt(e.currentTarget.id))}} className='absolute top-2 right-2'><img className='w-4 transition-all duration-200 opacity-60 hover:scale-125 hover:opacity-100' src={deleteSVG} alt="deleteSVG" /></button>
                                                        <h2 className="font-[700] text-darkBlue opacity-0 absolute">{task.title}</h2>
                                                        <h2 className="font-[700] text-darkBlue">
                                                        <HighlightedText text={task.title} searchTerm={searchInput} />
                                                        </h2>
                                                        <div className="text-darkBlue text-xs flex flex-col gap-3 font-[400]">
                                                            <p className='flex font-[500]'><img className='w-3' src={`${task.arrowType}`} alt="arrow" />{task.priority}</p>
                                                            <p className='font-bold ' id={`${taskIndex}`}>#{task.id}</p>
                                                        </div>
                                                        
                                                        
                                                        <AnimatePresence>
                                                            {(showValidationMessageTask && taskId === task.id)&&(
                                                            <motion.div
                                                            initial={{ opacity: 0, scale: 0 }}
                                                            animate={{ opacity: 1, scale:1 }}
                                                            exit={{ opacity: 0, scale:0 }}
                                                            transition={{ duration: 0.1 }}
                                                            className='absolute top-0 left-0 z-50 flex flex-col items-center w-full h-full gap-4 p-2 text-center borderColumnBackground bg-columnsBackground'>
                                                                <h1>Are you sure you want to delete this task?</h1>
                                                                <div className='flex justify-center gap-5'>
                                                                    <button className='transition-all duration-200 opacity-80 hover:text-textGray hover:opacity-100' onClick={() => setShowValidationMessageTask(false)}>Cancel</button>
                                                                    <button className='flex items-center justify-center p-[.12rem] px-3 text-white duration-500 rounded-md tranistion-all w-fit bg-darkBlue hover:bg-textGray' onClick={() => deleteTask(column.id, task.id)}>Yes</button>
                                                                </div>
                                                            </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    
                                    {provided.placeholder}
                                    
                                    <div className="text-center text-darkBlue">
                                        <button className='flex items-center justify-center gap-1 m-auto w-fit' id={column.id} onClick={(e) => showingaddingTask(e)}><img width={'12px'} src={plus} alt="" /> Add Task</button>
                                    </div>
                                    
                                    {(activeAddTaskColumn === column.id && close) && (
                                        <div className="relative flex flex-col gap-4 px-[.7rem] py-2 bg-transparentWhite rounded-md">
                                            <div>
                                                <input autoComplete='off' onKeyDown={handleTaskEnter} ref={inputt} onChange={(e) => setTaskTitle(e.target.value)} value={taskTitle} className='w-full p-1 mt-[.9rem] text-sm transition-all duration-500 border-none rounded-md outline-none input text-darkBlue borderSolid' type="text" name="titleTask" id="titleTask" />
                                                <label ref={labell} className={`absolute text-darkBlue2 cursor-text text-sm transition-all duration-200 left-4 top-[26px] label ${taskTitle !== ''? '!top-[3px] font': ''}`} htmlFor="titleTask">Task Title</label>
                                            </div>
                                            
                                            <div className='mt-2'>
                                                <h1 ref={taskProiorityRef} onClick={() => setShowTaskProiority(!showTaskProiority)} className='flex p-1 rounded-md cursor-pointer font-bold transition-all duration-500 text-darkBlue hover:bg-columnsBackground text-[.85rem]'><img className='w-4' src={`${arrow}`} alt="arrow" />{priority}</h1>
                                                
                                            
                                            <AnimatePresence>
                                                {showTaskProiority&&(
                                                    <motion.div
                                                    className={`mt-1 w-full bg-ticketBackground box-shadow text-darkBlue relative '}`}
                                                    initial={{translateY: -10, opacity: 0}}
                                                    animate={{translateY: 5, opacity: 1}}
                                                    exit={{translateY: -10, opacity: 0}}
                                                    transition={{duration: .3}}
                                                    >
                                                        <ul className='absolute w-full bg-white'>
                                                            <li onClick={() => {setPriority('High'); setShowTaskProiority(false); setArrow(threeArrowsRed); taskProiorityRef.current.classList.remove('animation'); inputt.current.focus()}} className='p-1 rounded-sm cursor-pointer text-[.8rem] font-[600] hover:bg-columnsBackground flex items-center'><img className='w-4' src={threeArrowsRed} alt="" /> HIGH</li>
                                                            <li onClick={() => {setPriority('Medium'); setShowTaskProiority(false); setArrow(threeArrowsOrange); taskProiorityRef.current.classList.remove('animation'); inputt.current.focus()}} className='p-1 rounded-sm cursor-pointer mt-2 text-[.8rem] font-[600] hover:bg-columnsBackground flex items-center'><img className='w-4' src={threeArrowsOrange} alt="" /> MEDIUM</li>
                                                            <li onClick={() => {setPriority('Low'); setShowTaskProiority(false); setArrow(threeArrowsGreen); taskProiorityRef.current.classList.remove('animation'); inputt.current.focus()}} className='p-1 rounded-sm cursor-pointer mt-2 text-[.8rem] font-[600] hover:bg-columnsBackground flex items-center'><img className='w-4' src={threeArrowsGreen} alt="" /> LOW</li>
                                                        </ul>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <div className='flex mt-[.97rem] items-center justify-center gap-7'>
                                                <button className='flex items-center justify-center px-2 py-1 duration-500 rounded-md tranistion-all text-darkBlue w-fit hover:bg-darkBluelight' id={`${column.id}`} onClick={() => setclose(false)}><img className='w-4' src={closeSVG} alt="" /></button>
                                                <button className='flex items-center justify-center px-4 py-1 text-white duration-500 rounded-md tranistion-all w-fit bg-darkBlue hover:bg-textGray' id={`${column.id}`} onClick={(e) => addingTasks(e)}>Add</button>
                                            </div>
                                        </div>
                                        
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    ))}
                    
                    {!showAddColumn&&(
                        <div className="flex items-center justify-center w-2/12 p-3 rounded-md max-w-60 min-w-56 h-14 ">
                        <button onClick={() => {setShowAddColumn(true)}} className=" transition-all duration-300 w-full p-[.35rem] text-darkBlue rounded-md flex justify-center items-center gap-2 hover:bg-columnsBackground"><img width={'12px'} src={plus} alt="" /> Add Column</button>
                        </div>
                    )}
                    
                    {showAddColumn&&(
                        <div className="flex flex-col items-center w-2/12 p-3 rounded-md h-fit bg-columnsBackground max-w-60 min-w-56">
                        <div className='relative w-full'>
                            <input
                            autoComplete='off' onKeyDown={handleColumnEnter} ref={inputt} onChange={(e) => setColumnInputValue(e.target.value)} className={`rounded-md w-full p-2 mt-6 text-sm transition-all duration-500 border-none outline-none input text-darkBlue borderSolid `} type="text" name="title" id="title" />
                            <label ref={labell} htmlFor="title" className={`absolute text-darkBlue2 cursor-text text-sm transition-all duration-200 left-1 top-[52%] label ${columnInputValue !== ''? '!top-[3px] font': ''}`} >Column Title</label>
                        </div>
                        
                        <div className='flex items-center justify-center gap-4 mt-8'>
                            <button className='flex items-center justify-center px-2 py-1 duration-500 rounded-md tranistion-all text-darkBlue w-fit hover:bg-darkBluelight' onClick={() => {setShowAddColumn(false); setColumnInputValue('')}}><img className='w-4' src={closeSVG} alt="" /></button>
                            <button id={`${columnButtonId}`} onClick={() => {addingColumns(); setColumnButtonId(columnButtonId+1)}} className="flex items-center justify-center px-4 py-1 text-white duration-500 rounded-md tranistion-all w-fit bg-darkBlue hover:bg-textGray">Add</button>
                        </div>
                        </div>
                    )}
                </div>
            </DragDropContext>
            </div>
        </div>
    );
}







// import { useCallback, useEffect, useRef, useState } from 'react';
// import '../assets/css/Page.css';
// import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
// import { AnimatePresence, motion } from 'framer-motion';
// import plus from '../assets/icons8-plus.svg'
// import closeSVG from '../assets/close.svg'
// import threeArrowsRed from '../assets/threeArrowsRed.svg'
// import threeArrowsOrange from '../assets/threeArrowsOrange.svg'
// import threeArrowsGreen from '../assets/threeArrowsGreen.svg'
// import threeArrowsBlack from '../assets/threeArrowsBlack.svg'
// import reset from '../assets/icons8-reset-50.png'
// import downArrow from '../assets/down-arrow.png'
// import searchSVG from '../assets/search.svg'

// export default function Page() {

//     const [showAddColumn, setShowAddColumn] = useState(false);
//     const [close, setclose] = useState(false);
//     const [showTaskProiority, setShowTaskProiority] = useState(false);
//     const [columnInputValue, setColumnInputValue] = useState('');
//     const [priority, setPriority] = useState('task priority');
//     const [arrow, setArrow] = useState(threeArrowsBlack)
//     const [activeAddTaskColumn, setActiveAddTaskColumn] = useState(null);
//     const inputt = useRef(null);
//     const labell = useRef(null);
//     const taskProiorityRef = useRef(null);
//     const [taskTitle, setTaskTitle] = useState('');
//     const [showFilter, setShowFilter] = useState(false)
//     const [ticketId, setTicketId] = useState(0)
//     const [filterTtitle, setFilterTtitle] = useState('')
//     const [columns, setColumns] = useState<any>([]);
//     const [resetColumn, setResetColumn] = useState([])
//     const [searchInput, setSearchInput] = useState('')


//     useEffect(() => {
//         if (showAddColumn && inputt.current) {
//             inputt.current.focus();
//         }
//     }, [showAddColumn]);

//     const handleColumnEnter = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter') {
//             addingColumns();
//         }
//     };

//     useEffect(() => {
//         if (close) {
//             inputt.current.focus();
//         }
//     }, [close]);
    
//     const handleTaskEnter = (e: React.KeyboardEvent) => {
//         if (e.key === 'Enter') {
//             addingTasks(e);
//         }
//     };

//     const addingTasks = (e) => {
        
//         if (taskTitle.trim() === '') {
//             labell.current.style.color = "rgb(255 131 131)";
//             inputt.current.focus();
//             inputt.current.style.border = "1px solid rgb(255 131 131)";
//         }
//         else if(priority === 'task priority') {
//             taskProiorityRef.current.classList.add('animation')
//         }
//         else {
//             const columnId = e.currentTarget.id;
//             setActiveAddTaskColumn(null);
//             setTicketId(ticketId+1)
//             setColumns((prevColumns: any) => 
//                 prevColumns.map((column: any) => {
//                     if (column.id === columnId) {
//                         return {
//                             ...column,
//                             tasks: [...column.tasks, { title: taskTitle, priority: priority, arrowType: arrow, id: ticketId }],
//                         };
//                     }
//                     return column;
//                 })
//             );
//             setTaskTitle('');
//             setPriority('task priority');
//         }
//     };

//     const showingaddingTask = (e) => {
//         setclose(true)
//         setTaskTitle('')
//         setPriority('task priority')
//         setArrow(threeArrowsBlack)
//         setActiveAddTaskColumn(e.target.id)
//     };

//     const addingColumns = () => {
//         if(columnInputValue.trim() === '') {
//             inputt.current.style.border = "1px solid rgb(255 131 131)";
//             labell.current.style.color = "rgb(255 131 131)";
//             inputt.current.focus();
//         } else {
//             setShowAddColumn(false);
//             const newColumn = {
//                 title: columnInputValue, 
//                 id: columns.length.toString(), 
//                 tasks: []
//             };
//             const updatedColumns = [...columns, newColumn];
//             setColumns(updatedColumns);
//             setResetColumn(updatedColumns);
//             setColumnInputValue('');
//         }
//     };

//     const onDragEnd = (result: DropResult) => {
//         const { source, destination } = result;
//         if (!destination) return;
//         if (source.droppableId === destination.droppableId && source.index === destination.index) return;

//         const sourceColumnIndex = columns.findIndex(col => col.id === source.droppableId);
//         const destColumnIndex = columns.findIndex(col => col.id === destination.droppableId);

//         const sourceColumn = columns[sourceColumnIndex];
//         const destColumn = columns[destColumnIndex];

//         const sourceTasks = Array.from(sourceColumn.tasks);
//         const destinationTasks = Array.from(destColumn.tasks);

//         const [movedTask] = sourceTasks.splice(source.index, 1);

//         if (source.droppableId === destination.droppableId) {
//             sourceTasks.splice(destination.index, 0, movedTask);
//             const updatedColumns = columns.map((col, index) => {
//                 if (index === sourceColumnIndex) {
//                     return { ...col, tasks: sourceTasks };
//                 }
//                 return col;
//             });
//             setColumns(updatedColumns);
//         } else {
//             destinationTasks.splice(destination.index, 0, movedTask);
//             const updatedColumns = columns.map((col, index) => {
//                 if (index === sourceColumnIndex) {
//                     return { ...col, tasks: sourceTasks };
//                 }
//                 if (index === destColumnIndex) {
//                     return { ...col, tasks: destinationTasks };
//                 }
//                 return col;
//             });
//             setColumns(updatedColumns);
//         }
//     };

//     useEffect(() => {
//         if (!filterTtitle && !searchInput) {
//             setColumns(resetColumn);
//         }
//     }, [filterTtitle, searchInput, resetColumn]);

//     // Function to filter by priority and reset search input
//     const filterTasks = (priorityValue) => {
//         resetFilter();
//         setFilterTtitle(priorityValue);
//         setShowFilter(false);

//         const filteredColumns = resetColumn.map(column => ({
//             ...column,
//             tasks: column.tasks.filter((task) => task.priority === priorityValue),
//         }));
        
//         setColumns(filteredColumns);
//     };

//     // Function to reset all filters
//     const resetFilter = () => {
//         setFilterTtitle('');
//         setSearchInput('');
//         setShowFilter(false);
//         setColumns(resetColumn);
//     };

//     // Debounce function
//     const debounce = (func, delay) => {
//         let timer;
//         return (...args) => {
//             clearTimeout(timer);
//             timer = setTimeout(() => func(...args), delay);
//         };
//     };

//     // Search handler with debounce
//     const handleSearchChange = (e) => {
//         const value = e.target.value;
//         setSearchInput(value);
//         debouncedSearch(value);
//     };

//     // Search function to filter tasks based on title
//     const search = (value) => {
//         const filteredColumns = resetColumn.map(column => ({
//             ...column,
//             tasks: column.tasks.filter(task =>
//                 (!filterTtitle || task.priority === filterTtitle) && 
//                 task.title.toLowerCase().includes(value.toLowerCase())
//             ),
//         }));
        
//         setColumns(filteredColumns);
//     };

//     const debouncedSearch = useCallback(debounce(search, 500), [resetColumn, filterTtitle]);
    
//     return (
//         <div className='mt-10'>
            
//         <div className='flex gap-4 p-8 pb-0'>
//             <div className='w-[170px] relative'>
//                 <div onClick={() => setShowFilter(!showFilter)} className={`flex justify-between h-[34px] transition-all duration-300 relative p-1 text-darkBlue border-[1px] border-border rounded-md cursor-pointer font-[500] hover:bg-columnsBackground items-center ${showFilter? 'bg-columnsBackground': ''}`}>
//                     <motion.h1 className={`transition-all duration-200 absolute opacity-80 ${showFilter || filterTtitle !== ''? '-top-[1.1rem] text-[.8rem] opacity-100 font-[400]': 'top-1 left-2'}`}>Priority</motion.h1>
//                     <h1 className='text-sm'>{filterTtitle}</h1>
//                     <img className={`w-4 mt-[.12rem] ${showFilter? 'rotate-180': ''}`} src={downArrow} alt="downArrow" />
//                 </div>
//                 <AnimatePresence>
//                     {showFilter&&(
//                         <motion.div
//                         className='absolute z-10 w-full rounded-md'
//                         initial={{translateY: -10, opacity: 0}}
//                         animate={{translateY: 5, opacity: 1}}
//                         exit={{translateY: -10, opacity: 0}}
//                         transition={{duration: .3}}
//                         >
//                             <ul className='w-full bg-white rounded-md box-shadow text-darkBlue'>
//                                 <li onClick={resetFilter} className='py-2 bg-white rounded-sm cursor-pointer mt-1 text-[.8rem] font-[600] hover:bg-columnsBackground flex justify-center items-center gap-[.17rem]'><img className='w-[.80rem] mt-[.12rem]' src={reset} alt="" /> Reset</li>
//                                 <li value='High' onClick={() => filterTasks('High')} className={`py-1 pb-2 rounded-sm cursor-pointer mt-1 text-[.8rem] font-[600] hover:bg-columnsBackground flex items-center ${(filterTtitle !== 'High' && filterTtitle !== '')? 'pointer-events-none hidden': 'pointer-events-auto bg-white'}`}><img className='w-4' src={threeArrowsRed} alt="" /> High</li>
//                                 <li value='Medium' onClick={() => filterTasks('Medium')} className={`py-1 pb-2 rounded-sm cursor-pointer mt-2 text-[.8rem] font-[600] hover:bg-columnsBackground flex items-center ${(filterTtitle !== 'Medium' && filterTtitle !== '')? 'pointer-events-none hidden': 'pointer-events-auto bg-white'}`}><img className='w-4' src={threeArrowsOrange} alt="" /> Medium</li>
//                                 <li value='Low' onClick={() => filterTasks('Low')} className={`py-1 pb-2 rounded-sm cursor-pointer mt-2 text-[.8rem] font-[600] hover:bg-columnsBackground flex items-center ${(filterTtitle !== 'Low' && filterTtitle !== '')? 'pointer-events-none hidden': 'pointer-events-auto bg-white'}`}><img className='w-4' src={threeArrowsGreen} alt="" /> Low</li>
//                             </ul>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </div>
//             <div className='relative w-[170px]'>
//                 <input value={searchInput} onChange={(e) => handleSearchChange(e)} className={`h-[34px] rounded-md w-full p-2 text-sm transition-all duration-500 outline-none input1 text-darkBlue border-[1px] border-border border-solid `} type="text" name="search" id="search" />
//                 <label htmlFor="search" className={`flex gap-[.2rem] absolute label1 text-darkBlue cursor-text text-sm transition-all duration-200 left-1 top-[.50rem] label opacity-80 ${searchInput !== ''? '!top-[-20px] left-[-15px] cursor-default text-darkBlue font opacity-100': ''}`} ><img className={`transition-all duration-200 w-[.9rem] image ${searchInput !== ''? 'opacity-0': 'opacity-100'}`} src={searchSVG} alt="" />Search</label>
//             </div>
//         </div>
        
//         <div className="h-[50vh] m-3 p-5 pb-0 overflow-auto box-shadow2 box-shadow3 scroller mt-6">
//             <DragDropContext onDragEnd={onDragEnd}>
//                 <div className="flex h-full gap-4 pb-4 overflow-auto min-h-fit columns scroller">
//                     {columns.map((column, index) => (
//                         <Droppable droppableId={column.id} key={column.id}>
//                             {(provided) => (
//                                 <div
//                                 ref={provided.innerRef}
//                                 {...provided.droppableProps}
//                                 className="relative flex flex-col min-h-full gap-4 px-4 pb-4 rounded-md h-fit w-60 text-darkBlue scroller bg-columnsBackground min-w-60 "
//                                 >
//                                     <h1 className="sticky top-0 py-3 font-[700] text-textGray bg-columnsBackground ">
//                                         {column.title} &nbsp; {column.tasks.length}/{resetColumn[index].tasks.length}
//                                     </h1>
                                    
//                                     {column.tasks.map((task, taskIndex) => (
//                                         <Draggable key={`${column.id}-${taskIndex}`} draggableId={`${column.id}-${taskIndex}`} index={taskIndex}>
//                                             {(provided) => (
//                                                 <div
//                                                     ref={provided.innerRef}
//                                                     {...provided.draggableProps}
//                                                     {...provided.dragHandleProps}
//                                                     className="cursor-pointer tasksContainer"
//                                                 >
//                                                     <div className="flex flex-col gap-4 p-4 bg-white border rounded-md">
//                                                         <h2 className="font-[700] text-darkBlue">{task.title}</h2>
//                                                         <div className="text-darkBlue text-xs flex flex-col gap-3 font-[400]">
//                                                             <p className='flex font-[500]'><img className='w-3' src={`${task.arrowType}`} alt="arrow" />{task.priority}</p>
//                                                             <p className='font-bold ' id={`${taskIndex}`}>#{task.id}</p>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </Draggable>
//                                     ))}
                                    
//                                     {provided.placeholder}
                                    
//                                     <div className="text-center text-darkBlue">
//                                         <button className='flex items-center justify-center gap-1 m-auto w-fit' id={column.id} onClick={(e) => showingaddingTask(e)}><img width={'12px'} src={plus} alt="" /> Add Task</button>
//                                     </div>
                                    
//                                     {(activeAddTaskColumn === column.id && close) && (
//                                         <div className="relative flex flex-col gap-4 px-[.7rem] py-2 bg-transparentWhite rounded-md">
//                                             <div>
//                                                 <input onKeyDown={handleTaskEnter} ref={inputt} onChange={(e) => setTaskTitle(e.target.value)} value={taskTitle} className='w-full p-1 mt-[.9rem] text-sm transition-all duration-500 border-none rounded-md outline-none input text-darkBlue borderSolid' type="text" name="titleTask" id="titleTask" />
//                                                 <label ref={labell} className={`absolute text-darkBlue2 cursor-text text-sm transition-all duration-200 left-4 top-[26px] label ${taskTitle !== ''? '!top-[3px] font': ''}`} htmlFor="titleTask">Task Title</label>
//                                             </div>
                                            
//                                             <div className='mt-2'>
//                                                 <h1 ref={taskProiorityRef} onClick={() => setShowTaskProiority(!showTaskProiority)} className='flex p-1 rounded-md cursor-pointer font-bold transition-all duration-500 text-darkBlue hover:bg-columnsBackground text-[.85rem]'><img className='w-4' src={`${arrow}`} alt="arrow" />{priority}</h1>
                                                
                                            
//                                             <AnimatePresence>
//                                                 {showTaskProiority&&(
//                                                     <motion.div
//                                                     className={`mt-1 w-full bg-ticketBackground box-shadow text-darkBlue relative '}`}
//                                                     initial={{translateY: -10, opacity: 0}}
//                                                     animate={{translateY: 5, opacity: 1}}
//                                                     exit={{translateY: -10, opacity: 0}}
//                                                     transition={{duration: .3}}
//                                                     >
//                                                         <ul className='absolute w-full bg-white'>
//                                                             <li onClick={() => {setPriority('High'); setShowTaskProiority(false); setArrow(threeArrowsRed); taskProiorityRef.current.classList.remove('animation'); inputt.current.focus()}} className='p-1 rounded-sm cursor-pointer text-[.8rem] font-[600] hover:bg-columnsBackground flex items-center'><img className='w-4' src={threeArrowsRed} alt="" /> HIGH</li>
//                                                             <li onClick={() => {setPriority('Medium'); setShowTaskProiority(false); setArrow(threeArrowsOrange); taskProiorityRef.current.classList.remove('animation'); inputt.current.focus()}} className='p-1 rounded-sm cursor-pointer mt-2 text-[.8rem] font-[600] hover:bg-columnsBackground flex items-center'><img className='w-4' src={threeArrowsOrange} alt="" /> MEDIUM</li>
//                                                             <li onClick={() => {setPriority('Low'); setShowTaskProiority(false); setArrow(threeArrowsGreen); taskProiorityRef.current.classList.remove('animation'); inputt.current.focus()}} className='p-1 rounded-sm cursor-pointer mt-2 text-[.8rem] font-[600] hover:bg-columnsBackground flex items-center'><img className='w-4' src={threeArrowsGreen} alt="" /> LOW</li>
//                                                         </ul>
//                                                     </motion.div>
//                                                 )}
//                                             </AnimatePresence>
//                                             <div className='flex mt-[.97rem] items-center justify-center gap-7'>
//                                                 <button className='flex items-center justify-center px-2 py-1 duration-500 rounded-md tranistion-all text-darkBlue w-fit hover:bg-darkBluelight' id={`${column.id}`} onClick={() => setclose(false)}><img className='w-4' src={closeSVG} alt="" /></button>
//                                                 <button className='flex items-center justify-center px-4 py-1 text-white duration-500 rounded-md tranistion-all w-fit bg-darkBlue hover:bg-textGray' id={`${column.id}`} onClick={addingTasks}>Add</button>
//                                             </div>
//                                         </div>
                                        
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </Droppable>
//                     ))}
                    
//                     {!showAddColumn&&(
//                         <div className="flex items-center justify-center w-2/12 p-3 rounded-md max-w-60 min-w-56 h-14 ">
//                         <button onClick={() => {setShowAddColumn(true)}} className=" w-full p-[.35rem] text-darkBlue rounded-md flex justify-center items-center gap-2"><img width={'12px'} src={plus} alt="" /> Add Column</button>
//                         </div>
//                     )}
                    
//                     {showAddColumn&&(
//                         <div className="flex flex-col items-center w-2/12 p-3 rounded-md h-fit bg-columnsBackground max-w-60 min-w-56">
//                         <div className='relative w-full'>
//                             <input
//                             onKeyDown={handleColumnEnter} ref={inputt} onChange={(e) => setColumnInputValue(e.target.value)} className={`rounded-md w-full p-2 mt-6 text-sm transition-all duration-500 border-none outline-none input text-darkBlue borderSolid `} type="text" name="title" id="title" />
//                             <label ref={labell} htmlFor="title" className={`absolute text-darkBlue2 cursor-text text-sm transition-all duration-200 left-1 top-[52%] label ${columnInputValue !== ''? '!top-[3px] font': ''}`} >Column Title</label>
//                         </div>
                        
//                         <div className='flex items-center justify-center gap-4 mt-8'>
//                             <button className='flex items-center justify-center px-2 py-1 duration-500 rounded-md tranistion-all text-darkBlue w-fit hover:bg-darkBluelight' onClick={() => {setShowAddColumn(false); setColumnInputValue('')}}><img className='w-4' src={closeSVG} alt="" /></button>
//                             <button onClick={addingColumns} className="flex items-center justify-center px-4 py-1 text-white duration-500 rounded-md tranistion-all w-fit bg-darkBlue hover:bg-textGray">Add</button>
//                         </div>
//                         </div>
//                     )}
//                 </div>
//             </DragDropContext>
//             </div>
//         </div>
//     );
// }