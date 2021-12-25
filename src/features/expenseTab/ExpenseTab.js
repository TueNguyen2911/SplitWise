import React, { useEffect } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
const ExpenseTab = () => {
    const [value, setValue] = React.useState(2);
    const [expenses, setExpenses] = React.useState(['Expense #1', 'Pizza', 'Grocery', 'Presents']);
    const [arr, setArr] = React.useState(["Tue", "One", "Two"]);
    
    useEffect(() => {
        setValue(expenses.length - 1);
    }, [expenses])

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const addExpense = () => {
        console.log('yo')
        setExpenses([...expenses, `Expense #${expenses.length}`]);
    }
    const StyledTab = styled(Tab)({
        border: '1px solid',
        margin: '0px 5px',
        '&:hover': {
            opacity: '0.5'
        },
    })
    return (
        <div>
        <div style={{height: '50vh'}}>

        </div>
        <Tabs variant={"scrollable"} value={value} onChange={handleChange} >
            {expenses.map(elem => (
                <StyledTab label={elem} />
            ))}
            <Button onClick={addExpense}><AddIcon/></Button>
        </Tabs>
        <div>
            {value}
        </div>
        </div>
    )
}

export default ExpenseTab
