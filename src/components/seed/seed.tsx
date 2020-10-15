import React from 'react';
import contract from '../../api/contract';
import service from '../../api/service';
import { Modal, InputNumber, Input, Button, Statistic, Descriptions, Switch,Card } from 'antd';
import { BigNumber } from "bignumber.js";
import './seed.scss';
import i18n from '../../i18n'
// import { composeInitialProps } from 'react-i18next';
const { Countdown } = Statistic;

interface item {
  index: string,
  seronum: string,
  seednum: string,
  Unlocked: BigNumber,
  Withdrawn: BigNumber,
  operation: string,
  creatData: string,
  countDown: number,
  showDetail: boolean,
  lookDetail: boolean,
  dayNum: number,
  todaypercentage: string
}
interface Seeds {
  seedBalance: string,
  seroBalance: string,
  backedValue: number,
  claimantValue: number,
  time: number,
  mask: boolean,
  data: Array<any>,
  dataArr: Array<any>,
  showUserName: string,
  showUsermainpkr: string,
  account: object,
  mainpkr: string,
  Listdata: Array<item>,
  visibleName: boolean,
  visiblePledge: boolean,
  visibleDetail: boolean,
  visibleRules: boolean,
  visiblelook: boolean,
  pledgeNum: any,
  visibleDestruction: boolean,
  destructionNum: any,
  detailModal: any,
  radioStatu: boolean,
  tokennum:number,
  tokenseronum:number,
}

class Seed extends React.Component<any, Seeds> {
  state: Seeds = {
    seedBalance: "",
    seroBalance: "",
    backedValue: 0,
    claimantValue: 0,
    time: 86400,
    mask: false,
    data: [],
    dataArr: [],
    showUserName: "",
    showUsermainpkr: "",
    account: {},
    mainpkr: "",
    Listdata: [],
    visibleName: false,
    visiblePledge: false,
    visibleDetail: false,
    visibleRules: false,
    visiblelook: false,
    pledgeNum: 100,
    visibleDestruction: false,
    destructionNum: 1,
    detailModal: {},
    radioStatu: false,
    tokennum:0,
    tokenseronum:0
  }
  componentDidMount() {
    let that = this;
    service.setLanguage();
    that.getdata();
    let interId: any = sessionStorage.getItem("interId");
    if (interId) {
      clearInterval(interId)
    }
    interId = setInterval(() => that.getdata(), 5 * 10 ** 3);
    sessionStorage.setItem("interId", interId);
  }

  getdata = () => {
    let that = this;
    service.accountList().then((res: any) => {
      let userobj: any = {}
      if (sessionStorage.getItem("userName")?.length === undefined) {
        userobj = res.find(function (item: any) {
          return item.IsCurrent === true;
        })
      } else {
        userobj = res.find(function (item: any) {
          return item.Name === sessionStorage.getItem("userName");
        })
      }
      let strmainpk: string = userobj.MainPKr;
      let length = strmainpk.length;
      let startmainpkr = strmainpk.substring(0, 5);
      let endmainpkr = strmainpk.substring(length - 5, length)
      let strmainpkr = startmainpkr + "..." + endmainpkr;
      contract.IToken(userobj.MainPKr).then((res)=>{
        that.setState({
          tokennum:fromValue(res[0],18).toNumber()
        })
      })
      contract.balanceOf().then((res)=>{
        that.setState({
          tokenseronum:fromValue(res.tkn.SERO,18).toNumber()
        })
      })
      that.ListShow(userobj.MainPKr);
      that.myExchangeValue(userobj.MainPKr);
      that.setState({
        data: res,
        showUserName: userobj.Name,
        showUsermainpkr: strmainpkr,
        mainpkr: userobj.MainPKr,
        account: userobj,
        mask: false,
        seedBalance: new BigNumber(userobj.Balance.get("SEED")).dividedBy(10 ** 18).toFixed(2),
        seroBalance: new BigNumber(userobj.Balance.get("SERO")).dividedBy(10 ** 18).toFixed(2),
      })
    }).catch(e => {

    })
  }
  radiobtn = (e: any) => {
    let that = this;
    that.setState({
      radioStatu: e
    });
    that.getdata();
  }

