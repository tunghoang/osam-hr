import React from "react";
import { withRouter } from "react-router-dom";
import Autocomplete from "../../components/Autocomplete";
import apiService from '../../service/api.service';
import BorderBottomInput from "./../../components/BorderBottomInput";
import BorderedContainer from "./../../components/BorderedContainer";
import './style.less';


class DepartmentNewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentName: '',
      manager: null,
      idManager: null,
      active: true,
      name: '',
      approvers: null,
      idApprovers: null,
      loading: false,
      departments : [],
      nameDepartmentExist : false,
      errors : {}

    };
    this.handleManagerChange = this.handleManagerChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDepartmentChange = this.handleDepartmentChange.bind(this);
    this.handleActiveStatus = this.handleActiveStatus.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }

  async handleSave() {
    if(this.handleValidation()){
      let id = await apiService.generateDepartmentId();
      let data = {
        id : id,
        name: this.state.departmentName,
        idManager: this.state.idManager.id,
        idApprovers: this.state.idApprovers,
        active: this.state.active
      };
      let addNewDepartment = await apiService.addNewDepartment(data);
      let updateDepartment = {
        departments : [id]
      }
      await apiService.updateUserById(this.state.idManager.id, updateDepartment );
      if (addNewDepartment) {
        this.props.history.push('/departments');
      }
    }
    else{
      console.log(this.state.errors);
    }
  }

  handleValidation(){
    let formIsValid = true;
    let e = {};
    // name
    this.state.departments.forEach((val, index) => {
      if(val.name === this.state.departmentName){
        formIsValid = false;
        e["name"] = "Đã tồn tại";
      }
    });
    this.setState({
      errors: e
    });
    return formIsValid;
  }

  handleCancel() {
    this.props.history.push('/departments');
  }

  handleManagerChange(event) {
    this.setState({ manager: event.target.value });
  }

  handleDepartmentChange(event) {
    this.state.departments.forEach((val, index) => {
      if(val.name === event.target.value){
        this.setState({nameDepartmentExist : true});
      }
    })
    this.setState({ departmentName: event.target.value });
  }

  handleActiveStatus(e) {
    this.setState({ active: e.target.checked });
  }

  async componentDidMount() {
    let users = await apiService.listUsers({full : true});
    let department = await apiService.listDepartment();
    this.setState({ manager: users, approvers: users , departments : department});
  }
  render() {
    return (
      <div className="DepartmentNew">
        <div className="title-vs-btn">
          <div className="my-button active-btn ti ti-check" onClick={this.handleSave} style={{ background: "linear-gradient(120deg, #67dc2c, #38c53e)" }}></div>
          <div className="my-button ti ti-close" onClick={this.handleCancel} style={{ background: "#ddd", boxShadow: "none", color: "#888" }}></div>
          <div className="title">Bộ Phận / New</div>
        </div>
        <BorderedContainer>
          <div className="item-wrap">
            <span>Tên Bộ Phận</span>
            <div>
              <BorderBottomInput placeholder="Tên Bộ Phận" value={this.state.departmentName} onChange={this.handleDepartmentChange} />
            </div>
            <div className="error">{this.state.errors["name"]}</div>
          </div>
          <div className="item-wrap">
            <span>Người quản lý</span>
            <div>
              <Autocomplete
                loading={this.state.manager === null}
                style={{ flex: 1 }}
                options={this.state.manager}
                keyProp='id'
                labelProp='name'
                onChange={(event, value) => {
                  this.setState({ idManager: value});
                }}
              />
            </div>
          </div>
          <div className="item-wrap">
            <span>Người phụ trách duyệt leave request</span>
            <div>
              <Autocomplete
                multiple
                filterSelectedOptions
                loading={this.state.approvers === null}
                style={{ flex: 1 }}
                options={this.state.approvers}
                keyProp='id'
                labelProp='name'
                onChange={(event, value) => {
                  this.setState({ idApprovers: value.map(v => v.id) });
                }}
              />
            </div>
          </div>
          <div className="item-wrap" style={{ width: "70px" }}>
            <span>Hoạt động</span>
            <div>
              <input className="input checkbox" type="checkbox" checked={this.state.active} onClick={this.handleActiveStatus} />
            </div>
          </div>
        </BorderedContainer>
      </div>
    );
  }
}

export default withRouter(DepartmentNewPage);
