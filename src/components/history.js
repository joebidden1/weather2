import { useEffect, useState } from 'react'
import chacha from '../assets/叉叉.svg'

function History({message,message2,ptoson}){
    
     let city_list=ptoson
    function sendValue(event){
        const param=event.target.getAttribute('data-param')
        message(param)
        event.stopPropagation()
    }
    function deleteCity(event){
        const param1=event.target.getAttribute('data-param1')
        message2(param1)
        event.stopPropagation()
    }

return(
    <div className="bg-[#d8d7d7] rounded-lg mx-auto mt-2 pb-2 z-10">
        <div className="flex flex-wrap">
            {city_list.length>0 ? (
                city_list.map(item=>(
                    <div key={item}>
                        <div data-param={item} onClick={sendValue} className="bg-[#f6f7f8] text-sm p-2 m-2 rounded-lg relative cursor-pointer">{item}
                              <img src={chacha} data-param1={item} onClick={deleteCity} className='w-4 h-4 absolute -right-2 -top-1 bg-[#f6f7f8] rounded-full'/> 
                        </div>
                    </div>
                ))
            ):null}
        </div>
    </div>
)
}

export default History