  ListShow = (str: string) => {
    let that = this;
    if (that.state.radioStatu) {
      contract.getList(str).then((res) => {
        let listdata: Array<item> = [];
        for (let i = 0; i < res.result.length; i++) {
          let objShow = {
            index: "",
            seronum: "",
            seednum: "",
            Unlocked: new BigNumber(0),
            Withdrawn: new BigNumber(0),
            operation: "",
            creatData: "",
            countDown: 0,
            showDetail: true,
            lookDetail: true,
            dayNum: 0,
            todaypercentage: ""
          }
          let createTime = parseInt(res.result[i].data.createTime);
          let lastWithDrawTime = parseInt(res.result[i].data.lastWithDrawTime);
          const extracted = that.transformation(createTime, lastWithDrawTime);
          const newTime = parseInt((new Date().getTime() / 1000).toString());
          const extractable = that.transformation(createTime, newTime);
          const c = newTime - lastWithDrawTime;
          const countDown = (that.state.time + lastWithDrawTime) * 1000;
          if (extracted.percentage !== 0) {
            objShow.Withdrawn = fromValue(res.result[i].data.total, 18).multipliedBy(extracted.percentage)
            new BigNumber(res.result[i].data.total).multipliedBy(extracted.percentage).dividedBy(10 ** 18).toString();
          }
          if (extractable.percentage !== 0) {
            objShow.Unlocked = fromValue(res.result[i].data.total, 18).multipliedBy(extractable.percentage)
            objShow.dayNum = extractable.today
            objShow.todaypercentage = extractable.todaypercentage
          }
          if (c < that.state.time) {
            objShow.operation = "state";
          } else {
            objShow.operation = "statein";
          }
          if (newTime * 1000 < countDown) {
            objShow.lookDetail = false
          }
          if (createTime + that.state.time * 10 < lastWithDrawTime) {
            objShow.operation = "state";
            objShow.showDetail = false
          }
          objShow.index = res.result[i].index;
          objShow.seronum = new BigNumber(res.result[i].data.total).dividedBy(10 ** 16).toString();
          objShow.seednum = new BigNumber(res.result[i].data.total).dividedBy(10 ** 18).toString();
          objShow.creatData = that.formatTime(createTime * 1000, 'M/D/Y h:m');
          objShow.countDown = countDown;
          listdata.push(objShow)
        }
        that.setState({
          Listdata: listdata
        })
      }).catch(e => {
      }).catch((e) => {
      })
    } else {
      contract.getListScreen(str).then((res) => {
        let listdata: Array<item> = [];
        for (let i = 0; i < res.result.length; i++) {
          let objShow = {
            index: "",
            seronum: "",
            seednum: "",
            Unlocked: new BigNumber(0),
            Withdrawn: new BigNumber(0),
            operation: "",
            creatData: "",
            countDown: 0,
            showDetail: true,
            lookDetail: true,
            dayNum: 0,
            todaypercentage: ""
          }
          let createTime = parseInt(res.result[i].data.createTime);
          let lastWithDrawTime = parseInt(res.result[i].data.lastWithDrawTime);
          const extracted = that.transformation(createTime, lastWithDrawTime);
          const newTime = parseInt((new Date().getTime() / 1000).toString());
          const extractable = that.transformation(createTime, newTime);
          const c = newTime - lastWithDrawTime;
          const countDown = (that.state.time + lastWithDrawTime) * 1000;
          if (extracted.percentage !== 0) {
            objShow.Withdrawn = fromValue(res.result[i].data.total, 18).multipliedBy(extracted.percentage)
            new BigNumber(res.result[i].data.total).multipliedBy(extracted.percentage).dividedBy(10 ** 18).toString();
          }
          if (extractable.percentage !== 0) {
            objShow.Unlocked = fromValue(res.result[i].data.total, 18).multipliedBy(extractable.percentage)
            objShow.dayNum = extractable.today
            objShow.todaypercentage = extractable.todaypercentage
          }
          if (c < that.state.time) {
            objShow.operation = "state";
          } else {
            objShow.operation = "statein";
          }
          if (newTime * 1000 < countDown) {
            objShow.lookDetail = false
          }
          if (createTime + that.state.time * 10 < lastWithDrawTime) {
            objShow.operation = "state";
            objShow.showDetail = false
          }
          objShow.index = res.result[i].index;
          objShow.seronum = new BigNumber(res.result[i].data.total).dividedBy(10 ** 16).toString();
          objShow.seednum = new BigNumber(res.result[i].data.total).dividedBy(10 ** 18).toString();
          objShow.creatData = that.formatTime(createTime * 1000, 'M/D/Y h:m');
          objShow.countDown = countDown;
          listdata.push(objShow)
        }
        that.setState({
          Listdata: listdata
        })
      }).catch(e => {
      }).catch((e) => {
      })
    }
  }
  formatNumber(n: any) {
    n = n.toString()
    return n[1] ? n : '0' + n;
  }
  formatTime(number: number, format: any) {
    let time = new Date(number)
    let newArr = []
    let formatArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    newArr.push(time.getFullYear());
    newArr.push(this.formatNumber(time.getMonth() + 1));
    newArr.push(this.formatNumber(time.getDate()));
    newArr.push(this.formatNumber(time.getHours()));
    newArr.push(this.formatNumber(time.getMinutes()));
    newArr.push(this.formatNumber(time.getSeconds()));
    for (let i in newArr) {
      format = format.replace(formatArr[i], newArr[i]);
    }
    return format;
  }
  myExchangeValue = (str: string) => {
    let that = this;
    contract.myExchangeValue(str).then((res) => {
      that.setState({
        claimantValue: new BigNumber(res[1]).dividedBy(10 ** 18).toNumber(),
        backedValue: new BigNumber(res[0]).dividedBy(10 ** 18).toNumber()
      })
    })
  }
  showModal = () => {
    this.setState({
      visibleName: true,
    });
  };
  hideModal = () => {
    this.setState({
      visibleName: false,
    });
  };
  selectName(e: any) {
    let that = this;
    that.ListShow(e.target.dataset.mainpkr);
    that.myExchangeValue(e.target.dataset.mainpkr);
    let userobj = that.state.data.find(function (item: any) {
      return item.Name === e.target.dataset.name;
    })
    let userName = e.target.dataset.name;
    sessionStorage.setItem("userName", userName);
    that.setState({
      visibleName: false,
      showUserName: userobj.Name,
      mainpkr: userobj.MainPKr,
      account: userobj,
      seedBalance: new BigNumber(userobj.Balance.get("SEED")).dividedBy(10 ** 18).toFixed(2),
      seroBalance: new BigNumber(userobj.Balance.get("SERO")).dividedBy(10 ** 18).toFixed(2),
    });
  };
  showPledgeModal = () => {
    this.setState({
      visiblePledge: true,
      pledgeNum: 100,
      mask: true
    });
  };
  hidePledgeModal = () => {
    this.setState({
      visiblePledge: false,
      pledgeNum: 100,
      mask: false
    });
  };
  sendPledgeModal = () => {
    let that = this;
    that.setState({
      visiblePledge: false,
      pledgeNum: 100,
      mask: true
    });
    let cy = "SERO";
    contract.sendCy(that.state.account, cy, "0x" + new BigNumber(that.state.pledgeNum).multipliedBy(10 ** 18).toString(16)).then((res) => {
      service.getTransactionReceipt(res).then(() => {
        that.getdata();
      }).catch(e => {

      });
    }).catch((e) => {
      this.setState({
        visiblePledge: false,
        pledgeNum: 100,
        mask: false
      });
    });
  };
  showDestructionModal = () => {
    this.setState({
      visibleDestruction: true,
      destructionNum: 1,
      mask: true
    });
  };
  hideDestructionModal = () => {
    this.setState({
      visibleDestruction: false,
      destructionNum: 1,
      mask: false
    });
  };
  sendDestructionModal = () => {
    let that = this;
    that.setState({
      visibleDestruction: false,
      mask: true
    });
    let cy = "SEED";
    contract.sendCy(that.state.account, cy, "0x" + new BigNumber(that.state.destructionNum).multipliedBy(10 ** 18).toString(16)).then((res) => {
      service.getTransactionReceipt(res).then(() => {
        that.getdata();
      }).catch(e => {

      });
    }).catch((e) => {
      this.setState({
        visibleDestruction: false,
        destructionNum: 1,
        mask: false
      });
    });
  };
  Withdrawal(e: any) {
    let that = this;
    let cy = "SERO";
    if (e.target.dataset.name === "statein") {
      contract.Withdrawal(that.state.account, cy, e.target.dataset.index).then((res) => {
        this.setState({
          mask: true
        });
        service.getTransactionReceipt(res).then(() => {
          that.getdata();
        }).catch(e => {
        });
      })
    }
  }

