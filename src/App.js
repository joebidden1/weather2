import search_img from './assets/search.svg'
import sunny from './assets/qingtian.svg'
import rain from './assets/icon_xiaoyu.svg'
import places from './assets/newyork.jpg'
import celsius from './assets/摄氏度 (1).svg'
import fahrenheit from './assets/华氏度 (1).svg'
import block_celsius from './assets/摄氏度.svg'
import up_arrow from './assets/箭头上圆.svg'
import down_arrow from './assets/箭头下圆.svg'
import { useEffect,useState } from 'react'
import axios from 'axios'
import History from './components/history'


function App() {
  const key='dfb9620b9e6c780de8948498b0a110df'
  const city_arr=JSON.parse(localStorage.getItem('searchHistory')) || []
  const [city,setCity]=useState('new york')
  const [data,setData]=useState(null)
  const [convert,setConvert]=useState(false)
  const [isShow,setIsShow]=useState(false)
  const [localTime,setLocalTime]=useState(null)
  const [dayofweek,setDayOfWeek]=useState(null)
  const [sun,setSun]=useState(null)
  const [down,setDown]=useState(null)
  const [todayIcon,setTodayIcon]=useState(null)
  const [history,setHistory]=useState(null)
  const [tempHis,setTempHis]=useState('')
  const [future,setFuture]=useState([])
  const [iconList,setIconList]=useState(['','','','',''])

  function handleChange(event){
    let a=event.target.value
    setIsShow(true)
    setTempHis(a)
   // setCity(a)
  }
  function inputCity(event){
    setCity(tempHis)
    getWeather(tempHis)
    
  }
  
  function timeChange(val){
    let a=new Date(val*1000)
    let h=a.getHours()
    let m=a.getMinutes()
    return `${h}:${m}`
  }

  const handleSearch=()=>{
        if(city.trim()){
          city_arr.push(city)
            const newHistory = [city, ...city_arr.filter(item => item !== city)];
            let b=newHistory.slice(0, 10)
            setHistory(b)
            localStorage.setItem('searchHistory', JSON.stringify(b));
        }
    }
    function getVal(val){
      setTempHis(val)
      setCity(val)
      getWeather(val)
      return;
    }
    function deleteCity(val){
      let arr=JSON.parse(localStorage.getItem('searchHistory'))
      arr=arr.filter(item=>item!==val)
      setHistory(arr)
      localStorage.setItem('searchHistory', JSON.stringify(arr))
    }
    function dayWeek(val){
      let t=new Date(val)
      let week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return week[t.getDay()]
    }
//https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png
  const getWeather= async (val)=>{
    handleSearch()
    forecast(val)
    setIsShow(false)
    const url=`http://api.openweathermap.org/data/2.5/weather?q=${val}&appid=${key}`
    await axios.get(url).then(response=>{
      console.log(response)
      if(response.status==200){
        setData(response.data)
        let now=new Date().getTime()-28800000
        let t=new Date(now+response.data.timezone*1000)
        let week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let h=String(t.getHours()).padStart(2,'0')
        let m=String(t.getMinutes()).padStart(2,'0')
        let n=`${h}:${m}`
        let i=`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        
        setDayOfWeek(week[t.getDay()])
        setLocalTime(n)
        setSun(timeChange(response.data.sys.sunrise))
        setDown(timeChange(response.data.sys.sunset))
        setTodayIcon(i)
        
      }else{
        alert('error')
      }
   }).catch(error=>{
    console.error('there was an error',error)
    alert('The city does not exist')
   })
  }
  const forecast=async (val)=>{
    const base_url=`http://api.openweathermap.org/data/2.5/forecast?q=${val}&appid=${key}`
    await axios.get(base_url).then(response=>{
      if(response.status==200){
        let list=[]
        for(let i=0;i<response.data.list.length;i+=8){
          list.push(response.data.list[i])
          let a=`http://openweathermap.org/img/wn/${response.data.list[i].weather[0].icon}@2x.png`
          iconList[i/8]=a
          console.log(a,iconList)
        }
        console.log(iconList)
        console.log(list)
        setFuture(list)
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  useEffect(()=>{
    let a=JSON.parse(localStorage.getItem('searchHistory')) || []
    setHistory(a)
    getWeather('new york')
   // setCity('')
  },[])

  return (
    <div className="sm:w-[85%] h-[95%] mx-auto sm:p-8 block sm:flex">
      <div className='w-[100%] sm:w-[30%] bg-[#fff] sm:p-8 pb-14'>
        <div className='flex items-center justify-center mt-5 md-5'>
          <form className='h-8 min-w-15 relative'>
            <div>
            <input value={tempHis} onChange={handleChange} className='border-0 bg-transparent text-base transition bg-[#f1f2f3] border-[#e3e5e7] duration-300 mr-4 p-2' placeholder="Search for places..." type="text" name="search"/>
            </div>
            {
              isShow && (
                <History className="w-[95%]" message={getVal.bind(this)} message2={deleteCity.bind(this)} ptoson={history}></History>
              )
            }
          </form>
          <div className='w-7 h-7 bg-gray-200 rounded-full flex items-center mt-2'>
            <img className='w-5 h-5 mx-auto' onClick={inputCity} src={search_img}/>
          </div>
        </div>
        <div>
          <img src={todayIcon} className='m-5 sm:w-[75%]'/>
          
        </div>
        <div >
          {data && (<div className='text-6xl font-medium ml-4'>{Math.floor(data.main.temp-273.15)}℃</div>)}
          <div className='ml-4 mt-4 pb-6 border-b-2 border-inherit border-solid'>
            <span>{dayofweek}  , </span>
            <span className='text-slate-400'> {localTime}</span>
          </div>
          <div className='mt-4 ml-3 flex items-center'>
            {data &&( <img src={todayIcon} className='w-6 h-6'/>)}
            {data?(
              <div className='ml-2 text-sm'>{data.weather[0].description}</div>
            )
              :(<p>loading ...</p>)
            }
          </div>
          <div className='mt-4 ml-3 flex items-center'>
            <img src={rain} className='w-6 h-6'/>
            <div className='ml-2 text-sm'>Rain - 30%</div>
          </div>
        </div>
        {
          data&&(
            <div className='mt-6 h-[75px] relative'>
          
              <img src={places} className="rounded-xl w-[90%] h-[100%] object-none mx-auto"></img>
            
            <div className='font-medium text-center w-[100%] text-white absolute top-[35%]'>{data.name},{data.sys.country}</div>
          </div>
          )
        }
      </div>
      <div className='sm:w-[65%] bg-[#d8d8e0] p-8'>
        <div className='flex place-content-between mb-8 items-center'>
          <div className='flex items-center text-xl'>
            <div className='mr-4 font-medium text-slate-100'>Today</div>
            <div className='text-slate-700 font-medium border-b-2 border-black border-solid'>Week</div>
          </div>

          <div className='flex items-center'>
            <img src={block_celsius} className='w-10 h-10 mr-3 rounded-full'/>
            <img src={fahrenheit} className='w-8 h-8 bg-white rounded-full'/>
            <img src={places} className='w-10 h-10 ml-4 rounded-lg'/>
          </div>
        </div>
       
         
            <div className='min-h-[120px]'>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 min-h-[110px]'>
                {future.length>0?(
                  future.map((item,index)=>(
                    <div key={item.id} className='text-center flex-col items-center w-15 mr-2 mt-2 rounded-lg p-2 bg-white'>
                    <span className='font-medium '>{dayWeek(item.dt_txt)}</span>
                    <div className='mt-2'>
                      <img src={iconList[index]} className='w-8 h-8 mx-auto'/>
                    </div>
                    <div className='mt-2'>
                      <span className='font-medium '>{Math.floor(item.main.temp_max-273.15)}</span>
                      <span className='font-slate-200 text-slate-300'> -{Math.floor(item.main.temp_min-275.15)}</span>
                    </div>
                  </div>
                  ))
                ):null}
                
              
              </div>
              
            </div>
       
        <div className='text-black text-xl font-semibold mt-8 mb-3'>
          Today's Highlights
        </div>
        {data?(
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          <div className='bg-white rounded-lg p-4 m-4 w-[90%] max-h-[180px]'>
            <div className='text-slate-400 ml-2'>Wind Status</div>
            <div className='mt-5'>
              <span className='font-medium text-4xl'>{data.wind.speed}</span>
              <span> km/h</span>
            </div>
            <div className='flex mt-4 items-center'>
              <img src={sunny} className='w-8 h-8 mr-3'></img>
              <div>WSW</div>
            </div>
          </div>
          <div className='bg-white rounded-lg p-4 m-4 w-[90%] max-h-[180px]'>
            <div className='text-slate-400 ml-2'>
              Sunrise & Sunset
            </div>
            <div className='flex mt-3'>
              <img src={up_arrow} className='w-8 h-8 mr-3 mt-1'/>
              <div >
                <div className='text-lg'>{sun}AM</div>
                <div className='text-slate-400 text-sm'>-1m 46s</div>
              </div>
            </div>
            <div className='flex mt-3'>
              <img src={down_arrow} className='w-8 h-8 mr-3 mt-1'/>
              <div>
                <div className='text-lg'>{down}PM</div>
                <div className='text-slate-400 text-sm'>+2m 22s</div>
              </div>
            </div>
          </div>
          <div className='bg-white rounded-lg p-4 m-4 w-[90%] max-h-[180px]'>
            <div className='text-slate-400 ml-2'>Humidity</div>
            <div className='mt-5'>
              <span className='font-medium text-4xl'>{data.main.humidity}</span>
              <span> %</span>
            </div>
            <div className='flex mt-4 items-center'>
              <img src={sunny} className='w-8 h-8 mr-3'></img>
              <div>WSW</div>
            </div>
          </div>
          <div className='bg-white rounded-lg p-4 pb-7 m-4 w-[90%] max-h-[180px]'>
            <div className='text-slate-400 ml-2'>Visibility</div>
            <div className='mt-5'>
              <span className='font-medium text-4xl'>{data.visibility/1000}</span>
              <span> km</span>
            </div>
            <div className='flex mt-4 items-center'>
              <img src={sunny} className='w-8 h-8 mr-3'></img>
              <div>WSW</div>
            </div>
          </div>
          <div className='bg-white rounded-lg p-4 pb-7 m-4 w-[90%] max-h-[180px]'>
            <div className='text-slate-400 ml-2'>Wind Status</div>
            <div className='mt-5'>
              <span className='font-medium text-4xl'>7.70</span>
              <span> km/h</span>
            </div>
            <div className='flex mt-4 items-center'>
              <img src={sunny} className='w-8 h-8 mr-3'></img>
              <div>WSW</div>
            </div>
          </div>
          <div className='bg-white rounded-lg p-4 pb-7 m-4 w-[90%] max-h-[180px]'>
            <div className='text-slate-400 ml-2'>Wind Status</div>
            <div className='mt-5'>
              <span className='font-medium text-4xl'>7.70</span>
              <span> km/h</span>
            </div>
            <div className='flex mt-4 items-center'>
              <img src={sunny} className='w-8 h-8 mr-3'></img>
              <div>WSW</div>
            </div>
          </div>
        </div>
        ):(<p className='text-center text-slate-300 text-8xl'>Loading...</p>)}
      </div>
    </div>
  );
}

export default App;
