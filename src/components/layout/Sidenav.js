// import { useState } from "react";
import {
  BookOutlined, ContactsOutlined, BorderInnerOutlined, DollarOutlined, DownloadOutlined, SettingOutlined, TeamOutlined, UserAddOutlined, UserOutlined, SolutionOutlined, UserSwitchOutlined
} from '@ant-design/icons';
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { getUserrole } from "../../session";


function Sidenav({ color }) {

  const [user, setUser] = useState();

  useEffect(() => {
    setUser(localStorage.getItem('author'))
  }, [])

  const { pathname } = useLocation();
  const page = pathname.replace("/", "");


  return (
    <>
      {/* <div className="brand ">
        <h1><span>Ceylinco Collector</span></h1>
      </div> */}
      {/* <hr /> */}
      <Menu theme="dark" mode="inline">
        <Menu.Item key="1">
          <NavLink to="/dashboard">
            <span
              className="icon"
              style={{
                background: page === "dashboard" ? color : "",
              }}
            >
              <TeamOutlined />
            </span>
            <span className="label">Dashboard</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to="/company">
            <span
              className="icon"
              style={{
                background: page === "company" ? color : "",
              }}
            >
              <SolutionOutlined />
            </span>
            <span className="label">Company</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="7">
          <NavLink to="/payment">
            <span
              className="icon"
              style={{
                background: page === "payment" ? color : "",
              }}
            >
              <DollarOutlined />
            </span>
            <span className="label">Payments</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to="/policy">
            <span
              className="icon"
              style={{
                background: page === "policy" ? color : "",
              }}
            >
              <BookOutlined />
            </span>
            <span className="label">Policy</span>
          </NavLink>
        </Menu.Item>
        {getUserrole() == 1 ?
          <>

            <Menu.Item key="4">
              <NavLink to="/dealer">
                <span
                  className="icon"
                  style={{
                    background: page === "dealer" ? color : "",
                  }}
                >
                  <BorderInnerOutlined />
                </span>
                <span className="label">Dealer</span>
              </NavLink>
            </Menu.Item>

            <Menu.Item key="6">
              <NavLink to="/user">
                <span
                  className="icon"
                  style={{
                    background: page === "user" ? color : "",
                  }}
                >
                  <UserSwitchOutlined />
                </span>
                <span className="label">User</span>
              </NavLink>
            </Menu.Item>
          </>
          : <></>}
      </Menu>
    </>
  );
}

export default Sidenav;