  WithdrawalDetail(e: any) {
    let that = this;
    let cy = "SERO";
    contract.Withdrawal(that.state.account, cy, e.target.dataset.index).then((res) => {
      this.setState({
        mask: true,
        visibleDetail: false,
      });
      service.getTransactionReceipt(res).then(() => {
        that.getdata();
      }).catch(e => {
      });
    })
  }
  transformation = (createTime: number, lastWithDrawTime: number) => {
    let that = this;
    let information = {
      percentage: 0,
      today: 0,
      todaypercentage: ""
    }
    let num: number = Math.floor((lastWithDrawTime - createTime) / that.state.time) + 1;
    if (num < 0) {
      num = 0;
    }
    switch (num) {
      case 0:
        information.percentage = 0.00;
        information.today = 0;
        information.todaypercentage = "0%";
        break;
      case 1:
        information.percentage = 0.06;
        information.today = 1;
        information.todaypercentage = "6%";
        break;
      case 2:
        information.percentage = 0.13;
        information.today = 2;
        information.todaypercentage = "7%";
        break;
      case 3:
        information.percentage = 0.21;
        information.today = 3;
        information.todaypercentage = "8%";
        break;
      case 4:
        information.percentage = 0.30;
        information.today = 4;
        information.todaypercentage = "9%";
        break;
      case 5:
        information.percentage = 0.40;
        information.today = 5;
        information.todaypercentage = "10%";
        break;
      case 6:
        information.percentage = 0.50;
        information.today = 6;
        information.todaypercentage = "10%";
        break;
      case 7:
        information.percentage = 0.61;
        information.today = 7;
        information.todaypercentage = "11%";
        break;
      case 8:
        information.percentage = 0.73;
        information.today = 8;
        information.todaypercentage = "12%";
        break;
      case 9:
        information.percentage = 0.86;
        information.today = 9;
        information.todaypercentage = "13%";
        break;
      case 10:
        information.percentage = 1;
        information.today = 10;
        information.todaypercentage = "14%";
        break;
      default:
        information.percentage = 1;
        information.today = 10;
        information.todaypercentage = "14%";
    }
    return information;
  }
  onChangeSeedNum(e: any) {
    let that = this;
    if (e != null) {
      that.setState({
        pledgeNum: e * 100
      })
    } else {
      that.setState({
        pledgeNum: 0
      })
    }
  }
  onChangeSeroNum(e: any) {
    let that = this;
    if (e != null) {
      that.setState({
        destructionNum: e
      })
    } else {
      that.setState({
        destructionNum: 0
      })
    }
  }
  cli() {
    let that = this;
    that.setState({
      visibleDetail: false
    })


  }
  openRules() {
    let that = this;
    that.setState({
      visibleRules: true
    })
  }
  closeRules() {
    let that = this;
    that.setState({
      visibleRules: false
    })
  }

