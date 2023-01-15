import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Grid,
  Input,
  Layout,
  message,
  Row,
  Typography,
} from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { apiService } from "../services/api.service";
import { ErrorType } from "./Register";

const { Title } = Typography;

export default function Login() {
  const [userName, setUserName] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const { setIsLogin, isLogin } = React.useContext(UserContext);

  const onFinish = async (values: any) => {
    //buradan node js e istek gidecek
    let result;
    try {
      result = await apiService.post("/login", values, {
        headers: { "Content-Type": "application/json" },
      });
      localStorage.setItem("token", result.data.token);
      setIsLogin(true);
    } catch (error: ErrorType | any) {
      message.error(error.response.data.message);
    }

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Row
      justify={"center"}
      style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}
      align={"middle"}
    >
      <Col style={{ background: 'white', borderRadius: '1rem',padding:'1rem' }}>
        <Row justify={'center'}>
          <Col>
            <Title level={3}>Login</Title>
          </Col>
        </Row>
        <Col>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{
              backgroundColor: "#6660",
              padding: "1rem",
              borderRadius: "0.4rem",
            }}
          >
            <Form.Item
              label="Username"
              name="user_name"
              rules={[{ required: true, min: 4 }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, min: 4 }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
            <Divider />

            <Row justify={"center"}>
              <Link to={"/register"}>Register</Link>
            </Row>

            <Row justify={"center"}> </Row>
          </Form>
        </Col>
      </Col>
    </Row>
  );
}
