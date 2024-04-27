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

  const [date, setDate] = React.useState<any>(new Date())
  const [time, setTime] = React.useState<any>(new Date())

  const [calorieIntake,setCalorieIntake]=React.useState<any>({
    item:'',
    date:'',
    quantity:'',
    quantitytype:'g'
  })
   const[items,setItems]=React.useState<any>({})
  /*const selectedDay = (val: any) => {
    console.log(val)
  };
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));*/

  const saveCalorieIntake=async()=>{
    let tempdate=date.format('YYYY-MM-DD')
    let temptime=time.format('HH:mm:ss')
    let tempdatetime=tempdate+''+ temptime
    let finaldatetime=new Date(tempdatetime)
    console.log(finaldatetime+'finaldatetime')

    fetch(process.env.NEXT_PUBLIC_BACKEND_API+ '/calorieintake/addcalorieintake',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      credentials:'include',
      body: JSON.stringify({
        item:calorieIntake.item,
        date:finaldatetime,
        quantity:calorieIntake.quantity,
        quantitytype:calorieIntake.quantitytype
      })
  })
  .then(res=>res.json())
  .then(data=>{
    if(data.ok){
      toast.success('Calorie intake added successfully')
      getCalorieIntake
    }
    else{
      toast.error('Error in adding calorie intake')
    }
  })
  .catch(err => {
    toast.error('Error in adding calorie intake')
    console.log(err)
  })
  }
  const getCalorieIntake=async()=>{
    setItems([])
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/getcalorieintakebydate',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      credentials:'include',
      body:JSON.stringify({
        date:date
      }) 
    })
    .then(res=>res.json())
    .then(data=>{
      if(data.ok){
        console.log(data.data)
        setItems(data.data)
      }
      else{
        toast.error('error in getting calorie intake')
      }
    })
    .catch(err=>{
      toast.error('Error in getting calorie intake')
      console.log(err)
    })
  }
  const deleteCalorieIntake=async(item: any)=>{
    fetch(process.env.NEXT_PUBLIC_BACKEND_API +'/calorieintake/deletecalorieintake',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      credentials:'include',
      body:JSON.stringify({
        item: items.item,
        date: items.date
      })
    })
    .then(res=>res.json())
    .then(data=>{
      if(data.ok){
        toast.success('calorie intake item deleted successfully')
        getCalorieIntake()
      }
      else{
        toast.error('error in deleting calorie intake')
      }
    })
    .catch(err=>{
      toast.error('Error in deleting calorie intake')
      console.log(err)
    })

  }

  //when there is change of date
  React.useEffect(()=>{
    getCalorieIntake()
  },[date])

  const selectedDay=(val:any)=>{
    setDate(val)
  };

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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
      label="Select Date"
      value={date}
      onChange={(newValue:any)=>{
        selectedDay(newValue);
      }}
      />
    </LocalizationProvider>
    <TextField id="outlined-basic" label="Food item name" variant="outlined" color="warning"
    onChange={(e)=>{
      setCalorieIntake({ ...calorieIntake,item:e.target.value})
    }}
    />
    <TextField id="outlined-basic" label="Food item amount(in gms)" variant="outlined" color="warning" type='number'
    onChange={(e)=>{
      setCalorieIntake({ ...calorieIntake,quantity:e.target.value})
    }}
    />
    <div className='timebox'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
          label="Controlled picker"
          value={time}
          onChange={(newValue:any) => setTime(newValue)}
        />
      </LocalizationProvider>

    </div>
    <Button variant="contained" color="warning"
    onClick={saveCalorieIntake}
    >
      Save
    </Button>
    
    <div className="hrline"></div>
    <div className="items">
      {
        items.map((item:any)=>{
          return(
            <div className="item">
              <h3>{item.item}</h3>
               <h3>{item.quantity}{item.quantitytype}</h3>
               <button onClick={() => deleteCalorieIntake(item)}>
                <AiFillDelete/></button>
            </div>
          )
        })
      }
    </div>
    

      
      </div>
      </div>

  )
}

export default CalorieIntakePopup;