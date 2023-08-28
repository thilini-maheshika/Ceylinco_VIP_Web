import {
  Button, Col, Form,
  Input, Layout, message, Row, Typography, Alert
} from "antd";
import bgSignupImage from '../../assets/images/img-signin.jpg';
import Axios from 'axios';
import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { setToken, getToken, isLogged, setUserid, setUserrole, isAuthenticated } from "../../session";

import config from '../../config';

const { Title } = Typography;
const { Footer, Content } = Layout;

function SignIn() {

  let history = useHistory();
  const [ success, setSuccess ] = useState(false);

  const onFinish = async (values) => {
    try {
      const response = await Axios.post(config.url + "/user/login", values, { headers: config.headers });
      console.log(response)
      
      if (response.data.message) {
        message.error(response.data.message);
      } else {
        console.log(response.data);
        setToken(response.data.token);
        setUserid(response.data.userid);
        setUserrole(response.data.userrole);

        console.log(getToken())

        if (isLogged) {
          setSuccess(true);

          setTimeout(() => {
            history.push('/dashboard');
          }, 100);
        }
      }
    } catch (error) {
      console.log("Server error...");
    }
  };
  

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  const currentYear = new Date().getFullYear();

  return (
    <>
      <Layout className="layout-default layout-signin">
        <Content className="signin">
          <Row gutter={[24, 0]} justify="space-around">
            <Col
              xs={{ span: 24, offset: 0 }}
              lg={{ span: 6, offset: 2 }}
              md={{ span: 12 }}
            >
              <Title className="mb-15">Sign In</Title>
              {success ? <Alert message="Success Text" type="success" /> : <></>}
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  className="username"
                  label="Email"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                  className="username"
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    SIGN IN
                  </Button>
                </Form.Item>
                <p className="font-semibold text-muted">
                  fogot password? {" "}
                  <Link to="/forget-password" className="text-dark font-bold ml-2">
                    click here
                  </Link>
                </p>
              </Form>
            </Col>
            <Col
              className="sign-img"
              style={{ padding: 12 }}
              xs={{ span: 24 }}
              lg={{ span: 12 }}
              md={{ span: 12 }}
            >
              <img src={bgSignupImage} alt="" />
            </Col>
          </Row>
        </Content>
        <Footer>
          <p className="copyright">
            {" "}
            Copyright © {currentYear}. Ceylinco Collector
          </p>
        </Footer>
      </Layout>
    </>
  );

}

export default SignIn;