  openLook= () => {
    let that = this;
    that.setState({
      visiblelook: true
    })
  }
  handlelookOk= () => {
    let that = this;
    that.setState({
      visiblelook: false
    })
  };

  handlelookCancel= () => {
    let that = this;
    that.setState({
      visiblelook: false
    })
  };


  viewDetail(e: any) {
    let that = this;
    let userobj = that.state.Listdata.find(function (item: any) {
      return item.index === e.target.dataset.index;
    })
    that.setState({
      visibleDetail: true,
      detailModal: userobj
    })
  }
  hideDetail = () => {
    let that = this;
    that.setState({
      visibleDetail: false,
    })
  }
  render() {
    const { detailModal } = this.state;
    return (
      <div className="seed ">
        <div className="seed-box">
          <div className="seed-rules">
            <p onClick={() => this.openRules()}>
              {i18n.t("Therules")}
            </p>
            <Modal
              visible={this.state.visibleRules}
              okText="OK"
              cancelText=""
              centered={true}
              footer={null}
              closable={false}
            >
              <div className="rules">
                <h2 className="rules-c">
                  SEEO
                  {i18n.t("rule1")}
                  </h2>
                <p className="rules-c">
                  * 
                  {i18n.t("rule2")}
                   </p>
                <p>
                  ‣ 
                  
                  {i18n.t("rule3")}
                   </p>
                <p>
                  ‣
                  {i18n.t("rule4")}
                   </p>
                <p>
                  ‣
                   {i18n.t("rule5")}
                  </p>
                <p>
                  ‣ 
                  {i18n.t("rule6")}
                   </p>
                <p>
                  ‣ 
                  {i18n.t("rule7")}
                   </p>
                <h2>
                  PS
                  :
                  </h2>
                <p>
                  1.
                  {i18n.t("rule8")}
                  </p>
                <p>
                  2.
                  {i18n.t("rule9")}
                  </p>
                <table>
                  <tr>
                    <td>
                      {i18n.t("Outputcycle")}
                      </td>
                    <td>DAY1</td>
                    <td>DAY2</td>
                    <td>DAY3</td>
                    <td>DAY4</td>
                    <td>DAY5</td>
                    <td>DAY6</td>
                    <td>DAY7</td>
                    <td>DAY8</td>
                    <td>DAY9</td>
                    <td>DAY10</td>
                  </tr>
                  <tr>
                    <td>
                      {i18n.t("obtain")}
                      SEED
                      </td>
                    <td>6%</td>
                    <td>7%</td>
                    <td>8%</td>
                    <td>9%</td>
                    <td>10%</td>
                    <td>10%</td>
                    <td>11%</td>
                    <td>12%</td>
                    <td>13%</td>
                    <td>14%</td>
                  </tr>
                </table>
                <div style={{ height: "30px" }}>
                  <Button style={{ float: "right" }} onClick={() => this.closeRules()} type="primary">OK</Button>
                </div>
              </div>
            </Modal>
            <p style={{float:"right"}} onClick={() => this.openLook()}>
            {i18n.t("Viewcirculation")}
            </p>
            <Modal
              visible={this.state.visiblelook}
              title={i18n.t("Viewcirculation")}
              onOk={this.handlelookOk}
              onCancel={this.handlelookCancel}
              okText={i18n.t("confirm")}
              cancelText={i18n.t("cancel")}
            >
              <div className="lookmodal">
                <div>
                  <Card>
                    <Statistic
                      title={`${i18n.t("Totalcirculation")}SEED`}
                      
                      value={this.state.tokennum} 
                      /> 
                  </Card>
                </div>
                <div>
                  <Card>
                  <Statistic
                    title={`${i18n.t("Totalpledge")}SERO`}
                    value={this.state.tokenseronum} />
                     </Card>
                </div>
              </div>
            </Modal>
          </div>
          <div className="seed-header">
            <div className="seed-header-head">
              <img src={require('../../images/head.png')} alt="" />
            </div>
            <div className="seed-header-title">
              <p>{i18n.t("SeroEcologicalLaboratorygovernancetoken")}</p>
            </div>
          </div>
          <div className="seed-content">
            <div className="content-header">
              <div className="content-header-top">
                <div className="content-header-left">
                  <p>{this.state.showUserName}&nbsp;&nbsp;&nbsp;{this.state.showUsermainpkr}</p>
                </div>
                <div className="content-header-right">
                  <div onClick={this.showModal}>
                    {i18n.t("switch")}
                  </div>
                  <Modal
                    title={i18n.t("Pleaseselectaccount")}
                    visible={this.state.visibleName}
                    onOk={this.hideModal}
                    onCancel={this.hideModal}
                    okText={i18n.t("confirm")}
                    cancelText={i18n.t("cancel")}
                    footer={null}
                    maskClosable={false}
                  >
                    <ul className="model">
                      {
                        this.state.data.map((item: any, index: number) => {
                          return (
                            <li data-name={item.Name} data-mainpkr={item.MainPKr} onClick={(e) => this.selectName(e)} key={index}>
                              {item.Name}&nbsp;&nbsp;&nbsp;  {item.MainPKr.substring(0, 5)}...{item.MainPKr.substring(item.MainPKr.length - 5, item.MainPKr.length)}
                            </li>
                          )
                        })
                      }
                    </ul>
                  </Modal>
                </div>
              </div>
              <div className="content-header-bottom">
                <ul>
                  <li>SERO
                    {i18n.t("balance")}
                    :</li>
                  <li>{this.state.seroBalance !== "NaN" ? this.state.seroBalance : 0}</li>
                  <li>SEED
                  {i18n.t("balance")}
                    :</li>
                  <li>{this.state.seedBalance !== "NaN" ? this.state.seedBalance : 0}</li>
                </ul>
              </div>

            </div>
            <div className="content-btn">
              <div>
                <Statistic
                  title={i18n.t("Totalpledge")}
                  value={`${this.state.backedValue} SERO`} valueStyle={{ color: '#FFFFFF' }} />
                <button onClick={this.showPledgeModal}>
                  {i18n.t("culture")}
                  SEED
                  
                </button>
                <Modal
                  title={i18n.t("Inputthenumberofseedcultured")}
                  visible={this.state.visiblePledge}
                  onOk={this.sendPledgeModal}
                  onCancel={this.hidePledgeModal}
                  okText={i18n.t("confirm")}
                  cancelText={i18n.t("cancel")}
                  maskClosable={false}
                >
                  <ul className="modalbox">
                    <li>
                      <div>
                        <p>
                          SEED
                          {i18n.t("number")}
                          :</p>
                      </div>
                      <div>
                        <InputNumber type="number" min={1} defaultValue={1} value={new BigNumber(this.state.pledgeNum).dividedBy(10 ** 2).toNumber()} onChange={(e) => this.onChangeSeedNum(e)} className="inputWidth" />
                      </div>
                    </li>
                    <li>
                      <div>
                        <p>
                          {i18n.t("ItcostsSERO")}:
                        </p>
                      </div>
                      <div>
                        <Input value={this.state.pledgeNum} disabled={true} />
                      </div>
                    </li>
                  </ul>
                </Modal>
              </div>
              <div>
                <Statistic
                  title={i18n.t("Totaldestroyed")}
                  value={`${this.state.claimantValue} SEED`} valueStyle={{ color: '#FFFFFF' }} />
                <button onClick={this.showDestructionModal} className="destruction">
                  {i18n.t("recovery")}
                  SEED
                </button>
                <Modal
                  title={i18n.t("Pleaseenterthenumberofseedtorecycle")}
                  visible={this.state.visibleDestruction}
                  onOk={this.sendDestructionModal}
                  onCancel={this.hideDestructionModal}
                  okText={i18n.t("confirm")}
                  cancelText={i18n.t("cancel")}
                  maskClosable={false}
                >
                  <ul className="modalbox">
                    <li>
                      <div>
                        <p>
                          {i18n.t("Numberofseedrecovered")}
                          :
                          </p>
                      </div>
                      <div>
                        <InputNumber type="number" min={1} defaultValue={1} value={this.state.destructionNum} onChange={(e) => this.onChangeSeroNum(e)} className="inputWidth" />
                      </div>
                    </li>
                    <li>
                      <div>
                        <p>
                          {i18n.t("Redeemable")}
                          SERO:
                          </p>
                      </div>
                      <div>
                        <Input value={this.state.destructionNum * 100} disabled={true} />
                      </div>
                    </li>
                  </ul>
                </Modal>
              </div>
            </div>
            <div className="content-list">
              <ul>
                <li>
                  <div>
                    {i18n.t("Creationtime")}
                  </div>
                  <div>SERO</div>
                  <div>SEED</div>
                  <div>
                    {i18n.t("operation")}
                  </div>
                </li>
              </ul>
              <ul>
                <li>
                  <div className="radio-btn">
                    <Switch className="btn" size="small" onChange={(e) => this.radiobtn(e)} />
                    <span>&nbsp;&nbsp;&nbsp;{i18n.t("Viewall")}</span>
                  </div>
                </li>
              </ul>
              <ul className="content-list-data">
                {
                  this.state.Listdata.map((item: any, key: number) => {
                    return (
                      <li key={key}>
                        <div> {item.creatData}
                        </div>
                        <div>{item.seronum}</div>
                        <div>{item.seednum}</div>
                        <div className="content-list-data-box">
                          <div className={item.operation === "statein" ? "withdrawal" : "no-click"} data-index={item.index} data-name={item.operation} onClick={(e) => this.Withdrawal(e)}>
                            {i18n.t("withdrawal")}
                          </div>
                          <div className="detail" onClick={(e) => this.viewDetail(e)} data-index={item.index} >
                            {i18n.t("details")}
                          </div>
                        </div>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
            <div className="sero-man">
              <img src={require('../../images/sero_man.png')} alt="" />
            </div>
          </div>
        </div>
        <div className="seed-footer">
        </div>
        <div className={this.state.mask ? "mask" : "masks"}>
          Loading.....
        </div>
        <Modal
          title={i18n.t("details")}
          visible={this.state.visibleDetail}
          onCancel={this.hideDetail}
          footer={null}
          className="detail"
        >
          <div className="detailModal">
            <Descriptions column={1}>
              <Descriptions.Item
                label={`${i18n.t("the")}${detailModal.dayNum}${i18n.t("Dayrateofreturn")}`}
              >{detailModal.todaypercentage}</Descriptions.Item>
              <Descriptions.Item
                label={i18n.t("Creationtime")}
              >{detailModal.creatData}</Descriptions.Item>
            </Descriptions>
            <Descriptions column={3}>
              <Descriptions.Item label="">
                <Statistic value={detailModal.seednum}
                  title={i18n.t("Totalculture")}
                  suffix={"SEED"} />
              </Descriptions.Item>
              <Descriptions.Item label="">
                <Statistic value={detailModal.seednum - detailModal.Unlocked}
                  title={i18n.t("Incultivation")}
                  suffix={"SEED"} />
              </Descriptions.Item>
              <Descriptions.Item label="">
                <Statistic value={detailModal.seronum}
                  title={i18n.t("pledge")}
                  suffix={"SERO"} />
              </Descriptions.Item>
            </Descriptions>
            <Descriptions column={3}>
              <Descriptions.Item label="">
                <Statistic value={detailModal.Unlocked && detailModal.Unlocked.toString(10)}
                  title={i18n.t("Harvested")}
                  suffix={"SEED"} />
              </Descriptions.Item>
              <Descriptions.Item label="">
                <Statistic value={detailModal.Withdrawn && detailModal.Withdrawn.toString(10)}
                  title={i18n.t("Extracted")}
                  suffix={"SEED"} />
              </Descriptions.Item>
              <Descriptions.Item label="">
                <Statistic value={detailModal.Unlocked && detailModal.Withdrawn && detailModal.Unlocked.minus(detailModal.Withdrawn).toString(10)}
                  title={i18n.t("Extractable")}
                  suffix={"SEED"} />
              </Descriptions.Item>
            </Descriptions>

            <Descriptions column={3}>
              <Descriptions.Item span={3}> {detailModal.showDetail ? <ul>
                {detailModal.lookDetail ? <li className="detailbtn" data-index={detailModal.index} onClick={(e) => this.WithdrawalDetail(e)}>
                  {i18n.t("withdrawal")}
                  </li> : <Countdown value={detailModal.countDown} valueStyle={{ color: "#FFFFFF", background: "gray", textAlign: "center" }} format="HH:mm:ss" onFinish={() => this.cli()} />}
              </ul> : <div className="message-success">
                  {i18n.t("Completed")}
                </div>}</Descriptions.Item>
            </Descriptions>
          </div>
        </Modal>
      </div>
    )
  }
}

function fromValue(v: number | string | undefined, d: number): BigNumber {
  if (v) {
    return new BigNumber(v).dividedBy(10 ** d)
  } else {
    return new BigNumber(0)
  }
}


function toValue(v: number | string | undefined, d: number): BigNumber {
  if (v) {
    return new BigNumber(v).multipliedBy(10 ** d)
  } else {
    return new BigNumber(0)
  }
}



export default Seed;