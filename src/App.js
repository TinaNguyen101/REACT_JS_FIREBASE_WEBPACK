import React, { Component } from "react";

// task manager
import firebase from "./firebase.js";
import TaskAdd from "./Component/TaskAdd.jsx";
import TaskControl from "./Component/TaskControl.jsx";
import TaskList from "./Component/TaskList.jsx";

//Third-Party
import {findIndex} from "lodash";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Tasks: [],
      isDisplayForm: true,
      TaskEditing: "",
      filter: {
        name: "",
        status: -1,
      },
      keyword: "",
      sort: {
        Name: "",
        By: 1,
      },
      typeData:1,
    };
  }

  loadData(){
    if(this.state.typeData == 3 ){
      //localStorage////////////////////////////////////////////////////////////
        if (localStorage && localStorage.getItem("task")) {
          var _task = JSON.parse(localStorage.getItem("task"));
          this.setState({ Tasks: _task });
        }
      }
      else if(this.state.typeData == 2 ){
      // cloud firestore///////////////////////////////////////////////////////
        var store = firebase.firestore();
        store.collection('Task').get().then(querySnapshot => {
          var _tasks = querySnapshot.docs.map((doc) => {
            const eventData = doc.data();
            eventData.id = doc.id;
            return eventData
          });
          this.setState({ Tasks: _tasks });
  
        });
      }
      else if(this.state.typeData == 1 ){
      //realtime database///////////////////////////////////////////////////////
        const db = firebase.database();
        const ref = db.ref("Task");
        var _tasks=[] ;
        ref.once("value")
        .then((snapshot) =>{
          snapshot.forEach((childSnapshot) => {
            const eventData = childSnapshot.val();
            eventData.id = childSnapshot.key;
            _tasks.push(eventData)
          });
          this.setState({ Tasks: _tasks });
        });
      }
  }
  componentWillMount() {
    this.loadData()
  }
  

  onGenerate = () => {
    if(this.state.typeData == 1 ){
    // cloud firestore///////////////////////////////////////////////////////
    var store = firebase.firestore();
    store
      .collection("Task")
      .get()
      .then((querySnapshot) => {
        var _tasks = querySnapshot.docs.map((doc) => doc.data());
        this.setState({ Tasks: _tasks });
      });
    }
      else if(this.state.typeData == 2 ){
    //realtime database///////////////////////////////////////////////////////
       const db = firebase.database();
       const ref = db.ref('Task');
        ref.on('value', snapshot => {
          var _tasks = snapshot.val();
         this.setState({ Tasks: _tasks });

     });
      }
    else if(this.state.typeData == 3 ){
    //localStorage////////////////////////////////////////////////////////////
      var _tasks = [
        {
          id: "1",
          name: "sample 1",
          status: 1,
        },
        {
          id: "2",
          name: "sample 2",
          status: 2,
        },
      ];
      this.setState({ Tasks: _tasks });
      localStorage.setItem("task", JSON.stringify(_tasks));
    }
  };

  onToggleForm = () => {
    if (this.state.isDisplayForm && this.state.TaskEditing !== null) {
      this.setState({
        isDisplayForm: true,
        TaskEditing: null,
      });
    } else {
      this.setState({
        isDisplayForm: !this.state.isDisplayForm,
        TaskEditing: null,
      });
    }
  };

  onCloseForm = () => {
    this.setState({
      isDisplayForm: false,
    });
  };

  onShowForm = () => {
    this.setState({
      isDisplayForm: true,
    });
  };

  onSubmitParent = (data) => {
    var { Tasks } = this.state;
    if (data.name !== "") {
      if (data.id === "") {
        const maxValueOfY = Math.max(...Tasks.map(o => o.id), 0);
        data.id = maxValueOfY + 1;
        Tasks.push(data);
        if(this.state.typeData != 3 )
          this.Ins_Upd_Del_Data(
            0,
            String(data.id),
            String(data.name),
            data.status
          );
      } else {
        var index = this.findIndex(data.id);
        Tasks[index] = data;
        if(this.state.typeData != 3 )
          this.Ins_Upd_Del_Data(
            1,
            String(data.id),
            String(data.name),
            data.status
          );
      }
      this.setState({
        Tasks: Tasks,
        TaskEditing: null,
      });
      if(this.state.typeData == 3 )
         localStorage.setItem("task", JSON.stringify(Tasks));
    }
  };

  Ins_Upd_Del_Data(flag, id, name, status) {
    if(this.state.typeData == 1 )
        this.Ins_Upd_Del_Data_realDatabase(flag, id, name, status);
    else if(this.state.typeData== 2)
         this.Ins_Upd_Del_Data_cloudFirestore(flag,id,name,status);
  };

  Ins_Upd_Del_Data_realDatabase(flag, id, name, status) {
    //https://grokonez.com/frontend/react/how-to-react-firebase-database-crud-operations-in-react-webpack
    const db = firebase.database();
    const root = db.ref("Task/"+id);
    if (flag == 0) {
      //  INSERT
      root
        .set({ name: name, status: status })
        .then(function () {
          console.log("Document successfully written!");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    } else if (flag == 1) {
      //UPDATE
      root.update({
        name:name,
        status:status
      })
      .then(function() {
          console.log("Document successfully update!");
      })
      .catch(function(error) {
          console.error("Error update document: ", error);
      });
    } else {
      //DELETE
      root.remove()
      .then(function() {
          console.log("Document successfully delete!");
      })
      .catch(function(error) {
          console.error("Error delete document: ", error);
      });
    }
  };

  Ins_Upd_Del_Data_cloudFirestore(flag, id, name, status) {
    //https://morioh.com/p/c9f9a952b167
    var _store = firebase.firestore();
    var _doc = _store.collection("Task").doc(id);
    if (flag == 0) {
      //  INSERT
      _doc
        .set({
          name: name,
          status: status,
        })
        .then(function () {
          console.log("Document successfully written!");
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    } else if (flag == 1) {
      //UPDATE
      _doc
        .update({
          name: name,
          status: status,
        })
        .then(function () {
          console.log("Document successfully update!");
        })
        .catch(function (error) {
          console.error("Error update document: ", error);
        });
    } else {
      //DELETE
      _doc
        .delete()
        .then(function () {
          console.log("Document successfully delete!");
        })
        .catch(function (error) {
          console.error("Error delete document: ", error);
        });
    }
  };

  onUpdStatus = (id) => {
    var { Tasks } = this.state;
    //lodash
    var index = findIndex(Tasks,(task)=>{
       return task.id===id;
    })//this.findIndex(id);
    if (index !== -1) {
      Tasks[index].status = Tasks[index].status === 1 ? 2 : 1;
      this.setState({
        Tasks: Tasks,
      });
      if(this.state.typeData != 3 )
        this.Ins_Upd_Del_Data(
          1,
          String(Tasks[index].id),
          String(Tasks[index].name),
          Tasks[index].status
        );
      if(this.state.typeData == 3 )
        localStorage.setItem("task", JSON.stringify(Tasks));
    }
  };

  onDelete = (id) => {
    var { Tasks } = this.state;
    var index = this.findIndex(id);
    if (index !== -1) {
      if(this.state.typeData != 3 )
          this.Ins_Upd_Del_Data(-1, String(id), "", 0);
      Tasks.splice(index, 1);
      this.setState({
        Tasks: Tasks,
      });
      if(this.state.typeData == 3 )
        localStorage.setItem("task", JSON.stringify(Tasks));
    }
  };

  onEdit = (id) => {
    var { Tasks } = this.state;
    var index = this.findIndex(id);
    if (index !== -1) {
      this.setState({
        TaskEditing: Tasks[index],
      });

      this.onShowForm();
    }
  };

  findIndex = (id) => {
    var { Tasks } = this.state;
    var result = -1;
    Tasks.forEach((Task, index) => {
      if (Task.id === id) {
        result = index;
      }
    });
    return result;
  };

  onFilter = (filterName, filterStatus) => {
    filterStatus = parseInt(filterStatus, 10);
    this.setState({
      filter: {
        name: filterName.toLowerCase(),
        status: filterStatus,
      },
    });
  };

  onSearch = (keyword) => {
    this.setState({
      keyword: keyword,
    });
  };

  onSort = (sort) => {
    this.setState({
      sort: {
        Name: sort.Name,
        By: sort.By,
      },
    });
  };

  onChangeData = (e)=>{
    var id = e.target.value;
    if(id=="database"){
      this.setState({ typeData: 1 });
    }
    else if(id=="store"){
      this.setState({ typeData: 2 });
    }
    else if(id=="local"){
      this.setState({ typeData: 3});
    }
    this.loadData()
  }
  render() {
    var {
      Tasks,
      isDisplayForm,
      TaskEditing,
      filter,
      keyword,
      sort,
      typeData,
    } = this.state;

    if (filter) {
      if (filter.name) {
        Tasks = Tasks.filter((task) => {
          return task.name.toLowerCase().indexOf(filter.name) !== -1;
        });
      }
      if (filter.status) {
        Tasks = Tasks.filter((task) => {
          if (filter.status === -1) {
            return task;
          } else {
            return task.status === filter.status;
          }
        });
      }
    }
    if (keyword) {
      Tasks = Tasks.filter((task) => {
        return task.name.toLowerCase().indexOf(keyword) !== -1;
      });
    }
    if (sort.Name === "name") {
      Tasks.sort((a, b) => {
        if (a.name > b.name) {
          return sort.By;
        } else if (a.name < b.name) {
          return -sort.By;
        } else {
          return 0;
        }
      });
    } else {
      Tasks.sort((a, b) => {
        if (a.status > b.status) {
          return sort.By;
        } else if (a.status < b.status) {
          return -sort.By;
        } else {
          return 0;
        }
      });
    }
    var elmFormAdd = isDisplayForm ? (
      <TaskAdd
        onSubmit={this.onSubmitParent}
        onClose={this.onCloseForm}
        task={TaskEditing}
      ></TaskAdd>
    ) : (
      ""
    );
    console.log("2222222222");
    return (
      <div className="App container">
        <div className="row">
          <h1>Todo List</h1>
          <div className="float-right  align-text-bottom text-right col-md-8">
         
                  <div className="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="database" name="typeSave" className="custom-control-input" value="database"  checked={typeData == 1?true:false} onClick={this.onChangeData}/>
                    <label className="custom-control-label" for="database">Realtime Database</label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="store" name="typeSave" className="custom-control-input" value="store" checked={typeData == 2?true:false}  onClick={this.onChangeData}/>
                    <label className="custom-control-label" for="store">Cloud Firestore</label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="local" name="typeSave" className="custom-control-input" value="local" checked={typeData == 3?true:false}  onClick={this.onChangeData}/>
                    <label className="custom-control-label" for="local">Local Storage</label>
                  </div>
                  </div>
        </div>
        <div className="row">
          <div className={isDisplayForm ? "col-3" : ""}>
            {/* form add */}
            {elmFormAdd}
          </div>
          <div className={isDisplayForm ? "col-7" : "col-12"}>
            {/* search + list */}
            <div className="card" style={{ border: "0px" }}>
              <div className="card-body" style={{ paddingTop: "0px" }}>
                <div className="card-title">
                  {/* add  */}
                  <button
                    type="button"
                    className="btn btn-info"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={this.onToggleForm}
                  >
                    Task New
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onClick={this.onGenerate}
                  >
                    Generate Task
                  </button>
                 
                </div>
                <div className="card-text">
                  {/* Search Sort */}
                  <TaskControl
                    onSearch={this.onSearch}
                    onSort={this.onSort}
                    sortName={this.state.sort.Name}
                    sortby={this.state.sort.By}
                  ></TaskControl>

                  {/* List Task */}
                  <TaskList
                    Tasks={Tasks}
                    onUpdStatus1={this.onUpdStatus}
                    onEdit1={this.onEdit}
                    onDelete1={this.onDelete}
                    onFilter={this.onFilter}
                  ></TaskList>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
