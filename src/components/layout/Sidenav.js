// import { useState } from "react";
import {
  BookOutlined, ContactsOutlined, BorderInnerOutlined, DollarOutlined, DownloadOutlined, SettingOutlined, TeamOutlined, UserAddOutlined, UserOutlined
} from '@ant-design/icons';
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";


function Sidenav({ color }) {

  const [user, setUser] = useState();

  useEffect(() => {
    setUser(localStorage.getItem('author'))
  }, [])

  const { pathname } = useLocation();
  const page = pathname.replace("/", "");


  return (
    <>
      <div className="brand ">
        <h1><span>Ceylinco-VIP Dashboard</span></h1>
      </div>
      <hr />
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
            <NavLink to="/customer">
              <span
                className="icon"
                style={{
                  background: page === "customer" ? color : "",
                }}
              >
                <UserOutlined />
              </span>
              <span className="label">Customer</span>
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
          <Menu.Item key="3">
            <NavLink to="/income">
              <span
                className="icon"
                style={{
                  background: page === "income" ? color : "",
                }}
              >
                <DownloadOutlined />
              </span>
              <span className="label">Income</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="4">
            <NavLink to="/category">
              <span
                className="icon"
                style={{
                  background: page === "category" ? color : "",
                }}
              >
                <BorderInnerOutlined />
              </span>
              <span className="label">Category</span>
            </NavLink>
          </Menu.Item>
          <Menu.Item key="5">
            <NavLink to="/supplier">
              <span
                className="icon"
                style={{
                  background: page === "supplier" ? color : "",
                }}
              >
                <BorderInnerOutlined />
              </span>
              <span className="label">Supplier</span>
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
                <UserAddOutlined />
              </span>
              <span className="label">User</span>
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
          <Menu.Item key="8">
            <NavLink to="/contact">
              <span
                className="icon"
                style={{
                  background: page === "contact" ? color : "",
                }}
              >
                <ContactsOutlined />
              </span>
              <span className="label">Contact</span>
            </NavLink>
          </Menu.Item>
          
        </Menu>
    </>
  );
}

export default Sidenav;
