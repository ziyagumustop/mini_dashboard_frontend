import { Button, Col, Menu, Row, MenuProps } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../context/userContext';

let MenuItemArray = ["Dashboard", "Companies", "Products"];

const items1: MenuProps["items"] = MenuItemArray.map((e, i) => ({
    key: i,
    label: <Link to={e.split(" ").join("").toLowerCase()}>{e}</Link>,
}));

const getDefaultKey = () => {
    let splitPath = document.location.pathname.split("/");
    let splitUrl = splitPath[splitPath.length - 1];
    let resultIndex: string = "";
    MenuItemArray.every((e, i) => {
        if (e.split(" ").join("").toLowerCase() == splitUrl) {
            resultIndex = i.toString();
            return false;
        }
        return true;
    });

    return [resultIndex == "" ? "0" : resultIndex];
};

export default function Header() {
    const { setIsLogin } = React.useContext(UserContext);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLogin(false);
    };
    return (
        <Row
            style={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                width: "100vw",
                backgroundColor: "#001529",
            }}
            justify={'space-between'}
            align={"middle"}
        >
            <Menu
                defaultSelectedKeys={getDefaultKey()}
                theme="dark"
                mode="horizontal"
                items={items1}
            />
            <Col>
                <Button onClick={handleLogout}>Çıkış Yap</Button>
            </Col>
        </Row>
    )
}
