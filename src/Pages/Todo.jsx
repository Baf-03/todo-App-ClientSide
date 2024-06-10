import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
const apiUrl = import.meta.env.VITE_API_URL;
import axios from "axios";
import Buttons from "../Components/Buttons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Todo() {
  const navigate = useNavigate()
  const {email}= useSelector((state)=>state.userReducer)
  console.log(email)
  let [todo_main_input, set_todo_main_input] = useState("");
  let [uiShow, setuiShow] = useState([]);
  let [uishowinput, setuishowinput] = useState("");



  useEffect(() => {
    const getTodos = async () => {
      try {
        const resp = await axios.get(`${apiUrl}/api/getTodos/${email}`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        console.log("Response data:", resp.data);
  
        // Filter out deleted todos
        const filteredTodos = resp.data.data.filter(todo => !todo.is_deleted);
        
        // Update state with filtered todos
        setuiShow(filteredTodos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
  
    getTodos();
  }, []);
  
  //-----------------------------------Add todo---------------------------------------
  const add_todo = async () => {
    if (todo_main_input.length == 0) {
      alert("Cannot enter empty todo");
    } else {
      const addTodo = await axios.post(`${apiUrl}/api/createTodo/${email}`, {
        desc: todo_main_input,
        adminName: email,
      },{headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }}
    );
      console.log("addTod", addTodo.data);
      setuiShow([...uiShow, addTodo.data]);
      set_todo_main_input(""); // Clear input after adding todo
    }
  };

  //-----------------------------------Del all todo---------------------------------------

  const delall_todo = async () => {
    const delAllTodos = await axios.delete(
      `${apiUrl}/api/${email}/deleteAllTemp`,{headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }}
    );
    console.log(delAllTodos);
    setuiShow([]);
  };

  //-----------------------------------Del element todo---------------------------------------
  const del_element_todo = async (id,index) => {
    const objToSend={
      method:"delete"
    }
    const deltodo = await axios.put(`${apiUrl}/api/${id}/tmpdeltodo`, objToSend,{headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
      }}
     
    );
    console.log(deltodo);

    uiShow.splice(index, 1);
    setuiShow([...uiShow]);
  };

  //-----------------------------------edit todo---------------------------------------

  const edit_todo = (index) => {
    uiShow.forEach((element) => {
      element.isEdit = false;
    });

    uiShow[index].isEdit = true;
    setuiShow([...uiShow]);

    setuishowinput(uiShow[index].desc);
  };

  //----------------------------------Complete button code--------------------------------------
  const Completed_todo = async(id,index) => {
    try {
      const newStatus = uiShow[index].status === 0 ? 1 : 0;
      const editDescTodo = await axios.put(`${apiUrl}/api/${id}/status`,
        { status: newStatus }
      );
      uiShow[index].status = newStatus;
      setuiShow([...uiShow]);
      console.log("editDescTodo",editDescTodo);
    } catch(err) {
      console.log(err);
    }
  };
  
  //-----------------------------------after edit button u see save btn thats code is here---------------------------------------

  const save_edited_todo = async(id,index) => {
    uiShow[index].isEdit = false;

    setuiShow([...uiShow]);
    if (uishowinput.length == 0) {
      alert("cannot pass empty string");
    } else {
      try{
        const editDescTodo = await axios.put(
          `${apiUrl}/api/${id}/updatedesc`,
         {
          desc:uishowinput
         }
        );
  
        console.log(editDescTodo);
        uiShow[index].desc = uishowinput;
        setuiShow([...uiShow]);
      }
      catch(err){
        console.log("err",err)
      }
     
    }
  };

  //-----------------------------------ui -------------------------------------------------------------------
  return (
    <>
      {/* ---------------------------------Header------------------------------ */}
      <div className="flex justify-center bg-blue-300 py-5 items-center font-bold">
        <h2 className="w-[90%] text-center">Encryptodo</h2>
        <div onClick={()=>{localStorage.removeItem('token');navigate("/auth/login")}}><img className="w-[20px] hover:cursor-pointer" src="https://icons.veryicon.com/png/o/internet--web/website-icons/logout-8.png" alt="" /></div>
      </div>

      {/* -----------------------------input field --------------------------------------  */}
      <section className="flex flex-col items-center justify-center gap-2 ">
        <div className="w-[90%] md:w-[60%] lg:w-[40%] mt-5">
          <TextField
            id="filled-basic"
            label="Enter Todo"
            variant="filled"
            className="w-[100%] "
            value={todo_main_input}
            onChange={(e) => {
              set_todo_main_input(e.target.value);
            }}
          />
        </div>

        {/* -----------------------------two buttons add del_all code --------------------------------------  */}
        <div className="flex gap-2">
          <Buttons value="Add" trigger={add_todo} />
          <Buttons value="delete" trigger={delall_todo} colors="error" />
        </div>

        {/* //-----------------------------------map function hae yahan pr -------------------------------------- */}
        {uiShow.map((element, index) =>{
          console.log("element",element._id)

          // element.status=true
          return(
          element.status? (

            <section
              className="flex gap-2 border border-gray-700 p-4 rounded-lg items-center w-[90%] md:w-[70%] lg:w-[40%] justify-between"
              key={index}
            >
              <div className="flex gap-2  p-4 rounded-lg items-center w-[90%] md:w-[70%] lg:w-[40%] justify-between">
              {element.desc}
              </div>
              <div className="flex gap-2">
                <Buttons
                  value="Incomplete"
                  trigger={() => {
                    Completed_todo(element._id,index);
                  }}
                  colors="secondary"
                />
                <Buttons
                  value="delete"
                  trigger={() => {
                    del_element_todo(element._id,index)
                  }}
                  colors="error"
                />
              </div>
            </section>
          ) : element.isEdit ? (
            <section
              className="flex gap-2 border border-gray-700 p-4 rounded-lg items-center w-[90%] md:w-[70%] lg:w-[40%] justify-between"
              key={index}
            >
              <div className="w-[80%] overflow-x-scroll ml-[5px]">
                {" "}
                <TextField
                  className="w-[100%]"
                  id="standard-basic"
                  label="Edit todo"
                  variant="standard"
                  value={uishowinput}
                  onChange={(e) => {
                    setuishowinput(e.target.value);
                  }}
                />
              </div>
              <div className="flex gap-2 flex-wrap justify-center  w-[20%]">
                <Buttons
                  value="Save"
                  trigger={() => {
                    save_edited_todo(element._id,index);
                  }}
                  colors="success"
                />
              </div>
            </section>
          ) : (
            <section
              className="flex gap-2 border border-gray-700 p-4 rounded-lg items-center w-[90%] md:w-[70%] lg:w-[40%] justify-between"
              key={index}
            >
              <div className="w-[40%] overflow-x-scroll ml-[5px]">
                {element.desc}
              </div>
              <div className="flex gap-1 flex-wrap justify-center w-[60%]">
                <Buttons
                  value="Edit"
                  trigger={() => {
                    edit_todo(index);
                  }}
                />
                <Buttons
                  value="delete"
                  trigger={() => {
                    del_element_todo(element._id,index)
                  }}
                  colors="error"
                />
                <Buttons
                  value="Complete"
                  trigger={() => {
                    Completed_todo(element._id,index);
                  }}
                  colors="secondary"
                />
              </div>
            </section>
          )
        )}
        
        )}
      </section>
    </>
      
  );
}

export default Todo;
