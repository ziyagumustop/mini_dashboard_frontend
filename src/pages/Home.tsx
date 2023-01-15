import { Button, Col, Layout, Menu, MenuProps, Row } from "antd";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import Header from "../components/Header";
import { UserContext } from "../context/userContext";





export default function Home() {


  return (
    <Layout>
      <Header/>

      <Row style={{ minHeight: "calc(100vh - 64px)" }}>
        <Col span={24}>
          <Outlet></Outlet>
        </Col>
      </Row>
    </Layout>
  );
}
