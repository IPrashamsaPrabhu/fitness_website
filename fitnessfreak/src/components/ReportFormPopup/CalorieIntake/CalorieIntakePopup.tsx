import React from 'react'
import '../popup.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {toast} from 'react-toastify';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';


interface CaloriIntakePopupProps {
  setShowCalorieIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalorieIntakePopup: React.FC<CaloriIntakePopupProps> = ({ setShowCalorieIntakePopup }) => {
  const color = '#ffc20e'

  const [date, setDate] = React.useState<Dayjs>(dayjs());
  const [time, setTime] = React.useState<Dayjs>(dayjs());

  const [calorieIntake,setCalorieIntake]=React.useState<any>({
    item:'',
    date:'',
    quantity:'',
    quantitytype:'g'
  })
  const [items, setItems] = React.useState<any>([]);

  const selectedDay = (val: Dayjs | string | Date) => {
    const selectedDate = dayjs(val); // Convert to Dayjs object
    setDate(selectedDate); // Update date state
    setCalorieIntake({ ...calorieIntake, date: selectedDate.format('YYYY-MM-DD') }); // Update calorieIntake with the selected date
  };

  console.log(calorieIntake.date);
  
  const saveCalorieIntake = async () => {
    try {
      console.log('Calorie Intake Data:', calorieIntake);
  
       // Basic validation (optional)
    /*if (!calorieIntake.item || !calorieIntake.quantity || !calorieIntake.quantitytype || !calorieIntake.date) {
      toast.error('Please fill in all required fields');
      return;
    }*/

    setCalorieIntake({ ...calorieIntake, date: date.format('YYYY-MM-DD') }); // Update state before API call

      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/CalorieIntake/addcalorieintake', {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication (if needed)
        body: JSON.stringify({
          item: calorieIntake.item,
          date:  calorieIntake.date,
          quantity: parseFloat(calorieIntake.quantity),
          quantityType: calorieIntake.quantitytype,
        }),
      });
  
      const data = await response.json();
  
      if (data.ok) {
        toast.success('Calorie intake added successfully');
        getCalorieIntake(); // Refresh the list after successful addition
      } else {
        toast.error('Error in adding calorie intake');
        console.error(data.error); // Log the specific error from the API
      }
    } catch (err) {
      toast.error('Error in adding calorie intake');
      console.error(err); // Log the error for debugging
    }
  };
   
  
  const getCalorieIntake = async () => {
    setItems([]); // Clear previous items before fetching

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/CalorieIntake/getcalorieintakebydate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication (if needed)
        body: JSON.stringify({
        date: date.format('YYYY-MM-DD'), // Use Day.js for formatting date
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setItems(data.data); // Set the fetched calorie intake data
      } else {
        toast.error('Error in getting calorie intake');
      }
    } catch (err) {
      toast.error('Error in getting calorie intake');
      console.error(err); // Log the error for debugging
    }
  };


  const deleteCalorieIntake = async (item: any) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/CalorieIntake/deletecalorieintake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication (if needed)
        body: JSON.stringify({
          item: item.item, // Assuming item object has an 'item' property
          // Include date if your API requires it for deletion (e.g., item.date)
        }),
      });
  
      const data = await response.json();
  
      if (data.ok) {
        toast.success('Calorie intake item deleted successfully');
        getCalorieIntake(); // Refresh the list after successful deletion
      } else {
        toast.error('Error in deleting calorie intake');
        console.error(data.error); // Log the specific error from the API
      }
    } catch (err) {
      toast.error('Error in deleting calorie intake');
      console.error(err); // Log the error for debugging
    }
  };
  

  //when there is change of date
  React.useEffect(()=>{
    getCalorieIntake()
  },[date])
  
  return (
    <div className='popupout'>
      <div className="popupbox"> 
      <button className="close"
        onClick={()=>{
          setShowCalorieIntakePopup(false)
        }}
        >
        <AiOutlineClose/>
        </button>

    <TextField id="outlined-basic" label="Food item name" variant="outlined" color="warning"
    onChange={(e)=>{
      setCalorieIntake({ ...calorieIntake,item:e.target.value})
    }}
    />
    
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
      label="Select Date"
      value={date}
      onChange={(newValue:any)=>{
        selectedDay(newValue);
      }}
      />
    </LocalizationProvider>
    
   
    <TextField id="outlined-basic" label="Food item amount(in gms)" variant="outlined" color="warning" type='number'
    onChange={(e)=>{
      setCalorieIntake({ ...calorieIntake,quantity:e.target.value})
    }}
    />

<TextField id="outlined-basic" label="Food item quantity type" variant="outlined" color="warning"
    onChange={(e)=>{
      setCalorieIntake({ ...calorieIntake,quantitytype:e.target.value})
    }}
    />

    <Button variant="contained" color="warning"
    onClick={saveCalorieIntake}
    >
      Save
    </Button>
    
    
      
      </div>
      </div>

  )
}

export default CalorieIntakePopup;

