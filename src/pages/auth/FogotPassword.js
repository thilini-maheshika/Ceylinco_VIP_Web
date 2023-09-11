import {
    Button, Col, Form,
    Input, Layout, message, Row, Typography, Alert
} from "antd";
import bgSignupImage from '../../assets/images/img-signin.jpg';
import Axios from 'axios';
import { toast } from 'react-toastify';
import React, { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { setToken, getToken, isLogged, setUserid, setUserrole, isAuthenticated } from "../../session";

import config from '../../config';

const { Title } = Typography;
const { Footer, Content } = Layout;

function SignIn() {

    let history = useHistory();
    const [success, setSuccess] = useState(false);

    const onFinish = async (values) => {
        try {
            const response = await Axios.post(config.url + "/user/forget-password", values, { headers: config.headers });

            if (response.status === 200) {
                toast.success(response.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setSuccess(true);

                setTimeout(() => {
                    history.push('/sign-in');
                }, 3000);

            }
        } catch (error) {
            toast.warn(error.response.data.error || 'An error occurred', {
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
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
                            <Title className="mb-15">Reset Password</Title>
                            <Form
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                layout="vertical"
                                className="row-col"
                            >
                                <Form.Item
                                    className="email"
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your email!",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Email" />
                                </Form.Item>
                                {success && (
                                    <p className="font-semibold text-muted">
                                        We sent your password reset link to your email. please check your email.
                                    </p>
                                )}
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{ width: "100%" }}
                                    >
                                        Reset
                                    </Button>
                                </Form.Item>
                                <p className="font-semibold text-muted">
                                    Want try login ? {" "}
                                    <Link to="/sign-in" className="text-dark font-bold ml-2">
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
